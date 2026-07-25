# Software Requirements Specification

## EthioBerg — Final Functional SRS

**AI-Powered Listing Readiness, Disclosure Intelligence, and Financial Analysis for the Ethiopian Securities Exchange**

| Document field | Value |
|---|---|
| Document type | Software Requirements Specification |
| Product | EthioBerg |
| Version | 3.0 |
| Status | Final functional SRS |
| Owner | Abel |
| Market | Ethiopian capital market: ESX and ECMA |
| Date | 26 July 2026 |
| Replaces | EthioBerg SRS v2.0 |

### Revision history

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026 | Initial product and market concept |
| 2.0 | 25 July 2026 | Rewritten as a complete SRS; added architecture, verifiable RAG, deterministic rule evaluation, professional chart-response templates, security, testing, and deployment requirements |
| 3.0 | 26 July 2026 | Finalized enterprise and retail target groups; consolidated user roles; defined specialized RAG administration responsibilities; specified Pinecone-backed hybrid retrieval, table-aware parsing, cross-encoder reranking, citation lineage, and groundedness evaluation. |

---

# Table of contents

1. Introduction
2. Product overview
3. Release scope and principal use cases
4. Functional requirements
5. Financial response and chart specification
6. Business rules and rule representation
7. Architecture
8. Data requirements
9. AI and retrieval design
10. User-interface requirements
11. Non-functional requirements
12. Testing and evaluation
13. Deployment and operations
14. Risks and mitigations
15. Delivery roadmap
16. MVP acceptance criteria
17. Open production decisions
18. References
19. Appendix A — Default response templates
20. Appendix B — Professional disclaimers

---

# 1. Introduction

## 1.1 Purpose

This document defines the final functional, data, AI, visualization, security, quality, and deployment requirements for EthioBerg. It supersedes EthioBerg SRS v2.0 and preserves all v2.0 requirements except for the targeted user, administration, and retrieval changes explicitly stated in this revision.

EthioBerg is a decision-support system. It organizes regulatory evidence, evaluates deterministic listing rules, explains disclosures, and presents verified financial information. It does not replace ECMA, ESX, licensed advisers, auditors, compliance officers, or human approval.

## 1.2 Product scope

The MVP shall provide:

1. A secure analysis workspace for enterprise compliance and financial-institution clients, including newly licensed investment banks, brokerages, state-owned enterprises, and issuers preparing for ESX listing.
2. A public, simplified information experience for retail investors and market educators.
3. A listing-readiness checker for ESX Main Market and Growth Market.
4. A closed, versioned regulatory knowledge base built from official ECMA and ESX documents.
5. Source-grounded regulatory and financial question answering with verifiable citation traces.
6. Structured extraction of listing facts, IFRS financial filing content, and tables from issuer documents.
7. Deterministic evaluation of numeric listing requirements and evidence-linked disclosure gap analysis.
8. A specialized Hybrid RAG Data Retrieval Engine using BM25 sparse retrieval, Pinecone dense vector retrieval, cross-encoder reranking, and table-aware chunking.
9. Company and security information responses using controlled financial chart templates, with clearly labelled synthetic data where verified historical ESX data is unavailable.
10. Exportable compliance and analysis reports.

## 1.3 Intended audience

- Product owner and hackathon team
- Python and AI engineers
- UI and data-visualization developers
- Financial-domain reviewers
- Compliance professionals and listing advisers
- Testers, judges, and future design partners

## 1.4 Definitions and acronyms

| Term | Meaning |
|---|---|
| ECMA | Ethiopian Capital Market Authority |
| ESX | Ethiopian Securities Exchange |
| RAG | Retrieval-Augmented Generation |
| LLM | Large Language Model |
| CSD | Central Securities Depository |
| IFRS | International Financial Reporting Standards |
| OCR | Optical Character Recognition |
| OHLC | Open, High, Low, and Close market-price data |
| BM25 | Lexical information-retrieval ranking algorithm |
| RRF | Reciprocal Rank Fusion |
| Citation | A resolvable reference to a source document, page, section, and evidence text |
| Evidence fact | A structured value linked to its exact source location |
| Regulated claim | A claim about a law, directive, rule, obligation, threshold, or compliance status |
| Synthetic data | Artificial data created only for demonstration and never represented as real market data |
| MUST / SHALL | Mandatory requirement |
| SHOULD | Important requirement that may be deferred only with an accepted reason |
| COULD | Optional enhancement |

## 1.5 Authoritative source hierarchy

When sources conflict, the system shall apply this order:

1. Ethiopian proclamations and effective ECMA directives.
2. Effective ESX rulebook provisions.
3. Official ECMA or ESX interpretative guidance.
4. Official issuer filings and disclosure documents.
5. Official ECMA or ESX web guidance.
6. User-uploaded working documents.
7. Synthetic demonstration data.

The system shall not silently resolve a legal or numeric conflict. It shall display the conflicting sources and require professional review.

## 1.6 Reference sources

- Capital Market Proclamation No. 1248/2021
- ECMA Directive on Public Offering and Trading of Securities No. 1030/2024
- ESX Rulebook, effective version
- ESX IPO and Listing Guide
- ECMA issuer and ongoing-disclosure guidance
- ESX Main Market and Growth Market listing guidance
- OWASP guidance for RAG and prompt-injection security
- Pinecone, Ragas/TruLens, and Plotly official documentation

Exact links are listed in Section 18.

---

# 2. Product overview

## 2.1 Market context

ESX began operations in January 2025. As of 25 July 2026, the official ESX listed-company page shows five listed companies. Four are financial institutions and one is a telecommunications company. The small and sector-concentrated market limits reliable peer modelling and price prediction, but it creates an immediate need for document standardization, issuer readiness, compliance support, and investor education.

ECMA guidance requires securities offered to the public to be registered and requires publicly held issuers to submit ongoing reports. ECMA states that ongoing disclosure is semi-annual and that material information affecting security prices must be disclosed within 24 hours. Sector-specific or later rules may impose additional duties.

ESX publishes listing and post-trade information, but no stable public historical-price developer API has been confirmed for this SRS. The MVP shall therefore use official documents for real company facts and clearly labelled synthetic fixtures for historical chart demonstrations.

## 2.2 Problem statement

Enterprise compliance teams, financial institutions, and listing-ready issuers currently face:

- Dense and version-sensitive rules across multiple official documents.
- Manual review of prospectuses, reports, tables, and scanned pages.
- Repeated calculation of objective listing thresholds.
- Difficulty proving which source supports each conclusion.
- Inconsistent terminology, dates, units, and document quality.
- Limited tools for explaining filings to new investors in simple language.
- High reputational risk if AI invents a rule, number, citation, or market trend.

## 2.3 Product vision

EthioBerg shall become a trusted pre-review assistant that converts Ethiopian capital-market documents into auditable evidence, deterministic checks, cited explanations, and professional visual responses.

## 2.4 Product goals

| Goal ID | Goal |
|---|---|
| G-01 | Reduce time spent locating and interpreting relevant listing requirements |
| G-02 | Make every material conclusion traceable to evidence |
| G-03 | Eliminate LLM arithmetic from compliance calculations |
| G-04 | Distinguish missing evidence from failed compliance |
| G-05 | Present company information using consistent, professional chart templates |
| G-06 | Support English and Amharic source discovery and explanations |
| G-07 | Produce an inspectable architecture suitable for a hackathon demonstration |
| G-08 | Preserve a testable, inspectable delivery path for the existing product implementation and future production hardening |

## 2.5 Non-goals

The MVP shall not:

- Certify that an issuer is compliant or approved for listing.
- Replace legal, audit, valuation, investment-banking, or regulatory review.
- Recommend buying, selling, or holding securities.
- Predict stock prices or future issuer performance.
- Execute trades, hold client assets, or connect to the CSD.
- Perform real identity verification, AML screening, or KYC approval.
- Treat synthetic data as official or live market data.
- Crawl the open web as an answer source.
- Allow an LLM to invent chart code, rules, arithmetic results, or citations.
- Implement a multi-agent autonomous workflow with unsupervised tool access.

## 2.6 User classes

### 2.6.1 Target client groups

| Client group | Primary need | MVP priority |
|---|---|---|
| Enterprise Compliance & Financial Institutions | A secure workspace to analyze complex IFRS financial filings, prospectus tables, ECMA directives, and ESX listing obligations with verifiable, zero-hallucination citation traces. This group includes investment banks, brokerages, enterprise compliance teams, and state-owned enterprises such as Ethio Telecom preparing for ESX listings. | Primary |
| Retail Investors & Market Educators | Simplified natural-language Q&A, financial-literacy tools, and intuitive interfaces for understanding public listing disclosures. | Primary |

### 2.6.2 Essential platform roles

