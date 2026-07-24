import type { Metadata } from "next";
import { CommunitySection } from "@/components/landing/CommunitySection";
import { GameShowcaseCarousel } from "@/components/landing/GameShowcaseCarousel";
import { LandingHero } from "@/components/landing/LandingHero";
import { prisma } from "@/lib/db";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `${SITE_NAME} · Marvel Rivals Guides & Game Codes`,
  description:
    "Marvel Rivals season tier lists, hero how-to-play guides, and patch notes—plus active redeem codes for Genshin Impact, Honkai: Star Rail, and Wuthering Waves.",
  alternates: { canonical: "/" },
};

async function getLandingPulse() {
  const [heroes, patches, codeGroups, guides, sTier, latestPatch] = await Promise.all([
    prisma.hero.count(),
    prisma.patch.count(),
    prisma.redeemCode.groupBy({ by: ["status"], _count: true }),
    prisma.guide.count(),
    prisma.tierEntry.findMany({
      where: { tier: "S" },
      include: { hero: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.patch.findFirst({ orderBy: { publishedAt: "desc" } }),
  ]);

  const countFor = (status: string) =>
    codeGroups.find((g) => g.status === status)?._count ?? 0;

  return {
    heroes,
    patches,
    guides,
    activeCodes: countFor("active"),
    unconfirmedCodes: countFor("unconfirmed"),
    expiredCodes: countFor("expired"),
    sTier: sTier.map((t) => t.hero.name),
    latestPatchTitle: latestPatch?.title ?? null,
  };
}

export default async function LandingPage() {
  const pulse = await getLandingPulse();

  return (
    <div className="bg-[var(--background)]">
      <LandingHero
        stats={{
          heroes: pulse.heroes,
          patches: pulse.patches,
          activeCodes: pulse.activeCodes,
          guides: pulse.guides,
          latestPatchTitle: pulse.latestPatchTitle,
        }}
      />
      <GameShowcaseCarousel />
      <CommunitySection pulse={pulse} />
    </div>
  );
}
