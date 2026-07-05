"use client";

import { useMemo, useState } from "react";
import { Copy, Gamepad2 } from "lucide-react";
import { FANCY_STYLES } from "@/lib/textUtils";

export default function FancyTextGenerator({ onCopy }: { onCopy: (msg: string) => void }) {
  const [input, setInput] = useState("Player");

  const results = useMemo(() => {
    if (!input.trim()) return [];
    return FANCY_STYLES.map((style) => ({
      id: style.id,
      label: style.label,
      output: style.render(input),
    }));
  }, [input]);

  function handleCopy(value: string) {
    navigator.clipboard.writeText(value);
    onCopy("Style copied to clipboard");
  }

  return (
    <section aria-labelledby="fancy-text-heading" className="flex flex-col gap-6">
      <div>
        <h1 id="fancy-text-heading" className="text-2xl font-semibold tracking-tight">
          Fancy Text & Gaming Nickname Generator
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          A fancy font generator and Free Fire / BGMI / Valorant stylish nickname maker —
          perfect for Instagram bios and gaming handles.
        </p>
      </div>

      <div className="relative">
        <Gamepad2
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a name or phrase..."
          className="focus-ring w-full rounded-xl border py-3.5 pl-11 pr-4 text-[15px] transition-colors"
          style={{
            backgroundColor: "var(--bg-sunken)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      <div className="grid gap-2.5">
        {results.length === 0 && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Start typing above to generate stylish variations.
          </p>
        )}
        {results.map((result) => (
          <div
            key={result.id}
            className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3 transition-colors animate-fade-in"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-raised)" }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                {result.label}
              </p>
              <p className="mt-0.5 truncate text-base" style={{ color: "var(--text-primary)" }}>
                {result.output}
              </p>
            </div>
            <button
              onClick={() => handleCopy(result.output)}
              className="focus-ring flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-transparent hover:shadow-glow active:translate-y-0 active:duration-75"
              style={{ borderColor: "var(--border-color)", color: "var(--accent)" }}
            >
              <Copy size={13} /> Copy
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