| Role | Primary purpose | Access boundary |
|---|---|---|
| Investor / Educator | Browse public ESX information and learn from simplified cited explanations. | Public dashboard, Company Explorer, and basic regulatory/financial Q&A. Cannot upload documents, inspect vector chunks, export enterprise reports, or access administration. |
| Financial Analyst / Compliance Officer | Analyze filings, assess retrieval accuracy, and complete compliance workflows for enterprise clients. | Document upload and workspace parsing, advanced RAG Q&A with full citation traces and side-by-side evidence, raw chunk inspection, listing-readiness checks, and report export. Cannot manage crawler, Pinecone infrastructure, or platform-wide retrieval configuration. |
| Administrator | Operate the platform safely and maintain trusted data and retrieval quality. | Full platform access. Administrator permissions may be delegated through the specialized responsibilities below without creating additional public-facing user tiers. |

### 2.6.3 Specialized RAG administration responsibilities

| Responsibility | Purpose | Authorized capabilities |
|---|---|---|
| Data Ingestion & Pipeline Admin | Maximize context recall and data hygiene. | Configure ECMA/ESX crawlers; manage source ingestion; oversee OCR, PDF extraction, and table-to-Markdown/HTML conversion; configure parent-child chunking; define source metadata such as ticker, document type, and year; approve vector-ingestion jobs. |
| Search & Retrieval Engineer | Maximize retrieval precision and operational performance. | Configure BM25/dense fusion weights; tune cross-encoder reranking; manage Pinecone namespaces and index health; observe retrieval latency; run retrieval evaluations; change settings only through versioned, auditable configuration. |
| AI Safety & Quality Auditor | Maximize groundedness, citation faithfulness, and user safety. | Review RAG Triad metrics (faithfulness, context relevance, answer relevance); inspect query and citation traces; flag failed queries; administer approved prompts and guardrails; verify that the system does not provide investment advice. |

ECMA or ESX reviewers remain a future institutional workflow and do not receive autonomous administrative authority in the MVP.

## 2.7 Assumptions

- The product retains its existing implementation while this SRS defines functional behavior independent of presentation technology.
- A financial-domain reviewer validates the active rule set before demonstration.
- Official regulatory documents can be downloaded and stored locally for the closed corpus.
- Uploaded issuer documents may contain extraction errors and shall be treated as untrusted.
- Historical chart data used in the demo may be synthetic and shall be prominently labelled.
- English is the first implementation language; Amharic retrieval and output are included but require evaluation.

## 2.8 Constraints

- Short hackathon delivery period.
- Small number of listed companies and limited public historical data.
- Inconsistent PDF quality, including scanned pages and difficult tables.
- Rules may be revised and may differ by segment, security, issuer, or effective date.
- BGE-M3 local inference can be resource-intensive on CPU-only hardware.
- Parsing, embedding, reranking, and retrieval workloads require disciplined version-aware caching, configuration control, and observability.

---

# 3. Release scope and principal use cases

## 3.1 MVP modules

1. **Source Library** — trusted regulatory documents and metadata.
2. **Document Review** — issuer upload, extraction, evidence inspection, and gap analysis.
3. **Listing Readiness** — deterministic Main/Growth checks and status summary.
4. **Regulatory Q&A** — cited answers over the closed official corpus.
5. **Company Explorer** — company/security facts, financial metrics, and template-driven charts.
6. **Report Export** — review report in DOCX and, if supported, PDF.
7. **Administration** — rule versioning, source activation, synthetic fixture control, and audit logs.

## 3.2 End-to-end issuer-review flow

1. User selects Main Market or Growth Market.
2. User uploads a draft prospectus, annual report, or financial statement.
3. System validates the file and records its checksum.
4. System extracts page text, tables, headings, and document metadata.
5. System extracts structured facts using a strict schema.
6. User can inspect and correct extracted facts before evaluation.
7. Deterministic rules evaluate validated facts.
8. Hybrid retrieval locates relevant narrative obligations.
9. The LLM drafts evidence-grounded gap explanations.
10. The verifier checks calculations, citations, source validity, and unsupported statements.
11. The application renders the checklist, gaps, citations, and export controls.
12. User exports a report marked as a pre-review, not a compliance certificate.

## 3.3 End-to-end company-information flow

1. User asks for a company or security.
2. System resolves the official company name and ticker.
3. Intent router identifies the requested information and suitable response template.
4. Data service loads verified company facts and available market or financial observations.
5. Validator checks dates, units, source IDs, missing values, and synthetic status.
6. Computation service calculates returns, changes, margins, or ratios.
7. Template selector chooses an approved chart template.
8. Plotly renderer creates the chart from validated structured data.
9. The LLM writes a short explanation from the same validated payload.
10. Verifier confirms that narrative values match the payload.
11. Response shows an as-of date, source, citations, caveats, and a data table.

## 3.4 Principal use cases

### UC-01 — Evaluate listing readiness

**Actor:** Financial Analyst / Compliance Officer  
**Precondition:** Active rule set has been approved by an administrator.  
**Success result:** Requirements are shown as Met, Not Met, Missing Evidence, Not Applicable, or Review Required, with evidence and source citations.

### UC-02 — Ask a regulatory question

**Actor:** Investor / Educator for basic Q&A; Financial Analyst / Compliance Officer for advanced Q&A  
**Precondition:** Official source corpus is indexed.  
**Success result:** Answer contains cited clauses or explicitly states that sufficient support was not found.

### UC-03 — Review a disclosure document

**Actor:** Financial Analyst / Compliance Officer  
**Precondition:** File passes validation.  
**Success result:** System shows extracted facts, missing sections, attention signals, and source-linked findings.

### UC-04 — Request company stock information

**Actor:** Investor / Educator or Financial Analyst / Compliance Officer  
**Precondition:** Company exists in the registry.  
**Success result:** System renders the appropriate response template and clearly labels real, unavailable, or synthetic data.

### UC-05 — Export a report

**Actor:** Financial Analyst / Compliance Officer  
**Precondition:** Analysis run is complete.  
**Success result:** Export reproduces the same statuses, values, citations, caveats, source versions, and generation timestamp shown in the application.

---

# 4. Functional requirements

Priorities are **MUST**, **SHOULD**, and **COULD**.

## 4.1 Regulatory source management

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-SRC-001 | Administrator shall add an official source with title, issuing body, version, publication date, effective dates, language, URL, and file checksum. | MUST | All mandatory metadata is stored before indexing. |
| FR-SRC-002 | System shall distinguish official regulatory sources, official issuer filings, user drafts, and synthetic fixtures. | MUST | Trust class is visible and included in retrieval metadata. |
| FR-SRC-003 | Administrator shall activate or retire a source version without deleting historical analysis records. | MUST | Previous runs continue to reference their original source version. |
| FR-SRC-004 | Retrieval shall apply issuing-body, language, document-type, segment, and effective-date filters. | MUST | Inactive or inapplicable versions do not appear in normal results. |
| FR-SRC-005 | System shall reject duplicate source files based on checksum unless the administrator confirms a separate version record. | SHOULD | Duplicate upload produces a warning and no accidental duplicate index. |
| FR-SRC-006 | Each indexed clause shall retain a stable chunk ID and parent document ID. | MUST | Citations resolve after application restart. |

## 4.2 Document ingestion and parsing

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-ING-001 | MVP shall accept PDF and DOCX issuer documents; PDF is the primary format. | MUST | Supported files can be uploaded and unsupported types are rejected. |
| FR-ING-002 | System shall validate extension, MIME type, file size, and basic file integrity. | MUST | Invalid or mismatched files do not enter extraction. |
| FR-ING-003 | System shall assign a checksum, document ID, trust class, upload timestamp, and owner/session ID. | MUST | Every file has complete provenance metadata. |
| FR-ING-004 | Digital PDFs shall be parsed page-by-page using PyMuPDF as the primary extractor. | MUST | Extracted text retains page numbers. |
| FR-ING-005 | pdfplumber or an equivalent parser shall be used selectively for difficult tables. | SHOULD | Table output preserves row/column structure on the test corpus. |
| FR-ING-006 | OCR fallback shall run only when a page has insufficient text or is classified as scanned. | SHOULD | OCR use is logged per page and does not replace good embedded text. |
| FR-ING-007 | Parser shall preserve headings, sections, tables, page numbers, and bounding boxes where available. | MUST | Evidence viewer can locate the source page and section. |
| FR-ING-008 | Clause-aware chunking shall preserve section identifiers and parent headings. | MUST | A retrieved clause includes its section and parent context. |
| FR-ING-009 | Very short clauses shall use parent-child retrieval instead of being merged without traceability. | SHOULD | Citation remains specific while generation receives enough context. |
| FR-ING-010 | Extracted text shall be normalized without changing numbers, units, negation, defined terms, or legal references. | MUST | Regression tests show protected tokens remain unchanged. |
| FR-ING-011 | Uploaded content shall be treated as data, never as executable instructions. | MUST | Embedded prompt-like text cannot modify system behavior. |
| FR-ING-012 | The ingestion pipeline shall convert extractable IFRS and prospectus tables into structurally preserved Markdown or HTML before chunking. | MUST | A row/column evaluation corpus confirms labels, values, periods, units, and table relationships are retained. |
| FR-ING-013 | Parent-child chunking shall support configurable child chunks (default target: 256 tokens) and parent context (default target: 1024 tokens) while preserving page, section, table, and source lineage. | MUST | A child retrieval can expand to its parent context without losing its exact citation location. |
| FR-ING-014 | Data Ingestion & Pipeline Admin actions that alter parsing, OCR, table conversion, metadata, or chunking configuration shall be versioned and audit logged. | MUST | Each indexed chunk can be linked to the ingestion configuration and job that produced it. |

