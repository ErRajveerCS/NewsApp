export default function AdminLoading() {
  return (
    <div className="flex items-center gap-3 py-12">
      <div
        className="w-5 h-5 rounded-full border-2 animate-spin"
        style={{ borderColor: "var(--hairline)", borderTopColor: "var(--ink)" }}
      />
      <span className="dateline">Loading…</span>
    </div>
  );
}
