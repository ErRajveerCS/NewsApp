import { queryOne } from "@/lib/db";

export async function GET() {
  const info = {
    hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
    tursoUrlPrefix: process.env.TURSO_DATABASE_URL
      ? process.env.TURSO_DATABASE_URL.slice(0, 12)
      : null,
    hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
    hasAuthSecret: !!process.env.AUTH_SECRET,
    nodeEnv: process.env.NODE_ENV,
  };

  try {
    const row = await queryOne("SELECT COUNT(*) c FROM categories");
    return Response.json({ ok: true, categoriesCount: row?.c, env: info });
  } catch (err) {
    return Response.json(
      { ok: false, error: String(err?.message || err), env: info },
      { status: 500 }
    );
  }
}
