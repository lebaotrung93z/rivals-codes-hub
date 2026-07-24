import type { Metadata } from "next";
import Link from "next/link";
import { AdUnit } from "@/components/AdSense";
import { LastUpdated, PageHero, StatusBadge } from "@/components/Content";
import { getCodeGamesHub } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Game Redeem Codes Hub",
  description:
    "Active and expired redeem codes for Genshin Impact, Honkai: Star Rail, and Wuthering Waves with clear status labels.",
  alternates: { canonical: "/codes" },
};

export default async function CodesHubPage() {
  const games = await getCodeGamesHub();
  const latest =
    games
      .flatMap((g) => g.codes.map((c) => c.lastCheckedAt))
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? new Date();

  return (
    <div>
      <PageHero
        eyebrow="Redeem codes"
        title="Live codes hub"
        description="We ingest public code signals, label Active / Expired / Unconfirmed, and link out to official redemption pages. Always redeem on official sites."
      />
      <LastUpdated date={latest} />
      <AdUnit slot="codes" className="my-6" />

      <div className="space-y-10">
        {games.map((game) => (
          <section key={game.id} className="border-t border-[var(--line)] pt-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl text-[var(--ink)]">{game.name}</h2>
                <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">{game.description}</p>
              </div>
              <Link href={`/codes/${game.slug}`} className="text-sm text-[var(--accent-2)]">
                Full {game.name} codes →
              </Link>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {game.counts.active} active · {game.counts.unconfirmed} unconfirmed ·{" "}
              {game.counts.total} tracked
            </p>
            <ul className="mt-4 space-y-2">
              {game.codes.map((code) => (
                <li key={code.id} className="flex flex-wrap items-center gap-3 text-sm">
                  <StatusBadge status={code.status} />
                  <code className="font-mono text-[var(--ink)]">{code.code}</code>
                  <span className="text-[var(--muted)]">{code.rewards}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
