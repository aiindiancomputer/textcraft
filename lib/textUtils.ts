// ============================================================================
// FancyCraft — Core text utility engine
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

// Subscript — Unicode only defines subscript glyphs for a handful of
// letters (a e o x h k l m n p s t); everything else passes through
// unchanged since there is no subscript equivalent to fall back to.
const SUBSCRIPT_MAP: Record<string, string> = {
  a: "ₐ", e: "ₑ", o: "ₒ", x: "ₓ", h: "ₕ", k: "ₖ",
  l: "ₗ", m: "ₘ", n: "ₙ", p: "ₚ", s: "ₛ", t: "ₜ",
};

function toSubscript(text: string): string {
  return Array.from(text.toLowerCase())
    .map((ch) => {
      if (SUBSCRIPT_MAP[ch]) return SUBSCRIPT_MAP[ch];
      if (ch >= "0" && ch <= "9") return String.fromCodePoint(0x2080 + (ch.charCodeAt(0) - 48));
      return ch;
    })
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

function toReversed(text: string): string {
  return Array.from(text).reverse().join("");
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

// Parenthesized Latin small letters — lowercase-only Unicode block, so
// uppercase input is normalized to lowercase before mapping.
function toParenthesized(text: string): string {
  return Array.from(text.toLowerCase())
    .map((ch) => (ch >= "a" && ch <= "z" ? String.fromCodePoint(0x249c + (ch.charCodeAt(0) - 97)) : ch))
    .join("");
}

// Applies one or more Unicode combining marks after every visible
// character (spaces excluded) — used for strike-through, underline,
// dotted, wavy, and circled-overlay effects. Multiple marks stack (e.g.
// two different strike marks layered for a "double strike" look).
function withCombiningMarks(text: string, marks: string[]): string {
  return Array.from(text)
    .map((ch) => (ch === " " ? ch : ch + marks.join("")))
    .join("");
}

function spacedOut(text: string): string {
  return Array.from(text.trim()).join(" ");
}

// Generic "join every character with a separator" used for the
// hyphen/dot/underscore/arrow/pipe/star spaced novelty styles below.
function separatorJoin(text: string, separator: string): string {
  return Array.from(text.trim()).join(separator);
}

// "Aesthetic" text — the fullwidth look popular for IG/Twitter bios,
// additionally letter-spaced for the classic v a p o r w a v e feel.
function toAesthetic(text: string): string {
  const widened = mapBlock(text, { upperBase: 0xff21, lowerBase: 0xff41, digitBase: 0xff10 });
  return Array.from(widened.trim()).join(" ");
}

// Alternates upper/lower case by character position (ignoring the
// original casing), giving a consistent "ZaLgO-liTe" novelty look.
function toZigZag(text: string): string {
  return Array.from(text)
    .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

// Emphasizes vowels in bold math type while leaving consonants and
// spacing untouched.
function toVowelBold(text: string): string {
  const vowels = "aeiouAEIOU";
  return Array.from(text)
    .map((ch) => (vowels.includes(ch) ? mapBlock(ch, { upperBase: 0x1d400, lowerBase: 0x1d41a }) : ch))
    .join("");
}

export interface FancyStyle {
  id: string;
  label: string;
  category: "font" | "frame" | "combo";
  render: (input: string) => string;
}

// ---- Category 1: Unicode & novelty font-style transforms (42 styles) -----
const FONT_TRANSFORMS: FancyStyle[] = [
  { id: "bold", label: "Bold", category: "font", render: (t) => mapBlock(t, { upperBase: 0x1d400, lowerBase: 0x1d41a, digitBase: 0x1d7ce }) },
  { id: "italic", label: "Italic", category: "font", render: (t) => mapBlock(t, { upperBase: 0x1d434, lowerBase: 0x1d44e, lowerExceptions: { h: "\u210E" } }) },
  { id: "bold-italic", label: "Bold Italic", category: "font", render: (t) => mapBlock(t, { upperBase: 0x1d468, lowerBase: 0x1d482 }) },
  {
    id: "script",
    label: "Script (Cursive)",
    category: "font",
    render: (t) =>
      mapBlock(t, {
        upperBase: 0x1d49c,
        lowerBase: 0x1d4b6,
        upperExceptions: { B: "\u212C", E: "\u2130", F: "\u2131", H: "\u210B", I: "\u2110", L: "\u2112", M: "\u2133", R: "\u211B" },
        lowerExceptions: { e: "\u212F", g: "\u210A", o: "\u2134" },
      }),
  },
  { id: "bold-script", label: "Bold Script (Cursive Bold)", category: "font", render: (t) => mapBlock(t, { upperBase: 0x1d4d0, lowerBase: 0x1d4ea }) },
  {
    id: "double-struck",
    label: "Double Struck",
    category: "font",
    render: (t) =>
      mapBlock(t, {
        upperBase: 0x1d538,
        lowerBase: 0x1d552,
        digitBase: 0x1d7d8,
        upperExceptions: { C: "\u2102", H: "\u210D", N: "\u2115", P: "\u2119", Q: "\u211A", R: "\u211D", Z: "\u2124" },
      }),
  },
  {
    id: "fraktur",
    label: "Gothic (Fraktur)",
    category: "font",
    render: (t) => mapBlock(t, { upperBase: 0x1d504, lowerBase: 0x1d51e, upperExceptions: { C: "\u212D", H: "\u210C", I: "\u2111", R: "\u211C", Z: "\u2128" } }),
  },
  { id: "bold-fraktur", label: "Bold Gothic", category: "font", render: (t) => mapBlock(t, { upperBase: 0x1d56c, lowerBase: 0x1d586 }) },
  { id: "sans", label: "Sans", category: "font", render: (t) => mapBlock(t, { upperBase: 0x1d5a0, lowerBase: 0x1d5ba, digitBase: 0x1d7e2 }) },
  { id: "sans-bold", label: "Sans Bold", category: "font", render: (t) => mapBlock(t, { upperBase: 0x1d5d4, lowerBase: 0x1d5ee, digitBase: 0x1d7ec }) },
  { id: "sans-italic", label: "Sans Italic", category: "font", render: (t) => mapBlock(t, { upperBase: 0x1d608, lowerBase: 0x1d622 }) },
  { id: "sans-bold-italic", label: "Sans Bold Italic", category: "font", render: (t) => mapBlock(t, { upperBase: 0x1d63c, lowerBase: 0x1d656 }) },
  { id: "monospace", label: "Monospace", category: "font", render: (t) => mapBlock(t, { upperBase: 0x1d670, lowerBase: 0x1d68a, digitBase: 0x1d7f6 }) },
  { id: "fullwidth", label: "Wide / Fullwidth", category: "font", render: (t) => mapBlock(t, { upperBase: 0xff21, lowerBase: 0xff41, digitBase: 0xff10 }) },
  { id: "aesthetic", label: "Aesthetic (Spaced Wide)", category: "font", render: toAesthetic },
  { id: "small-caps", label: "Tiny / Small Caps", category: "font", render: toSmallCaps },
  { id: "superscript", label: "Superscript", category: "font", render: toSuperscript },
  { id: "subscript", label: "Subscript", category: "font", render: toSubscript },
  { id: "bubble", label: "Bubble (Circled)", category: "font", render: toCircled },
  { id: "squared", label: "Squared", category: "font", render: toSquared },
  { id: "negative-circled", label: "Dark Bubble", category: "font", render: toNegativeCircled },
  { id: "parenthesized", label: "Parenthesized", category: "font", render: toParenthesized },
  { id: "upside-down", label: "Upside Down", category: "font", render: toUpsideDown },
  { id: "reversed", label: "Reversed Text", category: "font", render: toReversed },
  { id: "slash-through", label: "Slash-through", category: "font", render: (t) => withCombiningMarks(t, ["\u0336"]) },
  { id: "double-strike", label: "Double Strikethrough", category: "font", render: (t) => withCombiningMarks(t, ["\u0336", "\u0335"]) },
  { id: "underline", label: "Underline", category: "font", render: (t) => withCombiningMarks(t, ["\u0332"]) },
  { id: "double-underline", label: "Double Underline", category: "font", render: (t) => withCombiningMarks(t, ["\u0333"]) },
  { id: "dotted-above", label: "Dotted Above", category: "font", render: (t) => withCombiningMarks(t, ["\u0307"]) },
  { id: "dotted-below", label: "Dotted Below", category: "font", render: (t) => withCombiningMarks(t, ["\u0323"]) },
  { id: "wavy", label: "Wavy Overlay", category: "font", render: (t) => withCombiningMarks(t, ["\u0303"]) },
  { id: "circled-overlay", label: "Circled Letters (Overlay)", category: "font", render: (t) => withCombiningMarks(t, ["\u20DD"]) },
  { id: "spaced", label: "Spaced Out", category: "font", render: spacedOut },
  { id: "hyphenated", label: "Hyphen-Spaced", category: "font", render: (t) => separatorJoin(t, "-") },
  { id: "dot-separated", label: "Dot Separated", category: "font", render: (t) => separatorJoin(t, ".") },
  { id: "underscore", label: "Underscore Style", category: "font", render: (t) => separatorJoin(t, "_") },
  { id: "arrow-spaced", label: "Arrow Spaced", category: "font", render: (t) => separatorJoin(t, "→") },
  { id: "pipe-separated", label: "Pipe Separated", category: "font", render: (t) => separatorJoin(t, "|") },
  { id: "star-separated", label: "Star Separated", category: "font", render: (t) => separatorJoin(t, "★") },
  { id: "zigzag", label: "Zig-Zag Case", category: "font", render: toZigZag },
  { id: "mixed-case", label: "Mixed Case", category: "font", render: toInverseCase },
  { id: "vowel-bold", label: "Bold Vowels", category: "font", render: toVowelBold },
];

// ---- Category 2: decorative gaming/aesthetic frames (111 styles) --------
// Each tuple is [id, label, prefix, suffix]. Kept as plain tuples rather
// than 100+ object literals purely to keep this list scannable.
const FRAME_DEFS: [string, string, string, string][] = [
  // Combat
  ["frame-sword", "Sword Frame", "⚔️ ", " ⚔️"],
  ["frame-blade", "Blade Frame", "▬▬ι═══════ﺤ ", " ﺤ═══════ι▬▬"],
  ["frame-twin-blades", "Twin Blades Frame", "⚔ ", " ⚔"],
  ["frame-bow", "Bow Frame", "🏹 ", " 🏹"],
  ["frame-shield", "Shield Frame", "🛡️ ", " 🛡️"],
  ["frame-axe", "Battle Axe Frame", "🪓 ", " 🪓"],
  ["frame-dagger", "Dagger Frame", "🗡️ ", " 🗡️"],
  // Royalty
  ["frame-crown", "Crown Frame", "👑 ", " 👑"],
  ["frame-royal", "Royal Frame", "꧁༒ ", " ༒꧂"],
  ["frame-king", "King Frame", "♔ ", " ♔"],
  ["frame-queen", "Queen Frame", "♕ ", " ♕"],
  ["frame-throne", "Throne Frame", "🏰 ", " 🏰"],
  ["frame-royal-seal", "Royal Seal Frame", "🔱 ", " 🔱"],
  ["frame-diamond-crown", "Diamond Crown Frame", "💎👑 ", " 👑💎"],
  // Stars / sparkle
  ["frame-star", "Star Frame", "⭐ ", " ⭐"],
  ["frame-sparkle", "Sparkle Frame", "✨ ", " ✨"],
  ["frame-star-struck", "Star Struck Frame", "🌟 ", " 🌟"],
  ["frame-shooting-star", "Shooting Star Frame", "💫 ", " 💫"],
  ["frame-stars", "Star Cluster Frame", "⋆｡°✩ ", " ✩°｡⋆"],
  ["frame-glimmer", "Glimmer Frame", "✧･ﾟ: ", " :･ﾟ✧"],
  ["frame-celestial", "Celestial Frame", "☆⁺.⋆ ", " ⋆.⁺☆"],
  ["frame-comet", "Comet Frame", "☄️ ", " ☄️"],
  // Nature
  ["frame-cherry-blossom", "Cherry Blossom Frame", "🌸 ", " 🌸"],
  ["frame-rose", "Rose Frame", "🌹 ", " 🌹"],
  ["frame-flower", "Flower Frame", "❀ ", " ❀"],
  ["frame-butterfly", "Butterfly Frame", "🦋 ", " 🦋"],
  ["frame-leaf", "Leaf Frame", "🍃 ", " 🍃"],
  ["frame-sunflower", "Sunflower Frame", "🌻 ", " 🌻"],
  ["frame-lotus", "Lotus Frame", "🪷 ", " 🪷"],
  ["frame-clover", "Clover Frame", "🍀 ", " 🍀"],
  // Fire / ice / weather
  ["frame-fire", "Fire Frame", "🔥 ", " 🔥"],
  ["frame-lightning", "Lightning Frame", "⚡『", "』⚡"],
  ["frame-thunder", "Thunder Frame", "Ϟ ", " Ϟ"],
  ["frame-storm", "Storm Frame", "🌪️ ", " 🌪️"],
  ["frame-ice", "Ice Frame", "❄️ ", " ❄️"],
  ["frame-blizzard", "Blizzard Frame", "❆ ", " ❆"],
  ["frame-tornado", "Tornado Frame", "🌀 ", " 🌀"],
  // Mystic / space
  ["frame-moon", "Moon Frame", "☾ ", " ☽"],
  ["frame-galaxy", "Galaxy Frame", "🌌 ", " 🌌"],
  ["frame-mystic", "Mystic Frame", "⛧ ", " ⛧"],
  ["frame-rune", "Rune Frame", "ᛝ ", " ᛝ"],
  ["frame-void", "Void Frame", "∴ ", " ∵"],
  ["frame-crystal-ball", "Crystal Ball Frame", "🔮 ", " 🔮"],
  ["frame-eclipse", "Eclipse Frame", "🌑 ", " 🌒"],
  ["frame-third-eye", "Third Eye Frame", "👁️ ", " 👁️"],
  // Love
  ["frame-heart", "Heart Frame", "♡ ", " ♡"],
  ["frame-heartbeat", "Heartbeat Frame", "💓 ", " 💓"],
  ["frame-love", "Love Frame", "💕 ", " 💕"],
  ["frame-heart-arrow", "Heart Arrow Frame", "💘 ", " 💘"],
  ["frame-sparkling-heart", "Sparkling Heart Frame", "💖 ", " 💖"],
  ["frame-broken-heart", "Broken Heart Frame", "💔 ", " 💔"],
  ["frame-heart-flourish", "Heart Flourish Frame", "❥ ", " ❥"],
  // Gaming / edge
  ["frame-skull", "Skull Frame", "💀 ", " 💀"],
  ["frame-crossbones", "Crossbones Frame", "☠️ ", " ☠️"],
  ["frame-spider", "Spider Frame", "🕷️ ", " 🕷️"],
  ["frame-web", "Web Frame", "🕸️ ", " 🕸️"],
  ["frame-controller", "Controller Frame", "🎮 ", " 🎮"],
  ["frame-target", "Target Frame", "🎯 ", " 🎯"],
  ["frame-trophy", "Trophy Frame", "🏆 ", " 🏆"],
  ["frame-medal", "Medal Frame", "🥇 ", " 🥇"],
  // Music / aesthetic
  ["frame-music-note", "Music Note Frame", "🎵 ", " 🎵"],
  ["frame-melody", "Melody Frame", "🎶 ", " 🎶"],
  ["frame-headphones", "Headphones Frame", "🎧 ", " 🎧"],
  ["frame-vibe", "Vibe Frame", "⋆౨ৎ˚ ", " ˚ৎ౨⋆"],
  ["frame-soft-aesthetic", "Soft Aesthetic Frame", "˚₊·➳ ", " ➳·₊˚"],
  // Animal / dragon
  ["frame-dragon", "Dragon Frame", "🐉 ", " 🐉"],
  ["frame-wolf", "Wolf Frame", "🐺 ", " 🐺"],
  ["frame-tiger", "Tiger Frame", "🐅 ", " 🐅"],
  ["frame-phoenix", "Phoenix Frame", "🔥🦅 ", " 🦅🔥"],
  ["frame-eagle", "Eagle Frame", "🦅 ", " 🦅"],
  // Asian-style symbols
  ["frame-katakana", "Katakana Frame", "メ", "メ"],
  ["frame-wave-dash", "Wave Dash Frame", "〜", "〜"],
  // Brackets / geometric
  ["frame-brackets", "Lenticular Bracket Frame", "【", "】"],
  ["frame-corner", "Corner Bracket Frame", "「", "」"],
  ["frame-white-corner", "White Corner Bracket Frame", "『", "』"],
  ["frame-tortoise-shell", "Tortoise Shell Bracket Frame", "〔", "〕"],
  ["frame-angle", "Angle Bracket Frame", "〈", "〉"],
  ["frame-double-angle", "Double Angle Bracket Frame", "《", "》"],
  ["frame-fullwidth-angle", "Fullwidth Angle Frame", "‹", "›"],
  ["frame-double-fullwidth-angle", "Double Fullwidth Angle Frame", "«", "»"],
  ["frame-heavy-angle", "Heavy Angle Bracket Frame", "❰", "❱"],
  ["frame-curly-fancy", "Curly Fancy Bracket Frame", "❴", "❵"],
  ["frame-math-angle", "Math Angle Bracket Frame", "⟨", "⟩"],
  ["frame-math-white-square", "Math White Square Frame", "⟦", "⟧"],
  ["frame-ornate-paren", "Ornate Parenthesis Frame", "﴾", "﴿"],
  ["frame-white-lenticular", "White Lenticular Frame", "〖", "〗"],
  ["frame-white-tortoise", "White Tortoise Shell Frame", "〘", "〙"],
  ["frame-fullwidth-bracket", "Fullwidth Bracket Frame", "［", "］"],
  ["frame-x-wrap", "X Wrap Frame", "×", "×"],
  ["frame-yen-wrap", "Yen Wrap Frame", "¥", "¥"],
  ["frame-section-wrap", "Section Wrap Frame", "§", "§"],
  ["frame-cross", "Cross Frame", "†", "†"],
  ["frame-wings", "Wings Frame", "𓆩", "𓆪"],
  // Cute separators / minimalist wraps
  ["frame-dot-wrap", "Dot Wrap Frame", "· ", " ·"],
  ["frame-bullet-wrap", "Bullet Wrap Frame", "• ", " •"],
  ["frame-diamond-wrap", "Diamond Wrap Frame", "◆ ", " ◆"],
  ["frame-small-diamond-wrap", "Small Diamond Wrap Frame", "◇ ", " ◇"],
  ["frame-triangle-wrap", "Triangle Wrap Frame", "▲ ", " ▲"],
  ["frame-circle-wrap", "Circle Wrap Frame", "● ", " ●"],
  ["frame-ring-wrap", "Ring Wrap Frame", "○ ", " ○"],
  ["frame-square-wrap", "Square Wrap Frame", "■ ", " ■"],
  // Misc symbol wraps
  ["frame-arrow-wrap", "Arrow Wrap Frame", "➳ ", " ➳"],
  ["frame-tilde-wrap", "Tilde Wrap Frame", "~ ", " ~"],
  ["frame-equals-wrap", "Equals Wrap Frame", "= ", " ="],
  ["frame-dash-wrap", "Dash Wrap Frame", "— ", " —"],
  ["frame-plus-wrap", "Plus Wrap Frame", "+ ", " +"],
  ["frame-asterisk-wrap", "Asterisk Wrap Frame", "* ", " *"],
  ["frame-percent-wrap", "Percent Wrap Frame", "% ", " %"],
  ["frame-ampersand-wrap", "Ampersand Wrap Frame", "& ", " &"],
  ["frame-tag-wrap", "Tag Wrap Frame", "@", "@"],
  ["frame-hash-wrap", "Hash Wrap Frame", "#", "#"],
];

const FRAME_STYLES: FancyStyle[] = FRAME_DEFS.map(([id, label, prefix, suffix]) => ({
  id,
  label,
  category: "frame",
  render: (t: string) => `${prefix}${t}${suffix}`,
}));

// ---- Category 3: font + frame combos (2 iconic frames × 42 fonts = 84) --
// Wraps every font-style transform in a couple of the most popular
// frames, so e.g. "Bold" and "Sword Frame" become one ready-to-copy
// "Bold + Sword" nickname instead of two separate manual steps.
const COMBO_FRAMES: { key: string; label: string; prefix: string; suffix: string }[] = [
  { key: "sword", label: "Sword", prefix: "⚔️ ", suffix: " ⚔️" },
  { key: "star", label: "Star", prefix: "✦ ", suffix: " ✦" },
];

const COMBO_STYLES: FancyStyle[] = COMBO_FRAMES.flatMap((frame) =>
  FONT_TRANSFORMS.map((font) => ({
    id: `combo-${frame.key}-${font.id}`,
    label: `${font.label} + ${frame.label}`,
    category: "combo" as const,
    render: (t: string) => `${frame.prefix}${font.render(t)}${frame.suffix}`,
  }))
);

export const FANCY_STYLES: FancyStyle[] = [
  ...FONT_TRANSFORMS,
  ...FRAME_STYLES,
  ...COMBO_STYLES,
];
