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
        <h1 className="text-3xl font-semibold mb-4">Privacy Policy</h1>
        <p>We collect only the information necessary to operate this site: newsletter subscriber emails and comments you choose to submit. We do not sell personal data. Cookies are used for session authentication in the admin panel. Replace this placeholder with your own GDPR/CCPA-compliant policy before launch.</p>
      </main>
      <SiteFooter />
    </>
  );
}
