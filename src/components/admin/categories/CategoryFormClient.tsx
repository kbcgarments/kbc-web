"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { useCreateCategory } from "@/hooks";
import { ImageUploader, UIImage } from "@/components/ui/media/ImageUploader";

interface CategoryFields {
  name_en: string;
  description_en: string;
  image: UIImage[];
}

export function CategoryFormClient() {
  const router = useRouter();
  const createCategory = useCreateCategory();

  const [categories, setCategories] = useState<CategoryFields[]>([
    { name_en: "", description_en: "", image: [] },
  ]);

  const addCategory = () =>
    setCategories((prev) => [
      ...prev,
      { name_en: "", description_en: "", image: [] },
    ]);

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const updateField = <K extends keyof CategoryFields>(
    index: number,
    field: K,
    value: CategoryFields[K],
  ) => {
    setCategories((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: Array.isArray(value) ? [...value] : value,
      };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (categories.some((c) => !c.name_en.trim())) {
      alert("Every category must have a name.");
      return;
    }

    if (categories.some((c) => c.image.length !== 1 || !c.image[0].file)) {
      alert("Each category must have exactly ONE image.");
      return;
    }

    const formData = new FormData();

    formData.append(
      "fields",
      JSON.stringify(
        categories.map((c) => ({
          name_en: c.name_en.trim(),
          description_en: c.description_en.trim(),
        })),
      ),
    );

    categories.forEach((c) => {
      const file = c.image[0]?.file;
      if (file) formData.append("images", file, file.name);
    });

    try {
      await createCategory.mutateAsync(formData);
      router.push("/admin/categories");
    } catch {}
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col max-w-8xl mx-auto">
      {/* ================= HEADER (STICKY) ================= */}
      <div className="sticky top-0 z-10 bg-primary border-b border-primary/20">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/categories"
              title="Back to Categories"
              className="p-2 hover:bg-tertiary rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-primary">
                Create Categories
              </h1>
              <p className="text-sm text-secondary">
                Add multiple categories at once
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={addCategory}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sand-900 hover:bg-sand-800 text-accent"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* ================= SCROLLABLE BODY ================= */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-8"
      >
        {categories.map((cat, index) => (
          <div
            key={index}
            className="relative bg-secondary border border-primary rounded-lg p-6 space-y-4"
          >
            {categories.length > 1 && (
              <button
                type="button"
                onClick={() => removeCategory(index)}
                className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-100 rounded-lg"
                aria-label={`Remove category ${index + 1}`}
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <h2 className="text-lg font-semibold text-primary">
              Category #{index + 1}
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category Name (English) *
              </label>
              <input
                required
                value={cat.name_en}
                onChange={(e) => updateField(index, "name_en", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
                placeholder="Men's Clothing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={cat.description_en}
                onChange={(e) =>
                  updateField(index, "description_en", e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg border"
              />
            </div>

            <ImageUploader
              images={cat.image}
              onChange={(images) => updateField(index, "image", images)}
              allowMultiple={false}
              enablePrimary={false}
              enableColor={false}
              maxImages={1}
            />
          </div>
        ))}
      </form>

      {/* ================= FOOTER (STICKY) ================= */}
      <div className="sticky bottom-0 bg-primary border-t border-primary/20 px-6 py-4">
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/categories"
            className="px-6 py-2 border rounded-lg hover:bg-tertiary"
          >
            Cancel
          </Link>

          <button
            type="submit"
            form="__next"
            onClick={handleSubmit}
            disabled={createCategory.isPending}
            className="flex items-center gap-2  px-6 py-2 bg-accent text-white rounded-lg disabled:opacity-50"
          >
            {createCategory.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Create Categories"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
