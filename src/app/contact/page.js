import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const categories = await getCategories();
  return (
    <>
      <SiteHeader categories={categories} />
      <main className="max-w-3xl mx-auto px-4 py-10 flex-1 w-full prose-article font-display text-lg">
        <h1 className="text-3xl font-semibold mb-4">Contact Us</h1>
        <p>For editorial inquiries, corrections, or tips, reach us at <a className="wire-link underline" href="mailto:editor@example.com">editor@example.com</a>.</p>
        <p>For advertising and sponsorship inquiries, contact <a className="wire-link underline" href="mailto:ads@example.com">ads@example.com</a>.</p>
      </main>
      <SiteFooter />
    </>
  );
}
