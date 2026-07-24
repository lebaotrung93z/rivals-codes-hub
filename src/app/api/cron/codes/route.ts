import { NextRequest, NextResponse } from "next/server";
import { runCodesPipeline } from "@/lib/crawlers/codes";
import { assertCronAuthorized } from "@/lib/cron-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = assertCronAuthorized(req);
  if (denied) return denied;

  try {
    const result = await runCodesPipeline();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Codes cron failed" },
      { status: 500 },
    );
  }
}
