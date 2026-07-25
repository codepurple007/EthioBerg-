import path from "path";

export function repoRoot(): string {
  // Next.js runs with cwd = web/
  return path.resolve(process.cwd(), "..");
}

export function seedsConfigPath(): string {
  return path.join(repoRoot(), "configs", "seeds.yaml");
}

export function runtimeDir(): string {
  return path.join(repoRoot(), ".runtime");
}

export function scrapePidPath(): string {
  return path.join(runtimeDir(), "scrape.pid");
}

export function scrapeLogPath(): string {
  return path.join(runtimeDir(), "scrape.log");
}

export function scrapeMetaPath(): string {
  return path.join(runtimeDir(), "scrape.meta.json");
}
