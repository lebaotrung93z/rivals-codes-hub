import { readFile } from "fs/promises";
import path from "path";
import { CodeStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export type CodeFeedItem = {
  gameSlug: string;
  code: string;
  rewards: string;
  status?: "active" | "expired" | "unconfirmed";
  sourceUrl?: string;
  sourceName?: string;
  expiresAt?: string;
  notes?: string;
};

const GAME_SLUGS = ["genshin-impact", "honkai-star-rail", "wuthering-waves"] as const;

async function loadLocalFeed(): Promise<CodeFeedItem[]> {
  const filePath = path.join(process.cwd(), "data", "codes-feed.json");
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as { codes?: CodeFeedItem[] };
    return parsed.codes ?? [];
  } catch {
    return [];
  }
}

async function loadRemoteFeed(): Promise<CodeFeedItem[]> {
  const url = process.env.CODES_FEED_URL;
  if (!url) return [];
  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const parsed = (await res.json()) as { codes?: CodeFeedItem[] } | CodeFeedItem[];
    return Array.isArray(parsed) ? parsed : (parsed.codes ?? []);
  } catch {
    return [];
  }
}

export async function ingestCodesFeed() {
  const run = await prisma.crawlRun.create({
    data: { job: "codes-ingest", status: "running" },
  });

  try {
    const [localItems, remoteItems] = await Promise.all([
      loadLocalFeed(),
      loadRemoteFeed(),
    ]);
    const items = [...localItems, ...remoteItems];
    const games = await prisma.game.findMany({
      where: { slug: { in: [...GAME_SLUGS] } },
    });
    const bySlug = new Map(games.map((g) => [g.slug, g]));

    let upserted = 0;
    for (const item of items) {
      const game = bySlug.get(item.gameSlug);
      if (!game || !item.code?.trim()) continue;

      const status = (item.status as CodeStatus | undefined) ?? CodeStatus.unconfirmed;
      await prisma.redeemCode.upsert({
        where: {
          gameId_code: { gameId: game.id, code: item.code.trim() },
        },
        create: {
          gameId: game.id,
          code: item.code.trim(),
          rewards: item.rewards || "Rewards unlisted — verify in-game",
          status,
          sourceUrl: item.sourceUrl,
          sourceName: item.sourceName ?? "Codes feed",
          expiresAt: item.expiresAt ? new Date(item.expiresAt) : null,
          notes: item.notes,
          needsReview: status === CodeStatus.unconfirmed,
          lastCheckedAt: new Date(),
        },
        update: {
          rewards: item.rewards || undefined,
          status,
          sourceUrl: item.sourceUrl,
          sourceName: item.sourceName ?? "Codes feed",
          expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined,
          notes: item.notes,
          needsReview: status === CodeStatus.unconfirmed,
          lastCheckedAt: new Date(),
        },
      });
      upserted += 1;
    }

    await prisma.crawlRun.update({
      where: { id: run.id },
      data: {
        status: "success",
        finishedAt: new Date(),
        itemsFound: items.length,
        itemsUpserted: upserted,
      },
    });

    return { itemsFound: items.length, itemsUpserted: upserted };
  } catch (error) {
    await prisma.crawlRun.update({
      where: { id: run.id },
      data: {
        status: "error",
        finishedAt: new Date(),
        error: error instanceof Error ? error.message : "Unknown ingest error",
      },
    });
    throw error;
  }
}

/** Mark expired by date and age-out stale unconfirmed codes. */
export async function verifyCodes() {
  const run = await prisma.crawlRun.create({
    data: { job: "codes-verify", status: "running" },
  });

  try {
    const now = new Date();
    const expiredByDate = await prisma.redeemCode.updateMany({
      where: {
        status: { in: [CodeStatus.active, CodeStatus.unconfirmed] },
        expiresAt: { lte: now },
      },
      data: {
        status: CodeStatus.expired,
        needsReview: false,
        lastCheckedAt: now,
      },
    });

    const staleCutoff = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 21);
    const expiredStale = await prisma.redeemCode.updateMany({
      where: {
        status: CodeStatus.unconfirmed,
        firstSeenAt: { lte: staleCutoff },
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      data: {
        status: CodeStatus.expired,
        needsReview: true,
        notes: "Auto-expired after 21 days unconfirmed. Re-check official sources.",
        lastCheckedAt: now,
      },
    });

    const touched = await prisma.redeemCode.updateMany({
      where: { status: { in: [CodeStatus.active, CodeStatus.unconfirmed] } },
      data: { lastCheckedAt: now },
    });

    const upserted = expiredByDate.count + expiredStale.count;
    await prisma.crawlRun.update({
      where: { id: run.id },
      data: {
        status: "success",
        finishedAt: now,
        itemsFound: touched.count,
        itemsUpserted: upserted,
        meta: {
          expiredByDate: expiredByDate.count,
          expiredStale: expiredStale.count,
        },
      },
    });

    return {
      expiredByDate: expiredByDate.count,
      expiredStale: expiredStale.count,
      checked: touched.count,
    };
  } catch (error) {
    await prisma.crawlRun.update({
      where: { id: run.id },
      data: {
        status: "error",
        finishedAt: new Date(),
        error: error instanceof Error ? error.message : "Unknown verify error",
      },
    });
    throw error;
  }
}

export async function runCodesPipeline() {
  const ingest = await ingestCodesFeed();
  const verify = await verifyCodes();
  return { ingest, verify };
}
