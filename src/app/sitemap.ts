import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/marvel-rivals/tier-list`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/marvel-rivals/patch-notes`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/codes`, changeFrequency: "hourly", priority: 0.95 },
    { url: `${base}/codes/genshin-impact`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/codes/honkai-star-rail`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/codes/wuthering-waves`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/guides`, changeFrequency: "weekly", priority: 0.7 },
  ];

  try {
    const [heroes, patches, guides] = await Promise.all([
      prisma.hero.findMany({
        where: { game: { slug: "marvel-rivals" } },
        select: { slug: true, updatedAt: true },
      }),
      prisma.patch.findMany({
        where: { game: { slug: "marvel-rivals" } },
        select: { slug: true, updatedAt: true },
      }),
      prisma.guide.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

    return [
      ...staticRoutes,
      ...heroes.map((h) => ({
        url: `${base}/marvel-rivals/heroes/${h.slug}`,
        lastModified: h.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...patches.map((p) => ({
        url: `${base}/marvel-rivals/patch-notes/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })),
      ...guides.map((g) => ({
        url: `${base}/guides/${g.slug}`,
        lastModified: g.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
