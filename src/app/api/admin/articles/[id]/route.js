import { queryOne, run } from "@/lib/db";

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const existing = await queryOne("SELECT * FROM articles WHERE id = ?", [id]);
  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  const publishedAt =
    body.status === "published" && !existing.published_at
      ? new Date().toISOString()
      : existing.published_at;

  await run(
    `UPDATE articles SET
      title=?, summary=?, content=?, cover_image=?,
      youtube_url=?, category_id=?, author_id=?,
      byline_label=?, byline_name=?,
      status=?, featured=?, breaking=?, tags=?,
      source_name=?, source_url=?, source_credit=?,
      published_at=?, updated_at=datetime('now')
     WHERE id=?`,
    [
      body.title,
      body.summary || "",
      body.content,
      body.cover_image || "",
      body.youtube_url || "",
      body.category_id || null,
      body.author_id || null,
      body.byline_label || "Reported by",
      body.byline_name || "",
      body.status || "draft",
      body.featured ? 1 : 0,
      body.breaking ? 1 : 0,
      body.tags || "",
      body.source_name || "",
      body.source_url || "",
      body.source_credit || "",
      publishedAt,
      id,
    ]
  );

  return Response.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await run("DELETE FROM comments WHERE article_id = ?", [id]);
  await run("DELETE FROM articles WHERE id = ?", [id]);
  return Response.json({ ok: true });
}
