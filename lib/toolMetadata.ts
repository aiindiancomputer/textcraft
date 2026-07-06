import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import type { ToolId } from "@/lib/types";

export interface ToolMeta {
  title: string;
  description: string;
  /** Path used for this tool's canonical + Open Graph URL. */
  path: string;
}

// The default entry (no `tool` param, or an unrecognized one) intentionally
// mirrors the site-wide metadata from lib/seo.ts — one source of truth for
// the root page's title/description instead of duplicating it here.
const DEFAULT_META: ToolMeta = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
};

export const TOOL_METADATA: Record<ToolId, ToolMeta> = {
  "case-converter": {
    title: "Free Online Case Converter Tool | FancyCraft",
    description:
      "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, or a URL slug instantly. Free online case converter with one-click copy, no sign-up.",
    path: "/?tool=case-converter",
  },
  "fancy-text": {
    title: "Fancy Font & Gaming Nickname Generator | FancyCraft",
    description:
      "Generate 230+ fancy fonts, cool text symbols, and stylish nicknames for Free Fire, BGMI, and Instagram bio instantly. Copy and paste with one click!",
    path: "/?tool=fancy-text",
  },
  "logo-generator": {
    title: "Free Fire Guild Logo Maker & BGMI Clan Logo Generator",
    description:
      "Create a 3D-style esports logo, gaming avatar, or clan emblem for free. Choose shield, neon, or dark templates and export an HD PNG instantly.",
    path: "/?tool=logo-generator",
  },
  analytics: {
    title: "Word Counter & Text Analytics Tool | FancyCraft",
    description:
      "Count words, characters, and sentences, and get accurate reading and speaking time estimates. Free online word counter tool with zero sign-up.",
    path: "/?tool=analytics",
  },
  cleaner: {
    title: "Clean Messy Text Online - Remove Spaces & HTML | FancyCraft",
    description:
      "Remove extra spaces, empty lines, HTML tags, and emojis from any text in one click. Free online tool to clean messy text - nothing leaves your browser.",
    path: "/?tool=cleaner",
  },
};

const VALID_TOOL_IDS = Object.keys(TOOL_METADATA) as ToolId[];

export function isToolId(value: string | string[] | undefined): value is ToolId {
  return typeof value === "string" && (VALID_TOOL_IDS as string[]).includes(value);
}

export function getToolMeta(toolParam: string | string[] | undefined): ToolMeta {
  return isToolId(toolParam) ? TOOL_METADATA[toolParam] : DEFAULT_META;
}

export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}
