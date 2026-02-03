"use client";

import { useToastStore } from "@/stores/useToastStore";
import { ToastItem } from "./ToastItem";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-100 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Desktop: Top-right */}
      <div className="hidden sm:flex flex-col gap-3 fixed top-5 right-4 lg:right-6">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>

      {/* Mobile: Top-center */}
      <div className="sm:hidden flex flex-col gap-3 fixed top-5 left-4 right-4">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
}
