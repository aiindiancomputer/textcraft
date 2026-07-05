"use client";

import { useState } from "react";
import { Copy, Trash2, Ruler, FileMinus2, Code2, SmilePlus } from "lucide-react";
import {
  removeExtraSpaces,
  removeEmptyLines,
  stripHtmlTags,
  removeEmojis,
} from "@/lib/textUtils";

const CLEAN_ACTIONS = [
  { id: "spaces", label: "Remove Extra Spaces", icon: Ruler, fn: removeExtraSpaces },
  { id: "lines", label: "Remove Empty Lines", icon: FileMinus2, fn: removeEmptyLines },
  { id: "html", label: "Strip HTML Tags", icon: Code2, fn: stripHtmlTags },
  { id: "emoji", label: "Remove Emojis", icon: SmilePlus, fn: removeEmojis },
];

export default function TextCleaner({ onCopy }: { onCopy: (msg: string) => void }) {
  const [text, setText] = useState("");

  function applyClean(fn: (t: string) => string) {
    setText((current) => fn(current));
  }

  function handleCopy() {
    if (!text) return;
    navigator.clipboard.writeText(text);
    onCopy("Copied to clipboard");
  }

  function handleClear() {
    setText("");
    onCopy("Text cleared");
  }

  return (
    <section aria-labelledby="cleaner-heading" className="flex flex-col gap-6">
      <div>
        <h2 id="cleaner-heading" className="text-2xl font-semibold tracking-tight">
          Pro Text Cleaner & Spacer
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          A clean messy text tool — fix extra spaces, blank lines, stray HTML markup, and
          emojis in one click.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        rows={10}
        className="focus-ring w-full resize-y rounded-xl border px-4 py-3.5 text-[15px] leading-relaxed transition-colors"
        style={{
          backgroundColor: "var(--bg-sunken)",
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CLEAN_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => applyClean(action.fn)}
              className="focus-ring flex flex-col items-center gap-2 rounded-lg border px-3 py-4 text-center text-xs font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-transparent hover:shadow-glow active:translate-y-0 active:duration-75"
              style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-raised)" }}
            >
              <Icon size={18} style={{ color: "var(--accent)" }} />
              {action.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          className="focus-ring flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0 active:duration-75"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <Copy size={16} /> Copy to Clipboard
        </button>
        <button
          onClick={handleClear}
          className="focus-ring flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:duration-75"
          style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        >
          <Trash2 size={16} /> Clear Text
        </button>
      </div>
    </section>
  );
}
