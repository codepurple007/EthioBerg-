from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024


@dataclass
class ParsedPage:
    page_number: int
    text: str


@dataclass
class ParsedDocument:
    pages: list[ParsedPage]
    mime_type: str
    checksum: str

    @property
    def full_text(self) -> str:
        return "\n".join(page.text for page in self.pages)


class IngestionError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


def compute_checksum(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def validate_upload(filename: str, content: bytes) -> str:
    suffix = Path(filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise IngestionError(
            "UNSUPPORTED_TYPE",
            "Supported issuer documents: PDF (primary) and DOCX.",
        )
    if len(content) == 0:
        raise IngestionError("EMPTY_FILE", "Uploaded file is empty.")
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise IngestionError("FILE_TOO_LARGE", "File exceeds the 25 MB upload limit.")
    if suffix == ".pdf" and not content.startswith(b"%PDF"):
        raise IngestionError("INVALID_PDF", "File extension is PDF but content is not a valid PDF.")
    if suffix == ".docx" and content[:2] != b"PK":
        raise IngestionError("INVALID_DOCX", "File extension is DOCX but content is not a valid DOCX archive.")
    return suffix


def parse_pdf(content: bytes) -> list[ParsedPage]:
    import fitz

    pages: list[ParsedPage] = []
    with fitz.open(stream=content, filetype="pdf") as doc:
        for index, page in enumerate(doc, start=1):
            pages.append(ParsedPage(page_number=index, text=page.get_text("text")))
    return pages


def parse_docx(content: bytes) -> list[ParsedPage]:
    from docx import Document

    document = Document(BytesIO(content))
    paragraphs = [p.text.strip() for p in document.paragraphs if p.text.strip()]
    text = "\n".join(paragraphs)
    return [ParsedPage(page_number=1, text=text)]


def parse_document(filename: str, content: bytes) -> ParsedDocument:
    suffix = validate_upload(filename, content)
    checksum = compute_checksum(content)
    if suffix == ".pdf":
        pages = parse_pdf(content)
        mime_type = "application/pdf"
    else:
        pages = parse_docx(content)
        mime_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    return ParsedDocument(pages=pages, mime_type=mime_type, checksum=checksum)


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()
