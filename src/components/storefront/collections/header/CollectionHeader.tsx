"use client";

import { LayoutGrid, List, SlidersHorizontal, ChevronDown } from "lucide-react";
import {
  SortOption,
  useCollectionFilters,
  useLanguageStore,
  useUIStore,
} from "@/stores";
import { cn } from "@/utils";

export default function CollectionHeader({
  totalItems,
}: {
  totalItems: number;
}) {
  const { view, sort, setFilter } = useCollectionFilters();
  const openFilters = useUIStore((s) => s.openFilters);
  const { translate } = useLanguageStore();
  return (
    <div className="bg-primary border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 backdrop-blur-lg ">
      <div className="py-4">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between gap-3">
          {/* Filter Button */}
          <button
            onClick={openFilters}
            title={translate("collections.filters.openFilters")}
            className="
              flex items-center gap-2 px-4 py-2.5
              bg-gray-100 dark:bg-gray-800
              hover:bg-gray-200 dark:hover:bg-gray-700
              rounded-lg
              transition-colors
              group
            "
          >
            <SlidersHorizontal className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {translate("collections.header.filters")}
            </span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex-1 max-w-45">
            <select
              value={sort}
              onChange={(e) => setFilter("sort", e.target.value as SortOption)}
              title="Sort products"
              className="
                w-full appearance-none
                px-4 py-2.5 pr-10
                bg-primary
                text-sm font-medium
                text-primary
                rounded-lg
                cursor-pointer
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light
              "
            >
              <option value="newest">
                {translate("collections.header.sort.newestMobile")}
              </option>
              <option value="price_low">
                {translate("collections.header.sort.priceLow")}
              </option>
              <option value="price_high">
                {translate("collections.header.sort.priceHigh")}
              </option>
              <option value="popular">
                {translate("collections.header.sort.popular")}
              </option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setFilter("view", "grid")}
              title="Grid view"
              className={cn(
                "p-2 rounded-md transition-all",
                view === "grid"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700",
              )}
            >
              <LayoutGrid
                className={cn(
                  "w-4 h-4",
                  view === "grid"
                    ? "text-accent dark:text-accent-light"
                    : "text-gray-600 dark:text-gray-400",
                )}
              />
            </button>

            <button
              onClick={() => setFilter("view", "list")}
              title={translate("collections.view.listView")}
              className={cn(
                "p-2 rounded-md transition-all",
                view === "list"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700",
              )}
            >
              <List
                className={cn(
                  "w-4 h-4",
                  view === "list"
                    ? "text-accent dark:text-accent-light"
                    : "text-gray-600 dark:text-gray-400",
                )}
              />
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left: Item Count */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-primary">
              <span className="text-accent dark:text-accent-light font-semibold">
                {totalItems}
              </span>{" "}
              {totalItems === 1
                ? translate("collections.header.products.one")
                : translate("collections.header.products.other")}
            </p>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) =>
                  setFilter("sort", e.target.value as SortOption)
                }
                title="Sort products"
                className="
                  appearance-none
                  pl-4 pr-10 py-2.5
                  bg-gray-100 dark:bg-gray-800
                  hover:bg-gray-200 dark:hover:bg-gray-700
                  text-sm font-medium
                  text-gray-700 dark:text-gray-300
                  rounded-lg
                  cursor-pointer
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light
                  min-w-50
                "
              >
                <option value="newest">
                  {translate("collections.header.sort.newestMobile")}
                </option>
                <option value="price_low">
                  {translate("collections.header.sort.priceLow")}
                </option>
                <option value="price_high">
                  {translate("collections.header.sort.priceHigh")}
                </option>
                <option value="popular">
                  {translate("collections.header.sort.popular")}
                </option>
                <option value="rating">
                  {translate("collections.header.sort.rating")}
                </option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
            </div>

            {/* View Divider */}
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
              <button
                onClick={() => setFilter("view", "grid")}
                title={translate("collections.header.view.gridView")}
                className={cn(
                  "px-3 py-2 rounded-md transition-all flex items-center gap-2",
                  view === "grid"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700",
                )}
              >
                <LayoutGrid
                  className={cn(
                    "w-4 h-4",
                    view === "grid"
                      ? "text-accent dark:text-accent-light"
                      : "text-gray-600 dark:text-gray-400",
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    view === "grid"
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400",
                  )}
                >
                  {translate("collections.header.view.grid")}
                </span>
              </button>

              <button
                onClick={() => setFilter("view", "list")}
                title={translate("collections.header.view.listView")}
                className={cn(
                  "px-3 py-2 rounded-md transition-all flex items-center gap-2",
                  view === "list"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700",
                )}
              >
                <List
                  className={cn(
                    "w-4 h-4",
                    view === "list"
                      ? "text-accent dark:text-accent-light"
                      : "text-gray-600 dark:text-gray-400",
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    view === "list"
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400",
                  )}
                >
                  {translate("collections.header.view.list")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
