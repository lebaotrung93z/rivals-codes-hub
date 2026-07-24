import { formatDate } from "@/lib/site";

export function LastUpdated({ date }: { date: Date | string }) {
  return (
    <p className="text-sm text-[var(--muted)]">
      Last updated: <time dateTime={new Date(date).toISOString()}>{formatDate(date)}</time>
    </p>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "active"
      ? "border border-[rgba(34,197,94,0.5)] bg-[rgba(34,197,94,0.15)] text-[var(--neon-green)]"
      : status === "expired"
        ? "border border-[rgba(148,163,184,0.35)] bg-[rgba(148,163,184,0.12)] text-[var(--muted)]"
        : "border border-[rgba(255,0,110,0.45)] bg-[rgba(255,0,110,0.12)] text-[var(--neon-pink)]";

  return (
    <span className={`inline-flex px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] ${styles}`}>
      {status}
    </span>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow ? (
        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--neon-cyan)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-display text-3xl leading-tight text-white sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">{description}</p>
    </div>
  );
}
