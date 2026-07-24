import Image from "next/image";
import Link from "next/link";
import { communityFeatures } from "@/data/landing";

type Pulse = {
  heroes: number;
  patches: number;
  activeCodes: number;
  unconfirmedCodes: number;
  expiredCodes: number;
  guides: number;
  sTier: string[];
};

export function CommunitySection({ pulse }: { pulse: Pulse }) {
  return (
    <section id="community" className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--neon-cyan)]">
          Community features
        </p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl text-white sm:text-4xl">
          Built for crews who grind together
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
          Three collaboration surfaces keep a stack synchronized: editorial guides for shared
          language, code sentries that refuse stale lists, and a meta war room anchored to the live
          S-tier pool
          {pulse.sTier.length ? ` (${pulse.sTier.join(", ")})` : ""}.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {communityFeatures.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group neon-border overflow-hidden bg-[rgba(18,18,26,0.85)] transition-transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={feature.image}
                  alt={feature.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,10,0.95)] to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{feature.body}</p>
                <ul className="mt-4 space-y-2 text-xs leading-relaxed text-[var(--muted)]">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-1 h-1 w-1 shrink-0 bg-[var(--neon-pink)]" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--neon-cyan)]">
                  Join channel →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-3 border border-[var(--line)] bg-[rgba(0,255,255,0.04)] px-5 py-5 sm:grid-cols-[auto_1fr]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--neon-green)]">
            Live pulse
          </p>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            <span className="text-white">{pulse.heroes}</span> hero docs ·{" "}
            <span className="text-white">{pulse.patches}</span> patch signals ·{" "}
            <span className="text-white">{pulse.activeCodes}</span> active codes ·{" "}
            <span className="text-white">{pulse.unconfirmedCodes}</span> unconfirmed ·{" "}
            <span className="text-white">{pulse.expiredCodes}</span> expired archive ·{" "}
            <span className="text-white">{pulse.guides}</span> editorial guides indexed now
          </p>
        </div>
      </div>
    </section>
  );
}