## 4.3 Structured fact extraction

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-EXT-001 | LLM extraction shall use a strict Pydantic/JSON schema. | MUST | Invalid output is rejected or retried; unstructured text is not evaluated. |
| FR-EXT-002 | Each extracted fact shall include value, unit, period, source page, evidence text, confidence, and extraction method. | MUST | No value reaches the rule engine without provenance. |
| FR-EXT-003 | Minimum listing fields shall include operating track record, market capitalization, profit history, free-float percentage, shareholder count, financial-reporting standard, and audit status. | MUST | Schema contains all listed fields and supports null. |
| FR-EXT-004 | Missing values shall be null and shall not be estimated. | MUST | Missing evidence never becomes zero, false, or a guessed value. |
| FR-EXT-005 | User shall inspect and correct extracted facts before final evaluation. | MUST | Corrected values are labelled user-confirmed and original evidence remains visible. |
| FR-EXT-006 | Conflicting values across pages or documents shall create a conflict record. | MUST | System does not silently choose one value. |
| FR-EXT-007 | Monetary values shall preserve original currency and unit scale. | MUST | ETB, thousands, millions, and billions are not mixed. |
| FR-EXT-008 | Ethiopian and Gregorian dates shall be stored with original text and normalized ISO date when conversion is reliable. | SHOULD | Converted date retains calendar and conversion status. |

## 4.4 Deterministic listing-readiness evaluation

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-RULE-001 | User shall select Main Market or Growth Market before evaluation. | MUST | Segment-specific rules are applied. |
| FR-RULE-002 | Numeric rules shall execute in Python, not in LLM prose. | MUST | Unit tests reproduce expected boundary results. |
| FR-RULE-003 | Rules shall be externalized as versioned YAML or JSON data evaluated by a generic Python engine. | MUST | Threshold changes do not require editing evaluator logic. |
| FR-RULE-004 | Each rule shall identify source document, section, page, effective dates, segment, field, operator, threshold, and unit. | MUST | Result can display the exact rule source. |
| FR-RULE-005 | Evaluation states shall be Met, Not Met, Missing Evidence, Not Applicable, Conflict, or Professional Review Required. | MUST | Null or ambiguous facts never produce Pass. |
| FR-RULE-006 | Boundary operators shall be explicit, including greater-than, greater-than-or-equal, equals, and range. | MUST | Tests cover values below, at, and above each threshold. |
| FR-RULE-007 | Overall readiness percentage shall be secondary to category statuses and shall exclude Not Applicable requirements. | SHOULD | User can see denominator and calculation method. |
| FR-RULE-008 | A readiness result shall display “Pre-review only — not ECMA or ESX approval.” | MUST | Disclaimer is visible on screen and exports. |
| FR-RULE-009 | Conflicting official thresholds shall block automatic evaluation of that rule. | MUST | Result becomes Professional Review Required and lists conflicts. |

## 4.5 Regulatory retrieval and Q&A

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-RAG-001 | Retrieval shall combine BM25 sparse keyword retrieval for exact regulatory clauses, article references, tickers, thresholds, and defined terms with Pinecone dense vector retrieval for semantic questions. | MUST | Exact-clause and semantic question sets both meet the approved retrieval target. |
| FR-RAG-002 | The system shall apply hard trust-class, active-status, issuing-body, document-type, segment, language, and effective-date metadata filters before candidate retrieval. | MUST | Inactive, untrusted, or inapplicable sources do not appear in normal answers. |
| FR-RAG-003 | Sparse and dense candidates shall be fused through versioned Reciprocal Rank Fusion or a measured equivalent. | MUST | A fixed query, corpus, and configuration produces deterministic candidate ordering before reranking. |
| FR-RAG-004 | A cross-encoder reranker shall rerank the top 30 fused candidates and select the sharpest top 5 evidence candidates by default; the values shall be configurable only by an authorized Search & Retrieval Engineer. | MUST | Retrieval trace records candidate count, reranker version, scores, and selected chunks. |
| FR-RAG-005 | Direct section or article queries shall receive an exact-match retrieval boost. | MUST | “Article 135” retrieves the correct provision when present. |
| FR-RAG-006 | Parent context, table context, and direct cross-references shall be expanded only after candidate selection and within the configured context budget. | MUST | The generator receives sufficient context without unrelated chunks displacing cited evidence. |
| FR-RAG-007 | The generator shall receive only the minimum relevant official evidence, validated facts, and deterministic calculations required to answer. | MUST | Context budget, chunk IDs, and omitted/unavailable evidence are logged. |
| FR-RAG-008 | Every regulated claim shall carry at least one valid citation. | MUST | Uncited regulated claims fail verification. |
| FR-RAG-009 | A citation shall include source title, version, section/article, page where available, chunk ID, quoted evidence, and a resolvable source location. | MUST | Citation opens or expands to matching evidence and lineage. |
| FR-RAG-010 | If evidence is insufficient, the system shall return an abstention instead of a guessed answer. | MUST | Test questions outside the corpus produce a clear limitation message. |
| FR-RAG-011 | Q&A shall not use open-web content as evidence in the MVP. | MUST | Only approved corpus IDs appear in citations. |
| FR-RAG-012 | Investor / Educator Q&A shall use a simplified explanation layer while retaining citations and the investment-advice limitation. | MUST | Plain-language answer is linked to the same official evidence as the advanced answer. |
| FR-RAG-013 | Financial Analyst / Compliance Officer Q&A shall show full citation traces, retrieved evidence, source metadata, and side-by-side document evidence where available. | MUST | Authorized users can inspect the exact selected chunks and source locations. |
| FR-RAG-014 | Search & Retrieval Engineer changes to retrieval weights, reranker settings, namespaces, or index configuration shall be versioned, access-controlled, and audit logged. | MUST | A query run records the retrieval-configuration version used. |

## 4.6 Disclosure review and attention signals

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-DIS-001 | System shall compare expected disclosure topics with evidence found in the uploaded document. | MUST | Each topic shows Found, Weak Evidence, Not Found, or Review Required. |
| FR-DIS-002 | Findings shall link to both the requirement source and issuer-document evidence. | MUST | User can inspect both sides of the comparison. |
| FR-DIS-003 | System shall call anomalies “attention signals,” not fraud or misconduct findings. | MUST | No UI or export labels an issuer fraudulent. |
| FR-DIS-004 | MVP signals may include auditor qualification, inconsistent figures, large unexplained changes, related-party growth, stale periods, and missing sections. | SHOULD | Enabled signals are deterministic or evidence-linked. |
| FR-DIS-005 | Each signal shall include calculation, periods, values, evidence, severity rationale, and limitation. | MUST | Reviewer can reproduce the signal. |
| FR-DIS-006 | Signals requiring sector-specific interpretation shall be disabled until approved sector rules exist. | MUST | Bank and non-bank metrics are not compared using one generic threshold. |

## 4.7 Financial computation

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-CALC-001 | Returns, changes, percentages, margins, growth, and threshold checks shall be calculated by deterministic Python functions. | MUST | LLM receives results but does not perform arithmetic. |
| FR-CALC-002 | Calculation functions shall declare input units, formula, rounding rule, and missing-value behavior. | MUST | Formula metadata is available in the response payload. |
| FR-CALC-003 | Division by zero, mixed units, incomplete periods, and invalid dates shall return typed errors. | MUST | No infinity, NaN, or misleading zero reaches a chart. |
| FR-CALC-004 | Display rounding shall not change stored precision. | MUST | Tooltip or data table can show source precision. |
| FR-CALC-005 | Calculations shall be reproducible from stored input observations. | MUST | Analysis run records input IDs and calculation version. |

## 4.8 Company and security information

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-COMP-001 | System shall maintain a company and security registry with official name, ticker, sector, market segment, listing date, and source. | MUST | The five current ESX issuers can be resolved by official name or ticker. |
| FR-COMP-002 | Company aliases shall resolve to one canonical entity and ambiguous queries shall request clarification. | MUST | System does not combine two issuers. |
| FR-COMP-003 | Response shall state the as-of date and data status: Official, Issuer-Reported, User-Supplied, Synthetic Demo, or Unavailable. | MUST | Status is visible above every chart. |
| FR-COMP-004 | Real and synthetic observations shall never be combined in one series. | MUST | Validator rejects mixed-status chart datasets. |
| FR-COMP-005 | Synthetic series shall use a reproducible fixture ID and seed. | MUST | Demo can be rerun with identical values. |
| FR-COMP-006 | Synthetic data shall be visually labelled in the page, chart subtitle, tooltip or caption, and export. | MUST | A screenshot cannot reasonably be mistaken for live ESX data. |
| FR-COMP-007 | If requested data is unavailable, system shall show available official facts and explain the missing data without drawing an invented chart. | MUST | No empty or fabricated visualization is rendered. |
| FR-COMP-008 | Company responses shall not contain investment recommendations. | MUST | Recommendation-like prompts receive factual analysis and a limitation notice. |

