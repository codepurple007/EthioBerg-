# EthioBerg — Lean Bootstrap Budget

**The minimum capital needed to solve the core problem: getting clean, verified information to Ethiopian brokers**

| Field | Value |
|---|---|
| Document type | Lean startup budget |
| Version | 1.0 |
| Supersedes for planning purposes | `EthioBerg_Financial_Plan_v1.md` (that document is the *funded* scenario — use it when raising money, not when spending it) |
| Date | 26 July 2026 |
| Currency | ETB; USD at 1 USD = 161 ETB |

---

# 1. The one-page answer

| Question | Answer |
|---|---|
| **Initial capital needed** | **220,000 ETB ≈ USD 1,370** (12 months) |
| Absolute survival floor | 140,000 ETB ≈ USD 870 (10 months) |
| Monthly burn while building (Months 1–4) | **9,000 ETB ≈ USD 56** |
| Monthly burn during the free pilot (Months 5–10) | **15,000 ETB ≈ USD 93** |
| Real infrastructure + AI cost per month | **≈ USD 21** |
| **Customers needed to break even** | **ONE, at 15,000 ETB/month** |
| Peak cash deficit (no project revenue at all) | −123,300 ETB at Month 10 |
| Peak cash deficit (one paid engagement at Month 8) | −70,300 ETB at Month 7 |
| Cost of the 6-month free pilot | **90,000 ETB ≈ USD 560** |

The previous plan asked for 5.5 million ETB. **This one asks for 220,000 ETB — a 96% reduction.** Nothing about the product gets worse. What changes is that you stop paying salaries, rent and enterprise pricing before you have a single customer.

---

# 2. Why the first plan was 25× too expensive

| Cost line | Funded plan | Lean plan | How |
|---|---|---|---|
| Salaries | 167,100 ETB/mo | **0** | Founders work for equity until revenue exists |
| Office | 30,000 ETB/mo | **0** | Work from home. Meet clients at their offices — they have better ones. |
| Enterprise internet | 6,420 ETB/mo | 1,760 ETB/mo | Home fibre 20 Mbps. Five users do not need an enterprise circuit. |
| Cloud + database + storage | 15,295 ETB/mo | 1,770 ETB/mo | One €6.80 Hetzner server runs everything |
| LLM API | 40,250 ETB/mo | 2,420 ETB/mo | Cheap models + caching + a static corpus (Section 5) |
| SaaS tools | 22,120 ETB/mo | **0** | Free tiers cover every tool you need at this size |
| Laptops | 390,000 ETB | **0** | Use the machines you already own |
| Legal package | 120,000 ETB | 15,000 ETB | One lawyer hour to review templates, at Month 7 |
| Company registration | 75,000 ETB | 8,000 ETB | Sole proprietorship first, PLC later (Section 8) |
| Marketing | 25,000 ETB/mo | 3,000 ETB/mo | There are 21 buyers. You phone them. |
| **Total monthly** | **380,000 ETB** | **15,000 ETB** | |

Every line removed is a line you can add back the month it becomes affordable. Section 12 gives the exact triggers.

---

# 3. Narrow the product to the one problem

You said the core problem is **giving information**. Then build exactly that and nothing else.

## 3.1 The smallest sellable thing

There are **five listed companies** on ESX. Cleaning their data is not a big-data problem — it is a 15-minute-a-day problem.

**Version 0 — deliver it by hand (Month 1, cost: 0 ETB)**

An Excel or PDF sheet, emailed every trading day, containing:

- Clean OHLC, volume, trades and turnover for all five securities.
- Week-to-date and month-to-date changes, calculated correctly.
- Corporate actions, disclosures and listing news, dated and sourced.
- Issuer fundamentals extracted from prospectuses and annual reports.
- A source reference on every single number.

This is the concierge MVP. It requires no servers, no AI and no code. It proves whether brokers value clean data **before** you spend a birr building software. If nobody opens the email, you have learned the most important thing in this project for free.

**Version 1 — the dashboard (Months 2–5)**

