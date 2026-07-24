/** Extract hero slug from `slug-how-to-play` guide slugs. */
export function heroSlugFromGuideSlug(guideSlug: string): string | null {
  if (!guideSlug.endsWith("-how-to-play")) return null;
  return guideSlug.slice(0, -"-how-to-play".length);
}
