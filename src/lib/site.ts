export const SITE_NAME = "Rivals Codes Hub";
export const SITE_TAGLINE =
  "Marvel Rivals tier lists and how-to-play guides, plus live redeem codes for Genshin Impact, Honkai: Star Rail, and Wuthering Waves.";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export function absoluteUrl(path: string) {
  const base = getSiteUrl();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function roleLabel(role: string) {
  switch (role) {
    case "vanguard":
      return "Vanguard";
    case "duelist":
      return "Duelist";
    case "strategist":
      return "Strategist";
    default:
      return role;
  }
}
