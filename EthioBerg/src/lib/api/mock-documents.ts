import type {
  DocumentEvaluateResponse,
  ExtractedFact,
  IssuerDocument,
  MarketSegment,
} from "@/lib/types";

const demoFacts: ExtractedFact[] = [
  {
    id: "fact-demo-1",
    field: "track_record_years",
    value: 4,
    unit: "years",
    period: null,
    sourcePage: 12,
    sourceQuote: "The issuer has an operating track record of 4 years.",
    confidence: 0.91,
    status: "EXTRACTED",
  },
  {
    id: "fact-demo-2",
    field: "market_cap_etb",
    value: 620_000_000,
    unit: "ETB",
    period: null,
    sourcePage: 18,
    sourceQuote: "Estimated market capitalization ETB 620 million.",
    confidence: 0.88,
    status: "EXTRACTED",
  },
  {
    id: "fact-demo-3",
    field: "free_float_pct",
    value: 14,
    unit: "percent",
    period: null,
    sourcePage: 22,
    sourceQuote: "The public free float represents 14 percent of issued shares.",
    confidence: 0.93,
    status: "EXTRACTED",
  },
  {
    id: "fact-demo-4",
    field: "shareholder_count",
    value: 145,
    unit: "shareholders",
    period: null,
    sourcePage: 24,
    sourceQuote: "The issuer has 145 shareholders at the reporting date.",
    confidence: 0.86,
    status: "EXTRACTED",
  },
];

class MockDocumentStore {
  private documents = new Map<string, IssuerDocument>();

  upload(filename: string, segment: MarketSegment): IssuerDocument {
    const id = `doc-mock-${Date.now().toString(36)}`;
    const doc: IssuerDocument = {
      id,
      filename,
      checksum: `mock-${id}`,
      segment,
      mimeType: filename.endsWith(".docx")
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : "application/pdf",
      pageCount: 24,
      uploadTimestamp: new Date().toISOString(),
      extractionStatus: "pending",
      factsConfirmed: false,
      facts: [],
      warnings: [],
    };
    this.documents.set(id, doc);
    return doc;
  }

  extract(documentId: string): IssuerDocument {
    const doc = this.documents.get(documentId);
    if (!doc) throw new Error("Document not found.");
    doc.extractionStatus = "extracted";
    doc.facts = demoFacts.map((fact) => ({ ...fact, id: `${fact.id}-${documentId}` }));
    doc.factsConfirmed = false;
    return { ...doc, facts: [...doc.facts] };
  }

  updateFacts(documentId: string, facts: ExtractedFact[], confirm: boolean): IssuerDocument {
    const doc = this.documents.get(documentId);
    if (!doc) throw new Error("Document not found.");
    doc.facts = facts;
    doc.factsConfirmed = confirm;
    return { ...doc, facts: [...doc.facts] };
  }

  get(documentId: string): IssuerDocument {
    const doc = this.documents.get(documentId);
    if (!doc) throw new Error("Document not found.");
    return { ...doc, facts: [...doc.facts] };
  }

  list(): IssuerDocument[] {
    return [...this.documents.values()].map((doc) => ({ ...doc, facts: [...doc.facts] }));
  }
}

export const mockDocumentStore = new MockDocumentStore();

export function mockEvaluateDocument(documentId: string): DocumentEvaluateResponse {
  const doc = mockDocumentStore.get(documentId);
  if (!doc.factsConfirmed) {
    throw new Error("Facts must be user-confirmed before evaluation.");
  }
  return {
    documentId,
    segment: doc.segment,
    ruleVersion: "2025.1-draft",
    results: [],
    summary: {},
    categorySummary: [],
    disclaimer: "Pre-review only — not ECMA or ESX approval.",
  };
}
