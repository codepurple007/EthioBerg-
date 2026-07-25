import { mockStore } from "@/lib/api/client";
import type {
  Company,
  CompanyExploreIntent,
  CompanyExploreRequest,
  CompanyExploreResponse,
  CompanyResolveResponse,
  DataStatus,
} from "@/lib/types";

const LIMITATION =
  "This response provides factual analysis and education only. It is not investment advice, a trading recommendation, or ECMA/ESX compliance certification.";

function resolve(query: string): CompanyResolveResponse {
  const normalized = query.trim().toLowerCase();
  const exact = mockStore.getCompanies().filter(
    (company) =>
      company.ticker.toLowerCase() === normalized ||
      company.officialName.toLowerCase() === normalized ||
      company.aliases.some((alias) => alias.toLowerCase() === normalized),
  );
  if (exact.length === 1) return { status: "RESOLVED", company: exact[0], candidates: [] };

  const partial = mockStore.getCompanies().filter(
    (company) =>
      company.officialName.toLowerCase().includes(normalized) ||
      company.aliases.some((alias) => alias.toLowerCase().includes(normalized)),
  );
  if (partial.length === 1) return { status: "RESOLVED", company: partial[0], candidates: [] };
  if (partial.length > 1) return { status: "AMBIGUOUS", candidates: partial };
  return { status: "NOT_FOUND", candidates: [] };
}

function syntheticPriceRows(seed: number, ticker: string) {
  let price = 700 + (ticker.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 250);
  const rows: Array<{ date: string; close: number; volume: number }> = [];
  let state = seed;
  for (let month = 1; month <= 7; month += 1) {
    state = (state * 9301 + 49297) % 233280;
    const delta = (state / 233280 - 0.5) * 40;
    price = Math.max(50, Math.round((price + delta) * 100) / 100);
    state = (state * 9301 + 49297) % 233280;
    const volume = 85000 + Math.floor((state / 233280) * 80000);
    rows.push({ date: `2026-${String(month).padStart(2, "0")}-28`, close: price, volume });
  }
  return rows;
}

