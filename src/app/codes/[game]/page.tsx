import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CodeStatus } from "@prisma/client";
import { AdUnit } from "@/components/AdSense";
import { LastUpdated, PageHero, StatusBadge } from "@/components/Content";
import { getCodeGames, getCodesForGame } from "@/lib/queries";
import { absoluteUrl, formatDate } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ game: string }> };

type CodeRow = {
  id: string;
  code: string;
  status: CodeStatus;
  rewards: string;
  firstSeenAt: Date;
  lastCheckedAt: Date;
  expiresAt: Date | null;
  sourceName: string | null;
  sourceUrl: string | null;
};

const allowed = new Set(["genshin-impact", "honkai-star-rail", "wuthering-waves"]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game: slug } = await params;
  const game = await getCodesForGame(slug);
  if (!game) return { title: "Codes not found" };
  return {
    title: `${game.name} Codes (Active & Expired)`,
    description: `Current ${game.name} redeem codes with Active, Expired, and Unconfirmed status plus official redeem steps.`,
    alternates: { canonical: `/codes/${game.slug}` },
    openGraph: {
      title: `${game.name} Redeem Codes`,
      description: `Track active ${game.name} codes and redeem on the official gift page.`,
      url: absoluteUrl(`/codes/${game.slug}`),
    },
  };
}

export async function generateStaticParams() {
  try {
    const games = await getCodeGames();
    return games.map((g) => ({ game: g.slug }));
  } catch {
    return [...allowed].map((game) => ({ game }));
  }
}

export default async function GameCodesPage({ params }: Props) {
  const { game: slug } = await params;
  if (!allowed.has(slug)) notFound();
  const game = await getCodesForGame(slug);
  if (!game) notFound();

  const active = game.codes.filter((c) => c.status === "active");
  const unconfirmed = game.codes.filter((c) => c.status === "unconfirmed");
  const expired = game.codes.filter((c) => c.status === "expired");
  const latest = game.codes[0]?.lastCheckedAt ?? new Date();

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to redeem ${game.name} codes`,
    step: [
      {
        "@type": "HowToStep",
        name: "Open the official redemption page",
        text: game.redeemUrl
          ? `Visit ${game.redeemUrl} and sign in.`
          : "Open the official in-game or web redemption tool and sign in.",
      },
      {
        "@type": "HowToStep",
        name: "Enter an active code",
        text: "Copy an Active code from this page exactly as shown and submit it.",
      },
      {
        "@type": "HowToStep",
        name: "Claim rewards in-game",
        text: "Check in-game mail or inventory for delivered rewards.",
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Are these ${game.name} codes guaranteed to work?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Only Active codes that still redeem on the official page should be trusted. Unconfirmed codes need verification. Expired codes are kept for historical clarity.",
        },
      },
      {
        "@type": "Question",
        name: `Where should I redeem ${game.name} codes?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: game.redeemUrl
            ? `Redeem only on the official page: ${game.redeemUrl}`
            : "Redeem only through official in-game or publisher redemption tools.",
        },
      },
    ],
  };

  function CodeTable({
    title,
    rows,
  }: {
    title: string;
    rows: CodeRow[];
  }) {
    return (
      <section className="mt-8">
        <h2 className="font-display text-2xl text-[var(--ink)]">{title}</h2>
        {rows.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">No codes in this status right now.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--muted)]">
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Code</th>
                  <th className="py-2 pr-3 font-medium">Rewards</th>
                  <th className="py-2 font-medium">Checked</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((code) => (
                  <tr key={code.id} className="border-b border-[var(--line)] align-top">
                    <td className="py-3 pr-3">
                      <StatusBadge status={code.status} />
                    </td>
                    <td className="py-3 pr-3 font-mono text-[var(--ink)]">{code.code}</td>
                    <td className="py-3 pr-3 text-[var(--muted)]">{code.rewards}</td>
                    <td className="py-3 text-[var(--muted)]">{formatDate(code.lastCheckedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  }

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <PageHero
        eyebrow="Redeem codes"
        title={`${game.name} codes`}
        description={`${game.description ?? ""} Clear Active vs Expired labeling is the point of this page—skip stale listicles.`}
      />
      <LastUpdated date={latest} />
      {game.redeemUrl ? (
        <p className="mt-3 text-sm">
          Official redeem page:{" "}
          <a
            href={game.redeemUrl}
            className="text-[var(--accent-2)] underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            {game.redeemUrl}
          </a>
        </p>
      ) : null}

      <AdUnit slot="codes" className="my-6" />

      <CodeTable title="Active codes" rows={active} />
      <AdUnit slot="inarticle" className="my-6" />
      <CodeTable title="Unconfirmed codes" rows={unconfirmed} />
      <CodeTable title="Expired codes" rows={expired} />

      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-2xl text-[var(--ink)]">How to redeem</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-[var(--muted)]">
          <li>Open the official redemption page linked above and sign in.</li>
          <li>Paste an Active code exactly as shown.</li>
          <li>Submit, then claim rewards from in-game mail/inventory.</li>
        </ol>
      </section>

      <p className="mt-8 text-sm">
        <Link href="/codes" className="text-[var(--accent-2)]">
          ← All code games
        </Link>
      </p>
    </article>
  );
}
