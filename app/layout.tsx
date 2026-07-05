import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // 1. Base URL config jo Google Search Console aur sitemap mappings ke liye bohot zaroori hai
  metadataBase: new URL("https://fancycraft.vercel.app"),
  
  // 2. High-CTR SEO Title jo target keywords ko organically target karta hai
  title: "TextCraft — Fancy Font Generator for Instagram Bio, Free Fire & BGMI",
  
  // 3. Keyword-rich meta description jo users ko search page se click karne par majboor karega
  description:
    "Generate 1000+ stylish fonts, cool text symbols, and aesthetic names for Instagram bio, Free Fire, BGMI, and WhatsApp instantly. Free online copy & paste fancy nickname maker, case converter, and utility hub.",
  
  // 4. Exact high-volume search phrases jo teri audience dhoondti hai
  keywords: [
    "online case converter",
    "fancy fonts for instagram bio",
    "free fire stylish nickname maker",
    "bgmi stylish name generator",
    "word counter online tool",
    "clean messy text tool",
    "text analytics",
    "stylish text generator",
    "fancy text copy paste",
    "cool fonts copy paste",
    "instagram font style modifier"
  ],
  
  // 5. Canonical link jo duplicate content issues ko completely fix karta hai
  alternates: {
    canonical: "/",
  },

  // 6. Social media sharing optimize karne ke liye OpenGraph protocols
  openGraph: {
    title: "TextCraft — Modern Text Utility Hub & Fancy Font Generator",
    description:
      "Convert case, generate 237+ fancy fonts and gaming nicknames, analyze text, and clean messy text — 100% free, all in your browser.",
    type: "website",
    url: "https://fancycraft.vercel.app",
    siteName: "TextCraft",
    locale: "en_US",
  },
};

// Runs synchronously in <head>, before React hydrates and before first
// paint, so the correct theme class is already on <html> when the page
// renders. This is what eliminates the light/dark "flash" on load — the
// alternative (setting the class from a useEffect in page.tsx) always
// paints one frame in the wrong theme first.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("textcraft-theme");
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
        {/* Anti-flash theme script execution */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased transition-colors duration-300" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}