import { run } from "@/lib/db";
import { makeSlug } from "@/lib/queries";

export async function POST(request) {
  const body = await request.json();
  if (!body.title || !body.content) {
    return Response.json({ error: "Title and content are required" }, { status: 400 });
  }
  const slug = await makeSlug(body.title);
  const publishedAt = body.status === "published" ? new Date().toISOString() : null;

  const info = await run(
    `INSERT INTO articles
      (title, slug, summary, content, cover_image, youtube_url, category_id, author_id,
       status, featured, breaking, tags, source_name, source_url, source_credit, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      body.title,
      slug,
      body.summary || "",
      body.content,
      body.cover_image || "",
      body.youtube_url || "",
      body.category_id || null,
      body.author_id || null,
      body.status || "draft",
      body.featured ? 1 : 0,
      body.breaking ? 1 : 0,
      body.tags || "",
      body.source_name || "",
      body.source_url || "",
      body.source_credit || "",
      publishedAt,
    ]
  );

  return Response.json({ ok: true, id: info.lastInsertRowid, slug });
}
