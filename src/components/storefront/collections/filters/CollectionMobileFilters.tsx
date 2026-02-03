"use client";

import { X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useCollectionFilters } from "@/stores/useCollectionFilters";
import { useLanguageStore } from "@/stores";
import { localizeField } from "@/utils";
import type { Category } from "@/types";
import { cn } from "@/utils";

import { FilterSection } from "@/components/common/filters/FilterSection";
import { FilterColorSwatch } from "@/components/common/filters/FilterColorSwatch";
import { FilterCheckbox } from "@/components/common/filters/FilterCheckbox";
import { FilterSizePill } from "@/components/common/filters/FilterSizePill";
import { PriceRange } from "@/components/common/filters/PriceRange";

import { PRODUCT_TYPES, SIZES } from "@/constants/filters";
import { useGetProductColors } from "@/hooks";

export default function CollectionMobileFilters({
  categories,
  open,
  onClose,
}: {
  categories: Category[];
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { language, translate } = useLanguageStore();
  const { data: productColors = [] } = useGetProductColors();

  const {
    sizes,
    colorIds,
    types,
    stock,
    minPrice,
    maxPrice,
    setFilter,
    resetFilters,
  } = useCollectionFilters();

  if (!open) return null;

  const slugFromUrl =
    pathname.startsWith("/collections/") && pathname.split("/").length === 3
      ? pathname.split("/")[2]
      : null;

  const sortedCategories = [...categories].sort((a, b) =>
    a.name_en.localeCompare(b.name_en),
  );

  const applyFilters = () => {
    const params = new URLSearchParams(window.location.search);

    if (sizes.length) {
      params.set("sizes", sizes.join(","));
    } else {
      params.delete("sizes");
    }

    if (colorIds.length) {
      params.set("colorIds", colorIds.join(","));
    } else {
      params.delete("colorIds");
    }

    if (types.length) {
      params.set("types", types.join(","));
    } else {
      params.delete("types");
    }

    if (stock) {
      params.set("stock", stock);
    } else {
      params.delete("stock");
    }

    if (minPrice !== undefined) {
      params.set("minPrice", String(minPrice));
    } else {
      params.delete("minPrice");
    }

    if (maxPrice !== undefined) {
      params.set("maxPrice", String(maxPrice));
    } else {
      params.delete("maxPrice");
    }

    router.push(`${pathname}?${params.toString()}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="absolute top-0 left-0 h-full w-[85%] max-w-90 bg-primary shadow-xl overflow-y-auto animate-slideInLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-primary border-b px-6 py-5 z-20 flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {translate("collections.header.filters")}
          </h3>
          <button
            title={translate("collections.filters.closeFilters")}
            onClick={onClose}
          >
            <X className="w-6 h-6 text-primary" />
          </button>
        </div>

        <div className="px-6 pb-24">
          {/* CATEGORIES */}
          <FilterSection title={translate("collections.filters.categories")}>
            {sortedCategories.map((cat) => {
              const label = localizeField(cat, "name", language);
              const isActive = slugFromUrl === cat.slug;

              return (
                <button
                  key={cat.id}
                  className={cn(
                    "block w-full text-left text-sm px-3 py-2 rounded-lg transition",
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "hover:bg-secondary",
                  )}
                  onClick={() => {
                    router.push(`/collections/${cat.slug}`);
                    onClose();
                  }}
                >
                  {label}
                </button>
              );
            })}
          </FilterSection>

          {/* SIZES */}
          <FilterSection title={translate("collections.filters.sizes")}>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <FilterSizePill
                  key={size}
                  label={size}
                  active={sizes.includes(size)}
                  onToggle={() =>
                    setFilter(
                      "sizes",
                      sizes.includes(size)
                        ? sizes.filter((s) => s !== size)
                        : [...sizes, size],
                    )
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* COLORS */}
          <FilterSection title={translate("collections.filters.colors")}>
            <div className="grid grid-cols-6 gap-3">
              {productColors.map((c) => (
                <FilterColorSwatch
                  key={c.hex}
                  hex={c.hex}
                  name={c.label}
                  active={colorIds.includes(c.hex)}
                  onToggle={() =>
                    setFilter(
                      "colorIds",
                      colorIds.includes(c.hex)
                        ? colorIds.filter((x) => x !== c.hex)
                        : [...colorIds, c.hex],
                    )
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* PRODUCT TYPES */}
          <FilterSection title={translate("collections.filters.productType")}>
            <div className="space-y-3">
              {PRODUCT_TYPES.map((t) => (
                <FilterCheckbox
                  key={t.value}
                  label={t.label}
                  checked={types.includes(t.value)}
                  onToggle={() =>
                    setFilter(
                      "types",
                      types.includes(t.value)
                        ? types.filter((x) => x !== t.value)
                        : [...types, t.value],
                    )
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* STOCK */}
          <FilterSection title={translate("collections.filters.availability")}>
            <FilterCheckbox
              label={translate("collections.filters.inStockOnly")}
              checked={stock === "in"}
              onToggle={() =>
                setFilter("stock", stock === "in" ? undefined : "in")
              }
            />

            <FilterCheckbox
              label={translate("collections.filters.outOfStock")}
              checked={stock === "out"}
              onToggle={() =>
                setFilter("stock", stock === "out" ? undefined : "out")
              }
            />
          </FilterSection>

          {/* PRICE RANGE */}
          <FilterSection title={translate("collections.filters.priceRange")}>
            <PriceRange
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinChange={(v) => setFilter("minPrice", v)}
              onMaxChange={(v) => setFilter("maxPrice", v)}
              min={0}
              max={2000}
              step={10}
            />
          </FilterSection>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="fixed bottom-0 left-0 w-[85%] max-w-90 bg-primary border-t px-6 py-4 space-y-3">
          <button
            onClick={applyFilters}
            className="w-full py-3 rounded-xl bg-accent text-white font-semibold shadow-lg hover:opacity-90"
          >
            {translate("collections.filters.applyFilters")}
          </button>

          <button
            onClick={() => {
              resetFilters();
              onClose();
            }}
            className="w-full py-3 rounded-xl border font-semibold text-primary"
          >
            {translate("collections.filters.resetFilters")}
          </button>
        </div>
      </div>
    </div>
  );
}
