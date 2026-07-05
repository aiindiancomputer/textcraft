"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. URL parameter se active tool read karenge. Agar blank hai, toh default "fancy-text" set hoga!
  const currentToolFromUrl = (searchParams.get("tool") as ToolId) || "fancy-text";
  const [activeTool, setActiveTool] = useState<ToolId>(currentToolFromUrl);

  const [isDark, setIsDark] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  // Handle click on tabs/sidebar to update URL along with State
  const handleToolChange = (toolId: ToolId) => {
    setActiveTool(toolId);
    router.push(`/?tool=${toolId}`, { scroll: false });
  };

  // Sync state if back/forward browser buttons are pressed
  useEffect(() => {
    if (currentToolFromUrl) {
      setActiveTool(currentToolFromUrl);
    }
  }, [currentToolFromUrl]);

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

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-app)" }}
    >
      <Sidebar
        activeTool={activeTool}
        onSelectTool={handleToolChange} // Router wrapped wrapper pass kiya
        isDark={isDark ?? true}
        onToggleTheme={toggleTheme}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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
          {/* Header branding changed to FancyCraft */}
          <span className="text-sm font-semibold">FancyCraft</span>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          <div key={activeTool} className="animate-fade-in">
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

          {/* Footer branding changed to FancyCraft */}
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

// Next.js App Router rules ke mutabik searchParams use karne par components ko Suspense me wrap karna mandatory hota hai build success ke liye.
export default function Home() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm">Loading FancyCraft Toolset...</div>}>
      <DashboardContent />
    </Suspense>
  );
}