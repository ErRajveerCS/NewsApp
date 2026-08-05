import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import { getCategories, getPublishedArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || "";
  const categories = await getCategories();
  const results = q ? await getPublishedArticles({ limit: 30, search: q }) : [];

  return (
    <>
      <SiteHeader categories={categories} />
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <form className="mb-8 flex gap-2 max-w-lg">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search articles…"
            className="flex-1 border rounded-full px-4 py-2 text-sm"
            style={{ borderColor: "var(--hairline)" }}
          />
          <button className="rounded-full px-5 py-2 text-sm text-white" style={{ background: "var(--ink)" }}>
            Search
          </button>
        </form>
        {q && (
          <p className="dateline mb-6">
            {results.length} result{results.length === 1 ? "" : "s"} for "{q}"
          </p>
        )}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
