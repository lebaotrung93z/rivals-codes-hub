import type { Metadata } from "next";
import Link from "next/link";
import { AdUnit } from "@/components/AdSense";
import { LastUpdated, PageHero } from "@/components/Content";
import { HeroAvatar } from "@/components/HeroAvatar";
import { heroSlugFromGuideSlug } from "@/lib/guides";
import { getGuidesIndex } from "@/lib/queries";
import { formatDate, roleLabel } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "How to Play Guides · Beginner to Advanced",
  description:
    "Learn how to play Marvel Rivals, Genshin Impact, Honkai: Star Rail, and Wuthering Waves with a clear beginner → intermediate → advanced path.",
  alternates: { canonical: "/guides" },
};

const LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    blurb: "Learn the rules, settings, and habits that stop early feed deaths.",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    blurb: "Build a pool, track cooldowns, and climb with intentional fight tempo.",
  },
  {
    id: "advanced",
    label: "Advanced",
    blurb: "Teamfight scripts, counters, anti-dive systems, patch adaptation, and mastery.",
  },
] as const;

export default async function GuidesIndexPage() {
  const { guides, heroes } = await getGuidesIndex();
  const heroBySlug = new Map(heroes.map((h) => [h.slug, h]));

  const heroGuides = guides
    .filter((g) => g.slug.endsWith("-how-to-play"))
    .sort((a, b) => a.title.localeCompare(b.title));
  const pathGuides = guides.filter((g) => !g.slug.endsWith("-how-to-play"));

  const latest = guides[0]?.updatedAt ?? new Date();
  const overview = pathGuides.find((g) => g.slug === "marvel-rivals-beginner-guide");

  return (
    <div>
      <PageHero
        eyebrow="How to play"
        title="Guides hub"
        description="Hero how-to-play docs plus a beginner → advanced learning path. Jump to a hero, or follow the curriculum in order."
      />
      <LastUpdated date={latest} />

      {heroGuides.length > 0 ? (
        <section id="hero-guides" className="mb-14">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl text-white">Hero how-to-play guides</h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
                Abilities, fight plan, team ideas, and counters for every Marvel Rivals hero.
              </p>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--neon-pink)]">
              {heroGuides.length} heroes
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {heroGuides.map((guide, idx) => {
              const heroSlug = heroSlugFromGuideSlug(guide.slug);
              const hero = heroSlug ? heroBySlug.get(heroSlug) : null;
              const heroName = hero?.name ?? guide.title.replace(/ Guide:.*/, "");
              const heroHref = heroSlug ? `/marvel-rivals/heroes/${heroSlug}` : null;

              return (
                <article
                  key={guide.id}
                  className="neon-border bg-[rgba(18,18,26,0.85)] p-4 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3">
                    {heroSlug ? (
                      <Link href={heroHref!} prefetch={false} className="shrink-0">
                        <HeroAvatar
                          name={heroName}
                          slug={heroSlug}
                          imageUrl={hero?.imageUrl}
                          size={64}
                          priority={idx < 6}
                        />
                      </Link>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/guides/${guide.slug}`}
                        prefetch={false}
                        className="font-display text-lg text-white hover:text-[var(--neon-cyan)]"
                      >
                        {heroName}
                      </Link>
                      {hero ? (
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--neon-pink)]">
                          {roleLabel(hero.role)}
                        </p>
                      ) : null}
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{guide.excerpt}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                    <Link
                      href={`/guides/${guide.slug}`}
                      prefetch={false}
                      className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--neon-cyan)]"
                    >
                      Open guide →
                    </Link>
                    {heroHref ? (
                      <Link
                        href={heroHref}
                        prefetch={false}
                        className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] hover:text-[var(--neon-cyan)]"
                      >
                        Hero page →
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {overview ? (
        <div className="mb-8 neon-border bg-[rgba(0,255,255,0.05)] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--neon-cyan)]">
            Learning path
          </p>
          <Link
            href={`/guides/${overview.slug}`}
            className="mt-2 inline-block font-display text-xl text-white hover:text-[var(--neon-cyan)]"
          >
            {overview.title}
          </Link>
          <p className="mt-2 text-sm text-[var(--muted)]">{overview.excerpt}</p>
        </div>
      ) : null}

      <AdUnit slot="inarticle" className="mb-8" />

      <div className="mb-10 grid gap-3 sm:grid-cols-3">
        {LEVELS.map((level) => {
          const count = pathGuides.filter((g) => g.level === level.id).length;
          return (
            <a
              key={level.id}
              href={`#${level.id}`}
              className="neon-border cursor-pointer bg-[rgba(18,18,26,0.85)] p-4 transition-transform hover:-translate-y-0.5"
            >
              <p className="font-display text-lg text-white">{level.label}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{level.blurb}</p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--neon-pink)]">
                {count} path guides
              </p>
            </a>
          );
        })}
      </div>

      {LEVELS.map((level) => {
        const levelGuides = pathGuides.filter((g) => g.level === level.id);
        const byGame = new Map<string, typeof levelGuides>();
        for (const guide of levelGuides) {
          const key = guide.game?.name ?? "General";
          const list = byGame.get(key) ?? [];
          list.push(guide);
          byGame.set(key, list);
        }

        return (
          <section key={level.id} id={level.id} className="mb-14">
            <h2 className="font-display text-3xl text-white">{level.label} path</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">{level.blurb}</p>

            {[...byGame.entries()].map(([gameName, list]) => (
              <div key={gameName} className="mt-6">
                <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--neon-cyan)]">
                  {gameName}
                </h3>
                <ol className="mt-3 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                  {list.map((guide, index) => (
                    <li key={guide.id} className="py-4">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="font-mono text-[11px] text-[var(--neon-pink)]">
                          Step {guide.sortOrder || index + 1}
                        </span>
                        <span className="text-xs text-[var(--muted)]">
                          {formatDate(guide.publishedAt)}
                        </span>
                      </div>
                      <Link
                        href={`/guides/${guide.slug}`}
                        className="mt-1 inline-block font-display text-xl text-white hover:text-[var(--neon-cyan)]"
                      >
                        {guide.title}
                      </Link>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
                        {guide.excerpt}
                      </p>
                      <Link
                        href={`/guides/${guide.slug}`}
                        className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--neon-cyan)]"
                      >
                        Open lesson →
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
