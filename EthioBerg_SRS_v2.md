# Software Requirements Specification

## EthioBerg

**AI-Powered Listing Readiness, Disclosure Intelligence, and Financial Analysis for the Ethiopian Securities Exchange**

| Document field | Value |
|---|---|
| Document type | Software Requirements Specification |
| Product | EthioBerg |
| Version | 2.0 |
| Status | Hackathon MVP baseline |
| Owner | Abel |
| Market | Ethiopian capital market: ESX and ECMA |
| Date | 25 July 2026 |
| Replaces | Version 1.0 project documentation |

### Revision history

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026 | Initial product and market concept |
| 2.0 | 25 July 2026 | Rewritten as a complete SRS; added architecture, verifiable RAG, deterministic rule evaluation, professional chart-response templates, security, testing, and deployment requirements |

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

This document defines the functional, data, AI, visualization, security, quality, and deployment requirements for EthioBerg. It is the baseline for product design, hackathon implementation, testing, and future production planning.

EthioBerg is a decision-support system. It organizes regulatory evidence, evaluates deterministic listing rules, explains disclosures, and presents verified financial information. It does not replace ECMA, ESX, licensed advisers, auditors, compliance officers, or human approval.

## 1.2 Product scope

The hackathon MVP shall provide:

1. A listing-readiness checker for ESX Main Market and Growth Market.
2. A closed, versioned regulatory knowledge base built from official ECMA and ESX documents.
3. Source-grounded regulatory question answering.
4. Structured extraction of listing facts from issuer documents.
5. Deterministic evaluation of numeric listing requirements.
6. Evidence-linked disclosure gap analysis.
7. Company and security information responses using controlled financial chart templates.
8. Clearly labelled synthetic market data for demonstrating chart functionality where verified historical ESX data is unavailable.
9. Exportable compliance and analysis reports.

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
- Streamlit and Plotly official documentation
- BGE-M3 model documentation

Exact links are listed in Section 18.

---

# 2. Product overview

## 2.1 Market context

ESX began operations in January 2025. As of 25 July 2026, the official ESX listed-company page shows five listed companies. Four are financial institutions and one is a telecommunications company. The small and sector-concentrated market limits reliable peer modelling and price prediction, but it creates an immediate need for document standardization, issuer readiness, compliance support, and investor education.

ECMA guidance requires securities offered to the public to be registered and requires publicly held issuers to submit ongoing reports. ECMA states that ongoing disclosure is semi-annual and that material information affecting security prices must be disclosed within 24 hours. Sector-specific or later rules may impose additional duties.

ESX publishes listing and post-trade information, but no stable public historical-price developer API has been confirmed for this SRS. The MVP shall therefore use official documents for real company facts and clearly labelled synthetic fixtures for historical chart demonstrations.

## 2.2 Problem statement

Prospective issuers, advisers, and compliance teams currently face:

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
| G-08 | Preserve a migration path from a Streamlit MVP to a production API and web frontend |

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

| User class | Primary needs | MVP priority |
|---|---|---|
| Listing adviser or investment bank analyst | Repeatable issuer review, rule evidence, gap reports | Primary |
| Prospective issuer | Understand Main/Growth readiness and missing evidence | Primary |
| Listed-company compliance or IR officer | Pre-check disclosures and explain filings | Secondary |
| Retail investor or educator | Understand company information and disclosures | Secondary |
| System administrator | Manage trusted sources, rules, demo data, and audit records | Primary |
| ECMA or ESX reviewer | Potential future institutional workflow | Future |

## 2.7 Assumptions

- The hackathon MVP uses Streamlit and Python.
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
- Streamlit reruns application code after interaction, requiring disciplined caching and state management.

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
11. Streamlit renders the checklist, gaps, citations, and export controls.
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

**Actor:** Issuer or adviser  
**Precondition:** Active rule set has been approved by an administrator.  
**Success result:** Requirements are shown as Met, Not Met, Missing Evidence, Not Applicable, or Review Required, with evidence and source citations.

### UC-02 — Ask a regulatory question

**Actor:** Adviser, issuer, or compliance officer  
**Precondition:** Official source corpus is indexed.  
**Success result:** Answer contains cited clauses or explicitly states that sufficient support was not found.

### UC-03 — Review a disclosure document

**Actor:** Compliance or IR user  
**Precondition:** File passes validation.  
**Success result:** System shows extracted facts, missing sections, attention signals, and source-linked findings.

### UC-04 — Request company stock information

**Actor:** Investor, analyst, or educator  
**Precondition:** Company exists in the registry.  
**Success result:** System renders the appropriate response template and clearly labels real, unavailable, or synthetic data.

