import type { Metadata } from "next";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL("https://fancycraft.vercel.app"), // 👈 Agar tumne custom domain lagaya hai toh "https://fancycraft.com" ya apna domain daal dena
  title: "FancyCraft - Fancy Font & Gaming Nickname Generator",
  description: "Generate 1000+ stylish fonts, cool text symbols, and custom nicknames for Free Fire, BGMI, and Instagram bio instantly. Copy and paste with one click!",
  applicationName: "FancyCraft",
  keywords: [
    "fancy font generator",
    "gaming nickname generator",
    "free fire stylish name",
    "bgmi name generator",
    "instagram bio fonts",
    "cool text symbols",
    "ff style name killer",
    "stylish text copy paste",
    "online case converter",
    "word counter online tool",
    "clean messy text tool",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://fancycraft.vercel.app",
    siteName: "FancyCraft",
    title: "FancyCraft - Fancy Font & Gaming Nickname Generator",
    description: "Generate 1000+ stylish fonts, cool text symbols, and custom nicknames for Free Fire, BGMI, and Instagram bio instantly. Copy and paste with one click!",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FancyCraft - Fancy Font & Gaming Nickname Generator",
    description: "Generate 1000+ stylish fonts, cool text symbols, and custom nicknames for Free Fire, BGMI, and Instagram bio instantly. Copy and paste with one click!",
  },
  verification: {
    google: "P4rSdfu8Xz_9LMqA1Bv7Y3cE6tW_kNz4oXp2QrSm5Tu",
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
        <meta name="theme-color" content="#000000" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <StructuredData />
      </head>
      <body className="font-sans antialiased transition-colors duration-300 bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}