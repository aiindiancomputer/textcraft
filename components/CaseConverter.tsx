"use client";

import { useMemo, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import {
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSentenceCase,
  toInverseCase,
  toSlug,
  getWordCount,
  getSentenceCount,
} from "@/lib/textUtils";

const ACTIONS = [
  { id: "upper", label: "UPPERCASE", fn: toUpperCase },
  { id: "lower", label: "lowercase", fn: toLowerCase },
  { id: "title", label: "Title Case", fn: toTitleCase },
  { id: "sentence", label: "Sentence case", fn: toSentenceCase },
  { id: "inverse", label: "InVeRsE cAsE", fn: toInverseCase },
  { id: "slug", label: "slug-case", fn: toSlug },
];

export default function CaseConverter({ onCopy }: { onCopy: (msg: string) => void }) {
  const [text, setText] = useState("");

  const wordCount = useMemo(() => getWordCount(text), [text]);
  const charCount = text.length;
  const sentenceCount = useMemo(() => getSentenceCount(text), [text]);

  function applyTransform(fn: (t: string) => string) {
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
    <section aria-labelledby="case-converter-heading" className="flex flex-col gap-6">
      <div>
        <h1 id="case-converter-heading" className="text-2xl font-semibold tracking-tight">
          Case Converter Studio
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          A free online case converter — switch between uppercase, lowercase, title case, and
          more, instantly.
        </p>
      </div>

      <div className="relative">
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
        <div
          className="pointer-events-none absolute bottom-3 right-4 flex gap-3 rounded-md px-2.5 py-1 text-xs font-medium"
          style={{ backgroundColor: "var(--bg-raised)", color: "var(--text-muted)" }}
        >
          <span>{wordCount} words</span>
          <span>·</span>
          <span>{charCount} chars</span>
          <span>·</span>
          <span>{sentenceCount} sentences</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => applyTransform(action.fn)}
            className="focus-ring rounded-lg border px-4 py-3 text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-raised)" }}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          className="focus-ring flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <Copy size={16} /> Copy to Clipboard
        </button>
        <button
          onClick={handleClear}
          className="focus-ring flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
          style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        >
          <Trash2 size={16} /> Clear Text
        </button>
      </div>
    </section>
  );
}
