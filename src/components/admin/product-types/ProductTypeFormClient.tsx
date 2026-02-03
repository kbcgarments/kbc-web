"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import { useCreateProductType } from "@/hooks";

export function ProductTypeFormClient() {
  const router = useRouter();
  const createProductType = useCreateProductType();

  const [form, setForm] = useState({
    key: "",
    label_en: "",
    order: 0,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createProductType.mutateAsync(form);
    router.push("/admin/product-types");
  };

  return (
    <div className="max-w-8xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/product-types"
          className="p-2 hover:bg-tertiary rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Create Product Type</h1>
          <p className="text-secondary">Define a new product grouping</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-secondary border border-primary rounded-lg p-6 space-y-4">
          <input
            placeholder="Key (e.g. tshirt)"
            value={form.key}
            onChange={(e) => setForm({ ...form, key: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            placeholder="Label (English)"
            value={form.label_en}
            onChange={(e) => setForm({ ...form, label_en: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="number"
            placeholder="Order"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: Number(e.target.value) })
            }
            className="w-full px-4 py-2 border rounded-lg"
          />

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
            disabled={createProductType.isPending}
            className="px-6 py-2 bg-accent text-white rounded-lg"
          >
            {createProductType.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Create Product Type"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
