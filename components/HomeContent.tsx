"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import CaseConverter from "@/components/CaseConverter";
import FancyTextGenerator from "@/components/FancyTextGenerator";
import LogoGenerator from "@/components/LogoGenerator";
import TextAnalytics from "@/components/TextAnalytics";
import TextCleaner from "@/components/TextCleaner";
import { isToolId } from "@/lib/toolMetadata";
import type { ToolId } from "@/lib/types";

export default function HomeContent({ searchParams }: { searchParams: { tool?: string | string[] } }) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  
  // URL parameter extraction
  const toolParam = searchParamsHook.get("tool") || "";
  
  // CRITICAL FIX: Set "fancy-text" as the absolute default fallback instead of case-converter
  const activeTool: ToolId = isToolId(toolParam) ? toolParam : "fancy-text";

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectTool = (toolId: ToolId) => {
    router.push(`/?tool=${toolId}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 antialiased font-sans">
      {/* Sidebar navigation component */}
      <Sidebar activeTool={activeTool} onSelectTool={handleSelectTool} />

      {/* Main Workspace Frame */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 ml-0 md:ml-64 transition-all duration-300">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {activeTool === "case-converter" && <CaseConverter onCopy={showToast} />}
          
          {activeTool === "fancy-text" && <FancyTextGenerator onCopy={showToast} />}
          
          {activeTool === "logo-generator" && <LogoGenerator onCopy={showToast} />}
          
          {activeTool === "analytics" && <TextAnalytics />}
          
          {activeTool === "cleaner" && <TextCleaner onCopy={showToast} />}

        </div>
      </main>

      {/* Dynamic Toast Alerts */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-2xl font-medium animate-bounce border border-indigo-400">
          {toastMessage}
        </div>
      )}
    </div>
  );
}