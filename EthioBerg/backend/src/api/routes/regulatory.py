from fastapi import APIRouter

from src.api.deps import regulatory_qa_service
from src.domain.models import RegulatoryAskRequest, RegulatoryAskResponse, RegulatoryCorpusStats

router = APIRouter(prefix="/regulatory", tags=["regulatory"])


@router.get("/corpus/stats", response_model=RegulatoryCorpusStats)
def corpus_stats() -> RegulatoryCorpusStats:
    stats = regulatory_qa_service.corpus_stats()
    return RegulatoryCorpusStats(
        chunkCount=stats["chunkCount"],
        sourceCount=stats["sourceCount"],
        retrievalMode=str(stats["retrievalMode"]),
    )


@router.post("/ask", response_model=RegulatoryAskResponse)
def ask_regulatory_question(payload: RegulatoryAskRequest) -> RegulatoryAskResponse:
    return regulatory_qa_service.ask(payload)
