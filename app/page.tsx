import { Suspense } from "react";
import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { getToolMeta, absoluteUrl } from "@/lib/toolMetadata";
import { SITE_NAME } from "@/lib/seo";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Runs server-side, per request, before the page renders — this is what
// lets `?tool=logo-generator` get its own <title>/<meta description> in
// the actual HTML response (and therefore in Google's snippet), not just
// a client-side document.title hack after hydration.
//
// Note: this is only possible in a page's generateMetadata. Layouts never
// receive `searchParams` from Next.js, since a layout persists across
// navigations within it — that's why this had to move from layout.tsx
// down into page.tsx, and why page.tsx can no longer be "use client".
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const meta = getToolMeta(searchParams.tool);
  const url = absoluteUrl(meta.path);
  const ogImage = absoluteUrl("/opengraph-image.png");

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: meta.path,
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: meta.title,
      description: meta.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
