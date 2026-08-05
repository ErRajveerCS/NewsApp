import { notFound } from "next/navigation";
import ArticleForm from "@/components/ArticleForm";
import { getCategories, getAuthors } from "@/lib/queries";
import { queryOne } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }) {
  const { id } = await params;
  const article = await queryOne("SELECT * FROM articles WHERE id = ?", [id]);
  if (!article) notFound();
  const categories = await getCategories();
  const authors = await getAuthors();
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Edit Article</h1>
      <ArticleForm article={article} categories={categories} authors={authors} />
    </div>
  );
}
