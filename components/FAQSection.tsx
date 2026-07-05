"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is TextCraft's online case converter?",
    a: "TextCraft's online case converter lets you switch any block of text between UPPERCASE, lowercase, Title Case, Sentence case, InVeRsE cAsE, and URL-safe slug format instantly, right in your browser. There's nothing to install and nothing is uploaded to a server — paste your text, pick a format, and copy the result.",
  },
  {
    q: "How do the fancy fonts for Instagram bio work?",
    a: "The fancy text generator maps your regular letters onto special Unicode character sets — bold, italic, script, gothic, double-struck, small caps, circled, and more — so the styled text looks different everywhere it's pasted, including Instagram, Twitter/X, Discord, and Facebook bios, since it's still plain Unicode text under the hood. There are over 230 styles in total, searchable by name and grouped into font styles, gaming frames, and ready-made font-plus-frame combos.",
  },
  {
    q: "Is this a good free fire stylish nickname maker?",
    a: "Yes. Alongside font styles, TextCraft includes ready-made gaming nickname frames like ⚔️ sword wraps, ꧁༒ royal frames ༒꧂, and katakana-style decorations that are popular for Free Fire, BGMI, PUBG, and Valorant usernames. Type your name once and copy whichever stylish frame fits your profile.",
  },
  {
    q: "How accurate is the word counter online tool?",
    a: "The word counter online tool splits text on whitespace to count words, tracks characters with and without spaces, counts sentences and paragraphs, and estimates reading time at 200 words per minute and speaking time at 130 words per minute — the same benchmarks used by most editorial style guides.",
  },
  {
    q: "What does the clean messy text tool actually remove?",
    a: "The clean messy text tool offers four independent fixes: collapsing repeated spaces and tabs into a single space, deleting blank or whitespace-only lines, stripping HTML tags copied from web pages, and filtering out emoji and pictograph characters — so you're left with plain, well-formatted text.",
  },
  {
    q: "Is my text stored anywhere or sent to a server?",
    a: "No. Every tool on TextCraft runs entirely client-side using your browser's JavaScript engine. Your text never leaves your device, there is no backend, no database, and no account required.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading" className="mt-4">
      <h2 id="faq-heading" className="text-xl font-semibold tracking-tight">
        Frequently Asked Questions
      </h2>
      <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
        Everything to know about TextCraft's case converter, fancy font generator, word
        counter, and text cleaning tools.
      </p>

      <div className="mt-5 flex flex-col gap-2.5">
        {FAQS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.q}
              className="overflow-hidden rounded-xl border transition-colors"
              style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-raised)" }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="focus-ring flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium"
                aria-expanded={isOpen}
              >
                {item.q}
                <ChevronDown
                  size={16}
                  className="shrink-0 transition-transform duration-200"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "var(--text-muted)" }}
                />
              </button>
              {isOpen && (
                <div
                  className="animate-fade-in px-4 pb-4 text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
