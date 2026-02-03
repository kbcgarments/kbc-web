"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Archive, Search, Filter, Loader } from "lucide-react";
import { useGetProducts, useArchiveProducts } from "@/hooks";
import type { PRODUCT_STATUS } from "@/types";

/* ======================================================
   MAIN COMPONENT
====================================================== */
export function ProductsListClient() {
  const { data, isLoading } = useGetProducts({
    admin: "true",
    limit: 500,
  });
  const archiveProducts = useArchiveProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | PRODUCT_STATUS>(
    "ALL",
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const products = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  /* -----------------------------------------------------
     FILTERED PRODUCTS
  ------------------------------------------------------ */
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return products?.filter((product) => {
      const title = product.title_en?.toLowerCase() ?? "";
      const matchesSearch = !q || title.includes(q);
      const matchesStatus =
        statusFilter === "ALL" || product.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  /* -----------------------------------------------------
     SELECTION HELPERS
  ------------------------------------------------------ */
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAllVisible = () => {
    const selectableIds = filteredProducts
      .filter((p) => p.status !== "ARCHIVED")
      .map((p) => p.id);

    setSelectedIds((prev) =>
      prev.length === selectableIds.length ? [] : selectableIds,
    );
  };

  const clearSelection = () => setSelectedIds([]);

  /* -----------------------------------------------------
     ACTION HANDLERS
  ------------------------------------------------------ */
  const handleSingleArchive = (id: string) => {
    if (!confirm("Archive this product?")) return;

    archiveProducts.mutate(id);
  };

  const handleBulkArchive = () => {
    if (!selectedIds.length) return;

    if (!confirm(`Archive ${selectedIds.length} selected product(s)?`)) return;

    archiveProducts.mutate(selectedIds, {
      onSuccess: clearSelection,
    });
  };

  /* -----------------------------------------------------
     LOADING
  ------------------------------------------------------ */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  /* -----------------------------------------------------
     UI
  ------------------------------------------------------ */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Products</h1>
          <p className="text-secondary">Manage your store products</p>
        </div>

        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 px-4 py-2 bg-sand-900 hover:bg-sand-800 text-accent rounded-lg"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>
      {/* FILTER BAR */}
      <div className="bg-secondary border border-primary rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* SEARCH */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIds([]);
              }}
              className="w-full pl-10 pr-4 py-2 bg-primary border border-primary rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-secondary" />
            <select
              title="select filter option"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "ALL" | PRODUCT_STATUS);
                setSelectedIds([]);
              }}
              className="px-4 py-2 bg-primary border border-primary rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>
      {/* BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
          <p className="text-sm font-medium">{selectedIds.length} selected</p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkArchive}
              disabled={archiveProducts.isPending}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Archive selected
            </button>

            <button
              onClick={clearSelection}
              className="text-sm underline text-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      {/* TABLE */}
      <div className="bg-secondary border border-primary rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <Th>
                  <input
                    type="checkbox"
                    title="Select all visible products"
                    aria-label="Select all visible products"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length ===
                        filteredProducts.filter((p) => p.status !== "ARCHIVED")
                          .length
                    }
                    onChange={selectAllVisible}
                  />
                </Th>
                <Th>Image</Th>
                <Th>Title</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th>Variants</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-secondary text-sm"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const image = product.images?.[0];

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-primary hover:bg-tertiary"
                    >
                      {/* CHECKBOX */}
                      <td className="py-3 px-4">
                        <input
                          title="Select product"
                          type="checkbox"
                          disabled={product.status === "ARCHIVED"}
                          checked={selectedIds.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                        />
                      </td>
                      {/* IMAGE */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-tertiary">
                          {image ? (
                            <Image
                              src={image.url}
                              alt={product.title_en}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              👕
                            </div>
                          )}
                        </div>
                      </td>
                      {/* TITLE */}
                      <td className="py-3 px-4 text-sm font-medium">
                        {product.title_en}
                      </td>
                      {/* CATEGORY */}
                      <td className="py-3 px-4 text-sm text-secondary">
                        {product.category?.name_en || "Uncategorized"}
                      </td>
                      {/* PRICE */}
                      <td className="py-3 px-4 text-sm">
                        ${product.priceUSD.toFixed(2)}
                      </td>
                      {/* STATUS */}
                      <td className="py-3 px-4">
                        <PRODUCT_STATUSBadge status={product.status} />
                      </td>
                      {/* VARIANTS */}
                      <td className="py-3 px-4 text-sm text-secondary">
                        {product.variants?.length ?? 0}
                      </td>
                      {/* ACTIONS */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-accent hover:bg-accent/10 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            title="Delete selected product"
                            onClick={() => handleSingleArchive(product.id)}
                            disabled={archiveProducts.isPending}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* FOOTER */}
      <div className="text-sm text-secondary">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}

/* ======================================================
   SMALL COMPONENTS
====================================================== */

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`text-left py-3 px-4 text-sm font-semibold text-primary ${className}`}
    >
      {children}
    </th>
  );
}

function PRODUCT_STATUSBadge({ status }: { status: PRODUCT_STATUS }) {
  const styles =
    status === "ACTIVE"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : status === "DRAFT"
        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";

  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}
