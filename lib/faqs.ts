export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "What is FancyCraft's online case converter?",
    answer:
      "FancyCraft's online case converter lets you switch any block of text between UPPERCASE, lowercase, Title Case, Sentence case, InVeRsE cAsE, and URL-safe slug format instantly, right in your browser. There's nothing to install and nothing is uploaded to a server — paste your text, pick a format, and copy the result.",
  },
  {
    question: "How do the fancy fonts for Instagram bio work?",
    answer:
      "The fancy text generator maps your regular letters onto special Unicode character sets — bold, italic, script, gothic, double-struck, small caps, circled, and more — so the styled text looks different everywhere it's pasted, including Instagram, Twitter/X, Discord, and Facebook bios, since it's still plain Unicode text under the hood. There are over 230 styles in total, searchable by name and grouped into font styles, gaming frames, and ready-made font-plus-frame combos.",
  },
  {
    question: "Is this a good Free Fire stylish nickname maker?",
    answer:
      "Yes. Alongside font styles, FancyCraft includes ready-made gaming nickname frames like sword wraps, royal frames, and katakana-style decorations that are popular for Free Fire, BGMI, PUBG, and Valorant usernames. Type your name once and copy whichever stylish frame fits your profile.",
  },
  {
    question: "How accurate is the word counter online tool?",
    answer:
      "The word counter online tool splits text on whitespace to count words, tracks characters with and without spaces, counts sentences and paragraphs, and estimates reading time at 200 words per minute and speaking time at 130 words per minute — the same benchmarks used by most editorial style guides.",
  },
  {
    question: "What does the clean messy text tool actually remove?",
    answer:
      "The clean messy text tool offers four independent fixes: collapsing repeated spaces and tabs into a single space, deleting blank or whitespace-only lines, stripping HTML tags copied from web pages, and filtering out emoji and pictograph characters — so you're left with plain, well-formatted text.",
  },
  {
    question: "Is my text stored anywhere or sent to a server?",
    answer:
      "No. Every tool on FancyCraft runs entirely client-side using your browser's JavaScript engine. Your text never leaves your device, there is no backend, no database, and no account required.",
  },
];