function buildExplore(company: Company, intent: CompanyExploreIntent): CompanyExploreResponse {
  const asOf = new Date().toISOString();
  const settings = mockStore.getSettings();

  if (intent === "company_price_history") {
    if (!settings.syntheticDemoEnabled) {
      return {
        responseId: `mock-${company.id}-price`,
        intent,
        company,
        asOf,
        dataStatus: "UNAVAILABLE",
        summaryFacts: [
          `${company.officialName} (${company.ticker}) is listed on the ${company.segment} Market.`,
          "Verified historical ESX price and volume feeds are not connected in mock mode.",
        ],
        metrics: [
          { label: "Listing date", value: company.listingDate, unit: "date", dataStatus: "OFFICIAL" },
          { label: "Market segment", value: company.segment, unit: "segment", dataStatus: "OFFICIAL" },
        ],
        visualizations: [],
        requirements: [],
        citations: [company.sourceId],
        warnings: ["Enable synthetic demo mode in Admin Settings to preview demo price charts."],
        verificationStatus: "PASSED",
        limitationNotice: LIMITATION,
      };
    }

    const fixtureId = `syn-price-v1-${company.ticker.toLowerCase()}`;
    const seed = 12000 + company.id.charCodeAt(1);
    const rows = syntheticPriceRows(seed, company.ticker);
    const dataStatus: DataStatus = "SYNTHETIC_DEMO";
    return {
      responseId: `mock-${company.id}-price`,
      intent,
      company,
      asOf,
      dataStatus,
      summaryFacts: [
        `${company.officialName} demo price history uses fixture ${fixtureId}.`,
        `Latest synthetic close: ETB ${rows.at(-1)?.close.toLocaleString()} on ${rows.at(-1)?.date}.`,
      ],
      metrics: [
        {
          label: "Latest synthetic close",
          value: String(rows.at(-1)?.close ?? 0),
          unit: "ETB",
          dataStatus,
        },
        {
          label: "Latest synthetic volume",
          value: String(rows.at(-1)?.volume ?? 0),
          unit: "shares",
          dataStatus,
        },
      ],
      visualizations: [
        {
          templateId: "PRICE_VOLUME_V1",
          title: `${company.officialName} closing price and volume`,
          subtitle: "Synthetic demo data — not ESX market data.",
          period: { start: rows[0].date, end: rows.at(-1)!.date },
          dataStatus,
          fixtureId,
          series: [
            {
              key: "close",
              label: "Closing price",
              unit: "ETB",
              dataStatus,
              fixtureId,
              points: rows.map((row) => ({ date: row.date, value: row.close, dataStatus })),
            },
            {
              key: "volume",
              label: "Volume",
              unit: "shares",
              dataStatus,
              fixtureId,
              points: rows.map((row) => ({ date: row.date, value: row.volume, dataStatus })),
            },
          ],
          sourceRefs: [fixtureId, company.sourceId],
          caveats: ["Synthetic demo data — not ESX market data."],
          tableRows: rows.flatMap((row) => [
            {
              date: row.date,
              measure: "Closing price",
              value: row.close,
              unit: "ETB",
              dataStatus,
            },
            {
              date: row.date,
              measure: "Volume",
              value: row.volume,
              unit: "shares",
              dataStatus,
            },
          ]),
        },
      ],
      requirements: [],
      citations: [company.sourceId, fixtureId],
      warnings: ["Synthetic demo data — not ESX market data."],
      verificationStatus: "PASSED",
      limitationNotice: LIMITATION,
    };
  }

  if (intent === "company_financial_trend") {
    const base = company.sector === "Telecommunications" ? 92 : 20 + company.id.charCodeAt(1);
    const periods = ["FY2023", "FY2024", "FY2025"];
    const rows = periods.map((period, index) => ({
      period,
      revenue: base + index * 3.2,
      netProfit: base * 0.32 + index * 0.8,
    }));
    return {
      responseId: `mock-${company.id}-fin`,
      intent,
      company,
      asOf,
      dataStatus: "ISSUER_REPORTED",
      summaryFacts: [
        `${company.officialName} revenue reached ETB ${rows.at(-1)?.revenue.toFixed(1)} million in ${rows.at(-1)?.period}.`,
      ],
      metrics: [
        {
          label: "Latest revenue",
          value: rows.at(-1)!.revenue.toFixed(1),
          unit: "ETB millions",
          dataStatus: "ISSUER_REPORTED",
        },
        {
          label: "Latest net profit",
          value: rows.at(-1)!.netProfit.toFixed(1),
          unit: "ETB millions",
          dataStatus: "ISSUER_REPORTED",
        },
      ],
      visualizations: [
        {
          templateId: "FINANCIAL_TREND_V1",
          title: `${company.officialName} revenue and net profit`,
          subtitle: "Issuer-reported fixture data — demo education only",
          period: { start: rows[0].period, end: rows.at(-1)!.period },
          dataStatus: "ISSUER_REPORTED",
          fixtureId: `fix-fin-${company.id}`,
          series: [
            {
              key: "revenue",
              label: "Revenue",
              unit: "ETB millions",
              dataStatus: "ISSUER_REPORTED",
              points: rows.map((row) => ({
                period: row.period,
                value: row.revenue,
                dataStatus: "ISSUER_REPORTED" as DataStatus,
              })),
            },
            {
              key: "net_profit",
              label: "Net profit",
              unit: "ETB millions",
              dataStatus: "ISSUER_REPORTED",
              points: rows.map((row) => ({
                period: row.period,
                value: row.netProfit,
                dataStatus: "ISSUER_REPORTED" as DataStatus,
              })),
            },
          ],
          sourceRefs: [company.sourceId, `fix-fin-${company.id}`],
          caveats: ["Issuer-reported fixture data — demo education only."],
          tableRows: rows.flatMap((row) => [
            {
              period: row.period,
              measure: "Revenue",
              value: row.revenue,
              unit: "ETB millions",
              dataStatus: "ISSUER_REPORTED" as DataStatus,
            },
            {
              period: row.period,
              measure: "Net profit",
              value: row.netProfit,
              unit: "ETB millions",
              dataStatus: "ISSUER_REPORTED" as DataStatus,
            },
          ]),
        },
      ],
      requirements: [],
      citations: [company.sourceId],
      warnings: ["Issuer-reported fixture data — not live market pricing."],
      verificationStatus: "PASSED",
      limitationNotice: LIMITATION,
    };
  }

  const freeFloat = company.id === "c4" ? 14 : 17;
  const requirements = mockStore
    .getRules(company.segment)
    .filter((rule) => rule.reviewStatus === "APPROVED")
    .map((rule) => {
      let state: "MET" | "NOT_MET" = "MET";
      if (rule.field === "free_float_pct" && freeFloat < rule.threshold) state = "NOT_MET";
      return {
        ruleId: rule.ruleId,
        ruleName: rule.name,
        state,
        factValue: rule.field === "free_float_pct" ? freeFloat : rule.threshold + 1,
        threshold: `≥ ${rule.threshold} ${rule.unit}`,
        category: "General",
        sourceSection: rule.sourceSection,
      };
    });

  const summary = requirements.reduce<Record<string, number>>((acc, row) => {
    acc[row.state] = (acc[row.state] ?? 0) + 1;
    return acc;
  }, {});

  return {
    responseId: `mock-${company.id}-ready`,
    intent,
    company,
    asOf,
    dataStatus: "ISSUER_REPORTED",
    summaryFacts: [
      `${company.officialName} illustrative readiness review covers ${requirements.length} requirements.`,
      `${summary.MET ?? 0} requirements are currently marked MET using fixture facts.`,
    ],
    metrics: [
      {
        label: "Requirements MET",
        value: String(summary.MET ?? 0),
        unit: "count",
        dataStatus: "ISSUER_REPORTED",
      },
      {
        label: "Requirements NOT MET",
        value: String(summary.NOT_MET ?? 0),
        unit: "count",
        dataStatus: "ISSUER_REPORTED",
      },
    ],
    visualizations: [
      {
        templateId: "READINESS_CATEGORY_V1",
        title: `${company.officialName} listing readiness by category`,
        subtitle: "Illustrative readiness view from labelled fixture facts",
        period: { start: company.listingDate, end: asOf.slice(0, 10) },
        dataStatus: "ISSUER_REPORTED",
        fixtureId: `fix-readiness-${company.id}`,
        series: [
          {
            key: "General",
            label: "General",
            unit: "requirements",
            dataStatus: "ISSUER_REPORTED",
            points: Object.entries(summary).map(([period, value]) => ({
              period,
              value,
              dataStatus: "ISSUER_REPORTED" as DataStatus,
            })),
          },
        ],
        sourceRefs: [company.sourceId, "src-esx-rulebook"],
        caveats: ["Pre-review only — not ECMA or ESX approval."],
        tableRows: [],
      },
    ],
    requirements,
    citations: [company.sourceId, "src-esx-rulebook"],
    warnings: ["Pre-review only — not ECMA or ESX approval."],
    verificationStatus: "PASSED",
    limitationNotice: LIMITATION,
  };
}

export function resolveMockCompany(query: string): CompanyResolveResponse {
  return resolve(query);
}

export function exploreMockCompany(payload: CompanyExploreRequest): CompanyExploreResponse {
  let company: Company | undefined;
  if (payload.companyId) {
    company = mockStore.getCompany(payload.companyId);
  } else if (payload.query) {
    const resolution = resolve(payload.query);
    if (resolution.status === "AMBIGUOUS") {
      throw new Error(`Ambiguous company query. Candidates: ${resolution.candidates.map((c) => c.ticker).join(", ")}`);
    }
    company = resolution.company;
  }
  if (!company) throw new Error("Company not found in the ESX registry.");
  return buildExplore(company, payload.intent);
}
