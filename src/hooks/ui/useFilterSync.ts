"use client";

import { useEffect } from "react";
import { useCollectionFilters } from "@/stores/useCollectionFilters";

export function useFilterSync() {
  const syncFromURL = useCollectionFilters((s) => s.syncFromURL);

  useEffect(() => {
    syncFromURL();
  }, [syncFromURL]);
}
