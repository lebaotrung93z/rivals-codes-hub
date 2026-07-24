"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { showcaseGames } from "@/data/landing";

export function GameShowcaseCarousel() {
  const games = showcaseGames;
  const [index, setIndex] = useState(0);
  const total = games.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(next, 5500);
    return () => window.clearInterval(id);
  }, [next]);

  const active = games[index];

  return (
    <section id="showcase" className="relative border-y border-[var(--line)] bg-[rgba(10,10,20,0.95)] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--neon-pink)]">
              Game showcase
            </p>
            <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">Featured ops channels</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              Four live rails on one platform: Marvel Rivals for competitive meta depth, plus three
              high-recurrence redeem-code channels for gacha players who need status-honest lists.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              className="btn-neon !px-3 !py-2 cursor-pointer"
              aria-label="Previous game"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={next}
              className="btn-neon btn-neon-pink !px-3 !py-2 cursor-pointer"
              aria-label="Next game"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <article className="relative overflow-hidden neon-border bg-[rgba(5,5,10,0.85)]">
            <div className="relative h-56 w-full sm:h-72">
              <Image
                src={active.image}
                alt={active.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,10,0.95)] via-[rgba(5,5,10,0.35)] to-transparent" />
              <p
                className="absolute left-5 top-5 font-mono text-xs uppercase tracking-[0.2em]"
                style={{ color: active.accent, textShadow: `0 0 12px ${active.accent}` }}
              >
                {active.tag}
              </p>
            </div>

            <div className="space-y-5 p-6 sm:p-8">
              <h3 className="font-display text-3xl text-white sm:text-4xl">{active.name}</h3>
              <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{active.blurb}</p>

              <ul className="space-y-2 text-sm text-[var(--muted)]">
                {active.details.map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-[var(--neon-cyan)]" aria-hidden />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              <dl className="grid gap-3 sm:grid-cols-3">
                {active.highlights.map((item) => (
                  <div key={item.label} className="border border-[var(--line)] bg-[rgba(0,255,255,0.04)] px-3 py-2">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                      {item.label}
                    </dt>
                    <dd className="mt-1 font-display text-sm text-white">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <Link href={active.href} className="btn-neon inline-flex">
                Enter {active.name} channel
              </Link>

              <div className="flex gap-2 pt-2" role="tablist" aria-label="Showcase slides">
                {games.map((game, i) => (
                  <button
                    key={game.slug}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show ${game.name}`}
                    onClick={() => setIndex(i)}
                    className="h-2 cursor-pointer transition-all"
                    style={{
                      width: i === index ? 36 : 16,
                      background: i === index ? active.accent : "rgba(148,163,184,0.35)",
                    }}
                  />
                ))}
              </div>
            </div>
          </article>

          <div className="overflow-hidden">
            <div className="carousel-track gap-4 pr-4">
              {[...games, ...games].map((game, i) => (
                <button
                  key={`${game.slug}-${i}`}
                  type="button"
                  onClick={() => setIndex(i % total)}
                  className="neon-border w-[240px] shrink-0 cursor-pointer overflow-hidden bg-[var(--surface)] text-left transition-transform hover:-translate-y-1"
                >
                  <div className="relative h-28 w-full">
                    <Image
                      src={game.image}
                      alt={game.imageAlt}
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                      {game.tag}
                    </p>
                    <p className="mt-2 font-display text-sm text-white">{game.name}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
              Hover strip to pause · Click a tile to focus
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