### UC-05 — Export a report

**Actor:** Adviser or issuer  
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
| FR-RAG-001 | Retrieval shall combine lexical and dense retrieval. | MUST | Exact clause references and semantic questions both succeed on the evaluation set. |
| FR-RAG-002 | Lexical and dense results shall be fused using RRF or a tested equivalent. | MUST | Fusion is deterministic for a fixed index and query. |
| FR-RAG-003 | A multilingual reranker may rerank the fused candidate set. | SHOULD | Reranking can be disabled on low-resource hardware. |
| FR-RAG-004 | Retrieval shall prioritize active official sources and apply hard effective-date filters. | MUST | Superseded rules are excluded unless the user asks for history. |
| FR-RAG-005 | Direct section or article queries shall receive an exact-match retrieval boost. | MUST | “Article 135” retrieves the correct provision when present. |
| FR-RAG-006 | The generator shall receive only the minimum relevant evidence required to answer. | MUST | Context budget is bounded and logged. |
| FR-RAG-007 | Every regulated claim shall carry at least one valid citation. | MUST | Uncited regulated claims fail verification. |
| FR-RAG-008 | A citation shall include source title, version, section/article, page where available, chunk ID, and quoted evidence. | MUST | Citation opens or expands to matching evidence. |
| FR-RAG-009 | If evidence is insufficient, the system shall return an abstention instead of a guessed answer. | MUST | Test questions outside the corpus produce a clear limitation message. |
| FR-RAG-010 | Q&A shall not use open-web content as evidence in the MVP. | MUST | Only approved corpus IDs appear in citations. |
| FR-RAG-011 | User may filter answers by Main/Growth segment, source language, and effective date. | SHOULD | Filters change the retrieval query and are shown in the response. |

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
| FR-ADM-001 | MVP shall support an administrator mode protected by deployment-level access controls. | MUST | Normal user cannot alter sources or rules. |
| FR-ADM-002 | Administrator shall approve rule files before activation. | MUST | Draft rule sets cannot affect user analysis. |
| FR-ADM-003 | Administrator shall enable or disable synthetic demo mode. | MUST | Production profile can prohibit synthetic data globally. |
| FR-ADM-004 | Streamlit session state shall retain the current workflow without mixing user sessions. | MUST | Concurrent session test shows isolation. |
| FR-ADM-005 | Expensive parsing, embedding, and retrieval resources shall use checksum- and version-aware caching. | MUST | Repeated interactions do not repeat unchanged work. |

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

# 7. Architecture

## 7.1 Architecture decision

The MVP shall use a **modular Python monolith with a Streamlit presentation layer**.

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
| UI | Streamlit | Fastest complete hackathon workflow |
| Charts | Plotly | Interactive financial charts and Streamlit support |
| Validation | Pydantic | Strict extraction and response contracts |
| Dataframes | Pandas | Simple integration with Plotly and financial data |
| PDF text | PyMuPDF | Fast page text, coordinates, and metadata |
| Difficult tables | pdfplumber | Selective table extraction fallback |
| OCR | PaddleOCR or Tesseract adapter | Scanned-page fallback; optional for MVP |
| Dense retrieval | Chroma local adapter | Persistence and metadata filtering with low setup |
| Lexical retrieval | BM25 local index | Exact clauses, article numbers, and financial terms |
| Fusion | Reciprocal Rank Fusion | Combines incomparable lexical and dense rankings |
| Embeddings | Provider abstraction; BGE-M3 candidate | Multilingual support, subject to Amharic evaluation and hardware |
| LLM | Provider abstraction with structured output | Avoids vendor lock-in |
| Application database | SQLite | Zero-infrastructure MVP metadata and audit storage |
| Files | Local private directory by checksum | Simple MVP provenance |
| Reports | python-docx; optional HTML-to-PDF adapter | Reliable DOCX baseline |
| Tests | pytest | Unit, integration, and evaluation tests |

No dependency version shall be assumed without testing the implementation environment and locking the final working set.

## 7.3 Production migration target

| MVP | Production target |
|---|---|
| Streamlit UI | React/Next.js or equivalent accessible web client |
| In-process services | FastAPI service layer and background workers |
| SQLite | PostgreSQL |
| Chroma local | pgvector, Qdrant, or managed hybrid retrieval after benchmark |
| Local files | Encrypted object storage |
| Session access | OIDC, role-based access, tenant isolation |
| Synchronous ingestion | Queued jobs with status and retries |
| Local audit | Central append-only audit and monitoring |

## 7.4 Logical components

