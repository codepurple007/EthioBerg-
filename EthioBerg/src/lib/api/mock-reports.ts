import type {
  ReportCandidate,
  ReportCaveat,
  ReportPreview,
  RequirementResult,
} from "@/lib/types";

const DEMO_DOCUMENT_ID = "doc-demo-prospectus";
const DISCLAIMER =
  "Pre-review only — not ECMA or ESX approval. Final decisions remain with the issuer, " +
  "licensed advisers, auditors, ESX, ECMA, and other competent authorities.";

const demoRequirements: RequirementResult[] = [
  {
    ruleId: "ESX_MAIN_TRACK_RECORD",
    ruleName: "Minimum operating track record",
    state: "MET",
    factValue: 4,
    threshold: "≥ 3 years",
    category: "Track record",
    sourceSection: "Volume C, applicable listing provision",
    calculation: "4 compared to ≥ 3 years",
  },
  {
    ruleId: "ESX_MAIN_MARKET_CAP",
    ruleName: "Minimum market capitalization",
    state: "MET",
    factValue: 620_000_000,
    threshold: "≥ 500,000,000 ETB",
    category: "Size",
    sourceSection: "Volume C, Main Market listing criteria",
    calculation: "620,000,000 compared to ≥ 500,000,000 ETB",
  },
  {
    ruleId: "ESX_MAIN_FREE_FLOAT",
    ruleName: "Minimum free float percentage",
    state: "NOT_MET",
    factValue: 14,
    threshold: "≥ 15 percent",
    category: "Distribution",
    sourceSection: "Volume C, public float requirement",
    calculation: "14 compared to ≥ 15 percent",
  },
  {
    ruleId: "ESX_MAIN_SHAREHOLDERS",
    ruleName: "Minimum number of shareholders",
    state: "MET",
    factValue: 145,
    threshold: "≥ 100 shareholders",
    category: "Distribution",
    sourceSection: "Volume C, shareholder dispersion",
    calculation: "145 compared to ≥ 100 shareholders",
  },
];

const demoCaveats: ReportCaveat[] = [
  {
    severity: "info",
    message:
      "This is demo data. Connect the EthioBerg API to produce a report from a real uploaded document.",
  },
];

export function mockReportCandidates(): ReportCandidate[] {
  return [
    {
      documentId: DEMO_DOCUMENT_ID,
      filename: "Sample prospectus (demo).pdf",
      segment: "MAIN",
      uploadTimestamp: "2026-07-20T09:15:00Z",
      extractionStatus: "extracted",
      factsConfirmed: true,
      factCount: 4,
      ready: true,
      blockedReason: "",
    },
  ];
}

export function mockReportPreview(documentId: string): ReportPreview {
  return {
    documentId,
    filename: "Sample prospectus (demo).pdf",
    segment: "MAIN",
    checksum: "demo-checksum-not-a-real-hash",
    pageCount: 24,
    uploadTimestamp: "2026-07-20T09:15:00Z",
    ruleVersion: "2025.1-draft",
    generatedAt: new Date().toISOString(),
    generatedBy: "Demo mode",
    summary: { MET: 3, NOT_MET: 1 },
    categorySummary: [
      { category: "Track record", MET: 1 },
      { category: "Size", MET: 1 },
      { category: "Distribution", MET: 1, NOT_MET: 1 },
    ],
    requirements: demoRequirements,
    evidence: [
      {
        field: "track_record_years",
        value: 4,
        unit: "years",
        period: null,
        sourcePage: 12,
        sourceQuote: "The issuer has an operating track record of 4 years.",
        confidence: 0.91,
        status: "USER_CONFIRMED",
      },
      {
        field: "market_cap_etb",
        value: 620_000_000,
        unit: "ETB",
        period: null,
        sourcePage: 18,
        sourceQuote: "Estimated market capitalization ETB 620 million.",
        confidence: 0.88,
        status: "USER_CONFIRMED",
      },
      {
        field: "free_float_pct",
        value: 14,
        unit: "percent",
        period: null,
        sourcePage: 22,
        sourceQuote: "The public free float represents 14 percent of issued shares.",
        confidence: 0.93,
        status: "USER_CONFIRMED",
      },
      {
        field: "shareholder_count",
        value: 145,
        unit: "shareholders",
        period: null,
        sourcePage: 24,
        sourceQuote: "The issuer has 145 shareholders at the reporting date.",
        confidence: 0.86,
        status: "USER_CONFIRMED",
      },
    ],
    citations: demoRequirements.map((requirement) => ({
      ruleId: requirement.ruleId,
      ruleName: requirement.ruleName,
      section: requirement.sourceSection ?? "",
      sourceTitle: "ESX Rulebook (Effective Version)",
      issuingBody: "ESX",
      sourceVersion: "2025.1",
      publicationDate: "2025-01-01",
      url: "https://esx.et/equity-market/listing/",
    })),
    caveats: demoCaveats,
    disclaimer: DISCLAIMER,
  };
}

/**
 * Demo mode has no DOCX writer, so it hands back a plain-text transcript that is
 * named for what it is. Emitting a file called `.docx` that Word cannot open
 * would be a worse lie than admitting the export is unavailable.
 */
export function mockReportExport(documentId: string): { filename: string; blob: Blob } {
  const preview = mockReportPreview(documentId);
  const lines = [
    "DEMO MODE — NOT A REAL REPORT",
    "",
    "DOCX export requires the EthioBerg API. This transcript is sample data and",
    "must not be shared as a pre-review analysis.",
    "",
    preview.disclaimer,
    "",
    `Document      : ${preview.filename}`,
    `Market segment: ${preview.segment}`,
    `Rule version  : ${preview.ruleVersion}`,
    "",
    "REQUIREMENTS",
    ...preview.requirements.map(
      (r) => `  - ${r.ruleName}: ${r.state} (found ${r.factValue ?? "—"}, needs ${r.threshold})`,
    ),
    "",
    "CITATIONS",
    ...preview.citations.map((c) => `  - ${c.ruleName}: ${c.sourceTitle}, ${c.section}`),
  ];

  return {
    filename: "DEMO-not-a-real-report.txt",
    blob: new Blob([lines.join("\n")], { type: "text/plain" }),
  };
}
