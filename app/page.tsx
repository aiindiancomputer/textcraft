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

const THEME_STORAGE_KEY = "textcraft-theme";

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolId>("case-converter");
  const [isDark, setIsDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const shouldBeDark = stored ? stored === "dark" : true;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  }, []);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    window.setTimeout(() => setToast({ message: "", visible: false }), 2200);
  }, []);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-app)" }}>
      <Sidebar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="sticky top-0 z-20 flex items-center gap-3 border-b px-5 py-3.5 backdrop-blur lg:hidden"
          style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-raised)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="focus-ring rounded-md p-1.5"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold">TextCraft</span>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          {activeTool === "case-converter" && <CaseConverter onCopy={showToast} />}
          {activeTool === "fancy-text" && <FancyTextGenerator onCopy={showToast} />}
          {activeTool === "analytics" && <TextAnalytics onCopy={showToast} />}
          {activeTool === "cleaner" && <TextCleaner onCopy={showToast} />}

          <div className="mt-10">
            <AdPlaceholder orientation="horizontal" />
          </div>

          <div className="mt-12 border-t pt-10" style={{ borderColor: "var(--border-color)" }}>
            <FAQSection />
          </div>

          <footer
            className="mt-12 border-t pt-6 text-center text-xs"
            style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}
          >
            <p>
              TextCraft — free online case converter, fancy font generator, word counter, and
              text cleaner. No sign-up, no tracking, no server.
            </p>
          </footer>
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
