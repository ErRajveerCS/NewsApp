import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader({ categories = [] }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="border-b" style={{ borderColor: "var(--hairline)" }}>
      <div className="max-w-6xl mx-auto px-4 pt-3 flex items-center justify-between">
        <span className="dateline">{today}</span>
        <ThemeToggle
          className="dateline border rounded-full px-3 py-1"
          style={{ borderColor: "var(--hairline)" }}
        />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          The Daily Wire Desk
        </Link>
        <Link
          href="/search"
          className="dateline border rounded-full px-4 py-2"
          style={{ borderColor: "var(--hairline)" }}
        >
          Search
        </Link>
      </div>
      <nav className="max-w-6xl mx-auto px-4 pb-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium border-t pt-3" style={{ borderColor: "var(--hairline)" }}>
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="hover:opacity-70">
            {c.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
