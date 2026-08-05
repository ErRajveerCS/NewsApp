import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session) {
    return children;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 border-r p-5 flex flex-col gap-1" style={{ borderColor: "var(--hairline)" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="font-display font-semibold">Admin</div>
          <ThemeToggle
            className="dateline border rounded-full px-2 py-1 text-xs"
            style={{ borderColor: "var(--hairline)" }}
          />
        </div>
        <Link href="/admin" className="text-sm py-1.5 hover:opacity-70">Dashboard</Link>
        <Link href="/admin/articles" className="text-sm py-1.5 hover:opacity-70">Articles</Link>
        <Link href="/admin/articles/new" className="text-sm py-1.5 hover:opacity-70">New Article</Link>
        <Link href="/admin/categories" className="text-sm py-1.5 hover:opacity-70">Categories</Link>
        <Link href="/admin/comments" className="text-sm py-1.5 hover:opacity-70">Comments</Link>
        <Link href="/admin/subscribers" className="text-sm py-1.5 hover:opacity-70">Subscribers</Link>
        <Link href="/" className="text-sm py-1.5 hover:opacity-70 mt-4" style={{ color: "var(--wire)" }}>
          View site →
        </Link>
        <div className="mt-auto pt-6">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8 max-w-5xl">{children}</main>
    </div>
  );
}
