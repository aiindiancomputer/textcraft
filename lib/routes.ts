import { SITE_URL } from "@/lib/seo";
import type { ToolId } from "@/lib/types";

export interface ToolRoute {
  id: ToolId;
  /** URL path segment, e.g. "/fancy-font-generator" — a real Next.js route,
   *  not a query param, so each tool is its own statically-generatable,
   *  independently indexable page. */
  path: string;
  /** Short label for nav/sidebar. */
  navLabel: string;
  title: string;
  description: string;
};

// Single source of truth for every tool page's route + metadata. Used by:
// each app/<slug>/page.tsx (static metadata), sitemap.ts, robots-adjacent
// internal links, Sidebar.tsx nav, the homepage's tool grid, and
// scripts/indexnow-ping.mjs (so IndexNow always submits the exact same
// URLs that actually exist as pages — nothing hardcoded twice).
export const TOOL_ROUTES: ToolRoute[] = [
  {
    id: "fancy-text",
    path: "/fancy-font-generator",
    navLabel: "Fancy Text Generator",
    title: "Fancy Font & Gaming Nickname Generator | FancyCraft",
    description:
      "Generate 230+ fancy fonts, cool text symbols, and stylish nicknames for Free Fire, BGMI, and Instagram bio instantly. Copy and paste with one click!",
  },
  {
    id: "logo-generator",
    path: "/gaming-logo-maker",
    navLabel: "Logo & Avatar Generator",
    title: "Free Fire Guild Logo Maker & BGMI Clan Logo Generator",
    description:
      "Create a 3D-style esports logo, gaming avatar, or clan emblem for free. Choose shield, neon, or dark templates and export an HD PNG instantly.",
  },
  {
    id: "case-converter",
    path: "/case-converter",
    navLabel: "Case Converter",
    title: "Free Online Case Converter Tool | FancyCraft",
    description:
      "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, or a URL slug instantly. Free online case converter with one-click copy, no sign-up.",
  },
  {
    id: "analytics",
    path: "/word-counter",
    navLabel: "Text Analytics",
    title: "Word Counter & Text Analytics Tool | FancyCraft",
    description:
      "Count words, characters, and sentences, and get accurate reading and speaking time estimates. Free online word counter tool with zero sign-up.",
  },
  {
    id: "cleaner",
    path: "/text-cleaner",
    navLabel: "Text Cleaner",
    title: "Clean Messy Text Online - Remove Spaces & HTML | FancyCraft",
    description:
      "Remove extra spaces, empty lines, HTML tags, and emojis from any text in one click. Free online tool to clean messy text - nothing leaves your browser.",
  },
];

export function getToolRoute(id: ToolId): ToolRoute {
  const route = TOOL_ROUTES.find((r) => r.id === id);
  if (!route) throw new Error(`No route registered for tool id "${id}"`);
  return route;
}

export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}
