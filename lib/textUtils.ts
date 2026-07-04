// ============================================================================
// TextCraft — Core text utility engine
// Pure, dependency-free string functions used across every tool module.
// ============================================================================

/* --------------------------------------------------------------------------
 * CASE CONVERTER
 * ------------------------------------------------------------------------ */

export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

export function toTitleCase(text: string): string {
  return text.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

export function toSentenceCase(text: string): string {
  const lower = text.toLowerCase();
  return lower.replace(
    /(^\s*\w|[.!?]\s+\w)/g,
    (match) => match.toUpperCase()
  );
}

export function toInverseCase(text: string): string {
  return text
    .split("")
    .map((ch) => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()))
    .join("");
}

export function toSlug(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric
    .replace(/[\s_]+/g, "-") // spaces/underscores -> hyphen
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/* --------------------------------------------------------------------------
 * TEXT ANALYTICS
 * ------------------------------------------------------------------------ */

export interface TextStats {
  charsWithSpaces: number;
  charsWithoutSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
}

const WORDS_PER_MINUTE_READING = 200;
const WORDS_PER_MINUTE_SPEAKING = 130;

export function getWordCount(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  return trimmed.split(/\s+/).length;
}

export function getSentenceCount(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  const matches = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return matches ? matches.filter((s) => s.trim().length > 0).length : 0;
}

export function getParagraphCount(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  const blocks = trimmed.split(/\n\s*\n+/).filter((p) => p.trim().length > 0);
  if (blocks.length > 1) return blocks.length;
  const lines = trimmed.split(/\n+/).filter((l) => l.trim().length > 0);
  return lines.length > 0 ? lines.length : 1;
}

export function getTextStats(text: string): TextStats {
  const words = getWordCount(text);
  return {
    charsWithSpaces: text.length,
    charsWithoutSpaces: text.replace(/\s/g, "").length,
    words,
    sentences: getSentenceCount(text),
    paragraphs: getParagraphCount(text),
    readingTimeSeconds: Math.ceil((words / WORDS_PER_MINUTE_READING) * 60),
    speakingTimeSeconds: Math.ceil((words / WORDS_PER_MINUTE_SPEAKING) * 60),
  };
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0 sec";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} sec`;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds} sec`;
}

/* --------------------------------------------------------------------------
 * TEXT CLEANER
 * ------------------------------------------------------------------------ */

export function removeExtraSpaces(text: string): string {
  return text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/[ \t]+/g, " ");
}

export function removeEmptyLines(text: string): string {
  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join("\n");
}

export function stripHtmlTags(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

const EMOJI_REGEX =
  /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|\uFE0F|\u200D)/g;

export function removeEmojis(text: string): string {
  return text.replace(EMOJI_REGEX, "").replace(/[ \t]{2,}/g, " ");
}

/* --------------------------------------------------------------------------
 * FANCY TEXT / STYLISH NICKNAME GENERATOR
 * ------------------------------------------------------------------------ */

interface BlockConfig {
  upperBase?: number;
  lowerBase?: number;
  digitBase?: number;
  upperExceptions?: Record<string, string>;
  lowerExceptions?: Record<string, string>;
}

// Generic contiguous-Unicode-block mapper (Mathematical Alphanumeric Symbols
// plane and similar blocks are laid out as 26 contiguous code points per
// case, so we can compute offsets instead of hand-writing 26-letter maps).
function mapBlock(text: string, config: BlockConfig): string {
  return Array.from(text)
    .map((ch) => {
      if (ch >= "A" && ch <= "Z") {
        if (config.upperExceptions?.[ch]) return config.upperExceptions[ch];
        if (config.upperBase !== undefined) {
          return String.fromCodePoint(config.upperBase + (ch.charCodeAt(0) - 65));
        }
      }
      if (ch >= "a" && ch <= "z") {
        if (config.lowerExceptions?.[ch]) return config.lowerExceptions[ch];
        if (config.lowerBase !== undefined) {
          return String.fromCodePoint(config.lowerBase + (ch.charCodeAt(0) - 97));
        }
      }
      if (ch >= "0" && ch <= "9" && config.digitBase !== undefined) {
        return String.fromCodePoint(config.digitBase + (ch.charCodeAt(0) - 48));
      }
      return ch;
    })
    .join("");
}

