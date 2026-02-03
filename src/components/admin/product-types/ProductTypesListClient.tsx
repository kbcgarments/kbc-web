"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, Loader } from "lucide-react";

import { useGetProductTypesAdmin, useDeleteProductType } from "@/hooks";

export function ProductTypesListClient() {
  const { data, isLoading } = useGetProductTypesAdmin();
  const deleteProductType = useDeleteProductType();
  const [searchQuery, setSearchQuery] = useState("");

  const productTypes = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const sorted = useMemo(
    () => [...productTypes].sort((a, b) => a.order - b.order),
    [productTypes],
  );

  const filtered = sorted.filter((pt) =>
    pt.label_en.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete product type "${name}"?`)) {
      deleteProductType.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Product Types
          </h1>
          <p className="text-secondary">
            Manage product groupings (T-shirts, Hoodies, etc.)
          </p>
        </div>

        <Link
          href="/admin/product-types/create"
          className="flex items-center gap-2 px-4 py-2 text-accent rounded-lg hover:bg-accent/10"
        >
          <Plus className="w-5 h-5" />
          Create Product Type
        </Link>
      </div>

      {/* SEARCH */}
      <div className="bg-secondary border border-primary rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product types..."
            className="w-full pl-10 pr-4 py-2 bg-primary border border-primary rounded-lg focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-secondary">
            No product types found
          </div>
        ) : (
          filtered.map((pt) => (
            <div
              key={pt.id}
              className="bg-secondary border border-primary rounded-lg p-6 hover:shadow transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-accent">
                    {pt.label_en.charAt(0)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/product-types/${pt.id}/edit`}
                    className="p-2 text-accent hover:bg-accent/10 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(pt.id, pt.label_en)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-primary">
                {pt.label_en}
              </h3>

              <p className="text-sm text-secondary mt-2">
                Key: <code>{pt.key}</code>
              </p>

              <p className="text-sm text-secondary mt-1">Order: {pt.order}</p>

              <p className="text-sm mt-2">
                Status:{" "}
                <span
                  className={pt.isActive ? "text-green-600" : "text-red-600"}
                >
                  {pt.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          ))
        )}
      </div>

      <div className="text-sm text-secondary">
        Showing {filtered.length} of {productTypes.length} product types
      </div>
    </div>
  );
}
