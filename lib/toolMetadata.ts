import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import type { ToolId } from "@/lib/types";

export interface ToolMeta {
  title: string;
  description: string;
  /** Path used for this tool's canonical + Open Graph URL. */
  path: string;
}

// Default page config with ultra-high-volume Hinglish keywords for direct root search
const DEFAULT_META: ToolMeta = {
  title: "FancyCraft — Fancy Font Generator & Stylish Nickname Creator",
  description: "Free Fire aur BGMI me stylish name kaise likhe? Create 1000+ cool text symbols, clan fonts, and gaming nicknames instantly. Copy & paste free!",
  path: "/",
};

export const TOOL_METADATA: Record<ToolId, ToolMeta> = {
  "fancy-text": {
    title: "Fancy Font Style for Free Fire & BGMI Nickname Generator",
    description: "Gaming name font style aur stylish keyboard text generator online. Apne Free Fire clan aur Instagram bio ke liye cool nickname copy paste karein!",
    path: "/?tool=fancy-text",
  },
  "case-converter": {
    title: "Free Online Case Converter & Text Cleaner Tool — FancyCraft",
    description: "Apne text ko UPPERCASE, lowercase, ya title case me convert karein instantly. Free online text cleaner tool to format texts easily.",
    path: "/?tool=case-converter",
  },
  "logo-generator": {
    title: "Free Fire Guild Logo Maker with Name — BGMI Clan Logo Generator",
    description: "Gaming avatar text maker aur 3D esports logo creator app online. Gaming logo kaise banaye? Design cool clan emblems with stylish fonts in HD!",
    path: "/?tool=logo-generator",
  },
  analytics: {
    title: "Word Counter & Text Analytics Tool | FancyCraft",
    description: "Count words, characters, and sentences, and get accurate reading and speaking time estimates. Free online word counter tool with zero sign-up.",
    path: "/?tool=analytics",
  },
  cleaner: {
    title: "Clean Messy Text Online - Remove Spaces & HTML | FancyCraft",
    description: "Remove extra spaces, empty lines, HTML tags, and emojis from any text in one click. Free online tool to clean messy text - nothing leaves your browser.",
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