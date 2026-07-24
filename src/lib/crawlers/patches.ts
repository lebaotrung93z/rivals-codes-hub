import { prisma } from "@/lib/db";

const STEAM_APP_ID = "2767030"; // Marvel Rivals

type SteamNewsItem = {
  gid: string;
  title: string;
  url: string;
  author: string;
  contents: string;
  feedlabel: string;
  date: number;
  feedname: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function stripHtml(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractBullets(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const bullets = lines.filter((l) => /^[-*•]/.test(l) || /^\d+\./.test(l));
  if (bullets.length) return bullets.map((b) => b.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, ""));
  return lines.slice(0, 8);
}

function buildEditorialSummary(title: string, bullets: string[]) {
  const highlight = bullets.slice(0, 3).join(" ");
  return `Public patch signal for "${title}". Our editorial takeaway: ${
    highlight || "review the official notes for exact numbers, then adjust your ranked pool accordingly."
  }`;
}

function buildRankedImpact(bullets: string[]) {
  if (!bullets.length) {
    return [
      "Check whether your main's cooldowns or damage windows changed.",
      "Expect short-term ranked volatility after any mid-season patch.",
      "Revisit the tier list within 48 hours of major balance drops.",
    ];
  }
  return bullets.slice(0, 5).map((b) => `Ranked note: ${b}`);
}

export async function crawlMarvelRivalsPatches() {
  const run = await prisma.crawlRun.create({
    data: { job: "marvel-rivals-patches", status: "running" },
  });

  try {
    const game = await prisma.game.findUnique({ where: { slug: "marvel-rivals" } });
    if (!game) throw new Error("marvel-rivals game missing — run prisma db seed");

    const endpoint = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${STEAM_APP_ID}&count=100&maxlength=0&format=json`;
    const res = await fetch(endpoint, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Steam news HTTP ${res.status}`);

    const json = (await res.json()) as {
      appnews?: { newsitems?: SteamNewsItem[] };
    };
    const items = json.appnews?.newsitems ?? [];

    let upserted = 0;
    for (const item of items) {
      const plain = stripHtml(item.contents || "");
      const bullets = extractBullets(plain);
      const slugBase = slugify(item.title) || `steam-${item.gid}`;
      const slug = slugBase;
      const versionGuess =
        item.title.match(/v?\d+(\.\d+){1,3}/i)?.[0] ??
        `steam-${item.gid.slice(-6)}`;

      await prisma.patch.upsert({
        where: { gameId_slug: { gameId: game.id, slug } },
        create: {
          gameId: game.id,
          slug,
          version: versionGuess,
          title: item.title,
          publishedAt: new Date(item.date * 1000),
          sourceUrl: item.url,
          sourceName: item.feedlabel || "Steam News",
          rawBody: plain.slice(0, 20000),
          summary: buildEditorialSummary(item.title, bullets),
          rankedImpact: buildRankedImpact(bullets),
          changelog: bullets.slice(0, 20).map((change) => ({ change })),
        },
        update: {
          title: item.title,
          publishedAt: new Date(item.date * 1000),
          sourceUrl: item.url,
          sourceName: item.feedlabel || "Steam News",
          rawBody: plain.slice(0, 20000),
          summary: buildEditorialSummary(item.title, bullets),
          rankedImpact: buildRankedImpact(bullets),
          changelog: bullets.slice(0, 20).map((change) => ({ change })),
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
        meta: { source: "steam-news", appId: STEAM_APP_ID },
      },
    });

    return { itemsFound: items.length, itemsUpserted: upserted };
  } catch (error) {
    await prisma.crawlRun.update({
      where: { id: run.id },
      data: {
        status: "error",
        finishedAt: new Date(),
        error: error instanceof Error ? error.message : "Unknown patch crawl error",
      },
    });
    throw error;
  }
}
