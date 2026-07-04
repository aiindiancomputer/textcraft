import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TextCraft — Online Case Converter, Fancy Font & Word Counter Tool",
  description:
    "TextCraft is a free online text utility hub: case converter, fancy text & stylish nickname generator, word counter, text analytics, and a messy text cleaner. 100% free, no sign-up, works instantly in your browser.",
  keywords: [
    "online case converter",
    "fancy fonts for instagram bio",
    "free fire stylish nickname maker",
    "word counter online tool",
    "clean messy text tool",
    "text analytics",
    "stylish text generator",
  ],
  openGraph: {
    title: "TextCraft — Modern Text Utility Hub",
    description:
      "Convert case, generate fancy fonts and gaming nicknames, analyze text, and clean messy text — all free, all in your browser.",
    type: "website",
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
