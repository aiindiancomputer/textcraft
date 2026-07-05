import type { Metadata } from "next";
import "./globals.css";

// 🔥 Ultimate High-Traffic SEO Metadata (Instagram, Gaming, & Text Tools Expanded)
export const metadata: Metadata = {
  title: "TextCraft — Fancy Font Generator for Instagram Bio, Free Fire & BGMI",
  description:
    "Generate 1000+ stylish fonts, cool text symbols, and aesthetic names for Instagram bio, Free Fire, BGMI, and WhatsApp instantly. Free online copy & paste fancy nickname maker and utility hub.",
  keywords: [
    // --- INSTAGRAM & SOCIAL MEDIA TRAFFIC ---
    "fancy fonts for instagram bio",
    "instagram stylish text generator",
    "aesthetic fonts for instagram",
    "bio fonts copy paste",
    "cool text fonts for instagram story",
    "instagram bio stylish name maker",
    "font changer online free",
    "stylish text copy paste for whatsapp",
    
    // --- GAMING & NICKNAME TRAFFIC ---
    "free fire stylish name",
    "bgmi nickname generator",
    "gaming nickname maker",
    "ff stylish name generator pro",
    "bgmi stylish symbol nick",
    "cool text symbols copy paste",
    "wings symbol for name",
    "free fire nick name style boy",
    
    // --- UTILITY & TEXT TOOLS TRAFFIC ---
    "online case converter",
    "word counter online tool",
    "clean messy text tool",
    "text analytics dashboard",
    "capital to small letter converter",
    "remove extra spaces online",
    "fancy font generator",
    "text craft tools"
  ],
  openGraph: {
    title: "TextCraft — Fancy Font Generator for Instagram Bio, Free Fire & BGMI",
    description:
      "Create beautiful Instagram bio fonts, cool gaming nicknames with symbols, and aesthetic text styles instantly with TextCraft.",
    type: "website",
  },
  // 🔐 Verification key intact
  verification: {
    google: "m7WLgNdM4WUHh4nKEX1tDzWST9WseCKHtzsW39Z7f-w",
  },
};

// Runs synchronously in <head>, before React hydrates and before first
// paint, so the correct theme class is already on <html> when the page
// renders. This is what eliminates the light/dark "flash" on load.
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