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
        <h1 className="text-3xl font-semibold mb-4">About Us</h1>
        <p>The Daily Wire Desk is an independent news publication covering national, world, business, technology, sports and entertainment stories. Edit this page from the admin panel or by updating this file directly to reflect your own mission, editorial standards, and team.</p>
      </main>
      <SiteFooter />
    </>
  );
}
