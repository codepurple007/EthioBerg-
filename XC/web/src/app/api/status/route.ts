import { NextResponse } from "next/server";

import { fetchArchiveStatus } from "@/lib/chroma";
import { readConfig } from "@/lib/config-store";
import { getScrapeRuntime } from "@/lib/scrape-process";

export const runtime = "nodejs";

export async function GET() {
  try {
    const config = await readConfig();
    const [archive, scrape] = await Promise.all([
      fetchArchiveStatus(config.chroma_url, config.collection),
      getScrapeRuntime(),
    ]);

    return NextResponse.json({
      archive,
      scrape,
      config: {
        workers: config.workers,
        default_rate_delay_ms: config.default_rate_delay_ms,
        request_timeout_sec: config.request_timeout_sec,
        collection: config.collection,
        chroma_url: config.chroma_url,
        seeds: config.seeds,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Status failed" },
      { status: 500 },
    );
  }
}