## 4.9 Visualization and response rendering

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-VIZ-001 | Charts shall be rendered by Plotly from validated structured data. | MUST | No chart depends on LLM-generated Python or JavaScript. |
| FR-VIZ-002 | Template selector shall choose only a registered template ID. | MUST | Unknown templates are rejected. |
| FR-VIZ-003 | Every chart shall show title, axes, units, period, source, as-of date, and data status. | MUST | Required metadata is present in visual review tests. |
| FR-VIZ-004 | Every chart shall have an accessible data-table view. | MUST | User can inspect all plotted values without hover. |
| FR-VIZ-005 | Bar charts shall use a zero baseline unless a documented exception is approved. | MUST | Visual tests confirm baseline behavior. |
| FR-VIZ-006 | Dual-axis charts, 3D charts, decorative gauges, and misleading truncated bars shall not be used. | MUST | Registered templates contain none of these patterns. |
| FR-VIZ-007 | Colors shall not be the only method for communicating status or series identity. | MUST | Labels, line patterns, markers, or text are also present. |
| FR-VIZ-008 | Chart narrative shall be generated only from the same verified payload used by the renderer. | MUST | Narrative number-matching check passes. |
| FR-VIZ-009 | Readiness results shall use checklist and category bars, not a single opaque score or pie chart. | MUST | Failed and missing evidence remain distinguishable. |
| FR-VIZ-010 | User shall be able to download chart data as CSV. | SHOULD | Downloaded rows match plotted values. |

## 4.10 Report generation

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-REP-001 | System shall export an analysis report to DOCX. | MUST | Generated document opens and contains all required sections. |
| FR-REP-002 | PDF export shall be provided if the deployment environment supports reliable conversion. | COULD | PDF matches the DOCX content and carries the same disclaimer. |
| FR-REP-003 | Report shall include document metadata, selected segment, facts, rule results, gaps, signals, citations, source versions, limitations, and timestamp. | MUST | Export completeness test passes. |
| FR-REP-004 | Charts included in a report shall retain title, units, source, data status, and period. | MUST | Static report chart remains self-describing. |
| FR-REP-005 | Exports shall identify user-confirmed edits and unresolved conflicts. | MUST | Audit-sensitive changes remain visible. |

## 4.11 Verification and audit

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-VER-001 | Programmatic verifier shall validate schema, citations, calculations, source status, units, and narrative-number consistency. | MUST | Invalid response is blocked or regenerated. |
| FR-VER-002 | Optional second-pass LLM review may inspect completeness, but shall not override deterministic failures. | SHOULD | Programmatic rejection cannot be changed to pass by reviewer prose. |
| FR-VER-003 | System shall record model, prompt version, source IDs, retrieved chunks, rule version, calculation version, and output status for each run. | MUST | Run can be reproduced or investigated. |
| FR-VER-004 | “Hallucination Index” shall not be used as an unmeasured quality claim. | MUST | Quality dashboard uses defined metrics from Section 12. |
| FR-VER-005 | User shall see a warning when OCR, low-confidence extraction, unresolved conflicts, or synthetic data materially affects a result. | MUST | Warning appears before the affected conclusion. |
| FR-VER-006 | System shall calculate and retain defined RAG quality metrics for faithfulness, context relevance, and answer relevance for approved evaluation runs. | MUST | The AI Safety & Quality Auditor can inspect metric definitions, score distributions, test-set context, and failing cases. |
| FR-VER-007 | A citation-lineage record shall connect each displayed claim to the selected chunk, parent context where used, source version, retrieval configuration, reranker result, and verification outcome. | MUST | An auditor can reconstruct the evidence path for a query without relying on model prose. |

## 4.12 Language and localization

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-LANG-001 | UI and generated explanations shall support English in the MVP. | MUST | All workflows are complete in English. |
| FR-LANG-002 | System shall support Amharic queries and cited answers where evaluated retrieval quality is acceptable. | SHOULD | Curated Amharic evaluation meets the release threshold. |
| FR-LANG-003 | Translated explanations shall preserve official names, article numbers, figures, currencies, dates, and defined terms. | MUST | Protected-token tests pass. |
| FR-LANG-004 | Original-language evidence shall remain available beside any translation. | MUST | Reviewer can inspect untranslated source text. |
| FR-LANG-005 | System shall not claim that machine translation is the legally authoritative text. | MUST | Translation limitation appears where relevant. |

## 4.13 Administration and session management

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-ADM-001 | MVP shall support administrator capabilities protected by role-based, deployment-level access controls. | MUST | Investor / Educator and Financial Analyst / Compliance Officer roles cannot alter platform-wide sources, retrieval settings, or safety policies. |
| FR-ADM-002 | Administrator shall approve rule files before activation. | MUST | Draft rule sets cannot affect user analysis. |
| FR-ADM-003 | Administrator shall enable or disable synthetic demo mode. | MUST | Production profile can prohibit synthetic data globally. |
| FR-ADM-004 | The application session shall retain the current workflow without mixing user sessions. | MUST | Concurrent session test shows isolation. |
| FR-ADM-005 | Expensive parsing, embedding, and retrieval resources shall use checksum- and version-aware caching. | MUST | Repeated interactions do not repeat unchanged work. |
| FR-ADM-006 | Data Ingestion & Pipeline Admin shall manage approved ECMA/ESX scraper feeds, ingestion jobs, source metadata, parsing quality, table conversion, and chunking parameters. | MUST | Unauthorized roles cannot start or configure ingestion; all configuration changes are auditable. |
| FR-ADM-007 | Search & Retrieval Engineer shall manage Pinecone namespaces, index-health monitoring, BM25/dense fusion settings, reranker parameters, and retrieval-performance evaluation. | MUST | Configuration changes require authorization, validation, versioning, and an audit record. |
| FR-ADM-008 | AI Safety & Quality Auditor shall review RAG quality metrics, query logs, failed-query cases, citation traces, approved prompts, and safety guardrails. | MUST | The auditor can flag a configuration or prompt version for review without bypassing deterministic verification. |
| FR-ADM-009 | The three specialized administration responsibilities are permissions within Administrator access and shall not create autonomous agents or unreviewed system changes. | MUST | Each action has a named authenticated administrator, timestamp, before/after configuration, and outcome. |

## 4.14 Error and abstention behavior

| ID | Requirement | Priority | Acceptance condition |
|---|---|---|---|
| FR-ERR-001 | Errors shall use user-safe messages and internal typed error codes. | MUST | Stack traces and secrets are not shown to users. |
| FR-ERR-002 | Partial extraction shall identify failed pages and permit retry or manual review. | MUST | A single bad page does not silently invalidate the document. |
| FR-ERR-003 | Provider failure shall not cause an uncited fallback answer. | MUST | System reports temporary unavailability or returns deterministic results only. |
| FR-ERR-004 | Missing evidence, unavailable data, unsupported questions, and system failure shall have different messages. | MUST | Users can distinguish absence of evidence from technical failure. |

---

# 5. Financial response and chart specification

## 5.1 Response design principle

The system shall not create a chart merely because the user mentions a company. It shall select the smallest visualization that improves understanding and is supported by sufficient verified data.

A professional company response shall follow this order:

1. Company identity and security status.
2. Data status banner and as-of timestamp.
3. Short factual summary.
4. Key metric cards.
5. One primary chart.
6. Optional secondary chart only when it answers a distinct question.
7. Key observations generated from verified calculations.
8. Source citations and methodology.
9. Caveats and missing-data statement.
10. Expandable data table and CSV download.

## 5.2 Controlled response envelope

The backend service shall produce a typed response before rendering:

```json
{
  "response_id": "uuid",
  "intent": "company_price_history",
  "company": {
    "company_id": "uuid",
    "name": "Example S.C.",
    "ticker": "EXMP",
    "sector": "Financial Services"
  },
  "as_of": "2026-07-25T10:00:00+03:00",
  "data_status": "SYNTHETIC_DEMO",
  "summary_facts": [],
  "metrics": [],
  "visualizations": [
    {
      "template_id": "PRICE_VOLUME_V1",
      "title": "Example S.C. closing price and volume",
      "period": {
        "start": "2026-01-01",
        "end": "2026-07-25"
      },
      "series": [],
      "source_refs": [],
      "caveats": []
    }
  ],
  "citations": [],
  "warnings": [],
  "verification_status": "PASSED"
}
```

The LLM may propose an intent and provide narrative wording. It shall not create or modify calculated values, source IDs, chart series, or verification status.

## 5.3 Approved chart-template registry

