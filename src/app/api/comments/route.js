import { run } from "@/lib/db";

export async function POST(request) {
  const { articleId, name, body } = await request.json();
  if (!articleId || !name || !body) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }
  await run(
    "INSERT INTO comments (article_id, name, body, approved) VALUES (?, ?, ?, 0)",
    [articleId, name.slice(0, 100), body.slice(0, 2000)]
  );
  return Response.json({ ok: true });
}
