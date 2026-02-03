"use client";

import { create } from "zustand";
export type SortOption = "newest" | "price_low" | "price_high";
export interface FilterState {
  view: "grid" | "list";
  sort: SortOption;
  sizes: string[];
  colorIds: string[];
  types: string[];
  stock?: "in" | "out";
  minPrice?: number;
  maxPrice?: number;
  openMobile: boolean;

  setFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => void;

  resetFilters: () => void;
  syncFromURL: () => void;
}

const defaultState: Omit<
  FilterState,
  "setFilter" | "resetFilters" | "syncFromURL"
> = {
  view: "grid",
  sort: "newest",
  sizes: [],
  colorIds: [],
  types: [],
  stock: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  openMobile: false,
};

export const useCollectionFilters = create<FilterState>((set) => ({
  ...defaultState,

  /** Set individual filter + sync to URL */
  setFilter: (key, value) => {
    set({ [key]: value } as Partial<FilterState>);

    if (typeof window === "undefined") return;
    if (key === "openMobile") return;
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;

    // Remove empty values
    if (
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    ) {
      params.delete(key);
    } else {
      params.set(key, Array.isArray(value) ? value.join(",") : String(value));
    }

    const query = params.toString();
    const newUrl = query ? `${path}?${query}` : path;

    window.history.replaceState({}, "", newUrl);
  },

  /** Reset ALL filters */
  resetFilters: () => {
    set(defaultState);

    if (typeof window !== "undefined") {
      // wipe all query params
      window.history.replaceState({}, "", window.location.pathname);
    }
  },

  /** Initialize state from URL on first load */
  syncFromURL: () => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const getArray = (key: string) =>
      params.get(key)?.split(",").filter(Boolean) ?? [];

    const sortParam = params.get("sort");
    const validSort: SortOption =
      sortParam === "newest" ||
      sortParam === "price_low" ||
      sortParam === "price_high"
        ? sortParam
        : "newest";

    const updates: Partial<FilterState> = {
      view: params.get("view") === "list" ? "list" : "grid",
      sort: validSort,
      sizes: getArray("sizes"),
      colorIds: getArray("colorIds"),
      types: getArray("types"),

      stock:
        params.get("stock") === "in" || params.get("stock") === "out"
          ? (params.get("stock") as "in" | "out")
          : undefined,

      minPrice: params.get("minPrice")
        ? Number(params.get("minPrice"))
        : undefined,

      maxPrice: params.get("maxPrice")
        ? Number(params.get("maxPrice"))
        : undefined,
      openMobile: false,
    };
    set(updates);
  },
}));