The same content behind a login, plus CSV export and simple charts. One server. No API yet.

**Version 2 — the API and the compliance engine (Month 8+)**

Only after firms are paying for Version 1.

## 3.2 What this means for your build order

| Build now | Build later | Do not build |
|---|---|---|
| Data schema with `source_id`, `as_of`, `data_status` | Regulatory Q&A with RAG | Multi-tenancy |
| Daily data pipeline for 5 securities | Listing-readiness rule engine | Amharic retrieval |
| Issuer fundamentals extraction | REST API | OCR pipeline |
| Simple dashboard + CSV export | DOCX report export | Real-time anything |
| Login and one admin screen | Chart template registry | Mobile app |

The SRS remains the destination. This is the order you walk to it in.

---

# 4. The actual technology bill

Everything below is a real, current price, verified July 2026.

| Item | Product | Cost/month |
|---|---|---|
| Application server | Hetzner CX32 — 4 vCPU, 8 GB RAM, 80 GB disk, 20 TB traffic | €6.80 ≈ USD 8 ≈ **1,290 ETB** |
| Database | PostgreSQL **on the same server** | 0 |
| Vector + lexical index | Chroma + BM25 **on the same server** | 0 |
| Backups | Hetzner automated backups (20% of server cost) | USD 1.6 ≈ **260 ETB** |
| Object storage | Server disk is enough at this scale | 0 |
| LLM API | DeepSeek V4 Flash ($0.14/$0.28 per M tokens) or Gemini 2.5 Flash-Lite ($0.10/$0.40) | USD 8–15 ≈ **1,300–2,420 ETB** |
| Embeddings | Run a small multilingual model on the same server, or Gemini free tier | 0 |
| Domain (.com) | ≈ USD 14/year | ≈ **190 ETB** |
| Email | Cloudflare Email Routing or Zoho Mail free tier | 0 |
| Code hosting + CI | GitHub Free (unlimited private repos, 2,000 CI minutes) | 0 |
| Error tracking | Sentry Developer free tier (5k events/mo) | 0 |
| Uptime monitoring | UptimeRobot free tier | 0 |
| DNS, TLS, CDN, DDoS | Cloudflare Free | 0 |
| Design | Figma free tier + an off-the-shelf Tailwind template | 0 |
| **Total** | | **≈ USD 21 ≈ 3,400 ETB/month** |

**Backup option if even that is too much:** Oracle Cloud Always Free gives 2 ARM cores and 12 GB RAM permanently at zero cost (reduced from 4/24 in June 2026, but still more than enough for 20 users). Use it as the free fallback or as your staging environment. Hetzner is worth the USD 8 for reliability and simplicity.

**Do not use:** managed Postgres, managed vector databases, Kubernetes, serverless functions, or separate staging infrastructure. At 20 users these cost 10× more and solve problems you do not have.

---

# 5. What AI actually costs at your scale

This is where the first plan was most wrong. I budgeted USD 250/month for LLM calls. Here is the arithmetic at your real volume.

| Workload | Token estimate | Model | Cost |
|---|---|---|---|
| Ingest the entire regulatory corpus (≈10 documents, ≈1,500 pages) — **one time** | 1.1M input, 200k output | Flash-Lite | **≈ USD 0.19** |
| Extract structured facts from one 200-page prospectus | 300k input, 30k output | Flash-Lite | **≈ USD 0.04** |
| Answer one regulatory question (retrieval keeps context to ~8k tokens) | 8k input, 800 output | Flash-Lite | **≈ USD 0.001** |
| 5 pilot firms × 100 questions each per month | 500 questions | Flash-Lite | **≈ USD 0.55** |
| 20 issuer documents processed per month | | Flash-Lite | **≈ USD 0.80** |
| **Realistic monthly total during the pilot** | | | **≈ USD 2** |

Budget USD 10–15/month anyway, for development, retries, failed extractions and experimentation. But understand the shape of it: **your AI cost is not a scaling problem, it is a rounding error.**

Three design choices in the SRS are what make this true — protect them:

