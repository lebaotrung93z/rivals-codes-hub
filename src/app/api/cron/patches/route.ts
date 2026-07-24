import { NextRequest, NextResponse } from "next/server";
import { crawlMarvelRivalsPatches } from "@/lib/crawlers/patches";
import { assertCronAuthorized } from "@/lib/cron-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = assertCronAuthorized(req);
  if (denied) return denied;

  try {
    const result = await crawlMarvelRivalsPatches();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Patches cron failed" },
      { status: 500 },
    );
  }
}
