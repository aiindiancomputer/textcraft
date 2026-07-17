"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import AdPlaceholder from "@/components/AdPlaceholder";
import { ToastProvider } from "@/components/ToastProvider";
import type { ToolId } from "@/lib/types";
import { TOOL_ROUTES } from "@/lib/routes";

const THEME_STORAGE_KEY = "fancycraft-theme";

export default function AppShell({
  activeTool,
  children,
}: {
  /** Which tool this page represents — `null` for the homepage, which
   *  isn't itself a tool and shouldn't highlight any sidebar item. */
  activeTool: ToolId | null;
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const otherTools = TOOL_ROUTES.filter((route) => route.id !== activeTool);

  return (
    <ToastProvider>
      <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: "var(--bg-app)" }}>
        <Sidebar
          activeTool={activeTool}
          isDark={isDark ?? true}
          onToggleTheme={toggleTheme}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/*
          This wrapper reserves the sidebar's width with a static
          `lg:pl-72` instead of putting the sidebar inside the flex flow.
          Since the sidebar is always `fixed` (see Sidebar.tsx), this
          padding is the only thing standing in for its width — it never
          changes at runtime, so nothing here can shift when the drawer
          opens/closes or the theme toggles.
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
              Each tool page brings its own <h1> now that it's a real,
              independently-indexable route — there's no shared site-wide
              h1 competing with it here.
            */}
            {children}

            <div className="mt-10">
              <AdPlaceholder orientation="horizontal" />
            </div>

            {/*
              Real internal links (crawlable <a href>, via next/link) from
              every tool page to every sibling tool — reinforces the
              internal-link mesh beyond just the sidebar and homepage grid.
            */}
            {activeTool !== null && otherTools.length > 0 && (
              <nav
                aria-label="More FancyCraft tools"
                className="mt-12 border-t pt-8 transition-colors duration-300"
                style={{ borderColor: "var(--border-color)" }}
              >
                <h2 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Explore more free tools
                </h2>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {otherTools.map((route) => (
                    <li key={route.id}>
                      <Link
                        href={route.path}
                        className="focus-ring text-sm underline-offset-4 hover:underline"
                        style={{ color: "var(--accent)" }}
                      >
                        {route.navLabel}
                      </Link>
                    </li>
                  ))}
                  {activeTool !== null && (
                    <li>
                      <Link
                        href="/"
                        className="focus-ring text-sm underline-offset-4 hover:underline"
                        style={{ color: "var(--accent)" }}
                      >
                        FancyCraft Home
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            )}

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
      </div>
    </ToastProvider>
  );
}
