import type { Metadata } from "next";
import Link from "next/link";
import { AdUnit } from "@/components/AdSense";
import { LastUpdated, PageHero } from "@/components/Content";
import { HeroAvatar } from "@/components/HeroAvatar";
import { getTierList } from "@/lib/queries";
import { roleLabel } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marvel Rivals Tier List",
  description:
    "Competitive Marvel Rivals tier list with hero portraits, S through D rankings, role context, and ranked climb notes.",
  alternates: { canonical: "/marvel-rivals/tier-list" },
};

const tierOrder = ["S", "A", "B", "C", "D"] as const;

export default async function TierListPage() {
  const tierList = await getTierList();
  if (!tierList) {
    return <p>No tier list found. Run database seed.</p>;
  }

  const grouped = tierOrder.map((tier) => ({
    tier,
    entries: tierList.entries.filter((e) => e.tier === tier),
  }));

  return (
    <div>
      <PageHero
        eyebrow="Marvel Rivals"
        title={tierList.title}
        description={tierList.summary}
      />
      <LastUpdated date={tierList.updatedAt} />
      <AdUnit slot="inarticle" className="my-6" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-8">
          {grouped.map((group) => (
            <section key={group.tier}>
              <h2 className="font-display text-2xl text-white">{group.tier} Tier</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-[var(--muted)]">
                      <th className="py-2 pr-3 font-medium">Hero</th>
                      <th className="py-2 pr-3 font-medium">Role</th>
                      <th className="py-2 font-medium">Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.entries.map((entry) => (
                      <tr key={entry.id} className="border-b border-[var(--line)] align-middle">
                        <td className="py-3 pr-3">
                          <Link
                            href={`/marvel-rivals/heroes/${entry.hero.slug}`}
                            className="inline-flex items-center gap-3 font-medium text-[var(--neon-cyan)] hover:underline"
                          >
                            <HeroAvatar
                              name={entry.hero.name}
                              slug={entry.hero.slug}
                              imageUrl={entry.hero.imageUrl}
                              size={44}
                            />
                            <span>{entry.hero.name}</span>
                          </Link>
                        </td>
                        <td className="py-3 pr-3 text-[var(--muted)]">
                          {roleLabel(entry.hero.role)}
                        </td>
                        <td className="py-3 text-[var(--muted)]">{entry.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
        <aside className="space-y-4">
          <AdUnit slot="sidebar" />
          <p className="text-sm text-[var(--muted)]">
            Mode: {tierList.mode}. Editorial Season 9.0 rankings for Diamond+ play.
            Refresh after major patches.
          </p>
        </aside>
      </div>
    </div>
  );
}
