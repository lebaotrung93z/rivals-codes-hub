import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

const links = [
  { href: "/#showcase", label: "Games" },
  { href: "/#community", label: "Community" },
  { href: "/marvel-rivals/tier-list", label: "Tier List" },
  { href: "/codes", label: "Codes" },
  { href: "/guides", label: "Guides" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(5,5,10,0.82)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="font-display text-sm tracking-[0.18em] text-white cursor-pointer hover:text-[var(--neon-cyan)] transition-colors"
        >
          <span className="neon-text-cyan">{SITE_NAME}</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer hover:text-[var(--neon-cyan)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-[var(--muted)]">
        <p className="font-display text-xs tracking-[0.16em] text-[var(--neon-cyan)]">
          {SITE_NAME}
        </p>
        <p>
          Editorial summaries and status tables only. Always redeem and verify on official game
          pages. Not affiliated with Marvel, NetEase, HoYoverse, or Kuro Games.
        </p>
        <p className="font-mono text-xs">US/EU English</p>
      </div>
    </footer>
  );
}

export function ContentFrame({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>;
}
