import fs from "fs/promises";
import { parse, stringify } from "yaml";

import { seedsConfigPath } from "./paths";
import type { ScraperConfig, Seed } from "./types";

const defaults: ScraperConfig = {
  chroma_url: "http://localhost:8000",
  collection: "local_archives",
  chunk_size: 500,
  workers: 4,
  request_timeout_sec: 10,
  max_page_bytes: 31457280,
  user_agent: "SovereignAI-ArchiveScraper/2.0 (Local Research Application)",
  default_rate_delay_ms: 250,
  seeds: [],
};

export async function readConfig(): Promise<ScraperConfig> {
  const raw = await fs.readFile(seedsConfigPath(), "utf8");
  const parsed = parse(raw) as Partial<ScraperConfig>;
  return normalizeConfig({ ...defaults, ...parsed });
}

export async function writeConfig(next: ScraperConfig): Promise<ScraperConfig> {
  const normalized = normalizeConfig(next);
  const yamlText = stringify(normalized, {
    lineWidth: 0,
    defaultStringType: "QUOTE_DOUBLE",
    defaultKeyType: "PLAIN",
  });
  await fs.writeFile(seedsConfigPath(), yamlText, "utf8");
  return normalized;
}

export function normalizeConfig(input: Partial<ScraperConfig>): ScraperConfig {
  const seeds: Seed[] = (input.seeds ?? [])
    .filter((s) => s && typeof s.url === "string" && s.url.trim() !== "")
    .map((s) => ({
      url: s.url.trim(),
      category: (s.category || "historical_web_scrape").trim(),
    }));

  return {
    chroma_url: input.chroma_url || defaults.chroma_url,
    collection: input.collection || defaults.collection,
    chunk_size: clampInt(input.chunk_size, 100, 5000, defaults.chunk_size),
    workers: clampInt(input.workers, 1, 100, defaults.workers),
    request_timeout_sec: clampInt(
      input.request_timeout_sec,
      5,
      60,
      defaults.request_timeout_sec,
    ),
    max_page_bytes:
      typeof input.max_page_bytes === "number" && input.max_page_bytes > 0
        ? input.max_page_bytes
        : defaults.max_page_bytes,
    user_agent: input.user_agent || defaults.user_agent,
    default_rate_delay_ms: clampInt(
      input.default_rate_delay_ms,
      0,
      5000,
      defaults.default_rate_delay_ms,
    ),
    seeds,
  };
}

function clampInt(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}
