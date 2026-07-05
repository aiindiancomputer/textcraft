"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import AdPlaceholder from "@/components/AdPlaceholder";
import Toast, { ToastState } from "@/components/Toast";
import CaseConverter from "@/components/CaseConverter";
import FancyTextGenerator from "@/components/FancyTextGenerator";
import TextAnalytics from "@/components/TextAnalytics";
import TextCleaner from "@/components/TextCleaner";
import FAQSection from "@/components/FAQSection";
import type { ToolId } from "@/lib/types";

const THEME_STORAGE_KEY = "fancycraft-theme";

export default function Home() {
  // 👈 Default tool ko badal kar "fancy-text" kar diya hai taaki sabse pehle yahi khule
  const [activeTool, setActiveTool] = useState<ToolId>("fancy-text");
  
  // The blocking script in app/layout.tsx already applied the right class
  // to <html> before this component ever mounts, so we read it back here
  // instead of guessing a default and flipping it after mount — that guess
  // is what causes the one-frame theme flash.
  const [isDark, setIsDark] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Lock background scroll while the mobile drawer is open. Without this,
  // the page behind the overlay can still scroll, and on some browsers the
  // scrollbar appearing/disappearing nudges the viewport width — which
  // reads as the exact "jitter" a fixed-position drawer is supposed to
  // avoid.
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

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-app)" }}
    >
      <Sidebar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
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
            FancyCraft — Fancy Font & Gaming Nickname Generator
          </h1>
          <p className="mt-2 max-w-2xl text-sm" style={{ color: "var(--text-secondary)" }}>
            Free online tools to convert text case, generate 230+ fancy fonts and stylish
            nicknames for Free Fire, BGMI, and Instagram bio, analyze word count, and clean up
            messy text — instantly, with one click to copy.
          </p>

          {/*
            `key={activeTool}` forces a clean remount per tool (rather than
            `patching the previous tool's DOM in place) and re-triggers the
            `fade-in keyframe, so switching tabs always reads as a single
            `deliberate transition instead of a partial re-render warping
            `mid-layout.
          */}
          <div key={activeTool} className="mt-8 animate-fade-in">
            {activeTool === "case-converter" && <CaseConverter onCopy={showToast} />}
            {activeTool === "fancy-text" && <FancyTextGenerator onCopy={showToast} />}
            {activeTool === "analytics" && <TextAnalytics onCopy={showToast} />}
            {activeTool === "cleaner" && <TextCleaner onCopy={showToast} />}
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
              FancyCraft — free online case converter, fancy font generator, word counter, and
              text cleaner. No sign-up, no tracking, no server.
            </p>
          </footer>
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}