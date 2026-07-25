import { NextResponse } from "next/server";

import { readConfig, writeConfig } from "@/lib/config-store";
import type { ScraperConfig } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const config = await readConfig();
    return NextResponse.json(config);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to read config" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Partial<ScraperConfig>;
    const current = await readConfig();
    const saved = await writeConfig({ ...current, ...body, seeds: body.seeds ?? current.seeds });
    return NextResponse.json(saved);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to write config" },
      { status: 500 },
    );
  }
}
