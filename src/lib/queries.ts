import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

const REVALIDATE_SECONDS = 300;

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
    prisma.guide.findMany({
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, slug: true, title: true, excerpt: true, publishedAt: true },
    }),
    prisma.tierList.findFirst({
      where: { game: { slug: "marvel-rivals" } },
      orderBy: { updatedAt: "desc" },
      include: {
        entries: {
          where: { tier: "S" },
          include: {
            hero: { select: { id: true, slug: true, name: true, role: true, imageUrl: true } },
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
    prisma.crawlRun.findMany({ orderBy: { startedAt: "desc" }, take: 5 }),
  ]);

  return { patches, codes, guides, tierList, crawlRuns };
}

export const getTierList = unstable_cache(
  async () => {
    return prisma.tierList.findFirst({
      where: { game: { slug: "marvel-rivals" } },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        mode: true,
        summary: true,
        updatedAt: true,
        publishedAt: true,
        entries: {
          orderBy: [{ sortOrder: "asc" }],
          select: {
            id: true,
            tier: true,
            note: true,
            sortOrder: true,
            hero: {
              select: {
                id: true,
                slug: true,
                name: true,
                role: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
  },
  ["tier-list"],
  { revalidate: REVALIDATE_SECONDS, tags: ["tier-list"] },
);

export async function getHeroBySlug(slug: string) {
  return unstable_cache(
    async () => {
      return prisma.hero.findFirst({
        where: { slug, game: { slug: "marvel-rivals" } },
        include: {
          game: { select: { slug: true, name: true } },
          tierEntries: {
            include: { tierList: { select: { id: true, updatedAt: true } } },
            orderBy: { tierList: { updatedAt: "desc" } },
            take: 1,
          },
        },
      });
    },
    ["hero-by-slug", slug],
    { revalidate: REVALIDATE_SECONDS, tags: ["heroes", `hero-${slug}`] },
  )();
}

export const getAllHeroes = unstable_cache(
  async () => {
    return prisma.hero.findMany({
      where: { game: { slug: "marvel-rivals" } },
      orderBy: [{ role: "asc" }, { name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        role: true,
        imageUrl: true,
        difficulty: true,
        summary: true,
      },
    });
  },
  ["all-heroes"],
  { revalidate: REVALIDATE_SECONDS, tags: ["heroes"] },
);

export async function getPatches() {
  return unstable_cache(
    async () => {
      return prisma.patch.findMany({
        where: { game: { slug: "marvel-rivals" } },
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          version: true,
          summary: true,
          publishedAt: true,
          updatedAt: true,
          sourceName: true,
          rankedImpact: true,
        },
      });
    },
    ["patches-index"],
    { revalidate: REVALIDATE_SECONDS, tags: ["patches"] },
  )();
}

export async function getPatchBySlug(slug: string) {
  return unstable_cache(
    async () => {
      return prisma.patch.findFirst({
        where: { slug, game: { slug: "marvel-rivals" } },
        include: { game: { select: { slug: true, name: true } } },
      });
    },
    ["patch-by-slug", slug],
    { revalidate: REVALIDATE_SECONDS, tags: ["patches", `patch-${slug}`] },
  )();
}

/** Codes hub: light payload — preview rows only, no full expired archive. */
export const getCodeGamesHub = unstable_cache(
  async () => {
    const games = await prisma.game.findMany({
      where: {
        slug: { in: ["genshin-impact", "honkai-star-rail", "wuthering-waves"] },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        redeemUrl: true,
        codes: {
          where: { status: { in: ["active", "unconfirmed"] } },
          orderBy: [{ status: "asc" }, { firstSeenAt: "desc" }],
          take: 4,
          select: {
            id: true,
            code: true,
            status: true,
            rewards: true,
            lastCheckedAt: true,
          },
        },
      },
    });

    const counts = await prisma.redeemCode.groupBy({
      by: ["gameId", "status"],
      where: {
        game: {
          slug: { in: ["genshin-impact", "honkai-star-rail", "wuthering-waves"] },
        },
      },
      _count: { _all: true },
    });

    return games.map((game) => {
      const gameCounts = counts.filter((c) => c.gameId === game.id);
      const active = gameCounts.find((c) => c.status === "active")?._count._all ?? 0;
      const unconfirmed =
        gameCounts.find((c) => c.status === "unconfirmed")?._count._all ?? 0;
      const expired = gameCounts.find((c) => c.status === "expired")?._count._all ?? 0;
      return {
        ...game,
        counts: {
          active,
          unconfirmed,
          expired,
          total: active + unconfirmed + expired,
        },
      };
    });
  },
  ["codes-hub"],
  { revalidate: REVALIDATE_SECONDS, tags: ["codes"] },
);

export async function getCodeGames() {
  return prisma.game.findMany({
    where: {
      slug: { in: ["genshin-impact", "honkai-star-rail", "wuthering-waves"] },
    },
    include: {
      codes: {
        orderBy: [{ status: "asc" }, { firstSeenAt: "desc" }],
        select: {
          id: true,
          code: true,
          status: true,
          rewards: true,
          firstSeenAt: true,
          lastCheckedAt: true,
          expiresAt: true,
          sourceName: true,
          sourceUrl: true,
        },
      },
    },
  });
}

export async function getCodesForGame(slug: string) {
  return unstable_cache(
    async () => {
      return prisma.game.findUnique({
        where: { slug },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          redeemUrl: true,
          officialUrl: true,
          codes: {
            orderBy: [{ status: "asc" }, { firstSeenAt: "desc" }],
            select: {
              id: true,
              code: true,
              status: true,
              rewards: true,
              firstSeenAt: true,
              lastCheckedAt: true,
              expiresAt: true,
              sourceName: true,
              sourceUrl: true,
            },
          },
        },
      });
    },
    ["codes-for-game", slug],
    { revalidate: REVALIDATE_SECONDS, tags: ["codes", `codes-${slug}`] },
  )();
}

export const getGuidesIndex = unstable_cache(
  async () => {
    const [guides, heroes] = await Promise.all([
      prisma.guide.findMany({
        orderBy: [{ level: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          level: true,
          sortOrder: true,
          publishedAt: true,
          updatedAt: true,
          game: { select: { name: true, slug: true } },
        },
      }),
      prisma.hero.findMany({
        where: { game: { slug: "marvel-rivals" } },
        select: { slug: true, name: true, role: true, imageUrl: true },
      }),
    ]);
    return { guides, heroes };
  },
  ["guides-index"],
  { revalidate: REVALIDATE_SECONDS, tags: ["guides"] },
);

export async function getGuides() {
  return prisma.guide.findMany({
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      level: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
}

export async function getGuideBySlug(slug: string) {
  return unstable_cache(
    async () => {
      return prisma.guide.findUnique({
        where: { slug },
        include: { game: { select: { id: true, slug: true, name: true } } },
      });
    },
    ["guide-by-slug", slug],
    { revalidate: REVALIDATE_SECONDS, tags: ["guides", `guide-${slug}`] },
  )();
}

/** One cached round-trip for guide detail pages (avoids N+1 body fetches). */
export async function getGuidePageData(slug: string) {
  return unstable_cache(
    async () => {
      const guide = await prisma.guide.findUnique({
        where: { slug },
        include: { game: { select: { id: true, slug: true, name: true } } },
      });
      if (!guide) return null;

      const heroSlug = guide.slug.endsWith("-how-to-play")
        ? guide.slug.slice(0, -"-how-to-play".length)
        : null;

      const [hero, navGuides, related] = await Promise.all([
        heroSlug
          ? prisma.hero.findFirst({
              where: { slug: heroSlug, game: { slug: "marvel-rivals" } },
              select: {
                slug: true,
                name: true,
                role: true,
                imageUrl: true,
                tierEntries: { take: 1, select: { tier: true }, orderBy: { sortOrder: "asc" } },
              },
            })
          : Promise.resolve(null),
        heroSlug
          ? prisma.guide.findMany({
              where: {
                gameId: guide.gameId ?? undefined,
                slug: { endsWith: "-how-to-play" },
              },
              orderBy: { title: "asc" },
              select: { id: true, slug: true, title: true },
            })
          : prisma.guide.findMany({
              where: {
                gameId: guide.gameId ?? undefined,
                level: guide.level,
                NOT: { slug: { endsWith: "-how-to-play" } },
              },
              orderBy: { sortOrder: "asc" },
              select: { id: true, slug: true, title: true, sortOrder: true },
            }),
        heroSlug
          ? prisma.guide.findMany({
              where: {
                gameId: guide.gameId ?? undefined,
                slug: { endsWith: "-how-to-play" },
                NOT: { slug: guide.slug },
              },
              orderBy: { title: "asc" },
              take: 8,
              select: { id: true, slug: true, title: true },
            })
          : prisma.guide.findMany({
              where: {
                gameId: guide.gameId ?? undefined,
                id: { not: guide.id },
                level: guide.level,
                NOT: { slug: { endsWith: "-how-to-play" } },
              },
              orderBy: { sortOrder: "asc" },
              take: 8,
              select: { id: true, slug: true, title: true },
            }),
      ]);

      const idx = navGuides.findIndex((g) => g.id === guide.id);
      const prev = idx > 0 ? navGuides[idx - 1] : null;
      const next = idx >= 0 && idx < navGuides.length - 1 ? navGuides[idx + 1] : null;

      return { guide, hero, heroSlug, related, prev, next };
    },
    ["guide-page", slug],
    { revalidate: REVALIDATE_SECONDS, tags: ["guides", `guide-${slug}`] },
  )();
}

export async function getHeroBySlugCached(slug: string) {
  return getHeroBySlug(slug);
}

export const getPatchesCached = getPatches;

export async function getPatchBySlugCached(slug: string) {
  return getPatchBySlug(slug);
}
