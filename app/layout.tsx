import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fancycraft.vercel.app"),
  
  // Branding badal kar FancyCraft kar diya
  title: "FancyCraft — Fancy Font Generator for Instagram Bio, Free Fire & BGMI",
  description:
    "Generate 1000+ stylish fonts, cool text symbols, and aesthetic names for Instagram bio, Free Fire, BGMI, and WhatsApp instantly. Free online copy & paste fancy nickname maker, case converter, and utility hub.",
  
  keywords: [
    "online case converter",
    "fancy fonts for instagram bio",
    "free fire stylish nickname maker",
    "bgmi stylish name generator",
    "word counter online tool",
    "clean messy text tool",
    "text analytics",
    "cool fonts copy paste",
    "instagram font style modifier",
    "stylish text generator",
    "fancy text copy paste",
    "fancycraft",
  ],
  
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "FancyCraft — Modern Text Utility Hub & Fancy Font Generator",
    description:
      "Convert case, generate 1000+ fancy fonts and gaming nicknames, analyze text, and clean messy text — 100% free, all in your browser.",
    type: "website",
    url: "https://fancycraft.vercel.app",
    siteName: "FancyCraft",
    locale: "en_US",
  },
};

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
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased transition-colors duration-300" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}