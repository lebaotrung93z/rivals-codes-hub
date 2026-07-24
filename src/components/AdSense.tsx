"use client";

import Script from "next/script";

type Slot = "inarticle" | "sidebar" | "codes";

const slotEnv: Record<Slot, string | undefined> = {
  inarticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE,
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  codes: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CODES,
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSenseScript() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return null;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

export function AdUnit({
  slot,
  className = "",
}: {
  slot: Slot;
  className?: string;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adSlot = slotEnv[slot];

  if (!client || !adSlot) {
    return (
      <div
        className={`flex min-h-[90px] items-center justify-center border border-dashed border-[var(--line)] bg-[var(--surface-2)] text-xs text-[var(--muted)] ${className}`}
        aria-hidden
      >
        AdSense slot ({slot}) — set NEXT_PUBLIC_ADSENSE_CLIENT and slot env vars
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block min-h-[90px] ${className}`}
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
      ref={(el) => {
        if (!el || el.dataset.loaded) return;
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          el.dataset.loaded = "1";
        } catch {
          // ignore adsense push errors in dev
        }
      }}
    />
  );
}
