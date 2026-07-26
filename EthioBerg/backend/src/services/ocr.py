"""Tesseract-backed OCR for issuer documents that carry no embedded text layer.

Tesseract is a system binary rather than a Python package, so it is absent from
environments that only run `pip install`. Everything here degrades to a reported
"unavailable" state instead of raising, letting callers tell the difference
between "the page held no text" and "we were unable to look".
"""

from __future__ import annotations

import functools
import shutil
from dataclasses import dataclass, field

# Tesseract's accuracy falls off sharply on renderings below roughly 300 DPI.
RENDER_DPI = 300

FALLBACK_LANGUAGE = "eng"


@dataclass(frozen=True)
class OcrStatus:
    available: bool
    version: str = ""
    languages: list[str] = field(default_factory=list)
    detail: str = ""


@dataclass(frozen=True)
class OcrOptions:
    """Ingestion settings that decide whether and how OCR runs."""

    enabled: bool = False
    languages: tuple[str, ...] = (FALLBACK_LANGUAGE,)
    min_text_chars: int = 120


@functools.lru_cache(maxsize=1)
def probe() -> OcrStatus:
    """Report whether Tesseract can run here, and which languages it has.

    Cached because it shells out; call `probe.cache_clear()` after changing the
    environment.
    """
    if shutil.which("tesseract") is None:
        return OcrStatus(
            available=False,
            detail="The tesseract binary is not installed in this environment.",
        )
    try:
        import pytesseract
    except ImportError:
        return OcrStatus(
            available=False,
            detail="The pytesseract package is not installed.",
        )

    try:
        version = str(pytesseract.get_tesseract_version())
        languages = sorted(lang for lang in pytesseract.get_languages() if lang != "osd")
    except Exception as exc:  # noqa: BLE001 - surface any tesseract failure as unavailable
        return OcrStatus(available=False, detail=f"Tesseract failed to start: {exc}")

    return OcrStatus(
        available=True,
        version=version,
        languages=languages,
        detail=f"Tesseract {version} with {len(languages)} language(s).",
    )


def resolve_languages(requested: tuple[str, ...] | list[str]) -> list[str]:
    """Keep only requested languages Tesseract actually has installed.

    Passing an uninstalled language code makes Tesseract fail the whole page, so
    unavailable ones are dropped rather than forwarded.
    """
    status = probe()
    if not status.available:
        return []
    installed = set(status.languages)
    resolved = [lang for lang in requested if lang in installed]
    if resolved:
        return resolved
    return [FALLBACK_LANGUAGE] if FALLBACK_LANGUAGE in installed else []


def image_to_text(image_bytes: bytes, languages: list[str]) -> str:
    """OCR a single rendered page. Raises RuntimeError if Tesseract is unusable."""
    status = probe()
    if not status.available:
        raise RuntimeError(status.detail)

    import pytesseract
    from PIL import Image
    from io import BytesIO

    with Image.open(BytesIO(image_bytes)) as image:
        return pytesseract.image_to_string(image, lang="+".join(languages or [FALLBACK_LANGUAGE]))
