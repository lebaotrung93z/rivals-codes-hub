import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdUnit } from "@/components/AdSense";
import { LastUpdated, PageHero } from "@/components/Content";
import { HeroAvatar } from "@/components/HeroAvatar";
import { getHeroBySlug } from "@/lib/queries";
import { absoluteUrl, roleLabel } from "@/lib/site";

export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hero = await getHeroBySlug(slug);
  if (!hero) return { title: "Hero not found" };
  const image = hero.imageUrl || `/images/heroes/${hero.slug}.webp`;
  return {
    title: `${hero.name} Guide · Marvel Rivals`,
    description: hero.summary,
    alternates: { canonical: `/marvel-rivals/heroes/${hero.slug}` },
    openGraph: {
      title: `${hero.name} Marvel Rivals Guide`,
      description: hero.summary,
      url: absoluteUrl(`/marvel-rivals/heroes/${hero.slug}`),
      images: [{ url: absoluteUrl(image) }],
    },
  };
}

export async function generateStaticParams() {
  // On-demand ISR — avoid prerendering all heroes at build (Neon pool limits).
  return [];
}

export default async function HeroPage({ params }: Props) {
  const { slug } = await params;
  const hero = await getHeroBySlug(slug);
  if (!hero) notFound();

  const abilities = Array.isArray(hero.abilities)
    ? (hero.abilities as { name: string; description: string }[])
    : [];
  const tier = hero.tierEntries[0]?.tier;
  const image = hero.imageUrl || `/images/heroes/${hero.slug}.webp`;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What role is ${hero.name} in Marvel Rivals?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${hero.name} is a ${roleLabel(hero.role)}. ${hero.summary}`,
        },
      },
      {
        "@type": "Question",
        name: `How do you play ${hero.name} effectively?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: hero.tips.join(" "),
        },
      },
    ],
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="mb-6 flex flex-wrap items-start gap-5">
        <HeroAvatar
          name={hero.name}
          slug={hero.slug}
          imageUrl={hero.imageUrl}
          size={112}
          priority
        />
        <div className="min-w-0 flex-1">
          <PageHero
            eyebrow={`${roleLabel(hero.role)}${tier ? ` · ${tier}-tier` : ""}`}
            title={`${hero.name} guide`}
            description={hero.summary}
          />
        </div>
      </div>
      <LastUpdated date={hero.updatedAt} />
      <AdUnit slot="inarticle" className="my-6" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-2xl text-white">Abilities</h2>
            <ul className="mt-3 space-y-3">
              {abilities.map((ability) => (
                <li key={ability.name} className="border-b border-[var(--line)] pb-3">
                  <p className="font-medium text-white">{ability.name}</p>
                  <p className="text-sm text-[var(--muted)]">{ability.description}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-white">Tips</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--muted)]">
              {hero.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-white">Common counters</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{hero.counters.join(", ")}</p>
          </section>
        </div>
        <aside className="space-y-4">
          <AdUnit slot="sidebar" />
          <p className="text-sm text-[var(--muted)]">Difficulty: {hero.difficulty}/5</p>
          <Link
            href={`/guides/${hero.slug}-how-to-play`}
            className="block text-sm text-[var(--neon-cyan)] hover:underline"
          >
            Full how-to-play guide →
          </Link>
          <Link href="/guides#hero-guides" className="block text-sm text-[var(--muted)] hover:text-[var(--neon-cyan)]">
            All hero guides
          </Link>
          <Link href="/marvel-rivals/tier-list" className="block text-sm text-[var(--neon-cyan)]">
            Back to tier list
          </Link>
        </aside>
      </div>
    </article>
  );
}
