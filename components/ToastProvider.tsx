"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Toast, { ToastState } from "@/components/Toast";

const ToastContext = createContext<(message: string) => void>(() => {});

/** Lets any client component trigger the shared toast without needing it
 *  passed down as a prop — useful now that tool components are rendered
 *  as children of a Server Component page, where prop-injecting a client
 *  callback isn't possible. */
export function useToast(): (message: string) => void {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    window.setTimeout(() => setToast({ message: "", visible: false }), 2200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toast toast={toast} />
    </ToastContext.Provider>
  );
}
