"use client";

import { useMemo, useState } from "react";
import {
  AlignLeft,
  Type,
  Hash,
  MessageSquareText,
  Rows3,
  Clock,
  Mic,
} from "lucide-react";
import { getTextStats, formatDuration } from "@/lib/textUtils";

export default function TextAnalytics() {
  const [text, setText] = useState("");
  const stats = useMemo(() => getTextStats(text), [text]);

  const metrics = [
    { label: "Characters (with spaces)", value: stats.charsWithSpaces, icon: Type },
    { label: "Characters (no spaces)", value: stats.charsWithoutSpaces, icon: Hash },
    { label: "Total Words", value: stats.words, icon: AlignLeft },
    { label: "Total Sentences", value: stats.sentences, icon: MessageSquareText },
    { label: "Paragraph Count", value: stats.paragraphs, icon: Rows3 },
    { label: "Est. Reading Time", value: formatDuration(stats.readingTimeSeconds), icon: Clock },
    { label: "Est. Speaking Time", value: formatDuration(stats.speakingTimeSeconds), icon: Mic },
  ];

  return (
    <section aria-labelledby="analytics-heading" className="flex flex-col gap-6">
      <div>
        <h1 id="analytics-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Deep Text Analytics &amp; Insights
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          A word counter online tool that also audits reading time, speaking time, and
          document structure.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        rows={9}
        className="focus-ring w-full resize-y rounded-xl border px-4 py-3.5 text-[15px] leading-relaxed transition-colors"
        style={{
          backgroundColor: "var(--bg-sunken)",
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="flex flex-col gap-3 rounded-xl border p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-glow"
              style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-raised)" }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(99,102,241,0.12)", color: "var(--accent)" }}
              >
                <Icon size={17} />
              </div>
              <div>
                <p className="text-xl font-semibold tabular-nums">{metric.value}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {metric.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
