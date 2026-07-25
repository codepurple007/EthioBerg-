from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from src.adapters.repository import Repository, _slugify
from src.domain.enums import IndexStatus
from src.domain.models import ActorRef, AddSourceInput, AddSourceResponse, SourceDocument
from src.services.ingestion import IngestionError, compute_checksum, validate_upload
from src.services.source_indexing import SourceIndexingError, SourceIndexingService


class SourceService:
    def __init__(
        self,
        repository: Repository,
        sources_dir: Path,
        indexing_service: SourceIndexingService | None = None,
    ):
        self.repository = repository
        self.sources_dir = sources_dir
        self.sources_dir.mkdir(parents=True, exist_ok=True)
        self.indexing_service = indexing_service

    def upload_source(
        self,
        payload: AddSourceInput,
        filename: str,
        content: bytes,
        actor: ActorRef,
        force_duplicate: bool = False,
    ) -> AddSourceResponse:
        try:
            validate_upload(filename, content)
        except IngestionError as exc:
            return AddSourceResponse(ok=False, error=exc.message)

        checksum = compute_checksum(content)
        if checksum != payload.checksum:
            return AddSourceResponse(
                ok=False,
                error="Checksum mismatch. Re-select the file and try again.",
            )

        duplicate = self.repository.find_source_by_checksum(checksum)
        if duplicate and not force_duplicate:
            return AddSourceResponse(
                ok=False,
                error="A source with this checksum already exists. Confirm to create a separate version record.",
                duplicateId=duplicate.id,
            )

        source = SourceDocument(
            id=f"src-{_slugify(payload.title)}-{uuid4().hex[:8]}",
            title=payload.title,
            issuingBody=payload.issuing_body,
            version=payload.version,
            publicationDate=payload.publication_date,
            effectiveFrom=payload.effective_from,
            effectiveTo=payload.effective_to,
            language=payload.language,
            url=payload.url,
            checksum=checksum,
            trustClass=payload.trust_class,
            indexStatus=IndexStatus.PENDING.value,
            isActive=False,
        )

        suffix = Path(filename).suffix.lower()
        stored_path = self.sources_dir / f"{source.id}{suffix}"
        stored_path.write_bytes(content)

        created = self.repository.add_source_record(source, stored_path, actor)
        return AddSourceResponse(ok=True, source=created)

    def index_source(self, source_id: str, actor: ActorRef) -> SourceDocument:
        if not self.indexing_service:
            raise ValueError("Pinecone is not configured. Set PINECONE_API_KEY in backend/.env.")

        source = self.repository.get_source(source_id)
        if not source:
            raise LookupError("Source not found.")

        stored_path = self.repository.get_source_stored_path(source_id)
        if not stored_path:
            raise ValueError("No uploaded file is associated with this source.")

        try:
            chunk_count = self.indexing_service.index_source_file(source, Path(stored_path))
        except SourceIndexingError as exc:
            raise ValueError(exc.message) from exc

        updated = self.repository.mark_source_indexed(source_id, actor)
        if not updated:
            raise LookupError("Source not found.")
        return updated

    def run_smoke_test(self, source_id: str, actor: ActorRef) -> tuple[bool, str]:
        source = self.repository.get_source(source_id)
        if not source:
            return False, "Source not found."
        if not source.is_active or source.index_status != IndexStatus.INDEXED.value:
            self.repository.log_audit(actor, "RETRIEVAL_SMOKE_TEST", "SourceDocument", source_id, "failure")
            return False, "Source must be active and indexed before retrieval smoke test."

        if not self.indexing_service:
            self.repository.log_audit(actor, "RETRIEVAL_SMOKE_TEST", "SourceDocument", source_id, "success")
            return True, f'Smoke test passed for "{source.title}" — Pinecone not configured, metadata only.'

        ok, message = self.indexing_service.smoke_test_source(source)
        self.repository.log_audit(
            actor,
            "RETRIEVAL_SMOKE_TEST",
            "SourceDocument",
            source_id,
            "success" if ok else "failure",
        )
        return ok, message
