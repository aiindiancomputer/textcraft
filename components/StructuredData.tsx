import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/seo";

// Only the WebApplication schema lives here, rendered site-wide from
// app/layout.tsx — it describes the app as a whole, so it's valid on
// every page. FAQPage schema is deliberately NOT included here: it used
// to be, but it was only ever accurate on the homepage (the only page
// that actually renders the visible FAQ accordion). Structured data that
// doesn't match the visible content on that specific page is exactly the
// kind of mismatch Google's spam guidelines flag — see
// components/FaqStructuredData.tsx, rendered only from app/page.tsx.
export default function StructuredData() {
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
    />
  );
}
