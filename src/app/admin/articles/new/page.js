import ArticleForm from "@/components/ArticleForm";
import { getCategories, getAuthors } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const categories = await getCategories();
  const authors = await getAuthors();
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">New Article</h1>
      <ArticleForm categories={categories} authors={authors} />
    </div>
  );
}
