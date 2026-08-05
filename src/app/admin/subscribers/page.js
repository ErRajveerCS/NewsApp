import { query } from "@/lib/db";
import { parseDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SubscribersAdminPage() {
  const subs = await query("SELECT * FROM subscribers ORDER BY created_at DESC");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Newsletter Subscribers</h1>
        <a
          href="/api/admin/subscribers/export"
          className="rounded-full px-4 py-2 text-sm text-white"
          style={{ background: "var(--ink)" }}
        >
          Export CSV
        </a>
      </div>
      <div className="border rounded-lg divide-y" style={{ borderColor: "var(--hairline)" }}>
        {subs.map((s) => (
          <div key={s.id} className="flex justify-between px-4 py-3 text-sm">
            <span>{s.email}</span>
            <span className="dateline">{parseDate(s.created_at)?.toLocaleDateString() || "—"}</span>
          </div>
        ))}
        {subs.length === 0 && <p className="p-4 text-sm dateline">No subscribers yet.</p>}
      </div>
    </div>
  );
}
