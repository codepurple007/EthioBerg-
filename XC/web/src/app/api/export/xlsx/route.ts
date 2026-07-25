import ExcelJS from "exceljs";
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
      false,
    );

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "EthioBurg";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Archive Chunks", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    sheet.columns = [
      { header: "ID", key: "id", width: 24 },
      { header: "URL", key: "url", width: 48 },
      { header: "Cleaned_Content", key: "content", width: 80 },
      { header: "Crawled_At", key: "crawledAt", width: 16 },
      { header: "Category", key: "category", width: 20 },
      { header: "Title", key: "title", width: 32 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: 6 },
    };

    for (const r of records) {
      sheet.addRow({
        id: r.id,
        url: r.url,
        content: r.content,
        crawledAt: r.crawledAt,
        category: r.category,
        title: r.title,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="ethioburg_export.xlsx"',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Excel export failed" },
      { status: 500 },
    );
  }
}
