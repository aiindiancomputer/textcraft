import type { Metadata, Viewport } from "next";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import { SITE_NAME, SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "fancy font generator",
    "gaming nickname generator",
    "free fire stylish name",
    "free fire guild logo maker",
    "bgmi name generator",
    "bgmi clan logo generator",
    "instagram bio fonts",
    "online case converter",
    "word counter online tool",
    "clean messy text tool",
    "3D esports logo generator free",
    "gaming avatar text maker",
    "cool gaming logo creator",
    "free online emblem generator",
    "stylish nickname maker",
    "text symbol generator",
  ],
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: "m7WLgNdM4WUHh4nKEX1tDzWST9WseCKHtzsW39Z7f-w",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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

export const viewport: Viewport = {
  themeColor: "#6366F1",
};

// Runs synchronously in <head>, before React hydrates and before first
// paint, so the correct theme class is already on <html> when the page
// renders. This is what eliminates the light/dark "flash" on load — the
// alternative (setting the class from a useEffect in page.tsx) always
// paints one frame in the wrong theme first.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("fancycraft-theme");
    var isDark = stored ? stored === "dark" : true;
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <StructuredData />
      </head>
      <body className="font-sans antialiased transition-colors duration-300" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
