import { getPublishedArticles, getCategoryBySlug } from "@/lib/queries";
import { siteUrl, parseDate } from "@/lib/utils";

export async function GET(request, { params }) {
  const { category } = await params;
  const cat = category === "all" ? null : await getCategoryBySlug(category);
  if (category !== "all" && !cat) {
    return new Response("Not found", { status: 404 });
  }
  const articles = await getPublishedArticles({
    limit: 50,
    categorySlug: category === "all" ? undefined : category,
  });
  const base = siteUrl();
  const title = cat ? `The Daily Wire Desk — ${cat.name}` : "The Daily Wire Desk — All News";

  const items = articles
    .map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${base}/article/${a.slug}</link>
      <guid>${base}/article/${a.slug}</guid>
      <pubDate>${(parseDate(a.published_at) || new Date()).toUTCString()}</pubDate>
      <description><![CDATA[${a.summary || ""}]]></description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${title}</title>
  <link>${base}</link>
  <description>Latest news from The Daily Wire Desk</description>
  ${items}
</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
