import { NextResponse } from "next/server";

import { fetchExportRecords } from "@/lib/chroma";
import { readConfig } from "@/lib/config-store";

export const runtime = "nodejs";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  try {
    const config = await readConfig();
    const records = await fetchExportRecords(
      config.chroma_url,
      config.collection,
      false,
    );

    const lines = ["ID,URL,Cleaned_Content,Crawled_At"];
    for (const r of records) {
      lines.push(
        [
          csvEscape(r.id),
          csvEscape(r.url),
          csvEscape(r.content),
          csvEscape(r.crawledAt),
        ].join(","),
      );
    }

    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="ethioburg_export.csv"',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "CSV export failed" },
      { status: 500 },
    );
  }
}