1. **The corpus is closed and static.** You process each regulatory document once, ever, not once per query.
2. **Deterministic rules do the arithmetic.** No LLM is asked to compute anything, so no expensive reasoning model is required.
3. **Retrieval bounds the context.** You send 8k tokens, not a 200-page document, into every question.

Also enable **prompt caching** (roughly 90% off repeated input on DeepSeek) — your system prompt and policy layer are identical on every call.

---

# 6. Initial capital — three options

## 6.1 One-time costs (and when to pay them)

| Item | When | ETB |
|---|---|---|
| Domain registration (.com, 1 year) | Month 0 | 2,300 |
| Small UPS (600 VA) to protect your laptop and router through outages | Month 0 | 12,000 |
| Sole proprietorship registration: trade name, TIN, trade licence | Month 8 (not before) | 8,000 |
| Lawyer review of your subscription contract and pilot agreement | Month 7 | 15,000 |
| **Total one-time** | | **37,300** |

Notice that only 14,300 ETB is needed in Month 0. Everything else is deferred until you have a customer in sight.

## 6.2 The three budgets

| | **A — Survival** | **B — Recommended** | **C — Comfortable** |
|---|---:|---:|---:|
| Runway | 10 months | 12 months | 12 months |
| One-time costs | 10,300 | 37,300 | 227,300 |
| Months 1–4 @ 9,000 | 36,000 | 36,000 | 36,000 |
| Months 5–10 @ 15,000 | 90,000 | 90,000 | 90,000 |
| Months 11–12 @ 18,000 | — | 36,000 | 36,000 |
| Buffer | 4,000 | 29,000 | 60,000 |
| Small founder stipend (M7–12) | — | — | 90,000 |
| **Total ETB** | **140,300** | **228,300** | **539,300** |
| **Total USD** | **871** | **1,418** | **3,350** |
| What you give up | No UPS, no lawyer review, no margin for error | Nothing important | — |
| What you gain | — | Legal safety and two extra months | A spare laptop, PLC status, a small salary |

**Take Option B: 220,000 ETB ≈ USD 1,370.**

Round it to 220,000 and hold the change as buffer. If you can raise 250,000, do — but do not delay starting in order to raise more. At this burn rate, three months of fundraising costs you more than the money is worth.

## 6.3 Where 220,000 ETB comes from

You do not need investors for this amount. Ranked by speed:

| Source | Realistic | Effort |
|---|---|---|
| Personal savings / founder contributions (2 founders × 110,000) | 220,000 | Immediate |
| **One paid consulting project** — a compliance or data engagement for any firm in the ecosystem | 150,000–300,000 | 4–8 weeks |
| Pilot onboarding fees (4 firms × 10,000) | 40,000 | Month 5 |
| Family / friends note | 100,000–300,000 | 2–4 weeks |
| Cloud & AI startup credits (in kind) | USD 1,000–25,000 | Application only |
| Local competitions, hackathon prizes, incubator stipends | 50,000–200,000 | Variable |

**A single paid consulting engagement funds this entire business for a year.** That is the fastest path and it costs you no equity.

---

# 7. Monthly burn in detail

## Phase 0 — Build (Months 1–4)

| Item | ETB/month |
|---|---|
| Server + backups | 1,550 |
| LLM API (development and testing) | 1,290 |
| Domain, email (amortised) | 190 |
| Home internet, 20 Mbps fibre | 1,760 |
| Transport, client meetings, printing | 3,000 |
| Contingency | 1,200 |
| **Total** | **9,000** (≈ USD 56) |

## Phase 1 — Free pilot with 3–5 firms (Months 5–10)

| Item | ETB/month |
|---|---|
| Server + backups + storage | 1,770 |
| LLM API (real pilot usage) | 2,420 |
| Domain, email | 320 |
| Home internet | 1,760 |
| Transport, client meetings (more frequent) | 5,000 |
| Bookkeeping (part-time, monthly) | 2,000 |
| Contingency | 1,730 |
| **Total** | **15,000** (≈ USD 93) |

