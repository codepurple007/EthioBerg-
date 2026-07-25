import fs from "fs/promises";
import { NextResponse } from "next/server";

import { clearArchive } from "@/lib/chroma";
import { readConfig } from "@/lib/config-store";
import { scrapeLogPath, scrapeMetaPath, scrapePidPath } from "@/lib/paths";
import { getScrapeRuntime, stopScrape } from "@/lib/scrape-process";

export const runtime = "nodejs";

export async function DELETE() {
  try {
    const scrape = await getScrapeRuntime();
    if (scrape.running) {
      await stopScrape();
    }

    const config = await readConfig();
    const result = await clearArchive(config.chroma_url, config.collection);

    // Clear local scrape runtime cache (logs / pid metadata)
    await Promise.all([
      fs.rm(scrapeLogPath(), { force: true }),
      fs.rm(scrapeMetaPath(), { force: true }),
      fs.rm(scrapePidPath(), { force: true }),
    ]);

    return NextResponse.json({
      ok: true,
      message: "Previous scrape archive cleared",
      ...result,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to clear archive" },
      { status: 500 },
    );
  }
}
