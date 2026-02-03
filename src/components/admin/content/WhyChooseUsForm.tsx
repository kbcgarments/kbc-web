"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";

import { useCreateWhyChooseUs, useUpdateWhyChooseUs } from "@/hooks";
import type { WhyChooseUsAdmin } from "@/types";
import {
  LUCIDE_ICON_MAP,
  LUCIDE_ICON_OPTIONS,
  type LucideIconName,
} from "@/constants/lucide-icons";

interface WhyChooseUsFormProps {
  feature?: WhyChooseUsAdmin | null;
  onClose: () => void;
}

export default function WhyChooseUsForm({
  feature,
  onClose,
}: WhyChooseUsFormProps) {
  const createFeature = useCreateWhyChooseUs();
  const updateFeature = useUpdateWhyChooseUs();

  const isEditing = Boolean(feature);
  const isLoading = createFeature.isPending || updateFeature.isPending;
  const [icon, setIcon] = useState<LucideIconName | "">(
    feature?.icon as LucideIconName,
  );
  const [titleEn, setTitleEn] = useState(feature?.title_en ?? "");
  const [descriptionEn, setDescriptionEn] = useState(
    feature?.description_en ?? "",
  );
  const [order, setOrder] = useState<number>(feature?.order ?? 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title_en: titleEn,
      description_en: descriptionEn,
      icon,
      order,
    };

    try {
      if (isEditing && feature) {
        await updateFeature.mutateAsync({ id: feature.id, ...payload });
      } else {
        await createFeature.mutateAsync(payload);
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
        className="w-full max-w-2xl rounded-2xl bg-primary shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary/10 px-6 py-4">
          <h2 className="text-lg font-bold text-primary">
            {isEditing ? "Edit Feature" : "Add Feature"}
          </h2>
          <button
            title="Close"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-secondary/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Icon Picker */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-secondary">
              Icon
            </label>

            <div className="grid grid-cols-6 gap-3">
              {LUCIDE_ICON_OPTIONS.map((iconName) => {
                const Icon = LUCIDE_ICON_MAP[iconName];

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={`
            flex aspect-square items-center justify-center rounded-lg border-2
            transition-all
            ${
              icon === iconName
                ? "border-accent bg-accent/10 text-accent"
                : "border-primary/20 text-secondary hover:border-accent/50"
            }
          `}
                    title={iconName}
                  >
                    <Icon className="h-6 w-6" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-secondary">
              Title (English)
            </label>
            <input
              title="Enter title"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Enter title"
              required
              className="w-full rounded-lg border border-primary/20 bg-secondary/20 px-4 py-3"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-secondary">
              Description (English)
            </label>
            <textarea
              title="Enter description"
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              required
              rows={3}
              className="w-full rounded-lg border border-primary/20 bg-secondary/20 px-4 py-3"
            />
          </div>

          {/* Order */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-secondary">
              Display Order
            </label>
            <input
              title="Enter order"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value) || 0)}
              min={0}
              className="w-full rounded-lg border border-primary/20 bg-secondary/20 px-4 py-3"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-primary/20 px-6 py-3 text-secondary"
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              ) : isEditing ? (
                "Update Feature"
              ) : (
                "Add Feature"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
