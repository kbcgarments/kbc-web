"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  apiClient,
  interpretAuthError,
  resolveAuthSuccess,
  useMutationHelpers,
} from "@/lib";
import { AuthResponse, Customer, LoginPayload, RefreshResponse } from "@/types";
import {
  useAuthStore,
  useCartStore,
  useLanguageStore,
  useWishlistStore,
} from "@/stores";
/* ============================================
   REGISTER
=============================================== */
export function useRegister() {
  const { success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (payload: { email: string; password: string; name?: string }) =>
      apiClient.post("/auth/register", payload),

    onSuccess: () => {
      const { translate } = useLanguageStore.getState();
      success(translate(resolveAuthSuccess("register")));
    },

    onError: (err) => {
      const { translate } = useLanguageStore.getState();
      error(translate(interpretAuthError(err)));
    },
  });
}

/* ============================================
   LOGIN
=============================================== */
export function useLogin() {
  const { queryClient, success, error } = useMutationHelpers();
  const { resetCart } = useCartStore();
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (payload) =>
      apiClient.post<AuthResponse, LoginPayload>("/auth/login", payload),

    onSuccess: (data) => {
      localStorage.setItem("kbc_customer_token", data.accessToken);
      localStorage.setItem("kbc_customer_refresh", data.refreshToken);

      resetCart();
      useWishlistStore.getState().resetWishlist();

      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.removeQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });

      const { translate } = useLanguageStore.getState();
      success(translate(resolveAuthSuccess("login")));
    },

    onError: (err) => {
      const { translate } = useLanguageStore.getState();
      error(translate(interpretAuthError(err)));
    },
  });
}

/* ============================================
   LOGOUT
=============================================== */
export function useLogout() {
  const { queryClient, success } = useMutationHelpers();
  const logoutStore = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),

    onSuccess: () => {
      localStorage.removeItem("kbc_customer_token");
      localStorage.removeItem("kbc_customer_refresh");

      logoutStore();

      queryClient.removeQueries({ queryKey: ["auth-me"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.removeQueries({ queryKey: ["wishlist"] });

      const { translate } = useLanguageStore.getState();
      success(translate(resolveAuthSuccess("logout")));
    },
  });
}

/* ============================================
   CURRENT USER
=============================================== */
export function useAuthMe() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("kbc_customer_token")
      : null;

  return useQuery({
    queryKey: ["auth-me"],
    queryFn: () => apiClient.get<Customer>("/auth/me"),
    enabled: !!token,
    retry: false,
  });
}

/* ============================================
   REFRESH TOKEN
=============================================== */
export function useRefreshToken() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (refreshToken: string) =>
      apiClient.post<RefreshResponse>("/auth/refresh", { refreshToken }),

    onSuccess: (data) => {
      localStorage.setItem("kbc_customer_token", data.accessToken);
      localStorage.setItem("kbc_customer_refresh", data.refreshToken);
    },

    onError: () => {
      localStorage.removeItem("kbc_customer_token");
      localStorage.removeItem("kbc_customer_refresh");
      setUser(null);
    },
  });
}

/* ============================================
   FORGOT PASSWORD
=============================================== */
export function useForgotPassword() {
  const { success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (email: string) =>
      apiClient.post("/auth/forgot-password", { email }),

    onSuccess: () => {
      const { translate } = useLanguageStore.getState();
      success(translate(resolveAuthSuccess("forgotPassword")));
    },

    onError: (err) => {
      const { translate } = useLanguageStore.getState();
      error(translate(interpretAuthError(err)));
    },
  });
}

/* ============================================
   RESET PASSWORD
=============================================== */
export function useResetPassword() {
  const { success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (payload: { token: string; newPassword: string }) =>
      apiClient.post("/auth/reset-password", payload),

    onSuccess: () => {
      const { translate } = useLanguageStore.getState();
      success(translate(resolveAuthSuccess("resetPassword")));
    },

    onError: (err) => {
      const { translate } = useLanguageStore.getState();
      error(translate(interpretAuthError(err)));
    },
  });
}

/* ============================================
   CHANGE PASSWORD (AUTHENTICATED)
=============================================== */
export function useChangePassword() {
  const { success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      apiClient.post("/auth/change-password", payload),

    onSuccess: () => {
      const { translate } = useLanguageStore.getState();
      success(translate(resolveAuthSuccess("resetPassword")));
    },

    onError: (err) => {
      const { translate } = useLanguageStore.getState();
      error(translate(interpretAuthError(err)));
    },
  });
}
