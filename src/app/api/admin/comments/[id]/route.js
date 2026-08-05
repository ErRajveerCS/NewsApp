import { run } from "@/lib/db";

export async function PUT(request, { params }) {
  const { id } = await params;
  const { approved } = await request.json();
  await run("UPDATE comments SET approved = ? WHERE id = ?", [approved ? 1 : 0, id]);
  return Response.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await run("DELETE FROM comments WHERE id = ?", [id]);
  return Response.json({ ok: true });
}
