import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import { getCategories, getAuthorArticles, getAuthors } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AuthorPage({ params }) {
  const { id } = await params;
  const authors = await getAuthors();
  const author = authors.find((a) => String(a.id) === id);
  if (!author) notFound();
  const categories = await getCategories();
  const articles = await getAuthorArticles(author.id);

  return (
    <>
      <SiteHeader categories={categories} />
      <main className="max-w-6xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b" style={{ borderColor: "var(--hairline)" }}>
          {author.photo && (
            <img src={author.photo} alt={author.name} className="w-16 h-16 rounded-full object-cover" />
          )}
          <div>
            <h1 className="font-display text-2xl font-semibold">{author.name}</h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{author.bio}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
