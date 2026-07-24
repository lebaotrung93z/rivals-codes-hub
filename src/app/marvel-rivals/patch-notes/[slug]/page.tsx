import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdUnit } from "@/components/AdSense";
import { LastUpdated, PageHero } from "@/components/Content";
import { getPatchBySlug, getPatches } from "@/lib/queries";
import { absoluteUrl, formatDate } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const patch = await getPatchBySlug(slug);
  if (!patch) return { title: "Patch not found" };
  return {
    title: `${patch.title} · Marvel Rivals`,
    description: patch.summary,
    alternates: { canonical: `/marvel-rivals/patch-notes/${patch.slug}` },
    openGraph: {
      title: patch.title,
      description: patch.summary,
      url: absoluteUrl(`/marvel-rivals/patch-notes/${patch.slug}`),
    },
  };
}

export async function generateStaticParams() {
  try {
    const patches = await getPatches();
    return patches.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function PatchDetailPage({ params }: Props) {
  const { slug } = await params;
  const patch = await getPatchBySlug(slug);
  if (!patch) notFound();

  const changelog = Array.isArray(patch.changelog)
    ? (patch.changelog as { hero?: string; change?: string }[])
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: patch.title,
    datePublished: patch.publishedAt.toISOString(),
    dateModified: patch.updatedAt.toISOString(),
    description: patch.summary,
    mainEntityOfPage: absoluteUrl(`/marvel-rivals/patch-notes/${patch.slug}`),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow={`Version ${patch.version}`}
        title={patch.title}
        description={patch.summary}
      />
      <LastUpdated date={patch.updatedAt} />
      <p className="mt-2 text-sm text-[var(--muted)]">
        Published {formatDate(patch.publishedAt)}
        {patch.sourceUrl ? (
          <>
            {" "}
            ·{" "}
            <a href={patch.sourceUrl} className="text-[var(--accent-2)] underline" rel="nofollow noopener noreferrer" target="_blank">
              Official / public source
            </a>
          </>
        ) : null}
      </p>

      <AdUnit slot="inarticle" className="my-6" />

      <section className="mt-6">
        <h2 className="font-display text-2xl text-[var(--ink)]">What changed for ranked</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--muted)]">
          {patch.rankedImpact.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl text-[var(--ink)]">Changelog highlights</h2>
        <ul className="mt-3 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {changelog.map((row, idx) => (
            <li key={`${row.change}-${idx}`} className="py-3 text-sm text-[var(--muted)]">
              {row.hero ? <strong className="text-[var(--ink)]">{row.hero}: </strong> : null}
              {row.change}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-sm text-[var(--muted)]">
        <Link href="/marvel-rivals/patch-notes" className="text-[var(--accent-2)]">
          ← All patch notes
        </Link>
        {" · "}
        <Link href="/marvel-rivals/tier-list" className="text-[var(--accent-2)]">
          Update your pool via the tier list
        </Link>
      </p>
    </article>
  );
}
