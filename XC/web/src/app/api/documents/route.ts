import { NextResponse } from "next/server";

import { fetchArchiveStatus, fetchDocuments } from "@/lib/chroma";
import { readConfig } from "@/lib/config-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 20)));
    const offset = (page - 1) * pageSize;

    const config = await readConfig();
    const status = await fetchArchiveStatus(config.chroma_url, config.collection);

    let documents: Awaited<ReturnType<typeof fetchDocuments>> = [];
    if (status.reachable) {
      try {
        documents = await fetchDocuments(
          config.chroma_url,
          config.collection,
          offset,
          pageSize,
        );
      } catch (err) {
        status.error = err instanceof Error ? err.message : "Document fetch failed";
      }
    }

    const totalPages = Math.max(1, Math.ceil(status.totalChunks / pageSize) || 1);

    return NextResponse.json({
      status,
      documents,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalChunks: status.totalChunks,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load documents" },
      { status: 500 },
    );
  }
}
