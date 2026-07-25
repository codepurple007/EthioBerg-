"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Loader2, MessageSquareQuote } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useEthioApi } from "@/providers/ApiProvider";
import type {
  MarketSegment,
  RegulatoryAskRequest,
  RegulatoryAskResponse,
  RegulatoryCorpusStats,
} from "@/lib/types";

const sampleQuestions = [
  "What does Article 135 prohibit?",
  "What is the Main Market minimum market capitalization?",
  "What public float is required on the Main Market?",
  "What are the public offering requirements under ECMA?",
];

export default function RegulatoryQaPanel() {
  const { api, mode } = useEthioApi();
  const [question, setQuestion] = useState("");
  const [segment, setSegment] = useState<MarketSegment | "">("");
  const [language, setLanguage] = useState<"" | "en" | "am">("");
  const [effectiveAsOf, setEffectiveAsOf] = useState("");
  const [stats, setStats] = useState<RegulatoryCorpusStats | null>(null);
  const [response, setResponse] = useState<RegulatoryAskResponse | null>(null);
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .getRegulatoryCorpusStats()
      .then((value) => {
        if (active) setStats(value);
      })
      .catch(() => {
        if (active) setStats(null);
      });
    return () => {
      active = false;
    };
  }, [api]);

  async function handleAsk(event?: React.FormEvent) {
    event?.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      setError("Enter a regulatory question.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);
    setExpandedCitation(null);

    const payload: RegulatoryAskRequest = { question: trimmed };
    if (segment) payload.segment = segment;
    if (language) payload.language = language;
    if (effectiveAsOf) payload.effectiveAsOf = effectiveAsOf;

    try {
      const result = await api.askRegulatoryQuestion(payload);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not retrieve an answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Regulatory Q&A"
        breadcrumbs={[
          { label: "EthioBerg", href: "/dashboard" },
          { label: "Regulatory Q&A" },
        ]}
      />

      <div className="mb-4 rounded border border-[#e9ebec] bg-white px-4 py-3 text-[13px] text-[#495057]">
        Ask questions over the closed ECMA/ESX corpus. Answers include verifiable citations or
        explicit abstention when official evidence is insufficient.{" "}
        <span className="text-[#878a99]">
          API mode: {mode === "remote" ? "Python backend" : "local mock"}.
        </span>
      </div>

      {stats ? (
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-[#e9ebec] bg-white px-4 py-3">
            <p className="m-0 text-[11px] uppercase tracking-wide text-[#878a99]">Corpus chunks</p>
            <p className="m-0 mt-1 text-xl font-semibold text-[#405189]">{stats.chunkCount}</p>
          </div>
          <div className="rounded border border-[#e9ebec] bg-white px-4 py-3">
            <p className="m-0 text-[11px] uppercase tracking-wide text-[#878a99]">Sources</p>
            <p className="m-0 mt-1 text-xl font-semibold text-[#405189]">{stats.sourceCount}</p>
          </div>
          <div className="rounded border border-[#e9ebec] bg-white px-4 py-3">
            <p className="m-0 text-[11px] uppercase tracking-wide text-[#878a99]">Retrieval</p>
            <p className="m-0 mt-1 text-[13px] font-medium text-[#495057]">{stats.retrievalMode}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form className="card" onSubmit={handleAsk}>
          <div className="card-header flex items-center gap-2">
            <MessageSquareQuote size={16} className="text-[#405189]" />
            <h5 className="card-title m-0">Ask a question</h5>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label htmlFor="regulatory-question" className="mb-1 block text-[12px] font-medium text-[#495057]">
                Question
              </label>
              <textarea
                id="regulatory-question"
                rows={4}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="e.g. What does Article 135 prohibit?"
                className="w-full rounded border border-[#ced4da] px-3 py-2 text-[13px] text-[#495057] outline-none focus:border-[#405189]"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="segment-filter" className="mb-1 block text-[12px] font-medium text-[#495057]">
                  Segment (optional)
                </label>
                <select
                  id="segment-filter"
                  value={segment}
                  onChange={(event) => setSegment(event.target.value as MarketSegment | "")}
                  className="w-full rounded border border-[#ced4da] px-3 py-2 text-[13px] text-[#495057]"
                >
                  <option value="">Any segment</option>
                  <option value="MAIN">Main Market</option>
                  <option value="GROWTH">Growth Market</option>
                </select>
              </div>
              <div>
                <label htmlFor="language-filter" className="mb-1 block text-[12px] font-medium text-[#495057]">
                  Language
                </label>
                <select
                  id="language-filter"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as "" | "en" | "am")}
                  className="w-full rounded border border-[#ced4da] px-3 py-2 text-[13px] text-[#495057]"
                >
                  <option value="">Any language</option>
                  <option value="en">English</option>
                  <option value="am">Amharic</option>
                </select>
              </div>
              <div>
                <label htmlFor="effective-date" className="mb-1 block text-[12px] font-medium text-[#495057]">
                  Effective as of
                </label>
                <input
                  id="effective-date"
                  type="date"
                  value={effectiveAsOf}
                  onChange={(event) => setEffectiveAsOf(event.target.value)}
                  className="w-full rounded border border-[#ced4da] px-3 py-2 text-[13px] text-[#495057]"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded border border-[#f06548]/30 bg-[#fff5f3] px-3 py-2 text-[13px] text-[#c03221]">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded bg-[#405189] px-4 py-2 text-[13px] font-medium text-white disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {loading ? "Searching corpus…" : "Ask question"}
            </button>
          </div>
        </form>

        <div className="card h-fit">
          <div className="card-header">
            <h5 className="card-title m-0">Sample questions</h5>
          </div>
          <div className="card-body space-y-2">
            {sampleQuestions.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setQuestion(sample)}
                className="block w-full rounded border border-[#e9ebec] px-3 py-2 text-left text-[12px] text-[#495057] hover:border-[#405189] hover:text-[#405189]"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {response ? (
        <div className="mt-4 card">
          <div className="card-header flex flex-wrap items-center justify-between gap-2">
            <h5 className="card-title m-0">Response</h5>
            <span
              className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase ${
                response.status === "ANSWERED"
                  ? "bg-[#daf4f0] text-[#0ab39c]"
                  : "bg-[#fff3cd] text-[#856404]"
              }`}
            >
              {response.status === "ANSWERED" ? "Answered with citations" : "Abstained"}
            </span>
          </div>
          <div className="card-body space-y-4">
            {response.status === "ABSTAINED" ? (
              <div className="flex gap-3 rounded border border-[#f7b84b]/40 bg-[#fff8e6] px-4 py-3 text-[13px] text-[#856404]">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="m-0 font-semibold">Insufficient official evidence</p>
                  <p className="m-0 mt-1">
                    {response.limitations[0] ??
                      "The system could not verify an answer from the active regulatory corpus."}
                  </p>
                </div>
              </div>
            ) : (
              <p className="m-0 text-[13px] leading-relaxed text-[#495057]">{response.answer}</p>
            )}

            {response.citations.length > 0 ? (
              <div>
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#878a99]">
                  Citations ({response.citations.length})
                </p>
                <div className="space-y-2">
                  {response.citations.map((citation) => {
                    const open = expandedCitation === citation.id;
                    return (
                      <div key={citation.id} className="rounded border border-[#e9ebec] bg-[#f8f9fa]">
                        <button
                          type="button"
                          onClick={() => setExpandedCitation(open ? null : citation.id)}
                          className="flex w-full items-start justify-between gap-3 px-3 py-2 text-left"
                        >
                          <div>
                            <p className="m-0 text-[13px] font-medium text-[#405189]">{citation.section}</p>
                            <p className="m-0 text-[11px] text-[#878a99]">
                              {citation.sourceTitle}
                              {citation.page ? ` · p. ${citation.page}` : ""}
                            </p>
                          </div>
                          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {open ? (
                          <div className="border-t border-[#e9ebec] px-3 py-2 text-[12px] leading-relaxed text-[#495057]">
                            {citation.quote}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {response.limitations.length > (response.status === "ABSTAINED" ? 1 : 0) ? (
              <div className="rounded border border-[#e9ebec] bg-white px-3 py-2 text-[12px] text-[#878a99]">
                <p className="m-0 font-medium text-[#495057]">Limitations</p>
                <ul className="mb-0 mt-1 list-disc pl-4">
                  {response.limitations.slice(response.status === "ABSTAINED" ? 1 : 0).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
