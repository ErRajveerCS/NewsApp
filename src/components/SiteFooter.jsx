import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function SiteFooter() {
  return (
    <footer className="border-t mt-12" style={{ borderColor: "var(--hairline)" }}>
      <div className="max-w-6xl mx-auto px-4 py-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: "var(--hairline)" }}>
        <div>
          <div className="font-display font-semibold">Stay informed</div>
          <p className="dateline">Get breaking stories in your inbox.</p>
        </div>
        <NewsletterForm />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-wrap justify-between gap-4 dateline">
        <span>© {new Date().getFullYear()} The Daily Wire Desk</span>
        <div className="flex gap-4">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
