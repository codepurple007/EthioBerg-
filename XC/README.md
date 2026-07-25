# EthioBurg — Concurrent Web Scraping & Ingestion Engine

Go worker pipeline that scrapes configured seed URLs, extracts clean text, chunks content, and upserts into ChromaDB — plus a Next.js control center for configuration, live archive viewing, and exports.

## Requirements

- Go 1.24.11+ (required by `chroma-go` v0.4)
- Node.js 20+
- Python 3.10+ (for local ChromaDB via `chromadb`)
- ChromaDB listening at the URL in `configs/seeds.yaml` (default `http://localhost:8000`)

## Quick start

```bash
# 1) Install + start Chroma (required — scrape will fail without it)
npm run chroma:install   # once
npm run chroma           # leave running on :8000

# 2) Control center UI
cd web && npm install && npm run dev
# open http://localhost:3000
```

Click **Start Scrape** in the UI. If Chroma is down, the UI now shows an explicit error instead of a silent exit.

## Scraper (Go) only

```bash
go mod tidy
go run ./cmd/scraper configs/seeds.yaml
```

## Control Center (Next.js)

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The UI reads/writes `configs/seeds.yaml`, lists Chroma collection chunks, starts/stops the Go scraper, and exports JSON / CSV / XLSX.

## Layout

```
cmd/scraper/          # Go scrape orchestration
configs/seeds.yaml    # seeds, Chroma, timeouts, workers
internal/             # crawl / extract / filter / chroma
web/                  # Next.js control center
  src/app/api/        # config, documents, scrape, exports
  src/components/     # dashboard UI
```
