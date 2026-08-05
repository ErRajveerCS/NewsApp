import Link from "next/link";

export default function BreakingTicker({ items = [] }) {
  if (!items.length) return null;
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "var(--signal)" }} className="text-white overflow-hidden">
      <div className="max-w-6xl mx-auto flex items-center">
        <span className="font-mono text-xs font-bold uppercase tracking-wider px-3 py-2 shrink-0">
          Breaking
        </span>
        <div className="relative flex-1 overflow-hidden h-8">
          <div className="ticker-track absolute whitespace-nowrap flex gap-10 items-center h-8">
            {doubled.map((a, i) => (
              <Link key={i} href={`/article/${a.slug}`} className="text-sm hover:underline">
                {a.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