## Phase 2 — First paying customers (Months 11–12)

Add roughly 3,000 ETB/month for a larger server and higher API usage. **Total ≈ 18,000 ETB.**

No hires. No office. No salary until Section 12's triggers are met.

---

# 8. Legal structure — start as a sole proprietorship

Registering a PLC costs roughly 75,000 ETB once you include the capital deposit, VAT registration and the ERCA-approved cash register machine. You do not need any of it in year one.

| | Sole proprietorship | PLC |
|---|---|---|
| Registration cost | ≈ 8,000 ETB | ≈ 75,000 ETB all-in |
| Minimum capital | None | 15,000 ETB deposited |
| Tax regime | Turnover tax (2%) below the VAT threshold | VAT (15%) + cash register machine |
| Shareholders | You alone | Minimum 2 |
| Liability | Unlimited — the real downside | Limited |
| Can invoice corporate clients | Yes | Yes |
| Time to register | Days | 2–4 weeks |

**Recommendation:** register a sole proprietorship at Month 8, when a client is ready to pay. Convert to a PLC when annual turnover approaches 2 million ETB or when you take outside investment — whichever comes first. Confirm the VAT-versus-turnover-tax treatment with a tax adviser before you register; the rules for PLCs specifically are stricter than for sole proprietors.

**Do not register anything in Month 0.** A registered business with no revenue accrues filing obligations, annual renewal fees and penalties for late returns. Register when you need to issue an invoice, not before.

---

# 9. Redesign the free period for a small user count

Twelve pilot firms was the right number for a funded plan. With no staff, **twelve pilots will drown you.** Each pilot firm consumes 3–5 hours a week in support, feedback calls and data corrections.

## 9.1 Revised pilot design

| Parameter | Funded plan | **Lean plan** |
|---|---|---|
| Pilot firms | 12 | **3–5** |
| Selection | Anyone licensed | **The 3 investment banks most likely to pay** — bank subsidiaries with real budgets |
| Onboarding fee | 25,000 ETB | **10,000 ETB** (lower friction, same signal) |
| Free duration | 6 months | 6 months, or 3 months free + 3 at half price |
| Support commitment | Full | **One 30-minute call per week per firm — scheduled, not on demand** |
| Paid from day one | — | **Listing-readiness engagements (P3) are never free** |

Three engaged pilot firms that talk to you every week are worth more than twelve who ignore your emails. You are looking for signal, not logos.

## 9.2 What the free period costs you now

| | Funded plan | Lean plan |
|---|---|---|
| Six months of operating cost | 2,325,000 ETB | **90,000 ETB** |
| Less onboarding fees | −300,000 | −40,000 (4 × 10,000) |
| **Net cost of giving the product away for 6 months** | 2,025,000 ETB | **50,000 ETB ≈ USD 310** |

This is the whole point of the lean structure. When your burn is 15,000 ETB a month, a six-month free programme is not a strategic gamble — it is a rounding error you can comfortably afford.

## 9.3 Simplified pricing

Add a low entry tier. Unproven products in small markets need a price a manager can approve without a committee.

| Tier | Contents | ETB/month |
|---|---|---|
| **Starter** | Daily clean data sheet by email, CSV export | **5,000** |
| **Essentials** | Dashboard, full history, all export formats, 2 seats | **15,000** |
| **Professional** | + API access, regulatory Q&A, 5 seats | **35,000** |
| Listing Readiness engagement | Per issuer, per segment | 150,000 one-off |

Founding pilot firms get 30% off these prices for life.

---

# 10. Break-even is one customer

| Scenario | Monthly revenue | Monthly cost | Result |
|---|---|---|---|
| 1 × Starter | 5,000 | 15,000 | −10,000 |
| **1 × Essentials** | **15,000** | **15,000** | **Break-even** |
| 2 × Essentials | 30,000 | 16,000 | +14,000 |
| 1 Professional + 2 Essentials | 65,000 | 18,000 | **+47,000** |
| Plus one P3 engagement per quarter | +50,000/mo avg | 18,000 | **+97,000** |

