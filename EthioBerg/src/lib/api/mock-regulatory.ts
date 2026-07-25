import type {
  MarketSegment,
  RegulatoryAskRequest,
  RegulatoryAskResponse,
  RegulatoryCorpusStats,
} from "@/lib/types";

type MockChunk = {
  chunkId: string;
  sourceId: string;
  sourceTitle: string;
  section: string;
  page: number | null;
  segment: MarketSegment | null;
  language: "en" | "am";
  effectiveFrom: string;
  effectiveTo: string | null;
  text: string;
};

const MOCK_CHUNKS: MockChunk[] = [
  {
    chunkId: "ecma-1030-art-12-public-offer",
    sourceId: "src-ecma-1030",
    sourceTitle: "ECMA Directive on Public Offering and Trading of Securities No. 1030/2024",
    section: "Article 12 — Public offering requirements",
    page: 14,
    segment: null,
    language: "en",
    effectiveFrom: "2024-07-01",
    effectiveTo: null,
    text:
      "No person shall offer securities to the public unless the securities are registered with the Authority and the issuer has filed a prospectus meeting the content requirements prescribed by the Authority.",
  },
  {
    chunkId: "esx-rulebook-main-free-float",
    sourceId: "src-esx-rulebook",
    sourceTitle: "ESX Rulebook (Effective Version)",
    section: "Volume C — Main Market public float requirement",
    page: 114,
    segment: "MAIN",
    language: "en",
    effectiveFrom: "2025-01-01",
    effectiveTo: null,
    text:
      "At least fifteen percent of the applicant's issued shares representing the public float must be in public hands at listing on the Main Market.",
  },
  {
    chunkId: "esx-rulebook-main-market-cap",
    sourceId: "src-esx-rulebook",
    sourceTitle: "ESX Rulebook (Effective Version)",
    section: "Volume C — Main Market listing criteria, market capitalization",
    page: 113,
    segment: "MAIN",
    language: "en",
    effectiveFrom: "2025-01-01",
    effectiveTo: null,
    text:
      "The expected market capitalization of the applicant at the time of listing on the Main Market shall be not less than ETB 500 million.",
  },
  {
    chunkId: "esx-rulebook-growth-market-cap",
    sourceId: "src-esx-rulebook",
    sourceTitle: "ESX Rulebook (Effective Version)",
    section: "Volume C — Growth Market listing criteria, market capitalization",
    page: 129,
    segment: "GROWTH",
    language: "en",
    effectiveFrom: "2025-01-01",
    effectiveTo: null,
    text:
      "The expected market capitalization of the applicant at the time of listing on the Growth Market shall be not less than ETB 100 million.",
  },
  {
    chunkId: "esx-rulebook-art-135-insider",
    sourceId: "src-esx-rulebook",
    sourceTitle: "ESX Rulebook (Effective Version)",
    section: "Article 135 — Insider dealing prohibition",
    page: 201,
    segment: null,
    language: "en",
    effectiveFrom: "2025-01-01",
    effectiveTo: null,
    text:
      "Article 135 prohibits a person who possesses inside information from dealing in relevant securities or encouraging another person to deal while the information is unpublished.",
  },
];

const ABSTENTION =
  "Insufficient official evidence was found in the active ECMA/ESX corpus to answer this question confidently. Please refine the question, adjust filters, or consult the cited source documents directly.";

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function extractArticle(query: string): string | null {
  const match = query.match(/\b(?:article|art\.?)\s*(\d+[a-z]?)\b/i);
  return match ? match[1].toLowerCase() : null;
}

function scoreChunk(chunk: MockChunk, query: string, articleRef: string | null): number {
  const queryTokens = tokenize(query);
  const haystack = `${chunk.section} ${chunk.text}`.toLowerCase();
  let score = queryTokens.reduce((acc, token) => (haystack.includes(token) ? acc + 1 : acc), 0);
  if (articleRef && chunk.section.toLowerCase().includes(articleRef)) {
    score += 5;
  }
  return score;
}

function eligible(
  chunk: MockChunk,
  segment?: MarketSegment,
  language?: string,
  effectiveAsOf?: string,
): boolean {
  if (segment && chunk.segment && chunk.segment !== segment) return false;
  if (language && chunk.language !== language) return false;
  const asOf = effectiveAsOf ?? new Date().toISOString().slice(0, 10);
  if (chunk.effectiveFrom > asOf) return false;
  if (chunk.effectiveTo && chunk.effectiveTo < asOf) return false;
  return true;
}

export function getMockRegulatoryCorpusStats(): RegulatoryCorpusStats {
  return {
    chunkCount: MOCK_CHUNKS.length,
    sourceCount: new Set(MOCK_CHUNKS.map((chunk) => chunk.sourceId)).size,
    retrievalMode: "Mock keyword + article boost",
  };
}

export function askMockRegulatoryQuestion(payload: RegulatoryAskRequest): RegulatoryAskResponse {
  const articleRef = extractArticle(payload.question);
  const hits = MOCK_CHUNKS.map((chunk) => ({
    chunk,
    score: eligible(chunk, payload.segment, payload.language, payload.effectiveAsOf)
      ? scoreChunk(chunk, payload.question, articleRef)
      : 0,
  }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const retrievalTrace = hits.map((hit) => ({
    chunkId: hit.chunk.chunkId,
    rrfScore: hit.score,
    bm25Score: hit.score,
    denseScore: 0,
    articleBoost: articleRef && hit.chunk.section.toLowerCase().includes(articleRef) ? 1 : 0,
  }));

  const limitations: string[] = [];
  if (payload.language === "am") {
    limitations.push(
      "Machine translation or paraphrase may not be the legally authoritative text; inspect original-language evidence.",
    );
  }

  if (!hits.length || hits[0].score < 2) {
    return {
      question: payload.question,
      answer: null,
      status: "ABSTAINED",
      citations: [],
      limitations: [ABSTENTION, ...limitations],
      retrievalTrace,
      verificationStatus: "ABSTAINED",
    };
  }

  const answerText = hits.map((hit) => hit.chunk.text).join(" ");
  const citations = hits.map((hit) => ({
    id: `cite-${hit.chunk.chunkId}`,
    sourceId: hit.chunk.sourceId,
    sourceTitle: hit.chunk.sourceTitle,
    section: hit.chunk.section,
    page: hit.chunk.page,
    chunkId: hit.chunk.chunkId,
    quote: hit.chunk.text.length > 280 ? `${hit.chunk.text.slice(0, 277)}...` : hit.chunk.text,
  }));

  return {
    question: payload.question,
    answer: `Based on the retrieved official provisions, ${answerText} This response summarizes the cited sources and is not legal advice.`,
    status: "ANSWERED",
    citations,
    limitations: [
      "This is an information and education response, not investment advice or a compliance certification.",
      ...limitations,
    ],
    retrievalTrace,
    verificationStatus: "PASSED",
  };
}
