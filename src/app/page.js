import SiteHeader from "@/components/SiteHeader";
import BreakingTicker from "@/components/BreakingTicker";
import ArticleCard from "@/components/ArticleCard";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import {
  getCategories,
  getPublishedArticles,
  getFeatured,
  getBreaking,
  getTrending,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featured, breaking, latest, trending] = await Promise.all([
    getCategories(),
    getFeatured(5),
    getBreaking(6),
    getPublishedArticles({ limit: 12 }),
    getTrending(5),
  ]);

  const pool = featured.length ? featured : latest;
  const [hero, ...secondary] = pool;

  return (
    <>
      <SiteHeader categories={categories} />
      <BreakingTicker items={breaking} />
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        {hero ? (
          <section className="grid md:grid-cols-3 gap-8 pb-8 mb-8 border-b" style={{ borderColor: "var(--hairline)" }}>
            <div className="md:col-span-2">
              <ArticleCard article={hero} size="lg" />
            </div>
            <div className="flex flex-col gap-6">
              {secondary.slice(0, 3).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        ) : (
          <p className="dateline">No published articles yet. Log in to the admin panel to publish your first story.</p>
        )}

        <div className="grid md:grid-cols-3 gap-10">
          <section className="md:col-span-2">
            <h2 className="font-display text-xl font-semibold mb-4 pb-2 border-b" style={{ borderColor: "var(--hairline)" }}>
              Latest News
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {latest.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>

          <aside>
            <h2 className="font-display text-xl font-semibold mb-4 pb-2 border-b" style={{ borderColor: "var(--hairline)" }}>
              Trending
            </h2>
            <ol className="flex flex-col gap-4">
              {trending.map((a, i) => (
                <li key={a.id} className="flex gap-3">
                  <span className="font-display text-2xl font-bold" style={{ color: "var(--hairline)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link href={`/article/${a.slug}`} className="hover:opacity-70">
                    <div className="dateline mb-1" style={{ color: "var(--wire)" }}>
                      {a.category_name}
                    </div>
                    <div className="font-display leading-snug">{a.title}</div>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="mt-8 border rounded-lg p-4" style={{ borderColor: "var(--hairline)" }}>
              <h3 className="font-display font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="dateline border rounded-full px-3 py-1"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
