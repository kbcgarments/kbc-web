import { create } from "zustand";
import { Toast, ToastType } from "@/types";

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (message: string, type: ToastType = "info", duration = 3500) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  success: (message: string, duration = 5000) => {
    useToastStore.getState().addToast(message, "success", duration);
  },

  error: (message: string, duration = 5000) => {
    useToastStore.getState().addToast(message, "error", duration);
  },

  warning: (message: string, duration = 5000) => {
    useToastStore.getState().addToast(message, "warning", duration);
  },

  info: (message: string, duration = 5000) => {
    useToastStore.getState().addToast(message, "info", duration);
  },
}));
