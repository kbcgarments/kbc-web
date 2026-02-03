"use client";

import { ReactNode, useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";

import { ThemeProvider } from "./ThemeProvider";
import { ToastContainer } from "../components/common/toast/ToastContainer";

import { useLanguageStore } from "@/stores/useLanguageStore";
import { useGetCurrencyRates } from "@/hooks";
import { AuthHydrator } from "./AuthHydrator";
import { useAuthMe, useGetCart, useGetWishlist } from "@/hooks";

function LanguageLoader({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const { language, loadTranslations } = useLanguageStore();

  useEffect(() => {
    loadTranslations(language).then(() => setIsReady(true));
  }, [language, loadTranslations]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Handles app-wide effects:
 * - Loads currency rates
 * - Initializes cart token + loads cart once
 */
function AppInitializer() {
  useGetCurrencyRates();
  useGetCart();
  useGetWishlist();
  useAuthMe();
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppInitializer />
        <AuthHydrator />
        <LanguageLoader>
          {children}
          <ToastContainer />
        </LanguageLoader>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
