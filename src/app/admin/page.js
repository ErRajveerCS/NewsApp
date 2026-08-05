import { queryOne, query } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const totalArticles = (await queryOne("SELECT COUNT(*) c FROM articles")).c;
  const published = (await queryOne("SELECT COUNT(*) c FROM articles WHERE status='published'")).c;
  const drafts = (await queryOne("SELECT COUNT(*) c FROM articles WHERE status='draft'")).c;
  const totalViews = (await queryOne("SELECT COALESCE(SUM(views),0) v FROM articles")).v;
  const pendingComments = (await queryOne("SELECT COUNT(*) c FROM comments WHERE approved=0")).c;
  const subscribers = (await queryOne("SELECT COUNT(*) c FROM subscribers")).c;
  const topArticles = await query(
    "SELECT title, slug, views FROM articles WHERE status='published' ORDER BY views DESC LIMIT 5"
  );

  const stats = [
    { label: "Total Articles", value: totalArticles },
    { label: "Published", value: published },
    { label: "Drafts", value: drafts },
    { label: "Total Pageviews", value: totalViews },
    { label: "Pending Comments", value: pendingComments },
    { label: "Newsletter Subscribers", value: subscribers },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="border rounded-lg p-4" style={{ borderColor: "var(--hairline)" }}>
            <div className="dateline mb-1">{s.label}</div>
            <div className="font-display text-3xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-lg font-semibold mb-3">Top performing articles</h2>
      <div className="border rounded-lg divide-y" style={{ borderColor: "var(--hairline)" }}>
        {topArticles.map((a) => (
          <Link
            key={a.slug}
            href={`/article/${a.slug}`}
            target="_blank"
            className="flex justify-between px-4 py-3 text-sm hover:opacity-70"
          >
            <span>{a.title}</span>
            <span className="dateline">{a.views} views</span>
          </Link>
        ))}
        {topArticles.length === 0 && <p className="p-4 text-sm dateline">No published articles yet.</p>}
      </div>
    </div>
  );
}
