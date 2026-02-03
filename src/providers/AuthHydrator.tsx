"use client";

import { useEffect } from "react";
import { useAuthMe } from "@/hooks";
import { useAuthStore } from "@/stores/useAuthStore";

export function AuthHydrator() {
  const { data, isLoading, isError, isFetched } = useAuthMe();
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    if (isLoading) return;

    if (!isFetched) {
      setHydrated();
      return;
    }

    if (isError || !data) {
      setUser(null);
      return;
    }

    setUser(data);
  }, [data, isLoading, isError, isFetched, setUser, setHydrated]);

  return null;
}
