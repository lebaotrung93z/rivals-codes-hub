"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { landingImages } from "@/data/landing";
import { SITE_NAME } from "@/lib/site";

type HeroProps = {
  stats: {
    heroes: number;
    patches: number;
    activeCodes: number;
    guides: number;
    latestPatchTitle?: string | null;
  };
};

export function LandingHero({ stats }: HeroProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = scene.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      scene.style.setProperty("--tilt-x", `${y * -8}deg`);
      scene.style.setProperty("--tilt-y", `${x * 10}deg`);
    };

    scene.addEventListener("mousemove", onMove);
    return () => scene.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <Image
        src={landingImages.hero}
        alt="Retro-futuristic neon command grid stretching into a dark void with cyan and magenta holographic panels"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,10,0.92) 0%, rgba(5,5,10,0.72) 42%, rgba(5,5,10,0.45) 100%), linear-gradient(180deg, rgba(5,5,10,0.35) 0%, rgba(5,5,10,0.75) 100%)",
        }}
      />
      <div className="scanlines" aria-hidden />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="font-display text-sm tracking-[0.28em] text-[var(--neon-cyan)] neon-text-cyan sm:text-base">
            {SITE_NAME}
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Marvel Rivals guides &amp; live game codes
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Season tier lists, hero how-to-play guides, and patch notes for Marvel Rivals—plus
            active redeem codes for Genshin Impact, Honkai: Star Rail, and Wuthering Waves. Check
            status labels, then redeem on official pages.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/marvel-rivals/tier-list" className="btn-neon">
              Open tier list
            </Link>
            <Link href="/guides" className="btn-neon btn-neon-pink">
              Browse guides
            </Link>
          </div>
          <dl className="mt-8 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Hero docs", value: String(stats.heroes) },
              { label: "Patch signals", value: String(stats.patches) },
              { label: "Active codes", value: String(stats.activeCodes) },
              { label: "Guides", value: String(stats.guides) },
            ].map((item) => (
              <div key={item.label} className="neon-border bg-[rgba(5,5,10,0.55)] px-3 py-2">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  {item.label}
                </dt>
                <dd className="mt-1 font-display text-lg text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          ref={sceneRef}
          className="perspective-scene relative mx-auto hidden h-[420px] w-full max-w-md sm:block"
        >
          <div
            className="float-3d absolute inset-6 overflow-hidden neon-border bg-[rgba(18,18,26,0.72)]"
            style={{
              transform:
                "rotateX(var(--tilt-x, 8deg)) rotateY(var(--tilt-y, -12deg)) translateZ(40px)",
              transition: "transform 120ms linear",
            }}
          >
            <Image
              src={landingImages.marvelRivals}
              alt="Abstract neon arena combat key art for the Marvel Rivals channel"
              fill
              sizes="400px"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,10,0.95)] via-transparent to-[rgba(5,5,10,0.35)]" />
            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--neon-pink)]">
                <span>HUD // 3D NODE</span>
                <span className="text-[var(--neon-green)]">ONLINE</span>
              </div>
              <div>
                <p className="font-display text-xl text-white">Marvel Rivals rail</p>
                <p className="mt-1 font-mono text-[11px] text-[var(--muted)]">
                  {stats.latestPatchTitle
                    ? `Latest signal: ${stats.latestPatchTitle}`
                    : "Depth stack · parallax tilt · neon glass"}
                </p>
              </div>
            </div>
          </div>
          <div
            className="float-3d float-3d-delayed absolute -right-2 top-10 h-28 w-40 border border-[rgba(255,0,110,0.45)] bg-[rgba(10,10,18,0.88)] p-3 backdrop-blur-sm"
            style={{ transform: "translateZ(80px) rotateY(-18deg)" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--neon-pink)]">
              Patch Sync
            </p>
            <p className="mt-2 font-display text-lg text-white">+{stats.patches}</p>
            <p className="font-mono text-[10px] text-[var(--muted)]">signals indexed</p>
          </div>
          <div
            className="absolute -left-4 bottom-8 h-24 w-36 border border-[rgba(0,255,255,0.4)] bg-[rgba(10,10,18,0.88)] p-3 backdrop-blur-sm"
            style={{ transform: "translateZ(70px) rotateY(16deg)" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--neon-cyan)]">
              Codes Live
            </p>
            <p className="mt-2 font-display text-lg text-white">{stats.activeCodes} ACTIVE</p>
          </div>
        </div>
      </div>
    </section>
  );
}