// Small Capitals (IPA / phonetic extension letters) — not a contiguous
// block, so each letter is mapped explicitly. Letters without a true
// small-cap glyph (q, x) fall back to their normal lowercase form.
const SMALL_CAPS_MAP: Record<string, string> = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ",
  i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ",
  q: "q", r: "ʀ", s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x",
  y: "ʏ", z: "ᴢ",
};

function toSmallCaps(text: string): string {
  return Array.from(text.toLowerCase())
    .map((ch) => SMALL_CAPS_MAP[ch] ?? ch)
    .join("");
}

// Superscript letters/digits — a handful of Latin letters (q) have no
// Unicode superscript glyph and fall back to their normal form.
const SUPERSCRIPT_MAP: Record<string, string> = {
  a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ", f: "ᶠ", g: "ᵍ", h: "ʰ",
  i: "ⁱ", j: "ʲ", k: "ᵏ", l: "ˡ", m: "ᵐ", n: "ⁿ", o: "ᵒ", p: "ᵖ",
  q: "q", r: "ʳ", s: "ˢ", t: "ᵗ", u: "ᵘ", v: "ᵛ", w: "ʷ", x: "ˣ",
  y: "ʸ", z: "ᶻ",
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};

function toSuperscript(text: string): string {
  return Array.from(text.toLowerCase())
    .map((ch) => SUPERSCRIPT_MAP[ch] ?? ch)
    .join("");
}

// Upside-down / flipped text — letters are individually mirrored and the
// string order is reversed to mimic a physically rotated line of text.
const FLIP_MAP: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ",
  i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d",
  q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x",
  y: "ʎ", z: "z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ",
  "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6",
  ".": "˙", ",": "'", "'": ",", '"': ",,", "?": "¿", "!": "¡",
  "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{",
  "<": ">", ">": "<", "&": "⅋", "_": "‾",
};

function toUpsideDown(text: string): string {
  return Array.from(text.toLowerCase())
    .map((ch) => FLIP_MAP[ch] ?? ch)
    .reverse()
    .join("");
}

// Circled digits are not contiguous with circled letters (⓪ sits at a
// different offset from ①–⑨), so digits get their own small lookup.
const CIRCLED_DIGIT_MAP: Record<string, string> = {
  "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④",
  "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨",
};

function toCircled(text: string): string {
  return Array.from(text)
    .map((ch) => {
      if (ch >= "A" && ch <= "Z") return String.fromCodePoint(0x24b6 + (ch.charCodeAt(0) - 65));
      if (ch >= "a" && ch <= "z") return String.fromCodePoint(0x24d0 + (ch.charCodeAt(0) - 97));
      if (CIRCLED_DIGIT_MAP[ch]) return CIRCLED_DIGIT_MAP[ch];
      return ch;
    })
    .join("");
}

// Squared letters (🄰–🅉) only exist as uppercase glyphs, so lowercase
// input is normalized to uppercase before mapping.
function toSquared(text: string): string {
  return Array.from(text.toUpperCase())
    .map((ch) => (ch >= "A" && ch <= "Z" ? String.fromCodePoint(0x1f130 + (ch.charCodeAt(0) - 65)) : ch))
    .join("");
}

// Negative (dark) circled letters — also uppercase-only in Unicode.
function toNegativeCircled(text: string): string {
  return Array.from(text.toUpperCase())
    .map((ch) => (ch >= "A" && ch <= "Z" ? String.fromCodePoint(0x1f150 + (ch.charCodeAt(0) - 65)) : ch))
    .join("");
}

function withCombiningMark(text: string, mark: string): string {
  return Array.from(text)
    .map((ch) => (ch === " " ? ch : ch + mark))
    .join("");
}

function spacedOut(text: string): string {
  return Array.from(text.trim()).join(" ");
}

export interface FancyStyle {
  id: string;
  label: string;
  render: (input: string) => string;
}

