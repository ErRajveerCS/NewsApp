import { getPublishedArticles, getCategories } from "@/lib/queries";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = siteUrl();
  const articles = await getPublishedArticles({ limit: 1000 });
  const categories = await getCategories();

  return [
    { url: base, changeFrequency: "hourly", priority: 1 },
    ...categories.map((c) => ({
      url: `${base}/category/${c.slug}`,
      changeFrequency: "hourly",
      priority: 0.8,
    })),
    ...articles.map((a) => ({
      url: `${base}/article/${a.slug}`,
      lastModified: a.updated_at,
      changeFrequency: "daily",
      priority: 0.6,
    })),
  ];
}
