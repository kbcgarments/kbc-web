"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Trash2, RotateCcw, Loader, AlertTriangle } from "lucide-react";

import {
  useGetProducts,
  useHardDeleteProducts,
  useRestoreProducts,
} from "@/hooks";
import { PRODUCT_STATUS } from "@/types";

/* ======================================================
   RECYCLE BIN — PRODUCTS
====================================================== */
export function ProductsRecycleClient() {
  const { data, isLoading } = useGetProducts({
    admin: "all",
    status: PRODUCT_STATUS.ARCHIVED,
    limit: 500,
  });

  const restoreProducts = useRestoreProducts();
  const hardDeleteProducts = useHardDeleteProducts();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const products = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);
  /* -----------------------------------------------------
     ARCHIVED PRODUCTS ONLY
  ------------------------------------------------------ */
  const archivedProducts = useMemo(
    () => products.filter((p) => p.status === "ARCHIVED"),
    [products],
  );

  /* -----------------------------------------------------
     SELECTION HELPERS
  ------------------------------------------------------ */
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    setSelectedIds((prev) =>
      prev.length === archivedProducts.length
        ? []
        : archivedProducts.map((p) => p.id),
    );
  };

  const clearSelection = () => setSelectedIds([]);

  /* -----------------------------------------------------
     ACTION HANDLERS
  ------------------------------------------------------ */
  const handleRestore = (ids: string | string[]) => {
    restoreProducts.mutate(ids, {
      onSuccess: clearSelection,
    });
  };

  const handleHardDelete = (ids: string | string[]) => {
    if (
      !confirm(
        "This will permanently delete the selected product(s). This action cannot be undone. Continue?",
      )
    )
      return;

    hardDeleteProducts.mutate(ids, {
      onSuccess: clearSelection,
    });
  };

  /* -----------------------------------------------------
     LOADING STATE
  ------------------------------------------------------ */
  if (isLoading) {
    return (
      <div
        className="flex justify-center py-20"
        title="Loading archived products"
      >
        <Loader className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  /* -----------------------------------------------------
     UI
  ------------------------------------------------------ */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Recycle Bin</h1>
        <p className="text-secondary">
          Archived products available for restore or permanent deletion
        </p>
      </div>
      {/* WARNING */}
      <div
        className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4"
        title="Warning: permanent deletion cannot be undone"
      >
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
        <p className="text-sm text-red-800 dark:text-red-200">
          Products deleted from the recycle bin are permanently removed and
          cannot be recovered.
        </p>
      </div>
      {/* BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div
          className="flex items-center justify-between bg-secondary border border-primary rounded-lg p-4"
          title="Bulk actions for selected products"
        >
          <p
            className="text-sm font-medium"
            title="Number of selected products"
          >
            {selectedIds.length} selected
          </p>

          <div className="flex gap-3">
            <button
              title="Restore selected products"
              onClick={() => handleRestore(selectedIds)}
              disabled={restoreProducts.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Restore
            </button>

            <button
              title="Permanently delete selected products"
              onClick={() => handleHardDelete(selectedIds)}
              disabled={hardDeleteProducts.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete forever
            </button>
          </div>
        </div>
      )}
      {/* TABLE */}
      <div className="bg-secondary border border-primary rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <Th>
                <input
                  type="checkbox"
                  title="Select all archived products"
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === archivedProducts.length
                  }
                  onChange={selectAll}
                />
              </Th>
              <Th>Image</Th>
              <Th>Title</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>

          <tbody>
            {archivedProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-secondary text-sm"
                  title="No archived products"
                >
                  Recycle bin is empty 🎉
                </td>
              </tr>
            ) : (
              archivedProducts.map((product) => {
                const image = product.images?.[0];

                return (
                  <tr
                    key={product.id}
                    className="border-t border-primary hover:bg-tertiary"
                    title={`Archived product: ${product.title_en}`}
                  >
                    {/* SELECT */}
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        title="Select product"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                      />
                    </td>
                    {/* IMAGE */}
                    <td className="py-3 px-4">
                      <div
                        className="w-12 h-12 rounded-lg overflow-hidden bg-tertiary"
                        title="Product image"
                      >
                        {image ? (
                          <Image
                            src={image.url}
                            alt={product.title_en}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            title="No image available"
                          >
                            👕
                          </div>
                        )}
                      </div>
                    </td>
                    {/* TITLE */}
                    <td
                      className="py-3 px-4 text-sm font-medium"
                      title={product.title_en}
                    >
                      {product.title_en}
                    </td>
                    {/* CATEGORY */}
                    <td
                      className="py-3 px-4 text-sm text-secondary"
                      title="Product category"
                    >
                      {product.category?.name_en || "Uncategorized"}
                    </td>
                    {/* PRICE */}
                    <td
                      className="py-3 px-4 text-sm"
                      title="Product price in USD"
                    >
                      ${product.priceUSD.toFixed(2)}
                    </td>
                    {/* ACTIONS */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          title="Restore product"
                          onClick={() => handleRestore(product.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        <button
                          title="Permanently delete product"
                          onClick={() => handleHardDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
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
  );
}

/* ======================================================
   SMALL COMPONENTS
====================================================== */

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`text-left py-3 px-4 text-sm font-semibold text-primary ${className || ""}`}
      title="Table column header"
    >
      {children}
    </th>
  );
}