1. **Streamlit Presentation**
   - Pages, forms, session state, tables, Plotly charts, citation expanders, downloads.
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
    - SQLite, Chroma, BM25 index, and file storage.
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
→ parent-child chunks
→ lexical index + dense index
→ retrieval evaluation
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
| Chunk | Retrievable clause or parent context | chunk ID, section, page, text, parent ID, embedding/index status |
| Citation | Evidence reference | source ID, chunk ID, page, section, quote |
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

Dense-only Chroma or FAISS retrieval is insufficient for exact article numbers, ticker symbols, thresholds, and defined legal terms. The MVP shall:

1. Apply hard metadata filters.
2. Run BM25 lexical retrieval.
3. Run multilingual dense retrieval.
4. Fuse results using RRF.
5. Optionally rerank a small candidate set.
6. Expand parent context and direct cross-references.
7. Return a bounded number of evidence chunks.

BGE-M3 is a reasonable candidate because it supports multilingual, dense, sparse, and multi-vector retrieval. It is not automatically approved for Amharic financial rules. A curated English/Amharic evaluation must determine whether it is acceptable. On low-resource machines, an embedding API or smaller multilingual model may be used behind the same provider interface.

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

The Streamlit application shall provide:

- Product title and current mode.
- Persistent source/data-status indicator.
- Sidebar navigation.
- Visible disclaimer.
- Current segment and document context.
- Loading and progress states for long operations.
- Expandable citations.
- Consistent status vocabulary.

## 10.2 Source Library page

- List active and retired official sources.
- Show authority, version, language, effective date, checksum, and index state.
- Admin-only upload and activation controls.
- Retrieval smoke-test action.

## 10.3 Document Review page

- File upload and document metadata.
- Page/extraction quality summary.
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

- Domain logic shall not be embedded directly in Streamlit page files.
- External providers shall use interfaces/adapters.
- Rules, prompts, and chart templates shall be version-controlled.
- Core services shall be testable without running Streamlit.
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
| User acceptance | Adviser completes issuer review and investor opens a company response |

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

- One Streamlit application.
- Python modular service layer in the same process.
- Local SQLite database.
- Local Chroma and BM25 indexes.
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
- Retrieved chunk IDs and scores.
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
| Small current ESX customer base | Limited early revenue | Prioritize repeat buyers such as listing advisers and investment banks |
| No confirmed public historical-price API | Missing real price charts | Use official facts, labelled synthetic demo fixtures, and future licensed data adapter |
| Conflicting or changing rules | Incorrect evaluation | Versioned rules, effective-date filters, human activation, conflict state |
| PDF table or OCR errors | Wrong financial facts | Evidence preview, confidence, user confirmation, table tests |
| LLM hallucination | False rule or company claim | Closed corpus, strict schemas, deterministic values, verification and abstention |
| Prompt injection in documents | Policy bypass or leakage | Treat content as data, scan, delimit, restrict tools, output verification |
| Weak Amharic retrieval | Missed evidence | Separate benchmark, hybrid retrieval, model comparison, do not launch unsupported claims |
| BGE-M3 resource cost | Slow local retrieval | Provider abstraction, smaller/API model option, cache embeddings |
| Streamlit rerun model | Repeated expensive work | Version-aware caching, session state, pure service layer |
| Overstated compliance | Legal and trust risk | Pre-review positioning, visible disclaimer, mandatory human sign-off |
| Same-model reviewer bias | Unsupported confidence | Programmatic checks first; independent human gold set |
| Sector-concentrated data | Misleading comparisons | Sector-specific analysis and no unsupported peer benchmark |
| Synthetic demo mistaken for real | Reputational harm | Persistent labels, separate records, screenshots/exports retain warning |

---

# 15. Delivery roadmap

## 15.1 Hackathon MVP

Must demonstrate:

1. Admin loads approved ESX/ECMA sources.
2. User selects Main or Growth Market.
3. User uploads one issuer document.
4. System extracts core facts with page evidence.
5. User confirms or corrects facts.
6. Rule engine returns inspectable requirement statuses.
7. Q&A returns exact, expandable citations.
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
14. The financial-domain reviewer signs off the demo rule set and gold cases.

---

# 17. Open production decisions

These decisions are intentionally not locked for the hackathon:

- Final LLM and embedding provider.
- Whether BGE-M3 meets Amharic retrieval targets on available hardware.
- Production vector database.
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

1. Streamlit Documentation: https://docs.streamlit.io/
2. Streamlit Plotly Chart API: https://docs.streamlit.io/develop/api-reference/charts/st.plotly_chart
3. Plotly Financial Charts: https://plotly.com/python/financial-charts/
4. BGE-M3 Model Documentation: https://huggingface.co/BAAI/bge-m3
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

