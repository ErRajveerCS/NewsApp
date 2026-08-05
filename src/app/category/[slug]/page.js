import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import { getCategories, getCategoryBySlug, getPublishedArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  return { title: cat ? `${cat.name} News | The Daily Wire Desk` : "Category" };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();
  const categories = await getCategories();
  const articles = await getPublishedArticles({ limit: 50, categorySlug: slug });

  return (
    <>
      <SiteHeader categories={categories} />
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="font-display text-3xl font-semibold mb-6 pb-3 border-b" style={{ borderColor: "var(--hairline)" }}>
          {cat.name}
        </h1>
        {articles.length === 0 ? (
          <p className="dateline">No stories published in this category yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