**One listing-readiness engagement at 150,000 ETB pays for ten months of operations.**

This reframes the whole risk profile. You are not trying to raise capital to survive until scale. You are trying to find one customer, which in a market of 21 named firms is a matter of phone calls, not funding.

---

# 11. 12-month lean cash flow

Two cases. Neither assumes anything you cannot control.

## Case 1 — Conservative: no project revenue at all

| Month | Revenue | Cost | Net | Cumulative |
|---|---:|---:|---:|---:|
| 0 | 0 | 14,300 | −14,300 | −14,300 |
| 1–4 | 0 | 9,000/mo | −36,000 | −50,300 |
| 5 | 40,000 (4 onboarding fees) | 15,000 | +25,000 | −25,300 |
| 6 | 0 | 15,000 | −15,000 | −40,300 |
| 7 | 0 | 30,000 (incl. lawyer) | −30,000 | −70,300 |
| 8 | 0 | 23,000 (incl. registration) | −23,000 | −93,300 |
| 9 | 0 | 15,000 | −15,000 | −108,300 |
| 10 | 0 | 15,000 | −15,000 | **−123,300** ← trough |
| 11 | 45,000 (3 firms convert) | 18,000 | +27,000 | −96,300 |
| 12 | 60,000 (4 firms) | 18,000 | +42,000 | −54,300 |
| 13 | 75,000 (5 firms) | 20,000 | +55,000 | **+700** ← payback |

Peak capital at risk: **123,300 ETB**. Payback: Month 13. Your 220,000 ETB budget covers this with 97,000 ETB to spare.

## Case 2 — Realistic: one paid engagement at Month 8

| Month | Revenue | Cost | Net | Cumulative |
|---|---:|---:|---:|---:|
| 0–7 | 40,000 | 110,300 | −70,300 | **−70,300** ← trough |
| 8 | 150,000 (one P3) | 23,000 | +127,000 | +56,700 |
| 9–10 | 0 | 30,000 | −30,000 | +26,700 |
| 11 | 45,000 | 18,000 | +27,000 | +53,700 |
| 12 | 210,000 (4 firms + one P3) | 18,000 | +192,000 | **+245,700** |

Peak capital at risk: **70,300 ETB**. You are cash positive from Month 8 and have repaid the founders by Month 12.

---

# 12. The spending ladder — what to add, and exactly when

Never add a cost before its trigger. Write these triggers down and hold yourself to them.

| Trigger (recurring monthly revenue) | Unlock |
|---|---|
| **0** | Nothing. 15,000 ETB/month total. Founders unpaid. |
| **30,000 ETB** | Founder stipend of 10,000 ETB. Upgrade to Hetzner CX42 if needed. |
| **60,000 ETB** | First part-time hire: a data analyst at 15,000 ETB to run the daily pipeline. Google Workspace. |
| **100,000 ETB** | Convert to a PLC. Founder salary to 25,000 ETB. Paid monitoring and proper backups. |
| **150,000 ETB** | First full-time engineer (45,000 ETB). Separate staging environment. |
| **250,000 ETB** | Co-working desks. Second engineer. Independent security review before Enterprise contracts. |
| **400,000 ETB** | You have arrived at the team structure in `EthioBerg_Financial_Plan_v1.md` §6.3 — and you funded it from revenue instead of equity. |

## What not to buy, and why

| Do not buy | Why | Buy it when |
|---|---|---|
| New laptops (390,000 ETB) | Your current machines compile Python fine | One breaks |
| Office space (30,000/mo) | Five clients, all of whom have offices you can visit | You have three employees |
| Enterprise internet (6,420/mo) | Home fibre serves 20 users comfortably | Uptime SLAs are contractual |
| Managed database (4,830/mo) | Postgres on your existing server, with automated backups | Data exceeds one server |
| Premium LLM models | Flash-Lite handles extraction and grounded Q&A; you removed arithmetic from the model already | A measured quality failure, not a hunch |
| Paid marketing (25,000/mo) | There are 21 buyers. Call them. | You expand beyond Ethiopia |
| Penetration test (100,000) | No client requires it yet | The first Enterprise contract requires it |
| PLC registration (75,000) | Sole proprietorship invoices work fine | Turnover nears 2M ETB or you take investment |
| Designer / custom UI | A Tailwind template looks better than most Ethiopian fintech products | You have paying users complaining about UX |

