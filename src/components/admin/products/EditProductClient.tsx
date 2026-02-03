/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useGetProduct,
  useGetProductColors,
  useUpdateProduct,
  useDeleteProductImages,
  useGetCategories,
  useGetProductSizes,
} from "@/hooks";
import { ArrowLeft, Plus, X, Loader, Trash2, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCT_STATUS, PRODUCT_CONTENT_TYPE } from "@/types";
import { UIImage, ImageUploader } from "@/components/ui/media/ImageUploader";

interface EditProductClientProps {
  productId: string;
}

interface Variant {
  id?: string;
  colorId: string;
  sizeId: string;
  stock: number;
}

type ContentSectionState = Record<PRODUCT_CONTENT_TYPE, string>;

export function EditProductClient({ productId }: EditProductClientProps) {
  const router = useRouter();
  const { data: product, isLoading } = useGetProduct(productId);
  const { data: colors = [] } = useGetProductColors();
  const { data: sizes = [] } = useGetProductSizes();
  const { data } = useGetCategories();
  const categories = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);
  const updateProduct = useUpdateProduct();
  const deleteImages = useDeleteProductImages();

  const orderedSizes = useMemo(
    () => [...sizes].sort((a, b) => a.order - b.order),
    [sizes],
  );

  const [fields, setFields] = useState({
    title_en: "",
    description_en: "",
    categoryId: "",
    priceUSD: "",
    status: "DRAFT" as PRODUCT_STATUS,
  });

  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<UIImage[]>([]);
  const [contentSections, setContentSections] = useState<ContentSectionState>({
    DESCRIPTION: "",
    SHIPPING: "",
    GENERAL: "",
  });

  // Populate form with product data
  useEffect(() => {
    if (product) {
      setFields({
        title_en: product.title_en,
        description_en: product.description_en,
        categoryId: product.categoryId || "",
        priceUSD: product.priceUSD.toString(),
        status: product.status,
      });

      setVariants(
        product.variants?.map((v) => ({
          id: v.id,
          colorId: v.colorId || "",
          sizeId: v.sizeId || "",
          stock: v.stock,
        })) || [],
      );

      // Populate content sections if they exist
      if (
        product.productContentSections &&
        product.productContentSections.length > 0
      ) {
        const sectionsObj: ContentSectionState = {
          DESCRIPTION: "",
          SHIPPING: "",
          GENERAL: "",
        };
        product.productContentSections.forEach((section) => {
          sectionsObj[section.type] = section.content_en || "";
        });
        setContentSections(sectionsObj);
      }
    }
  }, [product]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usableVariants = variants.filter((v) => v.colorId && v.sizeId);
    if (usableVariants.length === 0) {
      alert("Please add at least one valid variant");
      return;
    }

    const formData = new FormData();

    // Basic fields
    formData.append("title_en", fields.title_en.trim());
    formData.append("description_en", fields.description_en.trim());
    formData.append("categoryId", fields.categoryId || "");
    formData.append("priceUSD", String(parseFloat(fields.priceUSD)));
    formData.append("status", fields.status);

    // Variants
    formData.append("variants", JSON.stringify(usableVariants));

    // Content sections
    const sections = (
      Object.entries(contentSections) as [PRODUCT_CONTENT_TYPE, string][]
    )
      .filter(([, value]) => value.trim().length > 0)
      .map(([type, content_en]) => ({
        type,
        content_en: content_en.trim(),
      }));

    if (sections.length) {
      formData.append("contentSections", JSON.stringify(sections));
    }

    // New images
    if (newImages.length > 0) {
      newImages.forEach((img) => {
        if (img.file) {
          formData.append("newImages", img.file);
        }
      });

      const newImageMeta = newImages.map((img) => ({
        colorId: img.colorId ?? null,
        isPrimary: img.isPrimary ?? false,
      }));
      formData.append("newImageMeta", JSON.stringify(newImageMeta));
    }

    try {
      await updateProduct.mutateAsync({
        id: productId,
        formData,
      });
      router.push("/admin/products");
    } catch {}
  };

  // Variant handlers
  const addVariant = () =>
    setVariants([...variants, { colorId: "", sizeId: "", stock: 0 }]);

  const removeVariant = (index: number) => {
    if (variants.length <= 1) {
      alert("Product must have at least one variant");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | number,
  ) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Image selection & deletion
  const toggleImageSelection = (imgId: string) => {
    setSelectedImages((prev) =>
      prev.includes(imgId)
        ? prev.filter((id) => id !== imgId)
        : [...prev, imgId],
    );
  };

  const handleDeleteSelectedImages = () => {
    if (selectedImages.length === 0) return;

    const remaining = (product?.images?.length || 0) - selectedImages.length;
    if (remaining < 1) {
      alert("Product must have at least one image");
      return;
    }

    if (confirm(`Delete ${selectedImages.length} image(s)?`)) {
      deleteImages.mutate(
        { productId, imageIds: selectedImages },
        {
          onSuccess: () => setSelectedImages([]),
        },
      );
    }
  };

  const colorMap = useMemo(
    () => Object.fromEntries(colors.map((c) => [c.id, c])),
    [colors],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Product Not Found
        </h2>
        <Link
          href="/admin/products"
          className="text-accent hover:text-accent-dark"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pb-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Back to Products
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">
              Edit Product
            </h1>
            <p className="text-sm text-secondary">Update product details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO */}
          <section className="bg-secondary/20 border border-primary/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-primary mb-5">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  value={fields.title_en}
                  onChange={(e) =>
                    setFields({ ...fields, title_en: e.target.value })
                  }
                  placeholder="Enter product title"
                  required
                  className="w-full px-4 py-3 bg-primary border border-primary/20 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                  Short Description
                </label>
                <textarea
                  rows={4}
                  value={fields.description_en}
                  onChange={(e) =>
                    setFields({ ...fields, description_en: e.target.value })
                  }
                  placeholder="Brief product description"
                  required
                  className="w-full px-4 py-3 bg-primary border border-primary/20 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                    Category
                  </label>
                  <select
                    title="select category"
                    value={fields.categoryId}
                    onChange={(e) =>
                      setFields({ ...fields, categoryId: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-primary border border-primary/20 rounded-lg text-sm text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={fields.priceUSD}
                    onChange={(e) =>
                      setFields({ ...fields, priceUSD: e.target.value })
                    }
                    placeholder="0.00"
                    required
                    className="w-full px-4 py-3 bg-primary border border-primary/20 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                    Status
                  </label>
                  <select
                    title="select status"
                    value={fields.status}
                    onChange={(e) =>
                      setFields({
                        ...fields,
                        status: e.target.value as PRODUCT_STATUS,
                      })
                    }
                    className="w-full px-4 py-3 bg-primary border border-primary/20 rounded-lg text-sm text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value={PRODUCT_STATUS.DRAFT}>Draft</option>
                    <option value={PRODUCT_STATUS.ACTIVE}>Active</option>
                    <option value={PRODUCT_STATUS.ARCHIVED}>Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* CONTENT SECTIONS */}
          <section className="bg-secondary/20 border border-primary/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-primary mb-5">
              Product Content
            </h2>
            <div className="space-y-4">
              {(Object.keys(contentSections) as PRODUCT_CONTENT_TYPE[]).map(
                (type) => (
                  <div key={type}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                      {type}
                    </label>
                    <textarea
                      rows={3}
                      value={contentSections[type]}
                      onChange={(e) =>
                        setContentSections({
                          ...contentSections,
                          [type]: e.target.value,
                        })
                      }
                      placeholder={`Enter ${type.toLowerCase()} content...`}
                      className="w-full px-4 py-3 bg-primary border border-primary/20 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                    />
                  </div>
                ),
              )}
            </div>
          </section>

          {/* EXISTING IMAGES */}
          {product.images && product.images.length > 0 && (
            <section className="bg-secondary/20 border border-primary/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-primary">
                  Current Images
                </h2>
                {selectedImages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteSelectedImages}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    Delete ({selectedImages.length})
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => toggleImageSelection(img.id)}
                    className={`relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                      selectedImages.includes(img.id)
                        ? "border-accent ring-2 ring-accent/20"
                        : "border-primary/10 hover:border-accent/50"
                    }`}
                  >
                    <div className="aspect-square relative bg-secondary/20">
                      <Image
                        src={img.url}
                        alt="Product"
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </div>

                    {/* Checkmark */}
                    <div
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedImages.includes(img.id)
                          ? "bg-accent border-accent text-white scale-110"
                          : "bg-white/90 dark:bg-gray-800/90 border-primary/20"
                      }`}
                    >
                      {selectedImages.includes(img.id) && (
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M16.67 5.15a.75.75 0 010 1.06l-8.38 8.38a.75.75 0 01-1.06 0L3.3 10.66a.75.75 0 111.06-1.06l3.42 3.42 7.85-7.85a.75.75 0 011.06 0z" />
                        </svg>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
                      {img.isPrimary && (
                        <span className="px-2 py-0.5 bg-accent text-white text-[10px] font-semibold rounded-full">
                          Primary
                        </span>
                      )}
                      {img.colorId && colorMap[img.colorId] && (
                        <span className="px-2 py-0.5 bg-black/70 text-white text-[10px] font-medium rounded-full">
                          {colorMap[img.colorId].label}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ADD NEW IMAGES */}
          <section className="bg-secondary/20 border border-primary/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-primary mb-5">
              Add New Images
            </h2>
            <ImageUploader
              colors={colors}
              images={newImages}
              onChange={setNewImages}
              enableColor
              enablePrimary
              allowMultiple
            />
          </section>

          {/* VARIANTS */}
          <section className="bg-secondary/20 border border-primary/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-primary">
                Product Variants
              </h2>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm font-semibold hover:bg-accent/20 transition-colors"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((v, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-3 p-4 bg-primary rounded-lg border border-primary/10"
                >
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                      Color
                    </label>
                    <select
                      title="select color"
                      value={v.colorId}
                      onChange={(e) =>
                        updateVariant(i, "colorId", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-secondary/20 border border-primary/20 rounded-lg text-sm text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Color</option>
                      {colors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                      Size
                    </label>
                    <select
                      title="select size"
                      value={v.sizeId}
                      onChange={(e) =>
                        updateVariant(i, "sizeId", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-secondary/20 border border-primary/20 rounded-lg text-sm text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Size</option>
                      {orderedSizes.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-32">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) =>
                        updateVariant(i, "stock", Number(e.target.value))
                      }
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-secondary/20 border border-primary/20 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>

                  {variants.length > 1 && (
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove variant"
                      >
                        <X className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end  sticky bottom-0 bg-primary border-t border-primary/10 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary/20 rounded-lg text-sm font-semibold text-secondary hover:text-primary hover:bg-secondary/30 transition-all"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={updateProduct.isPending}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateProduct.isPending ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" strokeWidth={2} />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" strokeWidth={2} />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
