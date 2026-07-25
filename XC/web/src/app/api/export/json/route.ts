import { NextResponse } from "next/server";

import { fetchExportRecords } from "@/lib/chroma";
import { readConfig } from "@/lib/config-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const config = await readConfig();
    const records = await fetchExportRecords(
      config.chroma_url,
      config.collection,
      true,
    );

    const payload = records.map((r) => ({
      id: r.id,
      source_url: r.url,
      content: r.content,
      scraped_at: r.crawledAt,
      category: r.category,
      title: r.title,
      embeddings: r.embeddings ?? null,
    }));

    return new NextResponse(JSON.stringify(payload, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": 'attachment; filename="ethioburg_export.json"',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "JSON export failed" },
      { status: 500 },
    );
  }
}
