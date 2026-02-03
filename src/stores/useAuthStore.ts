import { Customer } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: Customer | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setUser: (user: Customer | null) => void;
  setHydrated: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isHydrated: true,
    }),

  setHydrated: () =>
    set({
      isHydrated: true,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isHydrated: true,
    }),
}));
