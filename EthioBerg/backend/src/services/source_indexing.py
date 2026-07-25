from __future__ import annotations

from pathlib import Path

from src.domain.models import SourceDocument
from src.services.ingestion import parse_document
from src.services.retrieval.chunking import chunk_page_text
from src.services.retrieval.pinecone_store import PineconeStore


class SourceIndexingError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class SourceIndexingService:
    def __init__(self, pinecone: PineconeStore):
        self.pinecone = pinecone

    def index_source_file(self, source: SourceDocument, file_path: Path) -> int:
        if not file_path.exists():
            raise SourceIndexingError("Source file not found on disk.")

        content = file_path.read_bytes()
        document = parse_document(file_path.name, content)
        records: list[dict] = []

        for page in document.pages:
            page_chunks = chunk_page_text(page.text)
            for chunk_index, chunk_text in enumerate(page_chunks, start=1):
                records.append(
                    {
                        "_id": f"{source.id}-p{page.page_number:03d}-c{chunk_index:02d}",
                        "text": chunk_text,
                        "source_id": source.id,
                        "source_title": source.title,
                        "section": f"Page {page.page_number}",
                        "page": page.page_number,
                        "language": source.language,
                        "effective_from": source.effective_from,
                        "effective_to": source.effective_to,
                        "segment": None,
                        "is_active": source.is_active,
                        "trust_class": source.trust_class,
                    }
                )

        if not records:
            raise SourceIndexingError(
                "No extractable text found in this file. Scanned/image-only PDFs require OCR."
            )

        return self.pinecone.upsert_records(records)

    def smoke_test_source(self, source: SourceDocument) -> tuple[bool, str]:
        hits = self.pinecone.search(
            "requirements disclosure obligations",
            source_id=source.id,
            top_k=3,
        )
        if not hits:
            return False, f'No indexed chunks found for "{source.title}".'
        top = hits[0]
        snippet = str(top["fields"].get("text", ""))[:120].replace("\n", " ")
        return True, (
            f'Smoke test passed for "{source.title}" — retrieved {len(hits)} chunk(s). '
            f'Top match (score {top["score"]:.3f}): {snippet}...'
        )