| Template ID | Use | Minimum data | Visual form | Prohibited use |
|---|---|---|---|---|
| PRICE_LINE_V1 | Closing-price trend | Two dated close values | Line with markers as needed | Do not imply OHLC data |
| OHLC_CANDLE_V1 | Trading-range history | Complete open, high, low, close per date | Candlestick | Do not use with missing OHLC fields |
| PRICE_VOLUME_V1 | Price and trading activity | Close and volume for matching dates | Two vertically linked panels | No dual y-axis overlay |
| FINANCIAL_TREND_V1 | Revenue, profit, assets, or other comparable periods | At least two periods with consistent units | Grouped bars or separate small multiples | Do not mix incompatible scales |
| MARGIN_TREND_V1 | Margin or ratio movement | At least two comparable periods | Percentage line | No unsupported benchmark |
| DIVIDEND_HISTORY_V1 | Dividend per share or total dividend by period | At least two declared periods | Bars | Do not infer undeclared periods as zero |
| BALANCE_COMPOSITION_V1 | Components of a total across periods | Complete compatible components | Stacked bars | Do not hide missing components |
| READINESS_CATEGORY_V1 | Listing-readiness categories | Evaluated requirements grouped by category | Horizontal category bars plus counts | No pie, gauge, or opaque total only |
| REQUIREMENT_STATUS_V1 | Detailed compliance result | At least one evaluated requirement | Checklist table with status and citation | Not a chart-only view |
| ATTENTION_SIGNAL_V1 | Explainable review signals | At least one verified signal | Ranked table with severity text | No “fraud score” |

## 5.4 Template-selection rules

1. If the user asks for price history and complete OHLC exists, use `OHLC_CANDLE_V1`.
2. If only closing prices exist, use `PRICE_LINE_V1`.
3. If closing price and volume both exist, prefer `PRICE_VOLUME_V1`.
4. If fewer than two observations exist, show a point-in-time metric without a trend chart.
5. If periods or units are not comparable, show separate tables or small multiples.
6. If data is synthetic, the template remains usable only with mandatory demo labelling.
7. If the question is about listing readiness, use `READINESS_CATEGORY_V1` and `REQUIREMENT_STATUS_V1`.
8. If the question is about evidence gaps, use a checklist or ranked table, not a decorative chart.
9. If no registered template fits, return a structured text-and-table response.

## 5.5 Chart quality rules

- Titles shall state company, measure, and period.
- Axis labels shall include units such as ETB, ETB millions, shares, or percent.
- Source and data status shall be visible without opening a citation panel.
- Time series shall use chronological ordering and explicit missing dates.
- Bars shall start at zero unless the chart is not encoding magnitude.
- Lines may use a focused range but shall display the axis scale clearly.
- Periods with no observation shall be missing, not automatically zero.
- Percent changes shall state the start and end observations.
- Tooltips shall show exact value, date/period, unit, and status.
- No 3D effects, gradients, excessive animation, or decorative finance imagery.
- Color palette shall remain readable for common color-vision deficiencies.
- Positive and negative meaning shall also use signs, labels, or patterns.
- The user shall be able to inspect and download the underlying table.

## 5.6 Synthetic demonstration data policy

The selected hackathon policy allows synthetic historical data. The following controls are mandatory:

- The page shall display “Synthetic demo data — not ESX market data.”
- Every affected chart shall include the same meaning in its subtitle or caption.
- Synthetic observations shall use separate fixture files and database records.
- Synthetic and official values shall never share one series.
- Synthetic fixtures shall use fictional values even when attached to a real ticker.
- The application shall provide a one-click method to hide all synthetic charts.
- Exports and screenshots shall retain the synthetic label.
- Demo narration shall not describe synthetic trends as actual market performance.

---

# 6. Business rules and rule representation

## 6.1 Rule design

Plain Python conditionals are inspectable, but hardcoding changing thresholds directly in source code is not maintainable. The MVP shall use:

- A generic Python evaluator.
- Versioned rule definitions in YAML or JSON.
- Unit-tested operators and conversions.
- Human approval before activation.

Example rule record:

```yaml
rule_id: ESX_MAIN_TRACK_RECORD
name: Minimum operating track record
segment: MAIN
field: track_record_years
operator: GTE
threshold: 3
unit: years
effective_from: 2025-01-01
effective_to: null
source:
  document_id: esx-rulebook-effective-version
  section: "Volume C, applicable listing provision"
  page: null
unknown_result: MISSING_EVIDENCE
review_status: APPROVED
```

## 6.2 Evaluation semantics

| State | Meaning |
|---|---|
| MET | Validated evidence satisfies the active rule |
| NOT_MET | Validated evidence does not satisfy the active rule |
| MISSING_EVIDENCE | Required fact was not found or confirmed |
| CONFLICT | Multiple credible values disagree |
| NOT_APPLICABLE | Rule does not apply to the selected segment or issuer |
| PROFESSIONAL_REVIEW | Rule is qualitative, ambiguous, conflicting, or requires expert judgment |

## 6.3 Known rule-quality concern

The current ESX listing web page contains inconsistent wording for the Growth Market free-float percentage. The implementation shall not copy that web-page value into executable rules without checking the effective ESX Rulebook and obtaining financial-domain approval. This is an example of why source versioning and human rule approval are mandatory.

## 6.4 Readiness scoring

If an aggregate score is shown:

```text
score = met_applicable_weight / evaluated_applicable_weight × 100
```

`MISSING_EVIDENCE`, `CONFLICT`, and `PROFESSIONAL_REVIEW` shall remain visible and shall not be presented as passed. The UI shall show counts and category details beside the percentage.

---

# 6.5 Revision-boundary statement

This final revision changes only: (a) the target client groups, (b) the essential roles and specialized Administrator responsibilities, and (c) the Hybrid RAG ingestion, retrieval, reranking, evaluation, and citation-lineage requirements. All other business, safety, compliance, calculation, chart, source-governance, privacy, and non-functional requirements from SRS v2.0 remain in force unless explicitly superseded in this document.

---

# 7. Architecture

## 7.1 Architecture decision

The product shall retain its existing application implementation and use a modular service architecture with a web presentation layer. This revision changes only the target client model, administration responsibilities, and retrieval design; it does not require a separate autonomous-agent architecture.

This is preferred to a multi-agent or microservice design because:

- It is faster to implement and demonstrate.
- Deterministic and AI responsibilities remain inspectable.
- Fewer network boundaries reduce failure modes.
- Python supports PDF processing, retrieval, calculation, Plotly, and report generation.
- Service interfaces can later be exposed through FastAPI without rewriting domain logic.

React/Next.js and a separate API are outside the MVP. They become appropriate when product-grade authentication, advanced responsive design, concurrent workloads, and external integrations are required.

## 7.2 Recommended MVP stack

| Layer | Selection | Reason |
|---|---|---|
| Language | Python 3.12+ | Strong document, AI, data, and visualization ecosystem |
| UI | Existing web presentation layer | Existing application interface; role-aware responsive experiences for enterprise and retail workflows |
| Charts | Plotly | Interactive financial charts and application integration |
| Validation | Pydantic | Strict extraction and response contracts |
| Dataframes | Pandas | Simple integration with Plotly and financial data |
| PDF text | PyMuPDF | Fast page text, coordinates, and metadata |
| Difficult tables | pdfplumber | Selective table extraction fallback |
| OCR | PaddleOCR or Tesseract adapter | Scanned-page fallback; optional for MVP |
| Dense retrieval | Pinecone managed vector index | Multilingual semantic retrieval, namespace operations, metadata filtering, and managed index health |
| Lexical retrieval | BM25 local index | Exact clauses, article numbers, and financial terms |
| Fusion | Reciprocal Rank Fusion | Combines incomparable lexical and dense rankings |
| Embeddings | Pinecone integrated multilingual embeddings or an evaluated provider adapter | Multilingual semantic retrieval; model selection remains evaluation-driven |
| LLM | Provider abstraction with structured output | Avoids vendor lock-in |
| Application database | SQLite | Zero-infrastructure MVP metadata and audit storage |
| Files | Local private directory by checksum | Simple MVP provenance |
| Reports | python-docx; optional HTML-to-PDF adapter | Reliable DOCX baseline |
| Tests | pytest | Unit, integration, and evaluation tests |

No dependency version shall be assumed without testing the implementation environment and locking the final working set.

## 7.3 Production migration target

| MVP | Production target |
|---|---|
| Existing web UI | Accessible responsive web client with enterprise workspace and retail information views |
| Existing service layer | Background-capable service layer and queued ingestion jobs where required |
| SQLite | PostgreSQL |
| Pinecone managed index | Managed hybrid retrieval or evaluated alternative after benchmark |
| Local files | Encrypted object storage |
| Session access | OIDC, role-based access, tenant isolation |
| Synchronous ingestion | Queued jobs with status and retries |
| Local audit | Central append-only audit and monitoring |

## 7.4 Logical components

1. **Web Presentation**
   - Role-aware pages, forms, workspace state, tables, charts, citation expanders, downloads, and responsive retail interfaces.
2. **Application Orchestrator**
   - Explicit workflow state machine; no free-form autonomous agent loop.
3. **Domain Policy Layer**
   - System prompt, financial boundaries, abstention rules, source policy, and output constraints.
4. **Document Ingestion Service**
   - Validation, parsing, OCR routing, normalization, chunking, and provenance.
5. **Structured Extraction Service**
   - Pydantic-based facts with evidence and confidence.
