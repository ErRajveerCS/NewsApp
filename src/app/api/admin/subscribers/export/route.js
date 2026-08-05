import { query } from "@/lib/db";

export async function GET() {
  const subs = await query("SELECT email, created_at FROM subscribers ORDER BY created_at DESC");
  const csv = ["email,subscribed_at", ...subs.map((s) => `${s.email},${s.created_at}`)].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=subscribers.csv",
    },
  });
}
