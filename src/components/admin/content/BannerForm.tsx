"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, Loader, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import { useCreateBanner, useUpdateBanner } from "@/hooks";
import type { BannerAdmin } from "@/types";

interface BannerFormProps {
  banner?: BannerAdmin | null;
  onClose: () => void;
}

export default function BannerForm({ banner, onClose }: BannerFormProps) {
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(banner);
  const isLoading = createBanner.isPending || updateBanner.isPending;

  const [titleEn, setTitleEn] = useState(banner?.title_en ?? "");
  const [descriptionEn, setDescriptionEn] = useState(
    banner?.description_en ?? "",
  );
  const [ctaTextEn, setCtaTextEn] = useState(banner?.ctaText_en ?? "");
  const [ctaLink, setCtaLink] = useState(banner?.ctaLink ?? "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    banner?.imageUrl ?? null,
  );

  /* --------------------------------------------
     Clean up object URL
  --------------------------------------------- */
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing && !imageFile) {
      alert("Banner image is required");
      return;
    }

    const fd = new FormData();

    if (titleEn) fd.append("title_en", titleEn);
    if (descriptionEn) fd.append("description_en", descriptionEn);
    if (ctaTextEn) fd.append("ctaText_en", ctaTextEn);
    if (ctaLink) fd.append("ctaLink", ctaLink);
    if (imageFile) fd.append("image", imageFile);

    try {
      if (isEditing && banner) {
        await updateBanner.mutateAsync({ id: banner.id, formData: fd });
      } else {
        await createBanner.mutateAsync(fd);
      }
      onClose();
    } catch {
      // handled in hook
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-primary shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary/10 px-6 py-4">
          <h2 className="text-lg font-bold text-primary">
            {isEditing ? "Edit Banner" : "Create Banner"}
          </h2>
          <button
            title="Close"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-secondary/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Image */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-secondary">
              Banner image {isEditing ? "" : "*"}
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative aspect-21/9 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-primary/20 bg-secondary/20 hover:border-accent/50"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Banner preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <ImageIcon className="mb-2 h-10 w-10 text-tertiary" />
                  <p className="text-sm text-secondary">
                    Click to upload banner image
                  </p>
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                <Upload className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-secondary">
              Title (English)
            </label>
            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full rounded-lg border border-primary/20 bg-secondary/20 px-4 py-3"
              placeholder="Summer Sale"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-secondary">
              Description (English)
            </label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-primary/20 bg-secondary/20 px-4 py-3"
              placeholder="Up to 50% off selected items"
            />
          </div>

          {/* CTA Text */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-secondary">
              CTA Text (English)
            </label>
            <input
              value={ctaTextEn}
              onChange={(e) => setCtaTextEn(e.target.value)}
              className="w-full rounded-lg border border-primary/20 bg-secondary/20 px-4 py-3"
              placeholder="Shop Now"
            />
          </div>

          {/* CTA Link */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-secondary">
              CTA Link
            </label>
            <input
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              className="w-full rounded-lg border border-primary/20 bg-secondary/20 px-4 py-3"
              placeholder="/collections/sale"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-primary/20 px-6 py-3 text-secondary hover:bg-secondary/30"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-accent px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                </span>
              ) : isEditing ? (
                "Update Banner"
              ) : (
                "Create Banner"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
