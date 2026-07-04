"use client";

import { CheckCircle2 } from "lucide-react";

export interface ToastState {
  message: string;
  visible: boolean;
}

export default function Toast({ toast }: { toast: ToastState }) {
  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-200 ${
        toast.visible
          ? "opacity-100 translate-y-0 animate-toast-in"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div
        className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-glow"
        style={{
          backgroundColor: "var(--bg-raised)",
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
      >
        <CheckCircle2 size={16} className="text-accent shrink-0" style={{ color: "var(--accent)" }} />
        {toast.message}
      </div>
    </div>
  );
}
