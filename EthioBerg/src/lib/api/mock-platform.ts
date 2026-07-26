import type {
  ChunkPreview,
  EvaluationProgress,
  GuardrailSettings,
  GuardrailSettingsInput,
  IngestionPipelineStats,
  IngestionSettings,
  IngestionSettingsInput,
  RagQualityOverview,
  RagQualityRun,
  RetrievalHealth,
  RetrievalProbeResult,
  RetrievalSettings,
  RetrievalSettingsInput,
} from "@/lib/types";

const SAMPLE_TEXT = `Article 12. Minimum Paid-Up Capital for the Main Market Segment

An applicant seeking admission to the Main Market segment shall demonstrate a minimum paid-up capital of ETB 500,000,000 as at the date of application, supported by audited financial statements covering the three most recent financial years.

Segment | Minimum paid-up capital (ETB) | Audited years required
Main | 500,000,000 | 3
Growth | 50,000,000 | 2`;

function nowIso() {
  return new Date().toISOString();
}

const defaultIngestion: IngestionSettings = {
  version: 1,
  parentChunkChars: 2400,
  childChunkChars: 600,
  chunkOverlapChars: 80,
  tableAwareParsing: true,
  tableFlattenStrategy: "row_per_line",
  ocrFallbackEnabled: true,
  ocrLanguages: ["eng", "amh"],
  ocrMinTextChars: 120,
  embeddingModel: "sentence-transformers/all-MiniLM-L6-v2",
  notes: "Seeded demo configuration.",
  updatedAt: nowIso(),
  updatedBy: "system",
  isActive: true,
};

const defaultRetrieval: RetrievalSettings = {
  retrievalBackend: "hybrid",
  // keep in sync with the backend default in src/domain/models.py
  topK: 5,
  candidatePool: 40,
  rrfK: 60,
  bm25Weight: 1,
  denseWeight: 1,
  articleBoost: 0.5,
  rerankEnabled: true,
  rerankTopN: 10,
  minScore: 0.012,
  updatedAt: nowIso(),
  updatedBy: "system",
};

const defaultGuardrails: GuardrailSettings = {
  requireCitationForAnswer: true,
  minCitationCount: 1,
  blockSyntheticInAnswers: true,
  enforceDisclaimer: true,
  abstainOnLowConfidence: true,
  updatedAt: nowIso(),
  updatedBy: "system",
};

class MockPlatformStore {
  private ingestion: IngestionSettings = { ...defaultIngestion };
  private ingestionVersions: IngestionSettings[] = [{ ...defaultIngestion }];
  private retrieval: RetrievalSettings = { ...defaultRetrieval };
  private guardrails: GuardrailSettings = { ...defaultGuardrails };
  private runs: RagQualityRun[] = [];

  getIngestionSettings(): IngestionSettings {
    return { ...this.ingestion };
  }

  updateIngestionSettings(payload: IngestionSettingsInput, actorName: string): IngestionSettings {
    const version = this.ingestionVersions.length + 1;
    this.ingestion = {
      ...payload,
      version,
      updatedAt: nowIso(),
      updatedBy: actorName,
      isActive: true,
    };
    this.ingestionVersions = [
      { ...this.ingestion },
      ...this.ingestionVersions.map((item) => ({ ...item, isActive: false })),
    ];
    return { ...this.ingestion };
  }

  getIngestionVersions(): IngestionSettings[] {
    return this.ingestionVersions.map((item) => ({
      ...item,
      isActive: item.version === this.ingestion.version,
    }));
  }

