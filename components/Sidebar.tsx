"use client";

import Link from "next/link";
import {
  CaseSensitive,
  Sparkles,
  BarChart3,
  Eraser,
  Shield,
  Moon,
  Sun,
  Wand2,
  X,
} from "lucide-react";
import AdPlaceholder from "./AdPlaceholder";
import type { ToolId } from "@/lib/types";

interface SidebarProps {
  activeTool: ToolId;
  isDark: boolean;
  onToggleTheme: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS: { id: ToolId; label: string; icon: typeof CaseSensitive }[] = [
  { id: "case-converter", label: "Case Converter", icon: CaseSensitive },
  { id: "fancy-text", label: "Fancy Text Generator", icon: Sparkles },
  { id: "logo-generator", label: "Logo & Avatar Generator", icon: Shield },
  { id: "analytics", label: "Text Analytics", icon: BarChart3 },
  { id: "cleaner", label: "Text Cleaner", icon: Eraser },
];

export default function Sidebar({
  activeTool,
  isDark,
  onToggleTheme,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/*
        Backdrop: a fixed, full-viewport overlay that only exists visually
        while the drawer is open. It never occupies space in normal flow,
        so it cannot push or shift the page underneath — it just dims and
        blurs whatever is already there. Fading via opacity (rather than
        mounting/unmounting the element) avoids any pop-in jitter.
      */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/*
        The sidebar is ALWAYS `fixed`, at every breakpoint. It never
        participates in the page's flex/flow layout, so opening or closing
        it — or resizing across the lg breakpoint — can never shift or
        resize the content next to it. On large screens it's simply pinned
        open (lg:translate-x-0); the page content reserves its own space
        with a matching `lg:pl-72` on the content wrapper instead of
        relying on the sidebar to take up flex width.
      */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col overflow-y-auto border-r px-5 py-6 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--bg-raised)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
            >
              <Wand2 size={18} className="text-white" />
            </div>
            <div>
              {/*
                This is branding, not page content — it renders on every
                screen regardless of which tool is active, so it must
                never be an <h1>. The single real page heading lives in
                app/page.tsx. Two <h1>s on one page is exactly the "multiple
                H1 tags" issue an SEO audit flags.
              */}
              <p className="text-[15px] font-semibold leading-tight">FancyCraft</p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Fancy Font & Nickname Generator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded-md p-1.5 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1" aria-label="Tool navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTool === item.id;
            return (
              <Link
                key={item.id}
                href={item.id === "fancy-text" ? "/" : `/?tool=${item.id}`}
                scroll={false}
                onClick={onClose}
                className={`focus-ring group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  active ? "shadow-glow" : ""
                }`}
                style={{
                  backgroundColor: active ? "var(--accent)" : "transparent",
                  color: active ? "#ffffff" : "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = "var(--bg-sunken)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = "transparent";
                }}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={17} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6">
          <AdPlaceholder orientation="vertical" compact />
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-6">
          <button
            onClick={onToggleTheme}
            className="focus-ring flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors duration-300"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            <span className="flex items-center gap-2">
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
              {isDark ? "Dark Mode" : "Light Mode"}
            </span>
            <span
              className="relative h-5 w-9 rounded-full transition-colors duration-300"
              style={{ backgroundColor: isDark ? "var(--accent)" : "var(--border-color)" }}
            >
              <span
                className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ease-in-out"
                style={{ transform: isDark ? "translateX(18px)" : "translateX(2px)" }}
              />
            </span>
          </button>
          <p className="text-center text-[11px]" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} FancyCraft. All processing happens in your browser.
          </p>
        </div>
      </aside>
    </>
  );
}
