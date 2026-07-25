from __future__ import annotations

from datetime import datetime, timezone

from src.adapters.repository import Repository
from src.domain.enums import IndexStatus
from src.domain.models import (
    ActorRef,
    ChunkPreviewItem,
    ChunkPreviewResponse,
    GuardrailSettings,
    GuardrailSettingsInput,
    IngestionPipelineStats,
    IngestionSettings,
    IngestionSettingsInput,
    RetrievalSettings,
    RetrievalSettingsInput,
)
from src.services.retrieval.chunking import chunk_parent_child

INGESTION_KEY = "ingestion_settings"
RETRIEVAL_KEY = "retrieval_settings"
GUARDRAIL_KEY = "guardrail_settings"

SAMPLE_TEXT = """Article 12. Minimum Paid-Up Capital for the Main Market Segment

An applicant seeking admission to the Main Market segment shall demonstrate a minimum
paid-up capital of ETB 500,000,000 as at the date of application, supported by audited
financial statements covering the three most recent financial years.

Where the applicant has undergone a reorganization, the Authority may require additional
evidence that the capital position is sustainable and that no material contingent
liabilities remain undisclosed.

Segment | Minimum paid-up capital (ETB) | Audited years required
Main | 500,000,000 | 3
Growth | 50,000,000 | 2
"""


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


class PlatformConfigService:
    """Owns admin-editable ingestion, retrieval, and guardrail configuration."""

    def __init__(self, repository: Repository):
        self.repository = repository

    def get_ingestion_settings(self) -> IngestionSettings:
        stored = self.repository.get_config(INGESTION_KEY)
        if not stored:
            return IngestionSettings(updatedAt=_now_iso(), updatedBy="system")
        return IngestionSettings.model_validate(stored)

    def update_ingestion_settings(
        self, payload: IngestionSettingsInput, actor: ActorRef
    ) -> IngestionSettings:
        version = self.repository.next_config_version(INGESTION_KEY)
        settings = IngestionSettings(
            version=version,
            updatedAt=_now_iso(),
            updatedBy=actor.actor_name,
            isActive=True,
            **payload.model_dump(by_alias=True),
        )
        value = settings.model_dump(by_alias=True)
        self.repository.save_config(INGESTION_KEY, value, actor)
        self.repository.save_config_version(
            INGESTION_KEY, version, value, actor, notes=payload.notes
        )
        self.repository.log_audit(
            actor, "INGESTION_SETTINGS_UPDATED", "IngestionSettings", f"v{version}"
        )
        return settings

    def list_ingestion_versions(self) -> list[IngestionSettings]:
        active = self.get_ingestion_settings()
        versions: list[IngestionSettings] = []
        for payload in self.repository.list_config_versions(INGESTION_KEY):
            payload["isActive"] = payload.get("version") == active.version
            versions.append(IngestionSettings.model_validate(payload))
        return versions

    def restore_ingestion_version(self, version: int, actor: ActorRef) -> IngestionSettings | None:
        stored = self.repository.get_config_version(INGESTION_KEY, version)
        if not stored:
            return None
        payload = IngestionSettingsInput.model_validate(
            {**stored, "notes": f"Restored from version {version}."}
        )
        return self.update_ingestion_settings(payload, actor)

    def get_retrieval_settings(self) -> RetrievalSettings:
        stored = self.repository.get_config(RETRIEVAL_KEY)
        if not stored:
            return RetrievalSettings(updatedAt=_now_iso(), updatedBy="system")
        return RetrievalSettings.model_validate(stored)

    def update_retrieval_settings(
        self, payload: RetrievalSettingsInput, actor: ActorRef
    ) -> RetrievalSettings:
        settings = RetrievalSettings(
            updatedAt=_now_iso(),
            updatedBy=actor.actor_name,
            **payload.model_dump(by_alias=True),
        )
        self.repository.save_config(RETRIEVAL_KEY, settings.model_dump(by_alias=True), actor)
        self.repository.log_audit(
            actor, "RETRIEVAL_SETTINGS_UPDATED", "RetrievalSettings", "global"
        )
        return settings

    def get_guardrails(self) -> GuardrailSettings:
        stored = self.repository.get_config(GUARDRAIL_KEY)
        if not stored:
            return GuardrailSettings(updatedAt=_now_iso(), updatedBy="system")
        return GuardrailSettings.model_validate(stored)

    def update_guardrails(
        self, payload: GuardrailSettingsInput, actor: ActorRef
    ) -> GuardrailSettings:
        settings = GuardrailSettings(
            updatedAt=_now_iso(),
            updatedBy=actor.actor_name,
            **payload.model_dump(by_alias=True),
        )
        self.repository.save_config(GUARDRAIL_KEY, settings.model_dump(by_alias=True), actor)
        self.repository.log_audit(actor, "GUARDRAILS_UPDATED", "GuardrailSettings", "global")
        return settings

    def ingestion_stats(self, corpus_chunks: int) -> IngestionPipelineStats:
        sources = self.repository.get_sources()
        archive = self.repository.get_scrape_archive_stats()
        return IngestionPipelineStats(
            totalSources=len(sources),
            indexedSources=sum(1 for s in sources if s.index_status == IndexStatus.INDEXED.value),
            pendingSources=sum(1 for s in sources if s.index_status == IndexStatus.PENDING.value),
            retiredSources=sum(1 for s in sources if s.index_status == IndexStatus.RETIRED.value),
            corpusChunks=corpus_chunks,
            scrapeChunks=int(archive.get("totalChunks", 0)),
            lastScrapeAt=archive.get("lastSyncDate"),
        )

    def preview_chunking(self, text: str | None = None) -> ChunkPreviewResponse:
        settings = self.get_ingestion_settings()
        sample = (text or SAMPLE_TEXT).strip() or SAMPLE_TEXT
        parents = chunk_parent_child(
            sample,
            parent_chars=settings.parent_chunk_chars,
            child_chars=settings.child_chunk_chars,
            overlap_chars=settings.chunk_overlap_chars,
            table_aware=settings.table_aware_parsing,
        )

        items: list[ChunkPreviewItem] = []
        child_total = 0
        for parent in parents:
            items.append(
                ChunkPreviewItem(
                    index=parent.index,
                    role="parent",
                    charCount=len(parent.text),
                    preview=_truncate(parent.text),
                )
            )
            for child in parent.children:
                child_total += 1
                items.append(
                    ChunkPreviewItem(
                        index=parent.index,
                        role="child",
                        charCount=len(child),
                        preview=_truncate(child),
                    )
                )

        return ChunkPreviewResponse(
            parentCount=len(parents),
            childCount=child_total,
            items=items[:24],
        )


def _truncate(value: str, limit: int = 220) -> str:
    collapsed = " ".join(value.split())
    return collapsed if len(collapsed) <= limit else collapsed[: limit - 3] + "..."
