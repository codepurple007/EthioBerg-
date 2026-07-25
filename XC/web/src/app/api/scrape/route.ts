import { NextResponse } from "next/server";

import { ScrapeStartError, startScrape, stopScrape } from "@/lib/scrape-process";

export const runtime = "nodejs";

export async function POST() {
  try {
    const scrapeRuntime = await startScrape();
    return NextResponse.json(scrapeRuntime);
  } catch (err) {
    if (err instanceof ScrapeStartError) {
      return NextResponse.json(
        { error: err.message, scrape: err.runtime },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to start scrape" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const scrapeRuntime = await stopScrape();
    return NextResponse.json(scrapeRuntime);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to stop scrape" },
      { status: 500 },
    );
  }
}
