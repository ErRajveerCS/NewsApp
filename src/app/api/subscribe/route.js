import { run } from "@/lib/db";

export async function POST(request) {
  const { email } = await request.json();
  if (!email || !email.includes("@")) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  try {
    await run("INSERT OR IGNORE INTO subscribers (email) VALUES (?)", [email]);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
