from __future__ import annotations

import json
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

import yaml

from src.adapters.repository import Repository
from src.domain.models import ActorRef
from src.services.retrieval.pinecone_store import PineconeStore
from src.services.web_scraper import ScrapeSeed, ScraperRuntimeConfig, scrape_seeds


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


class ScraperService:
    BATCH_SIZE = 96

    def __init__(
        self,
        repository: Repository,
        config_path: Path,
        pinecone: PineconeStore | None = None,
    ):
        self.repository = repository
        self.config_path = config_path
        self.pinecone = pinecone
        self._thread: threading.Thread | None = None
        self._stop_event = threading.Event()
        self._lock = threading.Lock()

    def get_config(self) -> dict[str, Any]:
        return self.repository.get_scraper_config(self._default_config())

    def update_config(self, payload: dict[str, Any], actor: ActorRef) -> dict[str, Any]:
        current = self.get_config()
        current.update(payload)
        if "seeds" in payload:
            current["seeds"] = payload["seeds"]
        saved = self.repository.save_scraper_config(current)
        self.repository.log_audit(actor, "SCRAPER_CONFIG_UPDATED", "ScraperConfig", "1")
        return saved

    def get_status(self) -> dict[str, Any]:
        # The latest job rather than the running one: a scrape of a few seeds
        # finishes in seconds, so reporting only running jobs leaves the caller
        # with zeros and no log for every run that has already ended.
        job = self.repository.get_latest_scrape_job()
        archive = self.repository.get_scrape_archive_stats()
        if self.pinecone:
            try:
                pinecone_stats = self.pinecone.describe_stats()
                archive["pineconeChunks"] = pinecone_stats.get("chunkCount", 0)
            except Exception:
                archive["pineconeChunks"] = archive.get("totalChunks", 0)
        config = self.get_config()
        return {
            "archive": archive,
            "scrape": {
                "running": job is not None and job["status"] == "running",
                "status": job["status"] if job else "idle",
                "jobId": job["id"] if job else None,
                "pagesSynced": job.get("pages_synced", 0) if job else 0,
                "chunksSynced": job.get("chunks_synced", 0) if job else 0,
                "startedAt": job.get("started_at") if job else None,
                "finishedAt": job.get("finished_at") if job else None,
                "logTail": (job.get("log_text") or "")[-4000:] if job else "",
            },
            "config": {
                "seedCount": len(config.get("seeds", [])),
                "workers": config.get("workers", 4),
            },
        }

    def list_documents(self, *, page: int = 1, page_size: int = 20) -> dict[str, Any]:
        page_size = min(max(page_size, 1), 100)
        rows, total = self.repository.list_scrape_chunks(page=page, page_size=page_size)
        total_pages = max(1, (total + page_size - 1) // page_size)
        archive = self.repository.get_scrape_archive_stats()
        return {
            "status": archive,
            "documents": rows,
            "pagination": {
                "page": page,
                "pageSize": page_size,
                "totalPages": total_pages,
                "totalChunks": total,
            },
        }

    def start_scrape(self, actor: ActorRef) -> dict[str, Any]:
        with self._lock:
            active = self.repository.get_active_scrape_job()
            if active and active["status"] == "running":
                return {"ok": False, "message": "A scrape job is already running."}
            if self._thread and self._thread.is_alive():
                return {"ok": False, "message": "Scrape workers are still shutting down."}

            job_id = f"job-{uuid.uuid4().hex[:10]}"
            self.repository.create_scrape_job(job_id)
            self._stop_event.clear()
            self._thread = threading.Thread(
                target=self._run_job,
                args=(job_id, actor),
                daemon=True,
            )
            self._thread.start()
            self.repository.log_audit(actor, "SCRAPER_STARTED", "ScrapeJob", job_id)
            return {"ok": True, "message": "Scrape started.", "jobId": job_id}

    def stop_scrape(self, actor: ActorRef) -> dict[str, Any]:
        self._stop_event.set()
        self.repository.log_audit(actor, "SCRAPER_STOP_REQUESTED", "ScrapeJob", "active")
        return {"ok": True, "message": "Stop signal sent to scraper workers."}

    def clear_archive(self, actor: ActorRef) -> dict[str, Any]:
        if self.repository.get_active_scrape_job():
            return {"ok": False, "message": "Stop the running scrape before clearing the archive."}
        deleted = self.repository.clear_scrape_chunks()
        self.repository.log_audit(actor, "SCRAPER_ARCHIVE_CLEARED", "ScrapeArchive", "all")
        return {"ok": True, "message": f"Cleared {deleted} scraped chunks from the database."}

    def export_csv(self) -> str:
        rows = self.repository.list_all_scrape_chunks()
        lines = ["ID,URL,Cleaned_Content,Crawled_At,Category,Title"]
        for row in rows:
            content = str(row["content"]).replace('"', '""')
            lines.append(
                f'"{row["id"]}","{row["source_url"]}","{content}","{row["scraped_at"]}","{row["category"]}","{row["title"]}"'
            )
        return "\n".join(lines)

    def _run_job(self, job_id: str, actor: ActorRef) -> None:
        logs: list[str] = [f"[{_now_iso()}] Scrape job {job_id} started."]
        pages = 0
        chunks_total = 0

        def append_log(line: str) -> None:
            logs.append(line)
            self.repository.update_scrape_job(job_id, log_text="\n".join(logs[-200:]))

        try:
            config_dict = self.get_config()
            runtime = self._to_runtime_config(config_dict)
            append_log(f"Fetching {len(runtime.seeds or [])} seed URLs…")

            def replace_url_chunks(source_url: str, url_chunks: list[dict[str, Any]]) -> None:
                removed = self.repository.delete_scrape_chunks_by_url(source_url)
                if removed:
                    append_log(f"Replaced {removed} previous chunk(s) for {source_url}")
                if self.pinecone:
                    try:
                        self.pinecone.delete_by_source_url(source_url)
                    except Exception as exc:
                        append_log(f"Pinecone cleanup warning for {source_url}: {exc}")

                db_records = [
                    {
                        "id": item["id"],
                        "job_id": job_id,
                        "source_url": item["source_url"],
                        "title": item["title"],
                        "category": item["category"],
                        "scraped_at": item["scraped_at"],
                        "content": item["content"],
                        "pinecone_id": item["id"],
                    }
                    for item in url_chunks
                ]
                self.repository.save_scrape_chunks(db_records)

                if self.pinecone:
                    pinecone_records = [
                        {
                            "_id": item["id"],
                            "text": item["content"],
                            "source_id": f"web-{hash(item['source_url']) & 0xFFFFFFFF:08x}",
                            "source_title": item["title"],
                            "section": item["category"],
                            "language": "en",
                            "source_url": item["source_url"],
                            "scraped_at": item["scraped_at"],
                            "doc_type": "web_scrape",
                            "is_active": True,
                            "trust_class": "official_regulatory",
                        }
                        for item in url_chunks
                    ]
                    for start in range(0, len(pinecone_records), self.BATCH_SIZE):
                        batch = pinecone_records[start : start + self.BATCH_SIZE]
                        self.pinecone.upsert_records(batch)

            def on_progress(chunk_count: int, url: str) -> None:
                nonlocal pages, chunks_total
                pages += 1
                chunks_total += chunk_count
                self.repository.update_scrape_job(
                    job_id,
                    pages_synced=pages,
                    chunks_synced=chunks_total,
                )
                append_log(f"Updated {chunk_count} chunks for {url}")

            _, scrape_logs = scrape_seeds(
                runtime,
                on_url_scraped=replace_url_chunks,
                on_progress=on_progress,
                should_stop=self._stop_event.is_set,
            )
            for line in scrape_logs:
                append_log(line)

            if not self.pinecone and chunks_total:
                append_log("Pinecone not configured — chunks saved to database only.")

            status = "stopped" if self._stop_event.is_set() else "completed"
            append_log(f"Job {status}. pages={pages}, chunks={chunks_total}.")
            self.repository.finish_scrape_job(job_id, status=status)
            self.repository.log_audit(actor, "SCRAPER_FINISHED", "ScrapeJob", job_id, status)
        except Exception as exc:
            append_log(f"Job failed: {exc}")
            self.repository.finish_scrape_job(job_id, status="failed")
            self.repository.log_audit(actor, "SCRAPER_FAILED", "ScrapeJob", job_id, "failure")

    def _to_runtime_config(self, payload: dict[str, Any]) -> ScraperRuntimeConfig:
        seeds = [
            ScrapeSeed(url=item["url"], category=item.get("category", "web_scrape"))
            for item in payload.get("seeds", [])
            if item.get("url")
        ]
        return ScraperRuntimeConfig(
            chunk_size=int(payload.get("chunk_size", 500)),
            workers=int(payload.get("workers", 4)),
            request_timeout_sec=int(payload.get("request_timeout_sec", 10)),
            max_page_bytes=int(payload.get("max_page_bytes", 31_457_280)),
            user_agent=str(payload.get("user_agent", "EthioBerg-WebScraper/1.0")),
            default_rate_delay_ms=int(payload.get("default_rate_delay_ms", 250)),
            seeds=seeds,
        )

    def _default_config(self) -> dict[str, Any]:
        if self.config_path.exists():
            loaded = yaml.safe_load(self.config_path.read_text(encoding="utf-8")) or {}
            if isinstance(loaded, dict):
                return loaded
        return {
            "chunk_size": 500,
            "workers": 4,
            "request_timeout_sec": 10,
            "max_page_bytes": 31457280,
            "user_agent": "EthioBerg-WebScraper/1.0 (ECMA/ESX Research)",
            "default_rate_delay_ms": 250,
            "seeds": [],
        }
