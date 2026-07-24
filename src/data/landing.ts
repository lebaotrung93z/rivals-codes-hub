export const landingImages = {
  hero: "/images/landing/hero-neon-grid.png",
  marvelRivals: "/images/landing/game-marvel-rivals.png",
  genshin: "/images/landing/game-genshin.png",
  starRail: "/images/landing/game-star-rail.png",
  wutheringWaves: "/images/landing/game-wuthering-waves.png",
  communitySquad: "/images/landing/community-squad.png",
  communityCodes: "/images/landing/community-codes.png",
  communityMeta: "/images/landing/community-meta.png",
} as const;

export type ShowcaseGame = {
  slug: string;
  name: string;
  tag: string;
  accent: string;
  href: string;
  image: string;
  imageAlt: string;
  blurb: string;
  details: string[];
  highlights: { label: string; value: string }[];
};

export const showcaseGames: ShowcaseGame[] = [
  {
    slug: "marvel-rivals",
    name: "Marvel Rivals",
    tag: "6v6 Competitive Shooter",
    accent: "#00ffff",
    href: "/marvel-rivals/tier-list",
    image: landingImages.marvelRivals,
    imageAlt:
      "Neon stylized key art of abstract armored fighters in a dark competitive arena with cyan and magenta energy",
    blurb:
      "Ranked-focused intel for Vanguard, Duelist, and Strategist pools: live patch signals from Steam news, editorial ranked-impact notes, hero docs, and a competitive tier list tuned for solo-queue consistency.",
    details: [
      "Hero pages cover abilities, counters, difficulty, and practical fight tips—not wiki dumps.",
      "Patch pages pair public changelog signals with original “what changed for ranked” summaries.",
      "Tier list highlights S-tier anchors like Magneto, Spider-Man, Hela, Luna Snow, and Invisible Woman.",
      "Guides include beginner onboarding, ranked climb loops, and anti-dive setups.",
    ],
    highlights: [
      { label: "Roles tracked", value: "3" },
      { label: "Focus", value: "Ranked climb" },
      { label: "Update cadence", value: "Patch + meta" },
    ],
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    tag: "Open-World Redeem Codes",
    accent: "#ff006e",
    href: "/codes/genshin-impact",
    image: landingImages.genshin,
    imageAlt:
      "Neon fantasy landscape with floating islands, cyan ocean, and hot-pink aurora over a dark night sky",
    blurb:
      "Primogem and material codes with strict Active / Expired / Unconfirmed labels, official HoYoverse redeem deep-links, and HowTo/FAQ structured data for search clarity.",
    details: [
      "Starter codes (like GENSHINGIFT) stay marked Active when still valid for new accounts.",
      "Livestream and event codes are flagged Unconfirmed until verification passes.",
      "Expired historical codes remain listed so players stop chasing dead rewards.",
      "Redeem steps point only to genshin.hoyoverse.com/en/gift—never third-party redeem forms.",
    ],
    highlights: [
      { label: "Reward focus", value: "Primogems" },
      { label: "Redeem", value: "Official web" },
      { label: "Status system", value: "3-state" },
    ],
  },
  {
    slug: "honkai-star-rail",
    name: "Honkai: Star Rail",
    tag: "Version Livestream Codes",
    accent: "#0080ff",
    href: "/codes/honkai-star-rail",
    image: landingImages.starRail,
    imageAlt:
      "Luminous interstellar train racing through neon nebulae on cyan energy rails in deep space",
    blurb:
      "Track permanent welcome codes and short-lived Special Program rewards. Status badges and last-checked timestamps reduce the classic “code already expired” frustration.",
    details: [
      "STARRAILGIFT and similar permanent codes stay visible for returning Trailblazers.",
      "Unconfirmed community signals are held for review instead of being published as guaranteed.",
      "Verification jobs age out stale unconfirmed entries after 21 days.",
      "Official redeem path: hsr.hoyoverse.com/gift.",
    ],
    highlights: [
      { label: "Reward focus", value: "Stellar Jade" },
      { label: "Risk control", value: "Needs review" },
      { label: "Region bias", value: "US/EU EN" },
    ],
  },
  {
    slug: "wuthering-waves",
    name: "Wuthering Waves",
    tag: "Patch Astrite Alerts",
    accent: "#22c55e",
    href: "/codes/wuthering-waves",
    image: landingImages.wutheringWaves,
    imageAlt:
      "Stormy neon coastal cliffs with cyan energy waves and a lone warrior silhouette under night sky",
    blurb:
      "Patch-window Astrite and material drops with in-client vs web redeem notes, so Resonators know where to enter codes and when a listing is still provisional.",
    details: [
      "Active codes surface first; expired event packs stay archived for clarity.",
      "Unconfirmed ingest items from the local/remote feed never silently look “guaranteed.”",
      "Channel page includes HowTo redeem steps and FAQ JSON-LD for SEO.",
      "Designed as a secondary lane beside Marvel Rivals—high recurring search, light editorial load.",
    ],
    highlights: [
      { label: "Reward focus", value: "Astrite" },
      { label: "Cadence", value: "Patch events" },
      { label: "Priority", value: "Secondary lane" },
    ],
  },
];

export const communityFeatures = [
  {
    title: "Squad signal board",
    href: "/guides",
    image: landingImages.communitySquad,
    imageAlt: "Neon squad command board with holographic chat panels and geometric operator silhouettes",
    body: "Beginner → advanced how-to-play paths for Marvel Rivals and our code games — lessons with drills, not tip spam.",
    bullets: [
      "Marvel Rivals path: roles, settings, die-less habits, then climb systems.",
      "Intermediate: hero pools, cooldown tracking, ultimate economy, comps.",
      "Advanced: teamfight scripts, anti-dive, patch adaptation, VOD review, hero mastery.",
    ],
  },
  {
    title: "Live code sentries",
    href: "/codes",
    image: landingImages.communityCodes,
    imageAlt: "Holographic terminals monitoring glowing redeem code strings with cyan scan beams",
    body: "A multi-game codes hub that refuses to mix Active with Expired. Every listing shows rewards, last-checked time, and review state.",
    bullets: [
      "Genshin Impact, Honkai: Star Rail, and Wuthering Waves in one rail.",
      "Hourly ingest from local feed + optional remote JSON source.",
      "Auto-expire by date and stale-unconfirmed aging for safer publishing.",
    ],
  },
  {
    title: "Meta war room",
    href: "/marvel-rivals/tier-list",
    image: landingImages.communityMeta,
    imageAlt: "Holographic tier pillars and projected strategy map inside a neon command room",
    body: "Competitive tier snapshots plus per-hero docs so newer players can pick a pool that survives the current patch window.",
    bullets: [
      "S–D editorial tiers with role context and why-notes.",
      "Hero pages with counters and practical tips linked from the tier table.",
      "Patch feed keeps the war room honest after each balance drop.",
    ],
  },
];
