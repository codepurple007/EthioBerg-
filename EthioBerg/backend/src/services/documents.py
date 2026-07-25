from __future__ import annotations

import json
from pathlib import Path
from uuid import uuid4

from src.domain.enums import FactStatus, MarketSegment
from src.domain.models import (
    ActorRef,
    DocumentEvaluateResponse,
    ExtractedFact,
    IssuerDocument,
    UpdateFactsInput,
)
from src.services.extraction import extract_facts
from src.services.ingestion import IngestionError, ParsedDocument, ParsedPage, parse_document
from src.services.rule_engine import PRE_REVIEW_DISCLAIMER, summarize_results
from src.adapters.repository import _now_iso
from src.services.rule_engine import PRE_REVIEW_DISCLAIMER, summarize_results


class DocumentService:
    def __init__(self, repository):
        self.repository = repository
        self.upload_dir = Path(__file__).resolve().parents[2] / "data" / "uploads"
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    def upload_document(
        self,
        filename: str,
        content: bytes,
        segment: MarketSegment,
        actor: ActorRef,
    ) -> IssuerDocument:
        try:
            parsed = parse_document(filename, content)
        except IngestionError as exc:
            raise exc

        document_id = f"doc-{uuid4().hex[:10]}"
        stored_path = self.upload_dir / f"{document_id}{Path(filename).suffix.lower()}"
        stored_path.write_bytes(content)

        warnings: list[str] = []
        if not parsed.full_text.strip():
            warnings.append("No embedded text detected. OCR fallback is not enabled in this MVP build.")

        with self.repository._connect() as conn:
            conn.execute(
                """
                INSERT INTO issuer_documents
                (id, filename, checksum, segment, mime_type, page_count, upload_timestamp,
                 extraction_status, facts_confirmed, stored_path, page_text_json, actor_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    document_id,
                    filename,
                    parsed.checksum,
                    segment.value,
                    parsed.mime_type,
                    len(parsed.pages),
                    _now_iso(),
                    "pending",
                    0,
                    str(stored_path),
                    json.dumps(
                        [{"pageNumber": p.page_number, "text": p.text} for p in parsed.pages]
                    ),
                    actor.actor_id,
                ),
            )

        self.repository.log_audit(actor, "DOCUMENT_UPLOADED", "IssuerDocument", document_id)
        return self.get_document(document_id, warnings=warnings)

    def extract_document(self, document_id: str, actor: ActorRef) -> IssuerDocument:
        row = self._fetch_row(document_id)
        if not row:
            raise LookupError("Document not found.")

        pages = json.loads(row["page_text_json"])
        parsed = ParsedDocument(
            pages=[ParsedPage(page_number=p["pageNumber"], text=p["text"]) for p in pages],
            mime_type=row["mime_type"],
            checksum=row["checksum"],
        )
        facts = extract_facts(parsed)
        self._save_facts(document_id, facts)

        with self.repository._connect() as conn:
            conn.execute(
                "UPDATE issuer_documents SET extraction_status = ?, facts_confirmed = 0 WHERE id = ?",
                ("extracted", document_id),
            )

        self.repository.log_audit(actor, "DOCUMENT_EXTRACTED", "IssuerDocument", document_id)
        return self.get_document(document_id)

    def update_facts(self, document_id: str, payload: UpdateFactsInput, actor: ActorRef) -> IssuerDocument:
        if not self._fetch_row(document_id):
            raise LookupError("Document not found.")

        facts = payload.facts
        if payload.confirm_for_evaluation:
            facts = [
                fact.model_copy(update={"status": FactStatus.USER_CONFIRMED})
                if fact.status != FactStatus.CONFLICT
                else fact
                for fact in facts
            ]

        self._save_facts(document_id, facts)
        with self.repository._connect() as conn:
            conn.execute(
                "UPDATE issuer_documents SET facts_confirmed = ? WHERE id = ?",
                (1 if payload.confirm_for_evaluation else 0, document_id),
            )

        if payload.confirm_for_evaluation:
            self.repository.log_audit(actor, "FACTS_CONFIRMED", "IssuerDocument", document_id)

        return self.get_document(document_id)

    def evaluate_document(self, document_id: str, actor: ActorRef) -> DocumentEvaluateResponse:
        document = self.get_document(document_id)
        if not document.facts_confirmed:
            raise ValueError("Facts must be user-confirmed before evaluation.")
        if not document.facts:
            raise ValueError("No extracted facts available for evaluation.")

        from src.domain.models import ExtractedFactInput

        settings = self.repository.get_settings()
        results = self.repository.rule_engine.evaluate(
            document.segment,
            [
                ExtractedFactInput(field=f.field, value=f.value, status=f.status)
                for f in document.facts
            ],
            include_draft_rules=False,
        )

        category_summary: dict[str, dict[str, int]] = {}
        for result in results:
            bucket = category_summary.setdefault(result.category, {})
            bucket[result.state] = bucket.get(result.state, 0) + 1

        self.repository.log_audit(actor, "READINESS_RUN_STARTED", "IssuerDocument", document_id)

        return DocumentEvaluateResponse(
            documentId=document_id,
            segment=document.segment,
            ruleVersion=settings.active_rule_version,
            results=results,
            summary=summarize_results(results),
            categorySummary=[
                {"category": category, **counts} for category, counts in category_summary.items()
            ],
            disclaimer=PRE_REVIEW_DISCLAIMER,
        )

    def list_documents(self) -> list[IssuerDocument]:
        with self.repository._connect() as conn:
            rows = conn.execute(
                "SELECT id FROM issuer_documents ORDER BY upload_timestamp DESC"
            ).fetchall()
        return [self.get_document(row["id"]) for row in rows]

    def get_document(self, document_id: str, warnings: list[str] | None = None) -> IssuerDocument:
        row = self._fetch_row(document_id)
        if not row:
            raise LookupError("Document not found.")
        facts = self._load_facts(document_id)
        return IssuerDocument(
            id=row["id"],
            filename=row["filename"],
            checksum=row["checksum"],
            segment=row["segment"],
            mimeType=row["mime_type"],
            pageCount=row["page_count"],
            uploadTimestamp=row["upload_timestamp"],
            extractionStatus=row["extraction_status"],
            factsConfirmed=bool(row["facts_confirmed"]),
            facts=facts,
            warnings=warnings or [],
        )

    def _fetch_row(self, document_id: str):
        with self.repository._connect() as conn:
            return conn.execute(
                "SELECT * FROM issuer_documents WHERE id = ?", (document_id,)
            ).fetchone()

    def _save_facts(self, document_id: str, facts: list[ExtractedFact]) -> None:
        with self.repository._connect() as conn:
            conn.execute("DELETE FROM extracted_facts WHERE document_id = ?", (document_id,))
            for fact in facts:
                conn.execute(
                    """
                    INSERT INTO extracted_facts
                    (id, document_id, field, value_json, unit, period, source_page,
                     source_quote, confidence, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        fact.id,
                        document_id,
                        fact.field,
                        json.dumps(fact.value),
                        fact.unit,
                        fact.period,
                        fact.source_page,
                        fact.source_quote,
                        fact.confidence,
                        fact.status,
                    ),
                )

    def _load_facts(self, document_id: str) -> list[ExtractedFact]:
        with self.repository._connect() as conn:
            rows = conn.execute(
                "SELECT * FROM extracted_facts WHERE document_id = ? ORDER BY field",
                (document_id,),
            ).fetchall()
        facts: list[ExtractedFact] = []
        for row in rows:
            value = json.loads(row["value_json"]) if row["value_json"] != "null" else None
            facts.append(
                ExtractedFact(
                    id=row["id"],
                    field=row["field"],
                    value=value,
                    unit=row["unit"],
                    period=row["period"],
                    sourcePage=row["source_page"],
                    sourceQuote=row["source_quote"],
                    confidence=row["confidence"],
                    status=row["status"],
                )
            )
        return facts