  restoreIngestionVersion(version: number, actorName: string): IngestionSettings {
    const target = this.ingestionVersions.find((item) => item.version === version);
    if (!target) throw new Error(`Ingestion settings version ${version} not found.`);
    return this.updateIngestionSettings(
      {
        parentChunkChars: target.parentChunkChars,
        childChunkChars: target.childChunkChars,
        chunkOverlapChars: target.chunkOverlapChars,
        tableAwareParsing: target.tableAwareParsing,
        tableFlattenStrategy: target.tableFlattenStrategy,
        ocrFallbackEnabled: target.ocrFallbackEnabled,
        ocrLanguages: target.ocrLanguages,
        ocrMinTextChars: target.ocrMinTextChars,
        embeddingModel: target.embeddingModel,
        notes: `Restored from version ${version}.`,
      },
      actorName,
    );
  }

  getIngestionStats(): IngestionPipelineStats {
    return {
      totalSources: 3,
      indexedSources: 2,
      pendingSources: 1,
      retiredSources: 0,
      corpusChunks: 13,
      scrapeChunks: 0,
      lastScrapeAt: null,
    };
  }

  previewChunking(text?: string): ChunkPreview {
    const source = (text ?? SAMPLE_TEXT).trim() || SAMPLE_TEXT;
    const blocks = source
      .split(/\n{2,}/)
      .map((block) => block.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    const items: ChunkPreview["items"] = [];
    let childCount = 0;
    blocks.forEach((block, index) => {
      items.push({ index, role: "parent", charCount: block.length, preview: block.slice(0, 220) });
      const stride = Math.max(1, this.ingestion.childChunkChars - this.ingestion.chunkOverlapChars);
      for (let start = 0; start < block.length; start += stride) {
        const child = block.slice(start, start + this.ingestion.childChunkChars);
        if (!child.trim()) continue;
        childCount += 1;
        items.push({ index, role: "child", charCount: child.length, preview: child.slice(0, 220) });
        if (start + this.ingestion.childChunkChars >= block.length) break;
      }
    });

    return { parentCount: blocks.length, childCount, items: items.slice(0, 24) };
  }

  getRetrievalSettings(): RetrievalSettings {
    return { ...this.retrieval };
  }

  updateRetrievalSettings(payload: RetrievalSettingsInput, actorName: string): RetrievalSettings {
    this.retrieval = { ...payload, updatedAt: nowIso(), updatedBy: actorName };
    return { ...this.retrieval };
  }

  getRetrievalHealth(): RetrievalHealth {
    return {
      retrievalMode: this.retrieval.rerankEnabled
        ? "BM25 + TF-IDF cosine + weighted RRF + lexical rerank"
        : "BM25 + TF-IDF cosine + weighted RRF",
      corpusChunks: 13,
      sourceCount: 3,
      activeSources: 2,
      indexedSources: 2,
      pineconeConfigured: false,
      pineconeServing: false,
      components: [
        {
          name: "Lexical index (BM25)",
          status: "healthy",
          detail: "13 regulatory chunks indexed (demo fixture).",
        },
        {
          name: "Dense index (TF-IDF cosine)",
          status: "healthy",
          detail: "In-process vector index built from the demo corpus.",
        },
        {
          name: "Pinecone vector store",
          status: "offline",
          detail: "Not configured in demo mode.",
        },
        {
          name: "Source corpus",
          status: "healthy",
          detail: "2 active of 3 registered sources.",
        },
      ],
    };
  }

  probeRetrieval(query: string): RetrievalProbeResult {
    const hits = [
      {
        rank: 1,
        chunkId: "esx-rulebook-main-market-cap",
        sourceTitle: "ESX Rulebook (Effective Version)",
        section: "Volume C — Main Market listing criteria, market capitalization",
        fusedScore: 0.0328,
        bm25Score: 1.42,
        denseScore: 0.31,
        articleBoost: 0,
        reranked: this.retrieval.rerankEnabled,
        preview:
          "The expected market capitalization of the applicant at the time of listing on the Main Market shall be not less than ETB 500 million.",
      },
      {
        rank: 2,
        chunkId: "esx-rulebook-main-track-record",
        sourceTitle: "ESX Rulebook (Effective Version)",
        section: "Volume C — Main Market listing criteria, track record",
        fusedScore: 0.0164,
        bm25Score: 0.88,
        denseScore: 0.19,
        articleBoost: 0,
        reranked: this.retrieval.rerankEnabled,
        preview:
          "An applicant for listing on the Main Market must demonstrate an operating track record of at least three years.",
      },
    ].slice(0, this.retrieval.topK);

    return {
      query,
      retrievalMode: this.getRetrievalHealth().retrievalMode,
      latencyMs: 12.4,
      candidatesConsidered: hits.length,
      passedThreshold: hits.length > 0 && hits[0].fusedScore >= this.retrieval.minScore,
      settings: this.getRetrievalSettings(),
      hits,
    };
  }

  getGuardrails(): GuardrailSettings {
    return { ...this.guardrails };
  }

  updateGuardrails(payload: GuardrailSettingsInput, actorName: string): GuardrailSettings {
    this.guardrails = { ...payload, updatedAt: nowIso(), updatedBy: actorName };
    return { ...this.guardrails };
  }

  getQualityOverview(): RagQualityOverview {
    return {
      guardrails: this.getGuardrails(),
      caseCount: 13,
      latestRun: this.runs[0] ?? null,
      history: this.runs.map((run) => ({ ...run })),
      progress: {
        running: false,
        runId: this.runs[0]?.id ?? null,
        completed: this.runs[0]?.totalCases ?? 0,
        total: this.runs[0]?.totalCases ?? 13,
        startedAt: this.runs[0]?.createdAt ?? null,
        message: this.runs.length
          ? `Run ${this.runs[0].id} finished in demo mode.`
          : "No evaluation has been run in demo mode yet.",
      },
    };
  }

  runEvaluation(actorName: string): RagQualityRun {
    const cases: Array<[string, string, "answer" | "abstain"]> = [
      ["gq-main-track-record", "What track record does an applicant need for the Main Market?", "answer"],
      ["gq-main-market-cap", "What is the minimum market capitalization for the Main Market?", "answer"],
      ["gq-main-free-float", "What public float percentage is required on the Main Market?", "answer"],
      ["gq-growth-track-record", "How many years of audited accounts does the Growth Market require?", "answer"],
      ["gq-article-135", "What does Article 135 prohibit?", "answer"],
      ["gq-out-of-scope-singapore", "What is the minimum capital for a Singapore Exchange listing?", "abstain"],
      ["gq-out-of-scope-advice", "Should I buy Awash Bank shares next quarter?", "abstain"],
    ];

    const results = cases.map(([caseId, question, expectation]) => ({
      caseId,
      question,
      expectation,
      status: expectation === "answer" ? "ANSWERED" : "ABSTAINED",
      passed: true,
      citationCount: expectation === "answer" ? 3 : 0,
      expectedSourceHit: expectation === "answer",
      verificationStatus: expectation === "answer" ? "PASSED" : "ABSTAINED",
      latencyMs: 14.2,
      topChunkId: expectation === "answer" ? "esx-rulebook-main-market-cap" : null,
      failureReason: null,
    }));

    const answered = results.filter((row) => row.status === "ANSWERED").length;
    const run: RagQualityRun = {
      id: `eval-demo-${this.runs.length + 1}`,
      createdAt: nowIso(),
      actorName,
      retrievalMode: this.getRetrievalHealth().retrievalMode,
      totalCases: results.length,
      passedCases: results.filter((row) => row.passed).length,
      answerRate: Number((answered / results.length).toFixed(4)),
      abstentionRate: Number(((results.length - answered) / results.length).toFixed(4)),
      citationCoverage: 1,
      expectedSourceRecall: 1,
      verificationPassRate: Number((answered / results.length).toFixed(4)),
      avgLatencyMs: 14.2,
      results,
    };

    this.runs = [run, ...this.runs].slice(0, 10);
    return run;
  }

  getQualityProgress(): EvaluationProgress {
    return this.getQualityOverview().progress;
  }
}

export const mockPlatformStore = new MockPlatformStore();
