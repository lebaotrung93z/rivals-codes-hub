import type { Metadata } from "next";
import Link from "next/link";
import { AdUnit } from "@/components/AdSense";
import { LastUpdated, PageHero } from "@/components/Content";
import { getPatches } from "@/lib/queries";
import { formatDate } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Marvel Rivals Patch Notes",
  description:
    "Marvel Rivals patch notes feed with editorial ranked impact summaries sourced from public Steam/official signals.",
  alternates: { canonical: "/marvel-rivals/patch-notes" },
};

export default async function PatchNotesIndexPage() {
  const patches = await getPatches();
  const latest = patches[0]?.updatedAt ?? new Date();

  return (
    <div>
      <PageHero
        eyebrow="Marvel Rivals"
        title="Patch notes & ranked impact"
        description="Chronological patch feed. Each entry pairs public changelog signals with an original ranked-impact summary."
      />
      <LastUpdated date={latest} />
      <AdUnit slot="inarticle" className="my-6" />
      <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {patches.map((patch) => (
          <li key={patch.id} className="py-5">
            <Link
              href={`/marvel-rivals/patch-notes/${patch.slug}`}
              className="font-display text-xl text-[var(--ink)] hover:text-[var(--accent)]"
            >
              {patch.title}
            </Link>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {formatDate(patch.publishedAt)} · Version {patch.version}
              {patch.sourceName ? ` · Source: ${patch.sourceName}` : ""}
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
              {patch.summary}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
