import { prisma } from "@/lib/db";

export async function getDashboardData() {
  const [patches, codes, guides, tierList, crawlRuns] = await Promise.all([
    prisma.patch.findMany({
      where: { game: { slug: "marvel-rivals" } },
      orderBy: { publishedAt: "desc" },
      take: 5,
      include: { game: true },
    }),
    prisma.redeemCode.findMany({
      where: { status: { in: ["active", "unconfirmed"] } },
      orderBy: { firstSeenAt: "desc" },
      take: 8,
      include: { game: true },
    }),
    prisma.guide.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.tierList.findFirst({
      where: { game: { slug: "marvel-rivals" } },
      orderBy: { updatedAt: "desc" },
      include: {
        entries: {
          where: { tier: "S" },
          include: { hero: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
    prisma.crawlRun.findMany({ orderBy: { startedAt: "desc" }, take: 5 }),
  ]);

  return { patches, codes, guides, tierList, crawlRuns };
}

export async function getTierList() {
  return prisma.tierList.findFirst({
    where: { game: { slug: "marvel-rivals" } },
    orderBy: { updatedAt: "desc" },
    include: {
      entries: {
        include: { hero: true },
        orderBy: [{ tier: "asc" }, { sortOrder: "asc" }],
      },
      game: true,
    },
  });
}

export async function getHeroBySlug(slug: string) {
  return prisma.hero.findFirst({
    where: { slug, game: { slug: "marvel-rivals" } },
    include: {
      game: true,
      tierEntries: {
        include: { tierList: true },
        orderBy: { tierList: { updatedAt: "desc" } },
        take: 1,
      },
    },
  });
}

export async function getAllHeroes() {
  return prisma.hero.findMany({
    where: { game: { slug: "marvel-rivals" } },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
}

export async function getPatches() {
  return prisma.patch.findMany({
    where: { game: { slug: "marvel-rivals" } },
    orderBy: { publishedAt: "desc" },
    include: { game: true },
  });
}

export async function getPatchBySlug(slug: string) {
  return prisma.patch.findFirst({
    where: { slug, game: { slug: "marvel-rivals" } },
    include: { game: true },
  });
}

export async function getCodeGames() {
  return prisma.game.findMany({
    where: {
      slug: { in: ["genshin-impact", "honkai-star-rail", "wuthering-waves"] },
    },
    include: {
      codes: {
        orderBy: [{ status: "asc" }, { firstSeenAt: "desc" }],
      },
    },
  });
}

export async function getCodesForGame(slug: string) {
  return prisma.game.findUnique({
    where: { slug },
    include: {
      codes: {
        orderBy: [{ status: "asc" }, { firstSeenAt: "desc" }],
      },
    },
  });
}

export async function getGuides() {
  return prisma.guide.findMany({ orderBy: { publishedAt: "desc" } });
}

export async function getGuideBySlug(slug: string) {
  return prisma.guide.findUnique({
    where: { slug },
    include: { game: true },
  });
}
