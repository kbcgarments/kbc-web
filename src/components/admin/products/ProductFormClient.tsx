"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X, Save, Loader2 } from "lucide-react";

import {
  useCreateProduct,
  useGetCategories,
  useGetProductColors,
  useGetProductSizes,
} from "@/hooks";
import { ImageUploader, UIImage } from "@/components/ui/media/ImageUploader";

import {
  CreateProductInput,
  PRODUCT_STATUS,
  PRODUCT_CONTENT_TYPE_LABELS,
  PRODUCT_CONTENT_TYPE,
} from "@/types";
import { useGetProductTypesAdmin } from "@/hooks/products/useProductTypes";

/* ======================================================
   TYPES
====================================================== */

type VariantInput = {
  colorId: string;
  sizeId: string;
  stock: number;
};

type ContentSectionState = Record<PRODUCT_CONTENT_TYPE, string>;

/* ======================================================
   COMPONENT
====================================================== */

export function ProductFormClient() {
  const createProduct = useCreateProduct();

  /* ------------------ DATA ------------------ */
  const { data: categories = [] } = useGetCategories();
  const { data: colors = [] } = useGetProductColors();
  const { data: sizes = [] } = useGetProductSizes();
  const { data: productTypes = [] } = useGetProductTypesAdmin();
  const orderedSizes = useMemo(
    () => [...sizes].sort((a, b) => a.order - b.order),
    [sizes],
  );

  const initialFields: Partial<CreateProductInput> = {
    title_en: "",
    description_en: "",
    categoryId: "",
    priceUSD: 0,
    productTypeId: "",
    status: PRODUCT_STATUS.DRAFT,
  };
  /* ------------------ STATE ------------------ */
  const [fields, setFields] = useState(initialFields);

  const [images, setImages] = useState<UIImage[]>([]);

  const [variants, setVariants] = useState<VariantInput[]>([
    { colorId: "", sizeId: "", stock: 0 },
  ]);

  const [contentSections, setContentSections] = useState<ContentSectionState>({
    DESCRIPTION: "",
    SHIPPING: "",
    GENERAL: "",
  });

  /* ======================================================
     HELPERS
  ====================================================== */

  const updateVariant = (
    index: number,
    key: keyof VariantInput,
    value: string | number,
  ) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };
  const validVariants = variants.filter(
    (v) => v.colorId && v.sizeId && v.stock > 0,
  );
  const addVariant = () =>
    setVariants([...validVariants, { colorId: "", sizeId: "", stock: 0 }]);

  const removeVariant = (index: number) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  /* ======================================================
     SUBMIT
  ====================================================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fields.productTypeId) {
      alert("Please select a product type");
      return;
    }

    if (!images.length) {
      alert("Please upload at least one image");
      return;
    }
    if (images.some((i) => !i.file)) {
      throw new Error("UI images must have files before submit");
    }

    const validVariants = variants.filter((v) => v.colorId && v.sizeId);

    if (!validVariants.length) {
      alert("Please add at least one valid variant");
      return;
    }
    if (!images.some((i) => i.isPrimary)) {
      alert("Please mark one image as primary");
      return;
    }

    const fd = new FormData();

    /* ---- Core fields ---- */
    fd.append("title_en", fields?.title_en?.trim() ?? "");
    fd.append("description_en", fields?.description_en?.trim() ?? "");
    fd.append("priceUSD", String(Number(fields?.priceUSD ?? 0)));
    fd.append("status", fields?.status ?? PRODUCT_STATUS.DRAFT);
    fd.append("productTypeId", fields?.productTypeId ?? "");

    if (fields.categoryId) {
      fd.append("categoryId", fields.categoryId);
    }

    /* ---- Images ---- */
    images.forEach((img) => {
      if (img.file) fd.append("images", img.file);
    });

    fd.append(
      "imageMeta",
      JSON.stringify(
        images.map((img) => ({
          colorId: img.colorId ?? null,
          isPrimary: img.isPrimary ?? false,
        })),
      ),
    );

    /* ---- Variants ---- */
    fd.append("variants", JSON.stringify(validVariants));

    /* ---- Content Sections ---- */
    const sections = (
      Object.entries(contentSections) as [PRODUCT_CONTENT_TYPE, string][]
    )
      .filter(([, value]) => value.trim().length > 0)
      .map(([type, content_en]) => ({
        type,
        content_en: content_en.trim(),
      }));

    if (sections.length) {
      fd.append("contentSections", JSON.stringify(sections));
    }

    try {
      await createProduct.mutateAsync(fd);
      setFields(initialFields);
      setImages([]);
      setVariants([]);
      setContentSections({
        DESCRIPTION: "",
        SHIPPING: "",
        GENERAL: "",
      });
    } catch {}
  };

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-8xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Back to Products
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                Create Product
              </h1>
              <p className="text-sm text-secondary">
                Add a new product to your catalog
              </p>
            </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                    Product Type
                  </label>
                  <select
                    value={fields.productTypeId ?? ""}
                    onChange={(e) =>
                      setFields({
                        ...fields,
                        productTypeId: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-primary border border-primary/20 rounded-lg text-sm text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer capitalize"
                  >
                    <option value="">Select Type</option>

                    {productTypes.map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.label_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                    Category
                  </label>
                  <select
                    title="select product category"
                    value={fields.categoryId ?? ""}
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
                      setFields({ ...fields, priceUSD: Number(e.target.value) })
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
                    title="select product status"
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
                      {PRODUCT_CONTENT_TYPE_LABELS[type]}
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
                      placeholder={`Enter ${PRODUCT_CONTENT_TYPE_LABELS[type].toLowerCase()}...`}
                      className="w-full px-4 py-3 bg-primary border border-primary/20 rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                    />
                  </div>
                ),
              )}
            </div>
          </section>

          {/* IMAGES */}
          <section className="bg-secondary/20 border border-primary/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-primary mb-5">
              Product Images
            </h2>
            <ImageUploader
              images={images}
              colors={colors}
              onChange={setImages}
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
                      title="select product color"
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
                      title="select product size"
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
          <div className="flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0 bg-primary border-t border-primary/10 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary/20 rounded-lg text-sm font-semibold text-secondary hover:text-primary hover:bg-secondary/30 transition-all"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={createProduct.isPending}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createProduct.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" strokeWidth={2} />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
