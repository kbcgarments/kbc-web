/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetCategories, useUpdateCategory } from "@/hooks";
import { ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
import { ImageUploader, UIImage } from "@/components/ui/media/ImageUploader";

interface EditCategoryClientProps {
  categoryId: string;
}

export function EditCategoryClient({ categoryId }: EditCategoryClientProps) {
  const router = useRouter();
  const { data, isLoading } = useGetCategories();
  const updateCategory = useUpdateCategory();
  const categories = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);
  const category = categories.find((c) => c.id === categoryId);

  const [formData, setFormData] = useState({
    name_en: "",
    description_en: "",
    imageUrl: "",
  });

  const [image, setImage] = useState<UIImage[]>([]);

  /* -------------------------------
    LOAD CATEGORY INTO THE FORM
  -------------------------------- */
  useEffect(() => {
    if (!category) return;

    setFormData({
      name_en: category.name_en ?? "",
      description_en: category.description_en ?? "",
      imageUrl: category?.imageUrl ?? "",
    });

    if (category.imageUrl) {
      setImage([
        {
          file: null,
          preview: category.imageUrl,
        },
      ]);
    }
  }, [category]);

  /* -------------------------------
    HANDLE SUBMIT
  -------------------------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append("name_en", formData.name_en.trim());
    fd.append("description_en", formData.description_en.trim());

    // Only append file if user uploaded one
    if (image.length > 0 && image[0].file) {
      fd.append("image", image[0].file, image[0].file.name);
    }

    updateCategory.mutate(
      { id: categoryId, formData: fd },
      {
        onSuccess: () => router.push("/admin/categories"),
      },
    );
  };

  /* -------------------------------
    LOADING OR NOT FOUND STATES
  -------------------------------- */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Category Not Found
        </h2>
        <Link
          href="/admin/categories"
          className="text-accent hover:text-accent-dark"
        >
          ← Back to Categories
        </Link>
      </div>
    );
  }

  /* -------------------------------
    MAIN UI
  -------------------------------- */
  return (
    <div className="max-w-8xl space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="p-2 hover:bg-tertiary rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>

        <div>
          <h1 className="text-3xl font-display font-bold text-primary">
            Edit Category
          </h1>
          <p className="text-secondary">Update category details and image</p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-secondary border border-primary rounded-lg p-6 space-y-6">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Category Name (English) *
            </label>
            <input
              type="text"
              required
              value={formData.name_en}
              onChange={(e) =>
                setFormData({ ...formData, name_en: e.target.value })
              }
              className="w-full px-4 py-2 bg-primary border border-primary rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g., Men's Clothing"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Description (English)
            </label>
            <textarea
              value={formData.description_en}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description_en: e.target.value,
                })
              }
              rows={4}
              className="w-full px-4 py-2 bg-primary border border-primary rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Describe this category..."
            />
          </div>

          {/* IMAGE UPLOADER */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Category Image
            </label>

            <ImageUploader
              images={image}
              onChange={setImage}
              allowMultiple={false}
              enablePrimary={false}
              enableColor={false}
              maxImages={1}
            />
          </div>

          {/* SLUG INFO */}
          <div className="pt-4 border-t border-primary">
            <p className="text-sm text-secondary">
              <strong>Slug:</strong> {category.slug}
            </p>
            <p className="text-xs text-tertiary mt-1">
              Slug is auto-generated and cannot be edited
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/categories"
            className="px-6 py-2 border border-primary rounded-lg hover:bg-tertiary transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={updateCategory.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-accent border-accent border
                       text-white rounded-lg hover:bg-accent-dark transition-colors
                       disabled:opacity-50"
          >
            {updateCategory.isPending ? (
              <Loader className="w-5 h-5 animate-spin text-white" />
            ) : (
              <span>Update Category</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