---

# 13. The risks this budget creates — and how to hold them

Cutting to 220,000 ETB is not free. Three honest costs:

| Risk | Consequence | Mitigation |
|---|---|---|
| **Founder burnout** | Unpaid work for 10 months while doing sales, support and engineering | Cap the free-pilot cohort at 3–5 firms. Schedule support calls instead of being always available. Set a hard date at Month 10: revenue or reassess. |
| **Slower build** | No paid engineers means the SRS scope takes 12 months, not 4 | This is why Section 3 narrows the product. Ship the data sheet, not the compliance engine. |
| **Unlimited liability** | Sole proprietorship exposes personal assets | Keep the SRS's disclaimers absolute — no advice, no certification, no guarantees. Convert to a PLC before any contract above 200,000 ETB. |
| **No FX buffer** | USD 21/month still requires foreign currency | At this size, a personal international card or a diaspora contact covers it. Apply for startup credits to remove the need entirely. |
| **Looking small to bank-owned clients** | Investment banks may hesitate to buy from an unregistered one-person operation | Compensate with product quality and a professional contract. The lawyer review at Month 7 matters more than an office does. |

---

# 14. First 30 days — total spend 14,300 ETB

| # | Action | Cost |
|---|---|---|
| 1 | Register the domain and set up free email routing | 2,300 |
| 2 | Buy a 600 VA UPS for your workstation and router | 12,000 |
| 3 | Apply for cloud and AI startup credits (AWS, Google, Microsoft, LLM providers) | 0 |
| 4 | Build the Version 0 daily data sheet by hand for all five listed securities | 0 |
| 5 | Email it free, every trading day, to named analysts at all 8 investment banks and 2 dealers | 0 |
| 6 | Track who opens it and who replies — that is your entire market research budget | 0 |
| 7 | Write to ESX asking about terms for redistributing market data | 0 |
| 8 | Pick the 3 firms that engage most; offer them the founding pilot | 0 |
| 9 | Start building Version 1 on a single Hetzner server | 1,290/mo from Month 2 |
| 10 | Do **not** register a company, rent anything, or hire anyone | 0 |

If after 30 days of free daily emails not one analyst has replied, you have learned something important for 14,300 ETB instead of 5,500,000 ETB. That is the entire argument for this budget.

---

# 15. Summary comparison

| | Funded plan | **Lean plan** |
|---|---:|---:|
| Initial capital | 5,500,000 ETB | **220,000 ETB** |
| USD equivalent | 34,200 | **1,370** |
| Monthly burn (build phase) | 380,000 ETB | **9,000 ETB** |
| Monthly burn (pilot phase) | 400,000 ETB | **15,000 ETB** |
| Cost of 6 months free | 2,025,000 ETB | **50,000 ETB** |
| Team at launch | 5 people | **Founders** |
| Break-even | 13 paying firms | **1 paying firm** |
| Peak cash at risk | 3,530,000 ETB | **123,300 ETB** |
| Payback | Month 18 | **Month 13** |
| Equity given up | 30–40% | **0%** |

Keep the funded plan. It is the right document to show an investor at Month 12, once you have three paying clients and can prove the model. Do not spend from it.

---

*Prices verified July 2026: Hetzner CX32 €6.80/month; Oracle Cloud Always Free 2 OCPU / 12 GB ARM; DeepSeek V4 Flash $0.14/$0.28 per million tokens; Gemini 2.5 Flash-Lite $0.10/$0.40 per million tokens; USD/ETB 161. Confirm all Ethiopian registration fees and tax treatment with a licensed accountant before registering.*
