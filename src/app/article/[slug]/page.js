import { marked } from "marked";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import CommentForm from "@/components/CommentForm";
import {
  getArticleBySlug,
  incrementViews,
  getRelated,
  getApprovedComments,
  getCategories,
} from "@/lib/queries";
import { youtubeId, siteUrl, parseDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | The Daily Wire Desk`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.cover_image ? [article.cover_image] : [],
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || article.status !== "published") notFound();

  await incrementViews(article.id);
  const related = await getRelated(article.category_id, article.id);
  const comments = await getApprovedComments(article.id);
  const categories = await getCategories();
  const ytId = youtubeId(article.youtube_url);
  const url = `${siteUrl()}/article/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: article.cover_image ? [article.cover_image] : undefined,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: article.byline_name ? { "@type": "Person", name: article.byline_name } : undefined,
    publisher: {
      "@type": "Organization",
      name: "The Daily Wire Desk",
    },
  };

  return (
    <>
      <SiteHeader categories={categories} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-3xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="dateline mb-3">
          <span style={{ color: "var(--wire)" }}>{article.category_name}</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-tight mb-4">
          {article.title}
        </h1>
        {article.summary && (
          <p className="text-lg mb-6" style={{ color: "var(--muted)" }}>
            {article.summary}
          </p>
        )}

        <div className="flex items-center justify-between border-y py-3 mb-6" style={{ borderColor: "var(--hairline)" }}>
          <div className="dateline">
            {article.byline_name
              ? <>{article.byline_label || "Reported by"} <strong>{article.byline_name}</strong></>
              : <>By <strong>Staff Reporter</strong></>}
            {" — "}
            {article.published_at &&
              parseDate(article.published_at)?.toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
          </div>
          <ShareButtons url={url} title={article.title} />
        </div>

        {article.source_name && (
          <div className="text-sm border rounded-lg p-3 mb-6 flex items-center gap-2" style={{ borderColor: "var(--hairline)" }}>
            <img
              src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(article.source_url || "")}&sz=32`}
              alt=""
              className="w-4 h-4"
            />
            <span>
              Source:{" "}
              {article.source_url ? (
                <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="wire-link underline">
                  {article.source_name}
                </a>
              ) : (
                article.source_name
              )}
              {article.source_credit ? ` — ${article.source_credit}` : ""}
            </span>
          </div>
        )}

        {article.cover_image && (
          <img src={article.cover_image} alt={article.title} className="w-full mb-8 object-cover" />
        )}

        {ytId && (
          <div className="aspect-video mb-8">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${ytId}`}
              title={article.title}
              allowFullScreen
            />
          </div>
        )}

        <article
          className="prose-article font-display text-lg"
          dangerouslySetInnerHTML={{ __html: marked.parse(article.content || "") }}
        />

        {article.source_name && (
          <p className="text-xs mt-8" style={{ color: "var(--muted)" }}>
            This article {article.source_credit ? "was adapted from reporting" : "cites reporting"} by{" "}
            {article.source_name}
            {article.source_url ? (
              <>
                {" "}
                (<a href={article.source_url} className="wire-link underline" target="_blank" rel="noopener noreferrer">
                  original source
                </a>
                )
              </>
            ) : null}
            .
          </p>
        )}

        <div className="mt-6">
          <ShareButtons url={url} title={article.title} />
        </div>

        {article.author_bio && (
          <div className="mt-10 border rounded-lg p-4 flex gap-4 items-start" style={{ borderColor: "var(--hairline)" }}>
            {article.author_photo && (
              <img src={article.author_photo} alt={article.author_name} className="w-14 h-14 rounded-full object-cover" />
            )}
            <div>
              <div className="font-display font-semibold">{article.author_name}</div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {article.author_bio}
              </p>
              <div className="flex gap-3 mt-1 text-xs">
                {article.author_twitter && (
                  <a href={article.author_twitter} className="wire-link" target="_blank" rel="noopener noreferrer">
                    X / Twitter
                  </a>
                )}
                {article.author_linkedin && (
                  <a href={article.author_linkedin} className="wire-link" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold mb-4 pb-2 border-b" style={{ borderColor: "var(--hairline)" }}>
              Related Stories
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map((a) => (
                <ArticleCard key={a.id} article={{ ...a, category_name: article.category_name }} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold mb-4 pb-2 border-b" style={{ borderColor: "var(--hairline)" }}>
            Comments
          </h2>
          <div className="flex flex-col gap-4 mb-6">
            {comments.length === 0 && (
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                No comments yet. Be the first to share your thoughts.
              </p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="border-b pb-3" style={{ borderColor: "var(--hairline)" }}>
                <div className="font-semibold text-sm">{c.name}</div>
                <p className="text-sm mt-1">{c.body}</p>
              </div>
            ))}
          </div>
          <CommentForm articleId={article.id} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function ShareButtons({ url, title }) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const links = [
    { name: "X", href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encoded}` },
  ];
  return (
    <div className="flex gap-3 text-xs dateline">
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="wire-link">
          {l.name}
        </a>
      ))}
    </div>
  );
}
