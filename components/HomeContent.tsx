"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import AdPlaceholder from "@/components/AdPlaceholder";
import Toast, { ToastState } from "@/components/Toast";
import CaseConverter from "@/components/CaseConverter";
import FancyTextGenerator from "@/components/FancyTextGenerator";
import TextAnalytics from "@/components/TextAnalytics";
import TextCleaner from "@/components/TextCleaner";
import LogoGenerator from "@/components/LogoGenerator";
import FAQSection from "@/components/FAQSection";
import type { ToolId } from "@/lib/types";
import { isToolId } from "@/lib/toolMetadata";

const THEME_STORAGE_KEY = "fancycraft-theme";
const DEFAULT_TOOL: ToolId = "fancy-text";

// Everything that touches useSearchParams lives in this component so
// app/page.tsx (the Server Component) can wrap it in <Suspense> — required
// by Next.js whenever a Client Component reads the URL's search params,
// otherwise the whole route opts out of static rendering instead of just
// this part.
//
// `isToolId` is imported from lib/toolMetadata.ts rather than redefined
// here — that's the same validity check app/page.tsx's generateMetadata
// uses server-side, so the URL can never be considered "valid" for the
// title/description but "invalid" for the rendered tool, or vice versa.
export default function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The URL is the single source of truth for which tool is active — no
  // separate `useState` for it, so it is structurally impossible for the
  // UI and the URL to disagree with each other.
  const toolParam = searchParams.get("tool");
  const activeTool: ToolId = isToolId(toolParam ?? undefined) ? (toolParam as ToolId) : DEFAULT_TOOL;

  const [isDark, setIsDark] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !(prev ?? true);
      document.documentElement.classList.toggle("dark", next);
      document.documentElement.style.colorScheme = next ? "dark" : "light";
      window.localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  }, []);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    window.setTimeout(() => setToast({ message: "", visible: false }), 2200);
  }, []);

  // Navigates by pushing `?tool=<id>` onto the current path. `{ scroll:
  // false }` keeps the page from jumping back to the top on every tab
  // switch — the one explicit requirement from the integration rules.
  const handleSelectTool = useCallback(
    (tool: ToolId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tool", tool);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-app)" }}
    >
      <Sidebar
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        isDark={isDark ?? true}
        onToggleTheme={toggleTheme}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/*
        This wrapper reserves the sidebar's width with a static `lg:pl-72`
        instead of putting the sidebar inside the flex flow. Since the
        sidebar is always `fixed` (see Sidebar.tsx), this padding is the
        only thing standing in for its width — it never changes at
        runtime, so there is nothing here that can shift when the drawer
        opens/closes or when the theme toggles.
      */}
      <div className="flex min-h-screen flex-col lg:pl-72">
        <header
          className="sticky top-0 z-20 flex items-center gap-3 border-b px-5 py-3.5 backdrop-blur transition-colors duration-300 lg:hidden"
          style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-raised)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="focus-ring rounded-md p-1.5 transition-colors duration-200 hover:opacity-70"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold">FancyCraft</span>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          {/*
            This is the ONLY <h1> on the page — every tool component below
            uses <h2> for its own heading. One h1 with the primary keyword
            context is what the SEO audit is asking for; the tool switcher
            underneath organizes the rest of the content under it.
          */}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            FancyCraft — Fancy Font, Gaming Logo & Nickname Generator
          </h1>
          <p className="mt-2 max-w-2xl text-sm" style={{ color: "var(--text-secondary)" }}>
            Free online tools to convert text case, generate 230+ fancy fonts and stylish
            nicknames for Free Fire, BGMI, and Instagram bio, design a gaming logo or esports
            emblem, analyze word count, and clean up messy text — instantly, with one click to
            copy or download.
          </p>

          {/*
            `key={activeTool}` forces a clean remount per tool (rather than
            patching the previous tool's DOM in place) and re-triggers the
            fade-in keyframe, so switching tabs always reads as a single
            deliberate transition instead of a partial re-render warping
            mid-layout.
          */}
          <div key={activeTool} className="mt-8 animate-fade-in">
            {activeTool === "case-converter" && <CaseConverter onCopy={showToast} />}
            {activeTool === "fancy-text" && <FancyTextGenerator onCopy={showToast} />}
            {activeTool === "analytics" && <TextAnalytics onCopy={showToast} />}
            {activeTool === "cleaner" && <TextCleaner onCopy={showToast} />}
            {activeTool === "logo-generator" && <LogoGenerator onCopy={showToast} />}
          </div>

          <div className="mt-10">
            <AdPlaceholder orientation="horizontal" />
          </div>

          <div className="mt-12 border-t pt-10 transition-colors duration-300" style={{ borderColor: "var(--border-color)" }}>
            <FAQSection />
          </div>

          <footer
            className="mt-12 border-t pt-6 text-center text-xs transition-colors duration-300"
            style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}
          >
            <p>
              FancyCraft — free online case converter, fancy font generator, gaming logo maker,
              word counter, and text cleaner. No sign-up, no tracking, no server.
            </p>
          </footer>
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
