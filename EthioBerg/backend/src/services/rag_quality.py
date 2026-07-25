from __future__ import annotations

import threading
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

import yaml

from src.adapters.repository import Repository
from src.domain.enums import MarketSegment
from src.domain.models import (
    ActorRef,
    EvalCaseResult,
    EvaluationProgress,
    RagQualityOverview,
    RagQualityRun,
    RegulatoryAskRequest,
)
from src.services.platform_config import PlatformConfigService
from src.services.regulatory_qa import RegulatoryQAService

HISTORY_LIMIT = 10
MAX_PARALLEL_CASES = 4


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _ratio(numerator: int, denominator: int) -> float:
    return round(numerator / denominator, 4) if denominator else 0.0


class GoldenCase:
    def __init__(self, payload: dict[str, Any]):
        self.id = payload["id"]
        self.question = payload["question"]
        self.expectation = payload.get("expectation", "answer")
        self.segment = payload.get("segment")
        self.language = payload.get("language")
        self.expected_source_ids: list[str] = payload.get("expected_source_ids", []) or []
        self.tags: list[str] = payload.get("tags", []) or []


class RagQualityService:
    """Runs the golden evaluation set through the live Q&A pipeline and scores it.

    Each case issues a real retrieval call, so runs execute on a background thread
    with progress reporting rather than blocking the request.
    """

    def __init__(
        self,
        repository: Repository,
        qa_service: RegulatoryQAService,
        config_service: PlatformConfigService,
        golden_set_path: Path,
    ):
        self.repository = repository
        self.qa_service = qa_service
        self.config_service = config_service
        self.golden_set_path = golden_set_path
        self._thread: threading.Thread | None = None
        self._lock = threading.Lock()
        self._progress = EvaluationProgress(
            running=False,
            completed=0,
            total=0,
            message="No evaluation has been started yet.",
        )

    def load_cases(self) -> list[GoldenCase]:
        if not self.golden_set_path.exists():
            return []
        payload = yaml.safe_load(self.golden_set_path.read_text(encoding="utf-8")) or {}
        return [GoldenCase(item) for item in payload.get("cases", [])]

    def progress(self) -> EvaluationProgress:
        with self._lock:
            return self._progress.model_copy()

    def _set_progress(self, **fields: Any) -> None:
        with self._lock:
            self._progress = self._progress.model_copy(update=fields)

    def overview(self) -> RagQualityOverview:
        history = [
            RagQualityRun.model_validate(item)
            for item in self.repository.list_eval_runs(HISTORY_LIMIT)
        ]
        return RagQualityOverview(
            guardrails=self.config_service.get_guardrails(),
            caseCount=len(self.load_cases()),
            latestRun=history[0] if history else None,
            history=history,
            progress=self.progress(),
        )

    def start_evaluation(self, actor: ActorRef) -> dict[str, Any]:
        cases = self.load_cases()
        if not cases:
            return {"ok": False, "message": "The golden evaluation set is empty."}

        with self._lock:
            if self._thread and self._thread.is_alive():
                return {"ok": False, "message": "An evaluation run is already in progress."}
            run_id = f"eval-{uuid4().hex[:8]}"
            self._progress = EvaluationProgress(
                running=True,
                runId=run_id,
                completed=0,
                total=len(cases),
                startedAt=_now_iso(),
                message=f"Evaluating {len(cases)} golden cases against the live pipeline…",
            )
            self._thread = threading.Thread(
                target=self._run, args=(run_id, cases, actor), daemon=True
            )
            self._thread.start()

        self.repository.log_audit(actor, "RAG_EVALUATION_STARTED", "RagQualityRun", run_id)
        return {"ok": True, "message": "Evaluation started.", "jobId": run_id}

    def _evaluate_case(self, case: GoldenCase) -> EvalCaseResult:
        request = RegulatoryAskRequest(
            question=case.question,
            segment=MarketSegment(case.segment) if case.segment else None,
            language=case.language,
        )
        started = time.perf_counter()
        response = self.qa_service.ask(request)
        latency_ms = (time.perf_counter() - started) * 1000

        cited_sources = {citation.source_id for citation in response.citations}
        expected_hit = bool(case.expected_source_ids) and bool(
            cited_sources & set(case.expected_source_ids)
        )

        expected_status = "ANSWERED" if case.expectation == "answer" else "ABSTAINED"
        passed = response.status == expected_status
        failure_reason: str | None = None
        if not passed:
            failure_reason = (
                f"Expected {expected_status.lower()} but the pipeline returned "
                f"{response.status.lower()}."
            )
        elif case.expectation == "answer" and case.expected_source_ids and not expected_hit:
            passed = False
            failure_reason = "Answered without citing any of the expected source documents."

        return EvalCaseResult(
            caseId=case.id,
            question=case.question,
            expectation=case.expectation,
            status=response.status,
            passed=passed,
            citationCount=len(response.citations),
            expectedSourceHit=expected_hit,
            verificationStatus=response.verification_status,
            latencyMs=round(latency_ms, 2),
            topChunkId=response.citations[0].chunk_id if response.citations else None,
            failureReason=failure_reason,
        )

    def _run(self, run_id: str, cases: list[GoldenCase], actor: ActorRef) -> None:
        try:
            results: list[EvalCaseResult] = []
            completed = 0
            workers = min(MAX_PARALLEL_CASES, len(cases))
            with ThreadPoolExecutor(max_workers=workers) as pool:
                for result in pool.map(self._safe_evaluate_case, cases):
                    results.append(result)
                    completed += 1
                    self._set_progress(
                        completed=completed,
                        message=f"Scored {completed} of {len(cases)} golden cases…",
                    )

            run = self._summarize(run_id, results, actor)
            self.repository.save_eval_run(run.id, run.model_dump(by_alias=True))
            self.repository.log_audit(actor, "RAG_EVALUATION_RUN", "RagQualityRun", run.id)
            self._set_progress(
                running=False,
                completed=len(results),
                message=(
                    f"Run {run.id} finished: {run.passed_cases}/{run.total_cases} cases passed."
                ),
            )
        except Exception as exc:
            self.repository.log_audit(
                actor, "RAG_EVALUATION_FAILED", "RagQualityRun", run_id, "failure"
            )
            self._set_progress(running=False, message=f"Evaluation failed: {exc}")

    def _safe_evaluate_case(self, case: GoldenCase) -> EvalCaseResult:
        try:
            return self._evaluate_case(case)
        except Exception as exc:
            return EvalCaseResult(
                caseId=case.id,
                question=case.question,
                expectation=case.expectation,
                status="ERROR",
                passed=False,
                citationCount=0,
                expectedSourceHit=False,
                verificationStatus="ERROR",
                latencyMs=0.0,
                topChunkId=None,
                failureReason=f"Pipeline error: {exc}",
            )

    def _summarize(
        self, run_id: str, results: list[EvalCaseResult], actor: ActorRef
    ) -> RagQualityRun:
        total = len(results)
        answered = sum(1 for row in results if row.status == "ANSWERED")
        abstained = sum(1 for row in results if row.status == "ABSTAINED")
        citation_covered = sum(
            1 for row in results if row.status == "ANSWERED" and row.citation_count > 0
        )
        expected_total = sum(1 for row in results if row.expectation == "answer")
        expected_hits = sum(
            1 for row in results if row.expectation == "answer" and row.expected_source_hit
        )
        verification_passed = sum(1 for row in results if row.verification_status == "PASSED")
        latency_total = sum(row.latency_ms for row in results)

        return RagQualityRun(
            id=run_id,
            createdAt=_now_iso(),
            actorName=actor.actor_name,
            retrievalMode=self.qa_service.retrieval_mode(),
            totalCases=total,
            passedCases=sum(1 for row in results if row.passed),
            answerRate=_ratio(answered, total),
            abstentionRate=_ratio(abstained, total),
            citationCoverage=_ratio(citation_covered, answered),
            expectedSourceRecall=_ratio(expected_hits, expected_total),
            verificationPassRate=_ratio(verification_passed, total),
            avgLatencyMs=round(latency_total / total, 2) if total else 0.0,
            results=results,
        )
