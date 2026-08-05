import { queryOne, run } from "@/lib/db";

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(request) {
  const { name } = await request.json();
  if (!name?.trim()) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }
  const slug = slugify(name);
  try {
    await run("INSERT INTO categories (name, slug) VALUES (?, ?)", [name.trim(), slug]);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Category already exists" }, { status: 400 });
  }
}

export async function DELETE(request) {
  const { id } = await request.json();
  const row = await queryOne("SELECT COUNT(*) c FROM articles WHERE category_id = ?", [id]);
  if (row.c > 0) {
    return Response.json({ error: "Category has articles assigned; reassign them first" }, { status: 400 });
  }
  await run("DELETE FROM categories WHERE id = ?", [id]);
  return Response.json({ ok: true });
}
