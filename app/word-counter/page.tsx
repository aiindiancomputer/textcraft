import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import TextAnalytics from "@/components/TextAnalytics";
import { getToolRoute, absoluteUrl } from "@/lib/routes";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const route = getToolRoute("analytics");

export const metadata: Metadata = {
  title: route.title,
  description: route.description,
  alternates: { canonical: route.path },
  openGraph: {
    type: "website",
    url: absoluteUrl(route.path),
    siteName: SITE_NAME,
    title: route.title,
    description: route.description,
    images: [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630, alt: route.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: route.title,
    description: route.description,
    images: [`${SITE_URL}/opengraph-image.png`],
  },
};

export default function WordCounterPage() {
  return (
    <AppShell activeTool="analytics">
      <TextAnalytics />
    </AppShell>
  );
}
