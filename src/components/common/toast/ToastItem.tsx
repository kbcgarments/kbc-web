"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { Toast } from "@/types";
import { useToastStore } from "@/stores/useToastStore";

interface ToastItemProps {
  toast: Toast;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastColors = {
  success: "bg-success/10 border-success text-success",
  error: "bg-error/10 border-error text-error",
  warning: "bg-warning/10 border-warning text-warning",
  info: "bg-info/10 border-info text-info",
};

export function ToastItem({ toast }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const removeToast = useToastStore((state) => state.removeToast);

  const Icon = toastIcons[toast.type];
  const colorClasses = toastColors[toast.type];

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300);
  };

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 w-full max-w-sm
        bg-primary border rounded-lg shadow-lg p-4
        transition-all duration-300 ease-out
        ${isVisible && !isExiting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${colorClasses}
      `}
      role="alert"
    >
      {/* Icon */}
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />

      {/* Message */}
      <p className="flex-1 text-sm text-primary leading-relaxed">
        {toast.message}
      </p>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-theme"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-tertiary" />
      </button>
    </div>
  );
}
