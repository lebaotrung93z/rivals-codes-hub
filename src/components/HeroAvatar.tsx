type Props = {
  name: string;
  slug: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
  priority?: boolean;
};

/** Local static webps — skip Next image optimizer (faster lists with many avatars). */
export function HeroAvatar({
  name,
  slug,
  imageUrl,
  size = 40,
  className = "",
  priority = false,
}: Props) {
  const src = imageUrl || `/images/heroes/${slug}.webp`;

  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden border border-[rgba(0,255,255,0.35)] bg-[rgba(0,255,255,0.06)] ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${name} avatar`}
        width={size}
        height={size}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