6. **Retrieval Service**
   - Metadata filters, BM25, dense retrieval, RRF, optional reranking, and context assembly.
7. **Rule Evaluation Service**
   - Versioned rules, operators, unit normalization, and status computation.
8. **Computation Service**
   - Financial formulas, changes, ratios, return calculations, and rounding.
9. **Company Data Service**
   - Company registry, issuer facts, market observations, financial metrics, and synthetic fixtures.
10. **Visualization Service**
    - Template selection, data validation, Plotly figure generation, and CSV tables.
11. **Generation Service**
    - Cited explanation and digest generation from approved evidence and values.
12. **Verification Service**
    - Schema, source, citation, calculation, narrative, and policy checks.
13. **Report Service**
    - DOCX and optional PDF rendering.
14. **Persistence Adapters**
    - Application database, Pinecone vector index, BM25 index, and file storage.
15. **Audit and Observability**
    - Run metadata, errors, timings, retrieval traces, model usage, and export records.

## 7.5 Correction to the proposed “agent” model

The proposed roles are useful responsibilities, but most should not be autonomous agents:

| Proposed role | Recommended implementation |
|---|---|
| Financial Domain Expert / Memetic Proxy | Rename to Domain Policy Layer: a versioned system prompt plus deterministic policies and reviewed terminology |
| Retrieval & Extraction Agent | Split into Document Ingestion, Structured Extraction, and Retrieval services |
| Computational Tool Executor | Deterministic Python calculation library with no LLM arithmetic |
| Verification & Compliance Reviewer | Programmatic verifier first; optional constrained second-pass LLM reviewer |

This design is safer and easier to test. A second LLM does not create ground truth. Ground truth comes from approved documents, structured evidence, deterministic calculations, and human-reviewed rules.

## 7.6 Suggested project structure

```text
ethioberg/
├── app.py
├── pages/
│   ├── source_library.py
│   ├── document_review.py
│   ├── listing_readiness.py
│   ├── regulatory_qa.py
│   └── company_explorer.py
├── src/
│   ├── domain/
│   │   ├── models.py
│   │   ├── enums.py
│   │   └── errors.py
│   ├── services/
│   │   ├── ingestion.py
│   │   ├── extraction.py
│   │   ├── retrieval.py
│   │   ├── rule_engine.py
│   │   ├── calculations.py
│   │   ├── visualization.py
│   │   ├── generation.py
│   │   ├── verification.py
│   │   └── reporting.py
│   ├── adapters/
│   │   ├── llm_provider.py
│   │   ├── embedding_provider.py
│   │   ├── vector_store.py
│   │   ├── lexical_index.py
│   │   ├── repositories.py
│   │   └── file_store.py
│   └── prompts/
│       ├── domain_policy.md
│       ├── extraction.md
│       ├── grounded_answer.md
│       └── reviewer.md
├── config/
│   ├── rules/
│   ├── chart_templates/
│   └── sources/
├── data/
│   ├── private_uploads/
│   ├── official_sources/
│   └── synthetic_demo/
└── tests/
    ├── unit/
    ├── integration/
    ├── retrieval_eval/
    ├── security/
    └── fixtures/
```

## 7.7 Processing pipelines

### Regulatory ingestion

```text
Approved source
→ file validation and checksum
→ page extraction
→ structure and clause detection
→ metadata enrichment
→ table-aware parent-child chunks
→ BM25 index + Pinecone dense index
→ cross-encoder retrieval evaluation
→ source activation
```

### Listing review

```text
Issuer upload
→ untrusted-file validation
→ text/table extraction
→ structured facts with evidence
→ user confirmation
→ deterministic rule evaluation
→ narrative-obligation retrieval
→ grounded gap explanation
→ verification
→ checklist, citations, and export
```

### Company chart response

```text
User request
→ intent and entity resolution
→ source-policy filter
→ validated observations
→ deterministic calculations
→ approved template selection
→ Plotly rendering
→ grounded narrative
→ number/source verification
→ response and data download
```

---

# 8. Data requirements

## 8.1 Core entities

| Entity | Purpose | Key fields |
|---|---|---|
| SourceDocument | Versioned authoritative or uploaded file | ID, trust class, issuer, title, version, language, effective dates, checksum, URL |
| DocumentPage | Page-level provenance | document ID, page number, text, OCR status, quality |
| Chunk | Retrievable clause, table fragment, child context, or parent context | chunk ID, parent ID, section, page, table coordinates, text/Markdown, metadata, embedding/index status, ingestion configuration version |
| Citation | Evidence reference and lineage | source ID, chunk ID, parent ID where used, page, section, quote, retrieval configuration, reranker score, verification outcome |
| RuleDefinition | Executable listing rule | rule ID, segment, field, operator, threshold, unit, dates, source |
| ExtractedFact | Structured issuer fact | name, value, unit, period, evidence, confidence, confirmation state |
| RequirementResult | Rule outcome | rule ID, fact ID, state, calculation, explanation |
| Company | Canonical issuer | company ID, official name, aliases, sector |
| Security | Listed security | ticker, instrument type, segment, listing date, source |
| MarketObservation | Price or volume data | security ID, date/time, OHLC, close, volume, status, source |
| FinancialMetric | Period financial value | company ID, metric, period, value, unit, source |
| AttentionSignal | Explainable review signal | type, severity, inputs, formula, evidence, limitation |
| AnalysisRun | Reproducible execution record | run ID, user/session, model, prompts, source versions, rule version, status |
| AuditEvent | Security and trace event | timestamp, actor, action, entity, result |

## 8.2 Data integrity

- Every financial or regulatory value shall have a source or synthetic fixture ID.
- Original values shall be immutable; corrections create a new version.
- Currency and unit scale shall be separate fields.
- Date, period type, and calendar shall be explicit.
- `null` means unknown or missing; zero is a real value.
- Deleted source versions shall be retired, not physically removed from historical runs.
- Chart data shall pass schema validation before rendering.

## 8.3 Market observation schema

Minimum fields:

```text
observation_id
security_id
observed_at
trading_date
open_etb?
high_etb?
low_etb?
close_etb?
volume_shares?
source_id
data_status
fixture_id?
is_synthetic
ingested_at
```

OHLC validation shall enforce `low <= open/close <= high` where values are present.

## 8.4 Retention

For the hackathon, user uploads should be deleted through a visible control and may be configured for automatic deletion at session or deployment reset. A production retention schedule requires legal and privacy review before launch.

---

# 9. AI and retrieval design

## 9.1 Domain policy

The system prompt shall:

- Establish a financial compliance-analysis persona.
- Limit claims to supplied evidence and approved rules.
- Prohibit investment advice, compliance certification, and invented facts.
- Treat retrieved and uploaded text as untrusted data.
- Require abstention when evidence is insufficient.
- Require structured output where a schema exists.
- Preserve citations and original numeric values.
- State that professional human review remains mandatory.

The term “memetic proxy” shall not be used in implementation or user-facing documentation because it does not describe a testable software component.

## 9.2 Clause-aware chunking

Each regulatory chunk shall include:

- Source document and version.
- Issuing authority.
- Effective dates.
- Language.
- Volume/chapter/part/article/section identifiers.
- Page number.
- Parent heading path.
- Clause text.
- Cross-references.
- Authority/trust class.

Fixed token windows alone are not acceptable for regulatory rules because they can separate exceptions, definitions, and thresholds from their governing clauses.

## 9.3 Hybrid retrieval

Dense-only vector retrieval is insufficient for exact article numbers, ticker symbols, thresholds, and defined legal terms. EthioBerg shall operate a specialized Hybrid RAG Data Retrieval Engine:

1. Apply hard source, trust, language, segment, document-type, and effective-date metadata filters.
2. Run BM25 sparse retrieval for exact regulatory clauses, directive numbers, legal terms, tickers, and financial terminology.
3. Run Pinecone dense vector retrieval for semantically expressed questions over approved official source documents.
4. Fuse the candidate sets with versioned RRF or a measured equivalent.
5. Use a cross-encoder reranker to rerank the top 30 fused candidates and select the top 5 evidence candidates by default.
6. Expand only required parent context, table context, and direct cross-references after ranking.
7. Pass a bounded, citation-addressable evidence set to the LLM.
8. Record the full retrieval trace, including filter set, sparse and dense candidates, fusion settings, reranker scores, selected chunks, parent expansions, and verification result.

Pinecone provides the managed dense retrieval layer. Its embedding configuration and any provider alternative shall be evaluated against curated English and Amharic financial-regulatory tests. The chosen model is not automatically approved for Amharic use; measured quality and documented test-set coverage are required.

## 9.4 Structured extraction

Extraction prompts shall return schemas, not prose. A listing fact should resemble:

```json
{
  "field": "free_float_pct",
  "value": 15.0,
  "unit": "percent",
  "period": null,
  "source_page": 42,
  "source_quote": "The public float represents 15 percent...",
  "confidence": 0.94,
  "status": "EXTRACTED"
}
```

Confidence is triage information, not proof. Rule evaluation shall depend on evidence and confirmation state, not confidence alone.

