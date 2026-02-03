/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Upload, Image as ImageIcon, Loader } from "lucide-react";
import Image from "next/image";

import { useCreateHero, useUpdateHero } from "@/hooks";
import type { HeroAdmin } from "@/types";

interface HeroSectionFormProps {
  hero?: HeroAdmin | null;
  onClose: () => void;
}

export default function HeroSectionForm({
  hero,
  onClose,
}: HeroSectionFormProps) {
  const createHero = useCreateHero();
  const updateHero = useUpdateHero();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    headline_en: "",
    subheadline_en: "",
    ctaText_en: "",
    ctaLink: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isEditing = Boolean(hero);
  const isLoading = createHero.isPending || updateHero.isPending;

  /* ------------------------------------------------------
     Sync form when hero changes
  ------------------------------------------------------ */
  useEffect(() => {
    if (hero) {
      setFormData({
        headline_en: hero.headline_en,
        subheadline_en: hero.subheadline_en ?? "",
        ctaText_en: hero.ctaText_en ?? "",
        ctaLink: hero.ctaLink ?? "",
      });
      setImagePreview(hero.imageUrl);
      setImageFile(null);
    } else {
      setFormData({
        headline_en: "",
        subheadline_en: "",
        ctaText_en: "",
        ctaLink: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [hero]);

  /* ------------------------------------------------------
     Cleanup object URLs
  ------------------------------------------------------ */
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

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing && !imageFile) {
      alert("Please upload a hero image");
      return;
    }

    const payload = new FormData();
    payload.append("headline_en", formData.headline_en);
    if (formData.subheadline_en)
      payload.append("subheadline_en", formData.subheadline_en);
    if (formData.ctaText_en) payload.append("ctaText_en", formData.ctaText_en);
    if (formData.ctaLink) payload.append("ctaLink", formData.ctaLink);
    if (imageFile) payload.append("image", imageFile);

    if (isEditing && hero) {
      await updateHero.mutateAsync({ id: hero.id, formData: payload });
    } else {
      await createHero.mutateAsync(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-primary rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-primary border-b border-primary/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">
            {isEditing ? "Edit Hero Section" : "Create Hero Section"}
          </h2>
          <button
            title="Close"
            onClick={onClose}
            className="p-2 hover:bg-secondary/30 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
              Hero Image *
            </label>

            <input
              title="Select file"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video bg-secondary/20 border-2 border-dashed border-primary/20 rounded-xl cursor-pointer hover:border-accent/50"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Hero preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-tertiary mb-2" />
                  <p className="text-sm text-secondary">
                    Click to upload hero image
                  </p>
                </div>
              )}

              {imagePreview && (
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Headline */}
          <input
            required
            placeholder="Headline (English)"
            value={formData.headline_en}
            onChange={(e) =>
              setFormData({ ...formData, headline_en: e.target.value })
            }
            className="w-full px-4 py-3 bg-secondary/20 border rounded-lg"
          />

          <input
            placeholder="Subheadline (optional)"
            value={formData.subheadline_en}
            onChange={(e) =>
              setFormData({ ...formData, subheadline_en: e.target.value })
            }
            className="w-full px-4 py-3 bg-secondary/20 border rounded-lg"
          />

          <input
            placeholder="CTA Text (optional)"
            value={formData.ctaText_en}
            onChange={(e) =>
              setFormData({ ...formData, ctaText_en: e.target.value })
            }
            className="w-full px-4 py-3 bg-secondary/20 border rounded-lg"
          />

          <input
            placeholder="CTA Link (optional)"
            value={formData.ctaLink}
            onChange={(e) =>
              setFormData({ ...formData, ctaLink: e.target.value })
            }
            className="w-full px-4 py-3 bg-secondary/20 border rounded-lg"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-lg py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-accent text-white rounded-lg py-3"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 mx-auto animate-spin text-white" />
              ) : isEditing ? (
                "Update Hero"
              ) : (
                "Create Hero"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
