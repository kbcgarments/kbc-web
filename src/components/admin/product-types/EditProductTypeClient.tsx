/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader, Loader2 } from "lucide-react";

import { useGetProductTypesAdmin, useUpdateProductType } from "@/hooks";

interface Props {
  productTypeId: string;
}

export function EditProductTypeClient({ productTypeId }: Props) {
  const router = useRouter();
  const { data, isLoading } = useGetProductTypesAdmin();
  const updateProductType = useUpdateProductType();

  const productTypes = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const productType = productTypes.find((p) => p.id === productTypeId);

  const [form, setForm] = useState({
    label_en: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!productType) return;
    setForm({
      label_en: productType.label_en,
      order: productType.order,
      isActive: productType.isActive,
    });
  }, [productType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProductType.mutate(
      { id: productTypeId, payload: form },
      { onSuccess: () => router.push("/admin/product-types") },
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!productType) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Product Type Not Found</h2>
        <Link href="/admin/product-types" className="text-accent">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-8xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/product-types"
          className="p-2 rounded-lg hover:bg-tertiary"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div>
          <h1 className="text-3xl font-bold">Edit Product Type</h1>
          <p className="text-secondary">Update product type settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-secondary border border-primary rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Label (English)
            </label>
            <input
              value={form.label_en}
              onChange={(e) => setForm({ ...form, label_en: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/product-types"
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={updateProductType.isPending}
            className="px-6 py-2 bg-accent text-white rounded-lg"
          >
            {updateProductType.isPending ? (
              <Loader2 className="w-5 h-5" />
            ) : (
              "Update Product Type"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