export const FANCY_STYLES: FancyStyle[] = [
  {
    id: "bold",
    label: "Bold Style",
    render: (t) => mapBlock(t, { upperBase: 0x1d400, lowerBase: 0x1d41a, digitBase: 0x1d7ce }),
  },
  {
    id: "italic",
    label: "Italic Style",
    render: (t) =>
      mapBlock(t, {
        upperBase: 0x1d434,
        lowerBase: 0x1d44e,
        lowerExceptions: { h: "\u210E" },
      }),
  },
  {
    id: "bold-italic",
    label: "Bold Italic Style",
    render: (t) => mapBlock(t, { upperBase: 0x1d468, lowerBase: 0x1d482 }),
  },
  {
    id: "cursive",
    label: "Cursive Style",
    render: (t) => mapBlock(t, { upperBase: 0x1d4d0, lowerBase: 0x1d4ea }),
  },
  {
    id: "bold-outline",
    label: "Bold Outline",
    render: (t) =>
      mapBlock(t, {
        upperBase: 0x1d538,
        lowerBase: 0x1d552,
        digitBase: 0x1d7d8,
        upperExceptions: {
          C: "\u2102", H: "\u210D", N: "\u2115", P: "\u2119",
          Q: "\u211A", R: "\u211D", Z: "\u2124",
        },
      }),
  },
  {
    id: "gothic",
    label: "Gothic Style",
    render: (t) =>
      mapBlock(t, {
        upperBase: 0x1d504,
        lowerBase: 0x1d51e,
        upperExceptions: { C: "\u212D", H: "\u210C", I: "\u2111", R: "\u211C", Z: "\u2128" },
      }),
  },
  {
    id: "bold-gothic",
    label: "Bold Gothic Style",
    render: (t) => mapBlock(t, { upperBase: 0x1d56c, lowerBase: 0x1d586 }),
  },
  {
    id: "sans-bold",
    label: "Sans Bold Style",
    render: (t) => mapBlock(t, { upperBase: 0x1d5d4, lowerBase: 0x1d5ee, digitBase: 0x1d7ec }),
  },
  {
    id: "monospace",
    label: "Monospace Style",
    render: (t) => mapBlock(t, { upperBase: 0x1d670, lowerBase: 0x1d68a, digitBase: 0x1d7f6 }),
  },
  {
    id: "fullwidth",
    label: "Vaporwave (Fullwidth)",
    render: (t) => mapBlock(t, { upperBase: 0xff21, lowerBase: 0xff41, digitBase: 0xff10 }),
  },
  { id: "small-caps", label: "Small Caps Style", render: toSmallCaps },
  { id: "circled", label: "Circled Style", render: toCircled },
  { id: "squared", label: "Squared / Boxed Style", render: toSquared },
  { id: "negative-circled", label: "Dark Circled Style", render: toNegativeCircled },
  { id: "superscript", label: "Superscript Style", render: toSuperscript },
  { id: "upside-down", label: "Upside Down Style", render: toUpsideDown },
  { id: "strikethrough", label: "Strikethrough Style", render: (t) => withCombiningMark(t, "\u0336") },
  { id: "underline", label: "Underline Style", render: (t) => withCombiningMark(t, "\u0332") },
  { id: "spaced", label: "Spaced Out Style", render: spacedOut },
  { id: "frame-sword", label: "Sword Frame", render: (t) => `⚔️ ${t} ⚔️` },
  { id: "frame-royal", label: "Royal Frame", render: (t) => `꧁༒ ${t} ༒꧂` },
  { id: "frame-lightning", label: "Lightning Frame", render: (t) => `⚡『${t}』⚡` },
  { id: "frame-katakana", label: "Katakana Frame", render: (t) => `メ${t}メ` },
  { id: "frame-star", label: "Star Frame", render: (t) => `☆*:.｡. ${t} .｡.:*☆` },
  { id: "frame-blade", label: "Blade Frame", render: (t) => `▬▬ι═══════ﺤ ${t} ﺤ═══════ι▬▬` },
];
