"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Gamepad2, Search, ChevronDown, PencilLine } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { FANCY_STYLES, type FancyStyle } from "@/lib/textUtils";

type CategoryFilter = "all" | FancyStyle["category"];

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: `All Styles (${FANCY_STYLES.length})` },
  { id: "font", label: "Font Styles" },
  { id: "frame", label: "Gaming Frames" },
  { id: "combo", label: "Font + Frame Combos" },
];

const PAGE_SIZE = 30;

export default function FancyTextGenerator() {
  const onCopy = useToast();
  const [input, setInput] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Any change to the active filters should reset how many rows are
  // revealed — otherwise switching from "All Styles" to a 20-item
  // category could leave visibleCount stuck at a number larger than the
  // list, which is harmless but also means the "show more" affordance
  // never appears again until a fresh filter change.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, search]);

  const filteredStyles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return FANCY_STYLES.filter((style) => {
      const matchesCategory = category === "all" || style.category === category;
      const matchesSearch = query === "" || style.label.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const results = useMemo(() => {
    if (!input.trim()) return [];
    return filteredStyles.slice(0, visibleCount).map((style) => ({
      id: style.id,
      label: style.label,
      output: style.render(input),
    }));
  }, [input, filteredStyles, visibleCount]);

  function handleCopy(value: string) {
    navigator.clipboard.writeText(value);
    onCopy("Style copied to clipboard");
  }

  const hasMore = filteredStyles.length > visibleCount;

  return (
    <section aria-labelledby="fancy-text-heading" className="flex flex-col gap-6">
      <div>
        <h1 id="fancy-text-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Fancy Text &amp; Gaming Nickname Generator
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          {FANCY_STYLES.length}+ fancy fonts, symbols, and stylish nickname frames — a fancy
          font generator and Free Fire / BGMI / Valorant nickname maker perfect for Instagram
          bios and gaming handles.
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
          placeholder="Enter Your Name / Nickname..."
          aria-label="Enter your name or nickname"
          className="focus-ring w-full rounded-xl border py-3.5 pl-11 pr-11 text-[15px] transition-colors"
          style={{
            backgroundColor: "var(--bg-sunken)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
        {/* Pencil icon signals the field is editable input, not static
            display text — addresses the "looks like a label, not a box
            to type in" UX issue. */}
        <PencilLine
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
        />
      </div>

      {/* Category tabs — lets 237 styles feel like four manageable lists
          instead of one long scroll. */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {CATEGORY_TABS.map((tab) => {
          const active = category === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              className="focus-ring shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200"
              style={{
                backgroundColor: active ? "var(--accent)" : "transparent",
                borderColor: active ? "var(--accent)" : "var(--border-color)",
                color: active ? "#ffffff" : "var(--text-secondary)",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search — the fastest way to find one style out of 237 (e.g.
          typing "heart" or "bold"). */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${filteredStyles.length} styles by name...`}
          className="focus-ring w-full rounded-lg border py-2 pl-9 pr-3 text-sm transition-colors"
          style={{
            backgroundColor: "var(--bg-sunken)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      <div className="grid gap-2.5">
        {input.trim() === "" && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Start typing above to generate stylish variations.
          </p>
        )}
        {input.trim() !== "" && filteredStyles.length === 0 && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No styles match &ldquo;{search}&rdquo;. Try a different search term.
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

      {hasMore && (
        <button
          onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          className="focus-ring mx-auto flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-glow"
          style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        >
          <ChevronDown size={15} />
          Show {Math.min(PAGE_SIZE, filteredStyles.length - visibleCount)} more
          <span style={{ color: "var(--text-muted)" }}>
            ({visibleCount} / {filteredStyles.length})
          </span>
        </button>
      )}
    </section>
  );
}
