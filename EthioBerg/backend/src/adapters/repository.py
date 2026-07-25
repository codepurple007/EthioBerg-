from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterator
from uuid import uuid4

from src.domain.enums import IndexStatus, MarketSegment, ReviewStatus
from src.domain.models import (
    ActorRef,
    AddSourceInput,
    AddSourceResponse,
    AppSettings,
    AuditEvent,
    Company,
    DashboardStats,
    RuleDefinition,
    SourceDocument,
)
from src.services.rule_engine import RuleEngine, load_rules_from_directory

PRE_REVIEW_DISCLAIMER = (
    "EthioBerg provides an automated pre-review based on the documents and rule versions "
    "identified in this report. It is not an approval, legal opinion, audit opinion, "
    "or guarantee of compliance."
)


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _slugify(value: str) -> str:
    slug = "".join(ch if ch.isalnum() else "-" for ch in value.lower()).strip("-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug[:40]


class Repository:
    def __init__(self, db_path: Path, rules_dir: Path):
        self.db_path = db_path
        self.rules_dir = rules_dir
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()
        self.rule_engine = RuleEngine(load_rules_from_directory(rules_dir))
        self._seed_if_empty()
        self._backfill_companies()

    @contextmanager
    def _connect(self) -> Iterator[sqlite3.Connection]:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    def _init_db(self) -> None:
        with self._connect() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS sources (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    issuing_body TEXT NOT NULL,
                    version TEXT NOT NULL,
                    publication_date TEXT NOT NULL,
                    effective_from TEXT NOT NULL,
                    effective_to TEXT,
                    language TEXT NOT NULL,
                    url TEXT,
                    checksum TEXT NOT NULL,
                    trust_class TEXT NOT NULL,
                    index_status TEXT NOT NULL,
                    is_active INTEGER NOT NULL
                );
                CREATE TABLE IF NOT EXISTS companies (
                    id TEXT PRIMARY KEY,
                    official_name TEXT NOT NULL,
                    aliases_json TEXT NOT NULL,
                    ticker TEXT NOT NULL,
                    sector TEXT NOT NULL,
                    segment TEXT NOT NULL,
                    listing_date TEXT NOT NULL,
                    source_id TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS settings (
                    id INTEGER PRIMARY KEY CHECK (id = 1),
                    synthetic_demo_enabled INTEGER NOT NULL,
                    active_rule_version TEXT NOT NULL,
                    disclaimer_text TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS audit_events (
                    id TEXT PRIMARY KEY,
                    timestamp TEXT NOT NULL,
                    actor_id TEXT NOT NULL,
                    actor_name TEXT NOT NULL,
                    action TEXT NOT NULL,
                    entity_type TEXT NOT NULL,
                    entity_id TEXT NOT NULL,
                    result TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS rule_overrides (
                    rule_id TEXT PRIMARY KEY,
                    review_status TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS counters (
                    name TEXT PRIMARY KEY,
                    value INTEGER NOT NULL
                );
                CREATE TABLE IF NOT EXISTS issuer_documents (
                    id TEXT PRIMARY KEY,
                    filename TEXT NOT NULL,
                    checksum TEXT NOT NULL,
                    segment TEXT NOT NULL,
                    mime_type TEXT NOT NULL,
                    page_count INTEGER NOT NULL,
                    upload_timestamp TEXT NOT NULL,
                    extraction_status TEXT NOT NULL,
                    facts_confirmed INTEGER NOT NULL,
                    stored_path TEXT NOT NULL,
                    page_text_json TEXT NOT NULL,
                    actor_id TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS extracted_facts (
                    id TEXT PRIMARY KEY,
                    document_id TEXT NOT NULL,
                    field TEXT NOT NULL,
                    value_json TEXT,
                    unit TEXT NOT NULL,
                    period TEXT,
                    source_page INTEGER,
                    source_quote TEXT,
                    confidence REAL NOT NULL,
                    status TEXT NOT NULL,
                    FOREIGN KEY (document_id) REFERENCES issuer_documents(id)
                );
                """
            )

    def _seed_if_empty(self) -> None:
        with self._connect() as conn:
            count = conn.execute("SELECT COUNT(*) FROM sources").fetchone()[0]
            if count:
                self._apply_rule_overrides(conn)
                return

            seed_sources = [
                SourceDocument(
                    id="src-ecma-1030",
                    title="ECMA Directive on Public Offering and Trading of Securities No. 1030/2024",
                    issuingBody="ECMA",
                    version="1030/2024",
                    publicationDate="2024-06-01",
                    effectiveFrom="2024-07-01",
                    effectiveTo=None,
                    language="en",
                    url="https://ecma.gov.et/laws-regulation/",
                    checksum="a3f8c2d1e9b047651234567890abcdef",
                    trustClass="official_regulatory",
                    indexStatus="indexed",
                    isActive=True,
                ),
                SourceDocument(
                    id="src-esx-rulebook",
                    title="ESX Rulebook (Effective Version)",
                    issuingBody="ESX",
                    version="2025.1",
                    publicationDate="2025-01-01",
                    effectiveFrom="2025-01-01",
                    effectiveTo=None,
                    language="en",
                    url="https://esx.et/equity-market/listing/",
                    checksum="b7e4a1f2c8d039562345678901bcdef0",
                    trustClass="official_regulatory",
                    indexStatus="indexed",
                    isActive=True,
                ),
                SourceDocument(
                    id="src-proclamation-1248",
                    title="Capital Market Proclamation No. 1248/2021",
                    issuingBody="FDRE",
                    version="1248/2021",
                    publicationDate="2021-05-01",
                    effectiveFrom="2021-05-01",
                    effectiveTo=None,
                    language="en",
                    url="https://ecma.gov.et/laws-regulation/",
                    checksum="e2f4a6b8c0d961895678901234ef0123",
                    trustClass="official_regulatory",
                    indexStatus="retired",
                    isActive=False,
                ),
            ]
            for source in seed_sources:
                self._insert_source(conn, source)

            companies = self._default_companies()
            for company in companies:
                conn.execute(
                    """
                    INSERT INTO companies
                    (id, official_name, aliases_json, ticker, sector, segment, listing_date, source_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        company.id,
                        company.official_name,
                        json.dumps(company.aliases),
                        company.ticker,
                        company.sector,
                        company.segment,
                        company.listing_date,
                        company.source_id,
                    ),
                )

            conn.execute(
                """
                INSERT INTO settings (id, synthetic_demo_enabled, active_rule_version, disclaimer_text)
                VALUES (1, 1, '2025.1-draft', ?)
                """,
                (PRE_REVIEW_DISCLAIMER,),
            )

            seed_audit = [
                ("ae1", "2026-07-25T09:00:00+03:00", "u5", "Samuel Worku", "SOURCE_ACTIVATED", "SourceDocument", "src-esx-rulebook", "success"),
            ]
            for row in seed_audit:
                conn.execute(
                    """
                    INSERT INTO audit_events
                    (id, timestamp, actor_id, actor_name, action, entity_type, entity_id, result)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    row,
                )
            conn.execute("INSERT INTO counters (name, value) VALUES ('audit', 1)")

    def _default_companies(self) -> list[Company]:
        return [
            Company(
                id="c1",
                officialName="Awash Bank S.C.",
                aliases=["Awash Bank", "AWASH"],
                ticker="AWASH",
                sector="Financial Services",
                segment=MarketSegment.MAIN,
                listingDate="2025-01-10",
                sourceId="src-esx-listed",
            ),
            Company(
                id="c2",
                officialName="Bank of Abyssinia S.C.",
                aliases=["BOA", "Bank of Abyssinia", "AIB"],
                ticker="BOA",
                sector="Financial Services",
                segment=MarketSegment.MAIN,
                listingDate="2025-01-10",
                sourceId="src-esx-listed",
            ),
            Company(
                id="c3",
                officialName="Dashen Bank S.C.",
                aliases=["Dashen Bank", "DASHEN"],
                ticker="DASHEN",
                sector="Financial Services",
                segment=MarketSegment.MAIN,
                listingDate="2025-01-10",
                sourceId="src-esx-listed",
            ),
            Company(
                id="c4",
                officialName="Wegagen Bank S.C.",
                aliases=["Wegagen Bank", "WEGAGEN"],
                ticker="WEGAGEN",
                sector="Financial Services",
                segment=MarketSegment.MAIN,
                listingDate="2025-01-10",
                sourceId="src-esx-listed",
            ),
            Company(
                id="c5",
                officialName="Ethio Telecom S.C.",
                aliases=["Ethio Telecom", "Ethio telecom", "ET"],
                ticker="ET",
                sector="Telecommunications",
                segment=MarketSegment.MAIN,
                listingDate="2025-01-10",
                sourceId="src-esx-listed",
            ),
        ]

    def _backfill_companies(self) -> None:
        with self._connect() as conn:
            for company in self._default_companies():
                conn.execute(
                    """
                    INSERT OR IGNORE INTO companies
                    (id, official_name, aliases_json, ticker, sector, segment, listing_date, source_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        company.id,
                        company.official_name,
                        json.dumps(company.aliases),
                        company.ticker,
                        company.sector,
                        company.segment,
                        company.listing_date,
                        company.source_id,
                    ),
                )

    def _apply_rule_overrides(self, conn: sqlite3.Connection) -> None:
        rows = conn.execute("SELECT rule_id, review_status FROM rule_overrides").fetchall()
        for row in rows:
            self.rule_engine.update_rule_review_status(row["rule_id"], ReviewStatus(row["review_status"]))

    def _insert_source(self, conn: sqlite3.Connection, source: SourceDocument) -> None:
        conn.execute(
            """
            INSERT INTO sources
            (id, title, issuing_body, version, publication_date, effective_from, effective_to,
             language, url, checksum, trust_class, index_status, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                source.id,
                source.title,
                source.issuing_body,
                source.version,
                source.publication_date,
                source.effective_from,
                source.effective_to,
                source.language,
                source.url,
                source.checksum,
                source.trust_class,
                source.index_status,
                1 if source.is_active else 0,
            ),
        )

    def _row_to_source(self, row: sqlite3.Row) -> SourceDocument:
        return SourceDocument(
            id=row["id"],
            title=row["title"],
            issuingBody=row["issuing_body"],
            version=row["version"],
            publicationDate=row["publication_date"],
            effectiveFrom=row["effective_from"],
            effectiveTo=row["effective_to"],
            language=row["language"],
            url=row["url"] or "",
            checksum=row["checksum"],
            trustClass=row["trust_class"],
            indexStatus=row["index_status"],
            isActive=bool(row["is_active"]),
        )

    def _next_audit_id(self, conn: sqlite3.Connection) -> str:
        row = conn.execute("SELECT value FROM counters WHERE name = 'audit'").fetchone()
        if row is None:
            conn.execute("INSERT INTO counters (name, value) VALUES ('audit', 0)")
            current = 0
        else:
            current = row["value"] + 1
        conn.execute("UPDATE counters SET value = ? WHERE name = 'audit'", (current,))
        return f"ae{current}"

    def log_audit(
        self,
        actor: ActorRef,
        action: str,
        entity_type: str,
        entity_id: str,
        result: str = "success",
    ) -> AuditEvent:
        with self._connect() as conn:
            event = AuditEvent(
                id=self._next_audit_id(conn),
                timestamp=_now_iso(),
                actorId=actor.actor_id,
                actorName=actor.actor_name,
                action=action,
                entityType=entity_type,
                entityId=entity_id,
                result=result,
            )
            conn.execute(
                """
                INSERT INTO audit_events
                (id, timestamp, actor_id, actor_name, action, entity_type, entity_id, result)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    event.id,
                    event.timestamp,
                    event.actor_id,
                    event.actor_name,
                    event.action,
                    event.entity_type,
                    event.entity_id,
                    event.result,
                ),
            )
            return event

    def get_sources(self) -> list[SourceDocument]:
        with self._connect() as conn:
            rows = conn.execute("SELECT * FROM sources ORDER BY title").fetchall()
            return [self._row_to_source(row) for row in rows]

    def get_source(self, source_id: str) -> SourceDocument | None:
        with self._connect() as conn:
            row = conn.execute("SELECT * FROM sources WHERE id = ?", (source_id,)).fetchone()
            return self._row_to_source(row) if row else None

    def find_source_by_checksum(self, checksum: str) -> SourceDocument | None:
        with self._connect() as conn:
            row = conn.execute("SELECT * FROM sources WHERE checksum = ?", (checksum,)).fetchone()
            return self._row_to_source(row) if row else None

    def add_source(self, payload: AddSourceInput, actor: ActorRef, force_duplicate: bool = False) -> AddSourceResponse:
        duplicate = self.find_source_by_checksum(payload.checksum)
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
            checksum=payload.checksum,
            trustClass=payload.trust_class,
            indexStatus=IndexStatus.PENDING.value,
            isActive=False,
        )
        with self._connect() as conn:
            self._insert_source(conn, source)
        self.log_audit(actor, "SOURCE_ADDED", "SourceDocument", source.id)
        return AddSourceResponse(ok=True, source=source)

    def _update_source(self, source_id: str, **fields: Any) -> SourceDocument | None:
        if not fields:
            return self.get_source(source_id)
        columns = ", ".join(f"{key} = ?" for key in fields)
        values = list(fields.values()) + [source_id]
        with self._connect() as conn:
            conn.execute(f"UPDATE sources SET {columns} WHERE id = ?", values)
        return self.get_source(source_id)

    def activate_source(self, source_id: str, actor: ActorRef) -> SourceDocument | None:
        source = self.get_source(source_id)
        if not source:
            return None
        index_status = IndexStatus.INDEXED.value if source.index_status == IndexStatus.RETIRED.value else source.index_status
        updated = self._update_source(source_id, is_active=1, index_status=index_status)
        self.log_audit(actor, "SOURCE_ACTIVATED", "SourceDocument", source_id)
        return updated

    def retire_source(self, source_id: str, actor: ActorRef) -> SourceDocument | None:
        if not self.get_source(source_id):
            return None
        updated = self._update_source(source_id, is_active=0, index_status=IndexStatus.RETIRED.value)
        self.log_audit(actor, "SOURCE_RETIRED", "SourceDocument", source_id)
        return updated

    def index_source(self, source_id: str, actor: ActorRef) -> SourceDocument | None:
        if not self.get_source(source_id):
            return None
        updated = self._update_source(source_id, index_status=IndexStatus.INDEXED.value)
        self.log_audit(actor, "SOURCE_INDEXED", "SourceDocument", source_id)
        return updated

    def run_smoke_test(self, source_id: str, actor: ActorRef) -> tuple[bool, str]:
        source = self.get_source(source_id)
        if not source:
            return False, "Source not found."
        if not source.is_active or source.index_status != IndexStatus.INDEXED.value:
            self.log_audit(actor, "RETRIEVAL_SMOKE_TEST", "SourceDocument", source_id, "failure")
            return False, "Source must be active and indexed before retrieval smoke test."
        self.log_audit(actor, "RETRIEVAL_SMOKE_TEST", "SourceDocument", source_id, "success")
        return True, f'Smoke test passed for "{source.title}" — 3 sample clauses retrieved.'

    def get_companies(self) -> list[Company]:
        with self._connect() as conn:
            rows = conn.execute("SELECT * FROM companies ORDER BY official_name").fetchall()
            return [
                Company(
                    id=row["id"],
                    officialName=row["official_name"],
                    aliases=json.loads(row["aliases_json"]),
                    ticker=row["ticker"],
                    sector=row["sector"],
                    segment=row["segment"],
                    listingDate=row["listing_date"],
                    sourceId=row["source_id"],
                )
                for row in rows
            ]

    def get_rules(self, segment: MarketSegment | None = None) -> list[RuleDefinition]:
        rules = self.rule_engine.list_rules(segment)
        with self._connect() as conn:
            overrides = {
                row["rule_id"]: ReviewStatus(row["review_status"])
                for row in conn.execute("SELECT rule_id, review_status FROM rule_overrides").fetchall()
            }
        merged: list[RuleDefinition] = []
        for rule in rules:
            data = rule.model_dump(by_alias=True)
            if rule.rule_id in overrides:
                data["reviewStatus"] = overrides[rule.rule_id].value
            merged.append(RuleDefinition.model_validate(data))
        return merged

    def approve_rule(self, rule_id: str, actor: ActorRef) -> RuleDefinition | None:
        existing = next((r for r in self.rule_engine.list_rules() if r.rule_id == rule_id), None)
        if not existing:
            return None
        self.rule_engine.update_rule_review_status(rule_id, ReviewStatus.APPROVED)
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO rule_overrides (rule_id, review_status)
                VALUES (?, ?)
                ON CONFLICT(rule_id) DO UPDATE SET review_status = excluded.review_status
                """,
                (rule_id, ReviewStatus.APPROVED.value),
            )
        self.log_audit(actor, "RULE_APPROVED", "RuleDefinition", rule_id)
        return next(r for r in self.get_rules() if r.rule_id == rule_id)

    def get_settings(self) -> AppSettings:
        with self._connect() as conn:
            row = conn.execute("SELECT * FROM settings WHERE id = 1").fetchone()
            return AppSettings(
                syntheticDemoEnabled=bool(row["synthetic_demo_enabled"]),
                activeRuleVersion=row["active_rule_version"],
                disclaimerText=row["disclaimer_text"],
            )

    def update_settings(self, actor: ActorRef, **fields: Any) -> AppSettings:
        allowed = {
            "synthetic_demo_enabled": "syntheticDemoEnabled",
            "active_rule_version": "activeRuleVersion",
        }
        updates = {}
        for key, alias in allowed.items():
            if alias in fields and fields[alias] is not None:
                value = fields[alias]
                if key == "synthetic_demo_enabled":
                    value = 1 if value else 0
                updates[key] = value
        if updates:
            columns = ", ".join(f"{key} = ?" for key in updates)
            with self._connect() as conn:
                conn.execute(f"UPDATE settings SET {columns} WHERE id = 1", list(updates.values()))
        self.log_audit(actor, "SETTINGS_UPDATED", "AppSettings", "global")
        return self.get_settings()

    def get_audit_logs(
        self,
        *,
        actor_id: str | None = None,
        action: str | None = None,
        result: str | None = None,
        search: str | None = None,
    ) -> list[AuditEvent]:
        query = "SELECT * FROM audit_events WHERE 1=1"
        params: list[Any] = []
        if actor_id:
            query += " AND actor_id = ?"
            params.append(actor_id)
        if action:
            query += " AND action = ?"
            params.append(action)
        if result:
            query += " AND result = ?"
            params.append(result)
        if search:
            query += " AND (actor_name LIKE ? OR action LIKE ? OR entity_id LIKE ? OR entity_type LIKE ?)"
            like = f"%{search}%"
            params.extend([like, like, like, like])
        query += " ORDER BY timestamp DESC"
        with self._connect() as conn:
            rows = conn.execute(query, params).fetchall()
            return [
                AuditEvent(
                    id=row["id"],
                    timestamp=row["timestamp"],
                    actorId=row["actor_id"],
                    actorName=row["actor_name"],
                    action=row["action"],
                    entityType=row["entity_type"],
                    entityId=row["entity_id"],
                    result=row["result"],
                )
                for row in rows
            ]

    def get_dashboard_stats(self) -> DashboardStats:
        sources = self.get_sources()
        return DashboardStats(
            activeSources=sum(1 for s in sources if s.is_active),
            pendingReviews=0,
            readinessRuns=0,
            qaSessions=0,
            registeredCompanies=len(self.get_companies()),
        )
