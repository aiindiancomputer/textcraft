import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TextCraft — Fancy Font, Online Case Converter & Word Counter Tool",
  description:
    "TextCraft is a free online text utility hub: fancy text, case converter & stylish nickname generator, word counter, text analytics, and a messy text cleaner. 100% free, no sign-up, works instantly in your browser.",
  keywords: [
    "stylish word for instagram",
    "online case converter",
    "fancy fonts for instagram bio",
    "free fire stylish nickname maker",
    "word counter online tool",
    "clean messy text tool",
    "text analytics",
    "fancy text converter",
    "stylish text generator",
  ],
  openGraph: {
    title: "TextCraft — Modern Text Utility Hub",
    description:
      "Convert case, generate fancy fonts and gaming nicknames, analyze text, and clean messy text — all free, all in your browser.",
    type: "website",
  },
  // Google Search Console Verification Tag yahan lag gaya hai
  verification: {
    google: "m7WLgNdM4WUHh4nKEX1tDzWST9WseCKHtzsW39Z7f-w",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}