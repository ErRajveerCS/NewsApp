import Link from "next/link";
import { parseDate } from "@/lib/utils";

function timeAgo(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return "";
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 3600) return `${Math.max(1, Math.round(diff / 60))}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ArticleCard({ article, size = "md" }) {
  const isLg = size === "lg";
  return (
    <Link href={`/article/${article.slug}`} className="block group">
      {article.cover_image ? (
        <div className={`w-full ${isLg ? "aspect-[16/9]" : "aspect-[4/3]"} overflow-hidden mb-3 bg-[var(--paper-dim)]`}>
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:opacity-90 transition"
          />
        </div>
      ) : null}
      <div className="dateline mb-1">
        <span style={{ color: "var(--wire)" }}>{article.category_name}</span>
        {" · "}
        {timeAgo(article.published_at)}
      </div>
      <h3 className={`font-display font-semibold leading-snug group-hover:opacity-70 ${isLg ? "text-2xl md:text-3xl" : "text-lg"}`}>
        {article.title}
      </h3>
      {isLg && article.summary ? (
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          {article.summary}
        </p>
      ) : null}
    </Link>
  );
}
