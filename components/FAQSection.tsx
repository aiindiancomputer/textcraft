"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/faqs";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading" className="mt-4">
      <h2 id="faq-heading" className="text-xl font-semibold tracking-tight">
        Frequently Asked Questions
      </h2>
      <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
        Everything to know about FancyCraft&rsquo;s case converter, fancy font generator, word
        counter, and text cleaning tools.
      </p>

      <div className="mt-5 flex flex-col gap-2.5">
        {FAQS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-xl border transition-colors"
              style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-raised)" }}
            >
              <h3 className="m-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="focus-ring flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium"
                  aria-expanded={isOpen}
                >
                  {item.question}
                  <ChevronDown
                    size={16}
                    className="shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "var(--text-muted)" }}
                  />
                </button>
              </h3>
              {isOpen && (
                <div
                  className="animate-fade-in px-4 pb-4 text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
