import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";

import { readConfig } from "./config-store";
import {
  repoRoot,
  runtimeDir,
  scrapeLogPath,
  scrapeMetaPath,
  scrapePidPath,
} from "./paths";
import type { ScrapeRuntime } from "./types";

type ScrapeMeta = {
  pid: number;
  startedAt: string;
  binaryPath?: string;
};

export class ScrapeStartError extends Error {
  runtime: ScrapeRuntime;

  constructor(message: string, runtime: ScrapeRuntime) {
    super(message);
    this.name = "ScrapeStartError";
    this.runtime = runtime;
  }
}

async function ensureRuntimeDir() {
  await fs.mkdir(runtimeDir(), { recursive: true });
}

async function isPidAlive(pid: number): Promise<boolean> {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function readLogTail(): Promise<string> {
  try {
    const log = await fs.readFile(scrapeLogPath(), "utf8");
    return log.slice(-4000);
  } catch {
    return "";
  }
}

export async function getScrapeRuntime(): Promise<ScrapeRuntime> {
  await ensureRuntimeDir();
  const lastLog = await readLogTail();

  try {
    const raw = await fs.readFile(scrapeMetaPath(), "utf8");
    const meta = JSON.parse(raw) as ScrapeMeta;
    const alive = await isPidAlive(meta.pid);
    if (!alive) {
      return {
        running: false,
        pid: null,
        startedAt: meta.startedAt,
        lastExitCode: null,
        lastLog,
      };
    }
    return {
      running: true,
      pid: meta.pid,
      startedAt: meta.startedAt,
      lastExitCode: null,
      lastLog,
    };
  } catch {
    return {
      running: false,
      pid: null,
      startedAt: null,
      lastExitCode: null,
      lastLog,
    };
  }
}

async function assertChromaReachable(): Promise<void> {
  const config = await readConfig();
  const base = config.chroma_url.replace(/\/$/, "");
  const url = `${base}/api/v2/heartbeat`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(3000) });
  } catch {
    throw new Error(
      `ChromaDB is not reachable at ${config.chroma_url}. Start it first (e.g. npm run chroma), then try Start Scrape again.`,
    );
  }

  if (!res.ok) {
    throw new Error(
      `ChromaDB heartbeat failed (${res.status}) at ${config.chroma_url}.`,
    );
  }
}

async function buildScraperBinary(): Promise<string> {
  const goBin = process.env.GO_BIN || "go";
  const outPath = path.join(runtimeDir(), "scraper");
  await ensureRuntimeDir();

  const buildLogPath = path.join(runtimeDir(), "build.log");
  const buildLog = await fs.open(buildLogPath, "w");

  try {
    await new Promise<void>((resolve, reject) => {
      const child = spawn(goBin, ["build", "-o", outPath, "./cmd/scraper"], {
        cwd: repoRoot(),
        env: {
          ...process.env,
          PATH: `${path.join(process.env.HOME || "", ".local/go/bin")}:${process.env.PATH || ""}`,
        },
        stdio: ["ignore", buildLog.fd, buildLog.fd],
      });
      child.on("error", reject);
      child.on("exit", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`go build failed with code ${code} (see .runtime/build.log)`));
      });
    });
  } finally {
    await buildLog.close();
  }

  return outPath;
}

export async function startScrape(): Promise<ScrapeRuntime> {
  const current = await getScrapeRuntime();
  if (current.running) return current;

  await assertChromaReachable();
  await ensureRuntimeDir();
  const binaryPath = await buildScraperBinary();
  const logFd = await fs.open(scrapeLogPath(), "w");

  const child = spawn(binaryPath, ["configs/seeds.yaml"], {
    cwd: repoRoot(),
    detached: true,
    stdio: ["ignore", logFd.fd, logFd.fd],
    env: {
      ...process.env,
      PATH: `${path.join(process.env.HOME || "", ".local/go/bin")}:${process.env.PATH || ""}`,
    },
  });
  await logFd.close();

  if (!child.pid) {
    throw new Error("Failed to spawn scraper process");
  }

  child.unref();

  const meta: ScrapeMeta = {
    pid: child.pid,
    startedAt: new Date().toISOString(),
    binaryPath,
  };
  await fs.writeFile(scrapeMetaPath(), JSON.stringify(meta, null, 2), "utf8");
  await fs.writeFile(scrapePidPath(), String(child.pid), "utf8");

  // Detect instant crashes (e.g. config/chroma errors) before telling the UI "running".
  for (let i = 0; i < 10; i++) {
    await sleep(150);
    if (!(await isPidAlive(child.pid))) {
      const runtime = await getScrapeRuntime();
      const detail =
        runtime.lastLog.trim() ||
        "Scraper exited immediately with no log output.";
      throw new ScrapeStartError(
        `Scraper started then exited immediately.\n${detail}`,
        runtime,
      );
    }
  }

  return getScrapeRuntime();
}

async function signalPid(pid: number, signal: NodeJS.Signals) {
  try {
    process.kill(-pid, signal);
    return;
  } catch {
    // fall through to direct pid kill
  }
  process.kill(pid, signal);
}

export async function stopScrape(): Promise<ScrapeRuntime> {
  const current = await getScrapeRuntime();
  if (!current.pid) {
    return getScrapeRuntime();
  }

  const pid = current.pid;

  try {
    await signalPid(pid, "SIGTERM");
  } catch {
    // already dead
  }

  for (let i = 0; i < 20; i++) {
    if (!(await isPidAlive(pid))) break;
    await sleep(100);
  }

  if (await isPidAlive(pid)) {
    try {
      await signalPid(pid, "SIGKILL");
    } catch {
      // ignore
    }
  }

  await fs.rm(scrapeMetaPath(), { force: true });
  await fs.rm(scrapePidPath(), { force: true });
  return getScrapeRuntime();
}
