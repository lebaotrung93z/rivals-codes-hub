import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdUnit } from "@/components/AdSense";
import { LastUpdated, PageHero } from "@/components/Content";
import { HeroAvatar } from "@/components/HeroAvatar";
import { prisma } from "@/lib/db";
import { heroSlugFromGuideSlug } from "@/lib/guides";
import { getGuideBySlug } from "@/lib/queries";
import { absoluteUrl, formatDate, roleLabel } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

function renderGuideBody(body: string) {
  const blocks = body.trim().split(/\n\n+/);
  return blocks.map((block, index) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={index} className="font-display text-2xl text-[var(--neon-cyan)]">
          {block.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3 key={index} className="font-display text-xl text-white">
          {block.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (block.startsWith("- ")) {
      const items = block.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={index} className="list-disc space-y-1 pl-5 text-[var(--muted)]">
          {items.map((item) => (
            <li key={item}>{formatInline(item.replace(/^-+\s*/, ""))}</li>
          ))}
        </ul>
      );
    }
    if (/^\d+\.\s/.test(block)) {
      const items = block.split("\n").filter((l) => /^\d+\.\s/.test(l));
      return (
        <ol key={index} className="list-decimal space-y-1 pl-5 text-[var(--muted)]">
          {items.map((item) => (
            <li key={item}>{formatInline(item.replace(/^\d+\.\s*/, ""))}</li>
          ))}
        </ol>
      );
    }
    // Mixed block: heading line + list lines
    const lines = block.split("\n");
    if (lines[0]?.startsWith("### ") || lines.some((l) => l.startsWith("- "))) {
      return (
        <div key={index} className="space-y-2">
          {lines.map((line, li) => {
            if (line.startsWith("### ")) {
              return (
                <h3 key={li} className="font-display text-xl text-white">
                  {line.replace(/^###\s+/, "")}
                </h3>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <p key={li} className="pl-5 text-[var(--muted)] before:content-['•_']">
                  {formatInline(line.replace(/^-+\s*/, ""))}
                </p>
              );
            }
            if (!line.trim()) return null;
            return (
              <p key={li} className="leading-relaxed text-[var(--muted)]">
                {formatInline(line)}
              </p>
            );
          })}
        </div>
      );
    }
    return (
      <p key={index} className="leading-relaxed text-[var(--muted)]">
        {formatInline(block)}
      </p>
    );
  });
}

function formatInline(text: string) {
  const parts = text.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    const link = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (link) {
      return (
        <Link key={i} href={link[2]} className="text-[var(--neon-cyan)] underline">
          {link[1]}
        </Link>
      );
    }
    const bold = part.match(/^\*\*(.*?)\*\*$/);
    if (bold) {
      return (
        <strong key={i} className="text-white">
          {bold[1]}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return { title: "Guide not found" };

  const heroSlug = heroSlugFromGuideSlug(guide.slug);
  const hero = heroSlug
    ? await prisma.hero.findFirst({
        where: { slug: heroSlug, game: { slug: "marvel-rivals" } },
        select: { imageUrl: true },
      })
    : null;
  const image = hero?.imageUrl || (heroSlug ? `/images/heroes/${heroSlug}.webp` : undefined);

  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      url: absoluteUrl(`/guides/${guide.slug}`),
      ...(image ? { images: [{ url: absoluteUrl(image) }] } : {}),
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  const heroSlug = heroSlugFromGuideSlug(guide.slug);
  const hero = heroSlug
    ? await prisma.hero.findFirst({
        where: { slug: heroSlug, game: { slug: "marvel-rivals" } },
        select: {
          slug: true,
          name: true,
          role: true,
          imageUrl: true,
          tierEntries: { take: 1, select: { tier: true } },
        },
      })
    : null;

  const pathGuides = await prisma.guide.findMany({
    where: {
      gameId: guide.gameId,
      level: guide.level,
      NOT: { slug: { endsWith: "-how-to-play" } },
    },
    orderBy: { sortOrder: "asc" },
  });

  const relatedHeroGuides = hero
    ? await prisma.guide.findMany({
        where: {
          gameId: guide.gameId,
          slug: { endsWith: "-how-to-play" },
          NOT: { slug: guide.slug },
        },
        orderBy: { title: "asc" },
        take: 8,
      })
    : [];

  const pathForNav = hero
    ? await prisma.guide.findMany({
        where: { gameId: guide.gameId, slug: { endsWith: "-how-to-play" } },
        orderBy: { title: "asc" },
      })
    : pathGuides;

  const idx = pathForNav.findIndex((g) => g.id === guide.id);
  const prev = idx > 0 ? pathForNav[idx - 1] : null;
  const next = idx >= 0 && idx < pathForNav.length - 1 ? pathForNav[idx + 1] : null;

  const related =
    relatedHeroGuides.length > 0
      ? relatedHeroGuides
      : await prisma.guide.findMany({
          where: {
            gameId: guide.gameId,
            id: { not: guide.id },
            level: guide.level,
            NOT: { slug: { endsWith: "-how-to-play" } },
          },
          orderBy: { sortOrder: "asc" },
          take: 8,
        });

  const sections = (guide.body.match(/^## /gm) ?? []).length;
  const wordCount = guide.body.split(/\s+/).filter(Boolean).length;
  const levelLabel =
    guide.level === "beginner"
      ? "Beginner"
      : guide.level === "intermediate"
        ? "Intermediate"
        : "Advanced";
  const tier = hero?.tierEntries[0]?.tier;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishedAt.toISOString(),
    dateModified: guide.updatedAt.toISOString(),
    wordCount,
    mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`),
    ...(hero?.imageUrl
      ? { image: absoluteUrl(hero.imageUrl) }
      : heroSlug
        ? { image: absoluteUrl(`/images/heroes/${heroSlug}.webp`) }
        : {}),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-[var(--neon-pink)]">
        {hero ? `${roleLabel(hero.role)}${tier ? ` · ${tier}-tier` : ""}` : `${levelLabel} lesson`}
        {guide.game ? ` · ${guide.game.name}` : ""}
        {!hero && guide.sortOrder ? ` · Step ${guide.sortOrder}` : ""}
      </p>

      <div className="mb-6 flex flex-wrap items-start gap-5">
        {hero ? (
          <Link href={`/marvel-rivals/heroes/${hero.slug}`} className="shrink-0">
            <HeroAvatar
              name={hero.name}
              slug={hero.slug}
              imageUrl={hero.imageUrl}
              size={112}
            />
          </Link>
        ) : null}
        <div className="min-w-0 flex-1">
          <PageHero title={guide.title} description={guide.excerpt} />
          {hero ? (
            <div className="mt-3 flex flex-wrap gap-4">
              <Link
                href={`/marvel-rivals/heroes/${hero.slug}`}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--neon-cyan)]"
              >
                {hero.name} hero page →
              </Link>
              <Link
                href="/marvel-rivals/tier-list"
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] hover:text-[var(--neon-cyan)]"
              >
                Tier list →
              </Link>
              <Link
                href="/guides#hero-guides"
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] hover:text-[var(--neon-cyan)]"
              >
                All hero guides →
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
        <LastUpdated date={guide.updatedAt} />
        <span>Published {formatDate(guide.publishedAt)}</span>
        <span>{sections} sections</span>
        <span>~{wordCount} words</span>
      </div>
      <AdUnit slot="inarticle" className="my-6" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-8">
          <div className="prose-guide space-y-4">{renderGuideBody(guide.body)}</div>
          <div className="flex flex-wrap justify-between gap-3 border-t border-[var(--line)] pt-6">
            {prev ? (
              <Link href={`/guides/${prev.slug}`} className="text-sm text-[var(--neon-cyan)]">
                ← Previous: {prev.title.replace(/ Guide:.*/, "")}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/guides/${next.slug}`} className="text-sm text-[var(--neon-cyan)]">
                Next: {next.title.replace(/ Guide:.*/, "")} →
              </Link>
            ) : null}
          </div>
        </div>
        <aside className="space-y-6">
          <AdUnit slot="sidebar" />
          {hero ? (
            <div className="neon-border bg-[rgba(18,18,26,0.85)] p-4">
              <div className="flex items-center gap-3">
                <HeroAvatar
                  name={hero.name}
                  slug={hero.slug}
                  imageUrl={hero.imageUrl}
                  size={48}
                />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--neon-pink)]">
                    Hero
                  </p>
                  <Link
                    href={`/marvel-rivals/heroes/${hero.slug}`}
                    className="font-display text-lg text-white hover:text-[var(--neon-cyan)]"
                  >
                    {hero.name}
                  </Link>
                </div>
              </div>
              <Link
                href={`/marvel-rivals/heroes/${hero.slug}`}
                className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--neon-cyan)]"
              >
                Open hero page →
              </Link>
            </div>
          ) : null}
          <div className="neon-border bg-[rgba(18,18,26,0.85)] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--neon-pink)]">
              {hero ? "More hero guides" : "Same level path"}
            </p>
            <ul className="mt-3 space-y-3">
              {related.map((item) => {
                const relatedHeroSlug = heroSlugFromGuideSlug(item.slug);
                return (
                  <li key={item.id} className="flex items-center gap-2">
                    {relatedHeroSlug ? (
                      <HeroAvatar
                        name={item.title}
                        slug={relatedHeroSlug}
                        size={28}
                      />
                    ) : null}
                    <Link
                      href={`/guides/${item.slug}`}
                      className="text-sm text-[var(--neon-cyan)] hover:underline"
                    >
                      {item.title.replace(/ Guide:.*/, "")}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <Link href="/guides" className="text-sm text-[var(--neon-cyan)]">
            Full guides hub
          </Link>
        </aside>
      </div>
      <p className="mt-8 text-sm">
        <Link href="/guides" className="text-[var(--neon-cyan)]">
          ← All guides
        </Link>
      </p>
    </article>
  );
}
