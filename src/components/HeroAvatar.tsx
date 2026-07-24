import Image from "next/image";

type Props = {
  name: string;
  slug: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
};

export function HeroAvatar({ name, slug, imageUrl, size = 40, className = "" }: Props) {
  const src = imageUrl || `/images/heroes/${slug}.webp`;

  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden border border-[rgba(0,255,255,0.35)] bg-[rgba(0,255,255,0.06)] ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={`${name} avatar`}
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