## 9.5 Grounded generation

Generation input shall contain:

- User question or requested report section.
- Applicable source chunks.
- Validated facts and calculations.
- Allowed output schema.
- Required citation IDs.
- Explicit list of unavailable information.

The model shall never receive permission to create new citation IDs or values.

## 9.6 Verification gates

A response is displayable only after:

1. Schema validation.
2. Citation-ID existence check.
3. Evidence-quote match check.
4. Source authority and effective-date check.
5. Numeric match against structured facts.
6. Unit and period consistency check.
7. Synthetic-data policy check.
8. Prohibited-claim check.
9. Required disclaimer check.

Failed verification results in a safe retry with the same evidence or an abstention. It shall not trigger open-web retrieval.

---

# 10. User-interface requirements

## 10.1 Global layout

The application shall provide:

- Product title and current mode.
- Persistent source/data-status indicator.
- Role-aware navigation and responsive layouts for enterprise workspaces and retail information views.
- Visible disclaimer.
- Current segment and document context.
- Loading and progress states for long operations.
- Expandable citations.
- Consistent status vocabulary.

## 10.2 Source Library page

- List active and retired official sources.
- Show authority, version, language, effective date, checksum, and index state.
- Data Ingestion & Pipeline Admin controls for upload, source activation, crawler configuration, parsing/table-quality review, chunking configuration, and retrieval smoke tests.

## 10.3 Document Review page

- Financial Analyst / Compliance Officer file upload and document metadata.
- Page/extraction quality summary, including table-conversion status.
- Extracted-fact editor with evidence preview.
- Conflict and low-confidence warnings.
- Start-review control.
- Gap and attention-signal sections.

## 10.4 Listing Readiness page

- Segment selector.
- Category summary.
- Status counts and readiness category chart.
- Requirement checklist table.
- Evidence and rule citation expanders.
- Filters for failed, missing, conflict, and review-required items.
- Export action.

## 10.5 Regulatory Q&A page

- Question input.
- Segment, language, and effective-date filters.
- Concise answer.
- Clause citations and quoted evidence.
- “Insufficient official evidence” state.
- Retrieval feedback control for evaluation.
- Investor / Educator mode with plain-language explanation and prominent financial-literacy and no-investment-advice boundaries.
- Financial Analyst / Compliance Officer mode with full retrieval trace, source metadata, selected chunks, and side-by-side evidence view.

## 10.5.1 Retrieval operations page

- Administrator-only operations dashboard.
- Ingestion job, crawler, parse, OCR, table-conversion, chunking, and index status.
- Pinecone namespace and index-health status.
- Versioned BM25/dense fusion and reranker configuration.
- Evaluation results for faithfulness, context relevance, answer relevance, Recall@5, answer support, abstention, and latency.
- Citation-lineage and failed-query inspection with audit controls.

## 10.6 Company Explorer page

- Company/ticker selector.
- Official company facts.
- Data-status banner.
- Period and chart-type controls limited to compatible templates.
- Key metric cards.
- Primary chart.
- Verified observations.
- Citations, caveats, data table, and CSV download.
- Persistent synthetic-data warning when demo fixtures are enabled.

## 10.7 Report page

- Report preview.
- Included sections.
- Source and rule versions.
- Unresolved issues.
- DOCX export.
- Optional PDF export.

---

# 11. Non-functional requirements

## 11.1 Accuracy and traceability

| ID | Requirement |
|---|---|
| NFR-ACC-001 | One hundred percent of regulated claims displayed to users shall have valid citations. |
| NFR-ACC-002 | One hundred percent of compliance arithmetic shall use deterministic functions. |
| NFR-ACC-003 | One hundred percent of plotted observations shall map to stored validated records. |
| NFR-ACC-004 | System shall preserve original source text and values for audit. |
| NFR-ACC-005 | Unknown, missing, ambiguous, and conflicting data shall remain distinguishable. |

## 11.2 Performance

Targets apply to the agreed hackathon environment:

| Operation | Target |
|---|---|
| Cached page interaction | 2 seconds or less at p95 |
| Company chart from loaded data | 2 seconds or less at p95 |
| Regulatory Q&A after index warm-up | 12 seconds or less at p95 |
| Twenty-page digital PDF extraction | 30 seconds or less under normal quality |
| Full review generation | 90 seconds or less, with progress feedback |

OCR and external model-provider latency are excluded from strict targets but shall be measured and shown as progress.

## 11.3 Security

- All uploaded and retrieved content shall be treated as untrusted.
- File type, size, and integrity shall be validated.
- Production deployment should add malware scanning and sandboxed conversion.
- The parser shall not execute macros, embedded files, scripts, or external links.
- Prompt-injection indicators and hidden Unicode content shall be detected and logged.
- Retrieved content shall be clearly separated from system instructions.
- Model tools shall use least privilege and no autonomous filesystem or network access.
- Secrets shall be stored outside source code.
- Sensitive files shall not be sent to an external model provider without an approved data-processing policy.
- Logs shall avoid full document text and personal information unless explicitly required.
- Admin functions shall require authorization.
- User sessions and stored documents shall be isolated.
- Downloads shall be authorized and time-limited in production.

## 11.4 Privacy

- MVP shall minimize collection of personal data.
- KYC documents and biometric data are outside scope.
- User shall be informed before a document is sent to any external AI provider.
- Production shall define lawful basis, retention, deletion, access, and incident procedures.
- User-uploaded documents shall not be reused for model training without explicit authorization.

## 11.5 Reliability

- A failure in the LLM provider shall not corrupt stored sources or rules.
- Analysis writes shall be transactional where practical.
- Indexes shall be rebuildable from original source files and metadata.
- Reports shall record the versions used at generation time.
- Cached values shall include source, rule, prompt, and model version keys.

## 11.6 Usability and accessibility

- Status shall not depend on color alone.
- Charts shall have descriptive titles and underlying tables.
- Controls shall have clear labels.
- Keyboard navigation and readable contrast shall be tested.
- Financial terms shall have plain-language help.
- Error messages shall explain the next safe action.
- The interface shall avoid dense dashboards and unnecessary charts.

## 11.7 Maintainability

- Domain logic shall not be embedded directly in presentation-layer page files.
- External providers shall use interfaces/adapters.
- Rules, prompts, and chart templates shall be version-controlled.
- Core services shall be testable without running the presentation layer.
- Type hints and schema validation shall be used throughout.
- Logging shall use run IDs and typed event names.

## 11.8 Portability

- MVP shall run locally on Linux.
- A containerized deployment should be supported after the hackathon.
- Provider adapters shall allow model replacement.
- Local and production storage shall implement the same repository contracts.

---

# 12. Testing and evaluation

## 12.1 Test layers

| Layer | Required coverage |
|---|---|
| Unit | Rule operators, units, calculations, date handling, schema validation, template selection |
| Parser | Digital PDFs, scans, mixed pages, tables, broken files, multilingual text |
| Integration | Upload-to-report flow, source activation, retrieval, extraction, verification |
| Retrieval evaluation | Exact clause, semantic, cross-language, version-sensitive, threshold, and no-answer queries |
| Visualization | Template compatibility, labels, source status, synthetic warnings, missing data |
| Security | Prompt injection in uploads, hidden text, unsafe file types, unauthorized admin actions |
| Regression | Approved financial and regulatory gold cases |
| User acceptance | Financial Analyst / Compliance Officer completes an issuer-review workflow; Investor / Educator completes a cited public-information workflow; each specialized Administrator responsibility completes its authorized operational workflow |

## 12.2 Measured quality metrics

The following replace vague claims such as “Hallucination Index”:

| Metric | MVP release target |
|---|---|
| Citation coverage for regulated claims | 100% |
| Citation resolvability | 100% |
| Numeric narrative consistency | 100% |
| Deterministic calculation test pass rate | 100% |
| Rule boundary test pass rate | 100% |
| Retrieval Recall@5 on approved question set | At least 90% |
| Context relevance on approved evaluation set | At least 90% |
| Faithfulness on approved answerable evaluation set | At least 95% |
| Answer relevance on approved answerable evaluation set | At least 90% |
| Answer support rate on answerable gold questions | At least 95% |
| Correct abstention on unanswerable gold questions | At least 90% |
| Chart-to-data row consistency | 100% |
| Synthetic-label coverage | 100% |

Targets shall be reported with the size and language distribution of the test set. A percentage without test-set context is not acceptable.

## 12.3 Minimum evaluation set

Before demonstration:

- At least 30 English regulatory questions.
- At least 15 Amharic or bilingual questions if Amharic is demonstrated.
- At least 10 exact section/article lookup questions.
- At least 10 unanswerable or out-of-scope questions.
- Boundary tests for every active numeric rule.
- At least three issuer-document extraction fixtures.
- At least one scanned or difficult-table fixture.
- At least one conflicting-value fixture.
- Every approved chart template with valid and invalid data.
- Prompt-injection samples embedded in uploaded documents.

## 12.4 Human review

A financial-domain reviewer shall:

