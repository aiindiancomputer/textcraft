import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppShell from "@/components/AppShell";
import FAQSection from "@/components/FAQSection";
import FaqStructuredData from "@/components/FaqStructuredData";
import { TOOL_ROUTES } from "@/lib/routes";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, SITE_NAME } from "@/lib/seo";

// Static metadata — no searchParams involved anymore, so this page (and
// every tool page) can be fully statically generated at build time rather
// than rendered per-request. That's both faster and more reliably indexed
// than the old ?tool= query-param approach.
export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/opengraph-image.png`],
  },
};

export default function HomePage() {
  return (
    <AppShell activeTool={null}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
          Free · No Sign-Up · Runs Entirely In Your Browser
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          FancyCraft — Fancy Font, Gaming Logo &amp; Nickname Generator
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Five free tools for gamers and creators — a 230+ style fancy font and stylish nickname
          generator for Free Fire, BGMI, and Instagram bio; an HD gaming logo and clan emblem
          maker; plus a case converter, word counter, and text cleaner. Nothing is uploaded to a
          server, and there&rsquo;s no account required for any tool.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TOOL_ROUTES.map((route) => (
          <Link
            key={route.id}
            href={route.path}
            className="group flex flex-col justify-between gap-3 rounded-xl border p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-glow"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-raised)" }}
          >
            <div>
              <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                {route.navLabel}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {route.description}
              </p>
            </div>
            <span
              className="flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: "var(--accent)" }}
            >
              Open tool
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 border-t pt-10 transition-colors duration-300" style={{ borderColor: "var(--border-color)" }}>
        <FAQSection />
        <FaqStructuredData />
      </div>
    </AppShell>
  );
}
