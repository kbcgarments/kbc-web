"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCollectionFilters } from "@/stores/useCollectionFilters";
import { localizeField } from "@/utils";
import { useLanguageStore } from "@/stores";
import type { Category } from "@/types";
import { cn } from "@/utils";

import { FilterSection } from "@/components/common/filters/FilterSection";
import { FilterCheckbox } from "@/components/common/filters/FilterCheckbox";
import { FilterColorSwatch } from "@/components/common/filters/FilterColorSwatch";
import { FilterSizePill } from "@/components/common/filters/FilterSizePill";
import { PriceRange } from "@/components/common/filters/PriceRange";

import { SIZES } from "@/constants/filters";
import { useGetProductColors, useGetProductTypes } from "@/hooks";

export default function CollectionFiltersSidebar({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: productTypes = [] } = useGetProductTypes();
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

  const slugFromUrl =
    pathname.startsWith("/collections/") && pathname.split("/").length === 3
      ? pathname.split("/")[2]
      : null;

  const sortedCategories = [...categories].sort((a, b) =>
    a.name_en.localeCompare(b.name_en),
  );
  const hasActiveFilters =
    sizes.length ||
    colorIds.length ||
    types.length ||
    stock ||
    minPrice !== undefined ||
    maxPrice !== undefined;
  return (
    <aside className="space-y-6 px-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase font-bold tracking-wider text-primary">
          {translate("collections.header.filters")}
        </h3>

        <button
          onClick={resetFilters}
          disabled={!hasActiveFilters}
          className={cn(
            "text-xs underline transition",
            hasActiveFilters
              ? "hover:text-accent"
              : "opacity-40 cursor-not-allowed",
          )}
        >
          {translate("collections.header.clearAll")}
        </button>
      </div>

      {/* CATEGORIES */}
      <FilterSection title={translate("collections.filters.categories")}>
        {sortedCategories.map((cat) => {
          const label = localizeField(cat, "name", language);
          const isActive = slugFromUrl === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() =>
                router.push(
                  isActive ? "/collections" : `/collections/${cat.slug}`,
                )
              }
              className={cn(
                "block w-full text-left px-3 py-2 rounded-lg text-sm transition",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "hover:bg-secondary text-primary",
              )}
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
        <div className="grid grid-cols-4 gap-3">
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
          {productTypes.map((t) => (
            <FilterCheckbox
              key={t.id}
              label={localizeField(t, "label", language)}
              checked={types.includes(t.key)}
              onToggle={() =>
                setFilter(
                  "types",
                  types.includes(t.key)
                    ? types.filter((x) => x !== t.key)
                    : [...types, t.key],
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
          onToggle={() => setFilter("stock", stock === "in" ? undefined : "in")}
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
    </aside>
  );
}
