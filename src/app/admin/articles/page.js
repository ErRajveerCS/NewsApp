import Link from "next/link";
import { getAllArticlesAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

const statusColors = {
  draft: "#9aa0aa",
  review: "#c99a1f",
  published: "#0f6b66",
  archived: "#6b7280",
};

export default async function ArticlesAdminPage() {
  const articles = await getAllArticlesAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Articles</h1>
        <Link href="/admin/articles/new" className="rounded-full px-4 py-2 text-sm text-white" style={{ background: "var(--ink)" }}>
          + New Article
        </Link>
      </div>
      <div className="border rounded-lg divide-y" style={{ borderColor: "var(--hairline)" }}>
        {articles.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-4 py-3 gap-4">
            <div className="min-w-0">
              <div className="font-medium truncate">{a.title}</div>
              <div className="dateline mt-1">
                {a.category_name || "Uncategorized"} ·{" "}
                {a.byline_name ? `${a.byline_label || "Reported by"} ${a.byline_name}` : "No byline set"} ·{" "}
                <span style={{ color: statusColors[a.status] }}>{a.status}</span>
                {a.featured ? " · Featured" : ""}
                {a.breaking ? " · Breaking" : ""}
              </div>
            </div>
            <div className="flex gap-3 text-sm shrink-0">
              <Link href={`/admin/articles/${a.id}`} className="wire-link">Edit</Link>
              {a.status === "published" && (
                <Link href={`/article/${a.slug}`} target="_blank" className="wire-link">View</Link>
              )}
            </div>
          </div>
        ))}
        {articles.length === 0 && <p className="p-4 text-sm dateline">No articles yet.</p>}
      </div>
    </div>
  );
}
