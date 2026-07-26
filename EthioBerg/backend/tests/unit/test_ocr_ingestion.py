"""OCR fallback behaviour.

Tesseract is a system binary that is absent from most CI and dev machines, so the
engine is stubbed here. The tests that need the real binary are skipped rather
than silently passing.
"""

from __future__ import annotations

import fitz
import pytest

from src.services import ingestion, ocr
from src.services.documents import _extraction_warnings
from src.services.ingestion import parse_document, parse_pdf
from src.services.ocr import OcrOptions, OcrStatus


def _pdf_with_text(text: str) -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    if text:
        page.insert_text((72, 72), text)
    return doc.tobytes()


def _pdf_without_text() -> bytes:
    """A page with no text layer, standing in for a scan."""
    doc = fitz.open()
    doc.new_page()
    return doc.tobytes()


@pytest.fixture(autouse=True)
def _clear_probe_cache():
    ocr.probe.cache_clear()
    yield
    ocr.probe.cache_clear()


def _stub_ocr(monkeypatch, *, available: bool, text: str = "", languages=("eng", "amh")):
    status = OcrStatus(
        available=available,
        version="5.3.0" if available else "",
        languages=list(languages) if available else [],
        detail="stub tesseract" if available else "The tesseract binary is not installed.",
    )
    monkeypatch.setattr(ingestion, "probe", lambda: status)
    monkeypatch.setattr(
        ingestion,
        "resolve_languages",
        lambda requested: [lang for lang in requested if lang in status.languages],
    )
    monkeypatch.setattr(ingestion, "image_to_text", lambda image, langs: text)
    return status


def test_pdf_with_text_layer_is_not_sent_to_ocr(monkeypatch):
    calls: list[int] = []
    _stub_ocr(monkeypatch, available=True, text="SHOULD NOT BE USED")
    monkeypatch.setattr(
        ingestion, "image_to_text", lambda image, langs: calls.append(1) or "unused"
    )

    body = "Article 12 requires a minimum paid-up capital of ETB 500,000,000 for the Main Market."
    pages, ocr_pages, error = parse_pdf(_pdf_with_text(body), OcrOptions(enabled=True, min_text_chars=20))

    assert calls == [], "OCR ran on a page that already had a text layer"
    assert ocr_pages == []
    assert error == ""
    assert "Article 12" in pages[0].text


def test_scanned_page_falls_back_to_ocr(monkeypatch):
    _stub_ocr(monkeypatch, available=True, text="Recovered scanned text")

    pages, ocr_pages, error = parse_pdf(_pdf_without_text(), OcrOptions(enabled=True))

    assert ocr_pages == [1]
    assert error == ""
    assert pages[0].text == "Recovered scanned text"
    assert pages[0].ocr_applied is True


def test_ocr_is_skipped_when_disabled(monkeypatch):
    _stub_ocr(monkeypatch, available=True, text="Recovered scanned text")

    pages, ocr_pages, error = parse_pdf(_pdf_without_text(), OcrOptions(enabled=False))

    assert ocr_pages == []
    assert error == ""
    assert pages[0].text.strip() == ""


def test_missing_binary_is_reported_rather_than_raised(monkeypatch):
    _stub_ocr(monkeypatch, available=False)

    pages, ocr_pages, error = parse_pdf(_pdf_without_text(), OcrOptions(enabled=True))

    assert ocr_pages == []
    assert "tesseract binary is not installed" in error
    assert len(pages) == 1, "the upload must still succeed without OCR"


def test_uninstalled_language_is_reported(monkeypatch):
    _stub_ocr(monkeypatch, available=True, text="ignored", languages=("eng",))

    _, ocr_pages, error = parse_pdf(
        _pdf_without_text(), OcrOptions(enabled=True, languages=("amh",))
    )

    assert ocr_pages == []
    assert "amh" in error


def test_threshold_controls_when_ocr_triggers(monkeypatch):
    _stub_ocr(monkeypatch, available=True, text="Recovered")
    short_text = "Page 3"

    _, below, _ = parse_pdf(
        _pdf_with_text(short_text), OcrOptions(enabled=True, min_text_chars=500)
    )
    _, above, _ = parse_pdf(
        _pdf_with_text(short_text), OcrOptions(enabled=True, min_text_chars=3)
    )

    assert below == [1], "a page under the threshold should be OCR'd"
    assert above == [], "a page over the threshold should be left alone"


def test_docx_never_invokes_ocr(monkeypatch):
    _stub_ocr(monkeypatch, available=False)
    from io import BytesIO

    from docx import Document

    document = Document()
    document.add_paragraph("Prospectus summary")
    buffer = BytesIO()
    document.save(buffer)

    parsed = parse_document("filing.docx", buffer.getvalue(), OcrOptions(enabled=True))

    assert parsed.ocr_pages == []
    assert parsed.ocr_error == ""


class _Parsed:
    def __init__(self, text="", ocr_pages=None, ocr_error=""):
        self._text = text
        self.ocr_pages = ocr_pages or []
        self.ocr_error = ocr_error

    @property
    def full_text(self):
        return self._text


def test_warning_states_the_truth_for_each_outcome():
    recovered = _extraction_warnings(_Parsed("text", ocr_pages=[1, 2]), OcrOptions(enabled=True))
    assert "Recovered text from 2 scanned page(s)" in recovered[0]

    unavailable = _extraction_warnings(
        _Parsed("", ocr_error="The tesseract binary is not installed."),
        OcrOptions(enabled=True),
    )
    assert any("could not run" in w for w in unavailable)
    assert not any("Recovered text" in w for w in unavailable)

    disabled = _extraction_warnings(_Parsed(""), OcrOptions(enabled=False))
    assert any("OCR fallback is disabled" in w for w in disabled)


@pytest.mark.skipif(ocr.probe().available is False, reason="tesseract binary not installed")
def test_real_tesseract_reads_a_rendered_page():
    """Runs only where Tesseract is installed, such as inside the backend image."""
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 100), "MINIMUM CAPITAL", fontsize=32)
    image = page.get_pixmap(dpi=ocr.RENDER_DPI).tobytes("png")

    text = ocr.image_to_text(image, ["eng"]).upper()

    assert "MINIMUM" in text