- Approve active rule definitions.
- Review gold answers and citations.
- Validate terminology and disclaimers.
- Review English/Amharic preservation of legal meaning.
- Sign off the hackathon demonstration scenarios.

---

# 13. Deployment and operations

## 13.1 Hackathon deployment

- One deployable EthioBerg application with its existing presentation and service layers.
- Python modular service layer in the same process.
- Local SQLite database.
- Pinecone dense vector index and BM25 sparse index.
- Private local source and upload directories.
- External LLM/embedding APIs only through environment-configured adapters.
- Synthetic demo mode enabled and visibly labelled.

## 13.2 Configuration profiles

| Profile | Behavior |
|---|---|
| Development | Local files, verbose logs, test sources |
| Demo | Approved corpus, synthetic charts enabled, stable seeded fixtures |
| Production-like | Synthetic data disabled, restricted uploads, minimal logs, real authentication |

## 13.3 Observability

Each run should log:

- Run and session ID.
- Operation and component.
- Source and rule versions.
- Parsing and retrieval timings.
- Retrieval configuration version, sparse/dense candidate IDs and scores, reranker scores, selected chunk IDs, and citation-lineage outcome.
- Model/provider and token usage.
- Verification failures.
- Error code.
- Export event.

Logs shall not contain secrets or unnecessary full source text.

## 13.4 Backup and recovery

- Official source files, rule files, and metadata shall be backed up together.
- Indexes may be regenerated and are not the sole copy of source data.
- Synthetic fixtures shall be version-controlled.
- A recovery test shall rebuild retrieval indexes from approved sources.

---

# 14. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Small current ESX customer base | Limited early revenue | Prioritize enterprise compliance and financial-institution clients, including investment banks, brokerages, and listing-ready state-owned enterprises, while supporting retail education through a lower-complexity experience |
| No confirmed public historical-price API | Missing real price charts | Use official facts, labelled synthetic demo fixtures, and future licensed data adapter |
| Conflicting or changing rules | Incorrect evaluation | Versioned rules, effective-date filters, human activation, conflict state |
| PDF table or OCR errors | Wrong financial facts | Evidence preview, confidence, user confirmation, table tests |
| LLM hallucination | False rule or company claim | Closed corpus, strict schemas, deterministic values, verification and abstention |
| Prompt injection in documents | Policy bypass or leakage | Treat content as data, scan, delimit, restrict tools, output verification |
| Weak Amharic retrieval | Missed evidence | Separate benchmark, hybrid retrieval, model comparison, do not launch unsupported claims |
| Dense retrieval provider or reranker latency | Slow or costly retrieval | Pinecone index-health monitoring, bounded top-30 reranking, versioned settings, latency measurement, and cache-aware retrieval |
| Ingestion and retrieval resource cost | Repeated expensive work | Checksum/version-aware caching, background-capable jobs, namespace health monitoring, and bounded retrieval context |
| Overstated compliance | Legal and trust risk | Pre-review positioning, visible disclaimer, mandatory human sign-off |
| Same-model reviewer bias | Unsupported confidence | Programmatic checks first; independent human gold set |
| Sector-concentrated data | Misleading comparisons | Sector-specific analysis and no unsupported peer benchmark |
| Synthetic demo mistaken for real | Reputational harm | Persistent labels, separate records, screenshots/exports retain warning |

---

# 15. Delivery roadmap

## 15.1 Hackathon MVP

Must demonstrate:

1. Data Ingestion & Pipeline Admin loads or crawls approved ESX/ECMA sources and verifies parsing, table conversion, metadata, and chunking quality.
2. User selects Main or Growth Market.
3. User uploads one issuer document.
4. System extracts core facts with page evidence.
5. User confirms or corrects facts.
6. Rule engine returns inspectable requirement statuses.
7. Hybrid Q&A returns exact, expandable citations after BM25 + Pinecone retrieval, top-30-to-top-5 cross-encoder reranking, and verification.
8. Company Explorer renders at least:
   - one synthetic price/volume template,
   - one issuer financial trend from sourced or labelled fixture data,
   - one readiness category view.
9. Verifier blocks an uncited or numerically inconsistent response.
10. User exports a DOCX pre-review report.

## 15.2 Post-hackathon pilot

- Design-partner feedback.
- More robust OCR and table extraction.
- Continuous disclosure checklist.
- Approved Amharic evaluation and terminology.
- Background ingestion jobs.
- Authentication and role-based access.
- PostgreSQL and object storage.
- Real ESX market-data agreement or approved feed.
- Better report branding and collaboration.

## 15.3 Later product phases

- React/Next.js frontend and FastAPI backend.
- Multi-tenant workspaces.
- Filing comparison and deadline monitoring.
- Sector-specific financial signal packs.
- Licensed market-data integration.
- ECMA regulatory sandbox engagement.
- Broker onboarding completeness workflow.
- Fayda/eKYC integration only through approved partnerships and privacy review.

---

# 16. MVP acceptance criteria

The MVP is acceptable only if all conditions below are met:

1. Active rules have source citations and reviewer approval.
2. Every displayed regulated claim is cited.
3. Numeric rules and chart calculations use deterministic code.
4. Missing evidence never appears as pass or zero.
5. The application can abstain when the corpus lacks an answer.
6. At least one uploaded issuer document completes the full review flow.
7. Chart template selection rejects incompatible data.
8. Synthetic data is labelled on screen, chart, table, and export.
9. No real and synthetic observations are mixed.
10. No response provides investment advice or compliance certification.
11. DOCX export contains results, sources, versions, caveats, and disclaimer.
12. Required quality metrics in Section 12 meet their release targets.
13. Prompt-injection test documents do not change system policy or gain tool access.
14. The financial-domain reviewer and AI Safety & Quality Auditor sign off the demo rule set, RAG gold cases, citation lineage, and defined groundedness metrics.

---

# 17. Open production decisions

These decisions are intentionally not locked for the hackathon:

- Final LLM provider.
- Whether the selected Pinecone embedding configuration or an evaluated provider adapter meets Amharic retrieval targets.
- Long-term managed vector/hybrid retrieval provider after benchmark.
- Licensed source of real-time or historical ESX market data.
- Production identity provider and hosting jurisdiction.
- Final data-retention and external-model privacy policy.
- Institutional integration requirements from ECMA, ESX, or design partners.

They shall be resolved using measured evaluation, partner requirements, cost, privacy, and operational constraints rather than novelty.

---

# 18. References

## 18.1 Ethiopian capital-market sources

1. ESX Listed Companies: https://esx.et/equity-market/listed-companies/
2. ESX Listing and Market Segments: https://esx.et/equity-market/listing/
3. ESX Trading and Operations: https://esx.et/equity-market/trading-operations/
4. ECMA Issuer and Ongoing-Disclosure FAQ: https://ecma.gov.et/faq/
5. ECMA Laws and Regulations: https://ecma.gov.et/laws-regulation/
6. ECMA Licensees: https://ecma.gov.et/licensees/
7. Fayda National ID: https://id.et/

## 18.2 Technical sources

1. Pinecone Documentation: https://docs.pinecone.io/
2. Plotly Financial Charts: https://plotly.com/python/financial-charts/
3. Ragas Documentation: https://docs.ragas.io/
4. TruLens Documentation: https://www.trulens.org/
5. OWASP RAG Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html
6. OWASP LLM Prompt Injection Prevention: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html

---

# Appendix A — Default response templates

## A.1 Company overview response

1. Company name, ticker, segment, sector, listing date.
2. Data status and as-of date.
3. Three to five sourced company facts.
4. Available financial period summary.
5. One appropriate chart, if supported.
6. Verified observations.
7. Citations and caveats.

## A.2 Price-history response

1. Synthetic or official status banner.
2. Start price, end price, deterministic change, high, low, and period.
3. `PRICE_LINE_V1`, `OHLC_CANDLE_V1`, or `PRICE_VOLUME_V1`.
4. Three factual observations from calculated values.
5. Source, period, and downloadable data table.

## A.3 Listing-readiness response

1. Selected segment and active rule version.
2. Counts by status.
3. `READINESS_CATEGORY_V1`.
4. Requirement checklist with fact evidence and rule citation.
5. Priority gaps and next actions.
6. Unresolved conflicts.
7. Pre-review disclaimer.

## A.4 Regulatory-answer response

1. Direct answer in one short paragraph.
2. Applicable segment and effective date.
3. Bullet list of obligations or conditions.
4. Exact citations with quoted evidence.
5. Limitation or ambiguity note.

---

# Appendix B — Professional disclaimers

## B.1 Compliance review

> EthioBerg provides an automated pre-review based on the documents and rule versions identified in this report. It is not an approval, legal opinion, audit opinion, or guarantee of compliance. Final decisions remain with the issuer, licensed advisers, auditors, ESX, ECMA, and other competent authorities.

## B.2 Company information

> This response is provided for information and education. It is not investment advice or a recommendation to buy, sell, or hold a security. Verify material information against the cited official source.

## B.3 Synthetic chart

> Synthetic demo data — not ESX market data. Values in this chart are artificial and demonstrate the interface only. They do not represent the actual trading history or performance of the named security.

