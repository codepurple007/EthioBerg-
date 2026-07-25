import time

from fastapi import APIRouter, Header, HTTPException

from src.api.deps import platform_config_service, regulatory_qa_service, repository
from src.domain.enums import IndexStatus
from src.domain.models import (
    ActorRef,
    RegulatoryAskRequest,
    RetrievalComponentHealth,
    RetrievalHealth,
    RetrievalProbeHit,
    RetrievalProbeRequest,
    RetrievalProbeResponse,
    RetrievalSettings,
    RetrievalSettingsInput,
)

router = APIRouter(prefix="/retrieval", tags=["retrieval"])


def _actor(actor_id: str | None, actor_name: str | None) -> ActorRef:
    if not actor_id or not actor_name:
        raise HTTPException(status_code=400, detail="X-Actor-Id and X-Actor-Name headers are required.")
    return ActorRef(actorId=actor_id, actorName=actor_name)


@router.get("/settings", response_model=RetrievalSettings)
def get_retrieval_settings() -> RetrievalSettings:
    return platform_config_service.get_retrieval_settings()


@router.put("/settings", response_model=RetrievalSettings)
def update_retrieval_settings(
    payload: RetrievalSettingsInput,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> RetrievalSettings:
    if payload.bm25_weight == 0 and payload.dense_weight == 0:
        raise HTTPException(
            status_code=400,
            detail="At least one of the BM25 or dense weights must be greater than zero.",
        )
    if payload.rerank_enabled and payload.rerank_top_n < payload.top_k:
        raise HTTPException(
            status_code=400,
            detail="Rerank depth must be at least as large as the returned top-K.",
        )
    if payload.candidate_pool < payload.top_k:
        raise HTTPException(
            status_code=400,
            detail="Candidate pool must be at least as large as the returned top-K.",
        )
    return platform_config_service.update_retrieval_settings(payload, _actor(x_actor_id, x_actor_name))


@router.get("/health", response_model=RetrievalHealth)
def retrieval_health() -> RetrievalHealth:
    stats = regulatory_qa_service.corpus_stats()
    sources = repository.get_sources()
    indexed = sum(1 for source in sources if source.index_status == IndexStatus.INDEXED.value)
    active = sum(1 for source in sources if source.is_active)
    archive = repository.get_scrape_archive_stats()
    chunk_count = int(stats["chunkCount"])

    settings = platform_config_service.get_retrieval_settings()
    pinecone_serving = regulatory_qa_service.pinecone_active(settings)
    local_corpus = len(regulatory_qa_service.chunks)

    components = [
        RetrievalComponentHealth(
            name="Lexical index (BM25)",
            status="healthy" if local_corpus else "offline",
            detail=(
                f"{local_corpus} regulatory chunks indexed."
                + ("" if not pinecone_serving else " Standby while the hosted index serves queries.")
            ),
        ),
        RetrievalComponentHealth(
            name="Dense index (TF-IDF cosine)",
            status="healthy" if local_corpus else "offline",
            detail="In-process vector index built at startup.",
        ),
        RetrievalComponentHealth(
            name="Pinecone vector store",
            status=(
                "healthy"
                if pinecone_serving
                else "degraded"
                if regulatory_qa_service.use_pinecone
                else "offline"
            ),
            detail=(
                "Serving dense retrieval for live queries."
                if pinecone_serving
                else "Configured but bypassed — the backend is set to the in-process retriever."
                if regulatory_qa_service.use_pinecone
                else "Not configured — the in-process hybrid retriever serves all queries."
            ),
        ),
        RetrievalComponentHealth(
            name="Source corpus",
            status="healthy" if active else "degraded",
            detail=f"{active} active of {len(sources)} registered sources, {indexed} indexed.",
        ),
        RetrievalComponentHealth(
            name="Scrape archive",
            status="healthy" if archive.get("totalChunks") else "degraded",
            detail=f"{archive.get('totalChunks', 0)} scraped chunks, last sync {archive.get('lastSyncDate') or 'never'}.",
        ),
    ]

    return RetrievalHealth(
        retrievalMode=str(stats["retrievalMode"]),
        corpusChunks=chunk_count,
        sourceCount=int(stats["sourceCount"]),
        activeSources=active,
        indexedSources=indexed,
        pineconeConfigured=regulatory_qa_service.use_pinecone,
        pineconeServing=pinecone_serving,
        components=components,
    )


@router.post("/probe", response_model=RetrievalProbeResponse)
def probe_retrieval(payload: RetrievalProbeRequest) -> RetrievalProbeResponse:
    if not payload.query.strip():
        raise HTTPException(status_code=400, detail="A probe query is required.")

    settings = platform_config_service.get_retrieval_settings()
    started = time.perf_counter()
    hits = regulatory_qa_service.retrieve(
        RegulatoryAskRequest(
            question=payload.query,
            segment=payload.segment,
            language=payload.language,
        )
    )
    latency_ms = (time.perf_counter() - started) * 1000

    probe_hits = [
        RetrievalProbeHit(
            rank=index + 1,
            chunkId=hit.chunk.chunk_id,
            sourceTitle=hit.chunk.source_title,
            section=hit.chunk.section,
            fusedScore=round(hit.rrf_score, 5),
            bm25Score=round(hit.bm25_score, 5),
            denseScore=round(hit.dense_score, 5),
            articleBoost=round(hit.article_boost, 5),
            reranked=getattr(hit, "reranked", False),
            preview=hit.chunk.text[:220] + ("..." if len(hit.chunk.text) > 220 else ""),
        )
        for index, hit in enumerate(hits)
    ]

    return RetrievalProbeResponse(
        query=payload.query,
        retrievalMode=regulatory_qa_service.retrieval_mode(),
        latencyMs=round(latency_ms, 2),
        candidatesConsidered=len(hits),
        passedThreshold=bool(hits) and hits[0].rrf_score >= settings.min_score,
        settings=settings,
        hits=probe_hits,
    )
