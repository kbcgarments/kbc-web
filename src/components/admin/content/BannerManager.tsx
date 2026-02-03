"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Loader } from "lucide-react";
import Image from "next/image";

import { useListBanners, useDeleteBanner } from "@/hooks";
import type { BannerAdmin } from "@/types";

import BannerForm from "./BannerForm";

export default function BannerManager() {
  const { data: banners = [], isLoading } = useListBanners();
  const deleteBanner = useDeleteBanner();

  const [formOpen, setFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerAdmin | null>(null);

  const openCreate = () => {
    setEditingBanner(null);
    setFormOpen(true);
  };

  const openEdit = (banner: BannerAdmin) => {
    setEditingBanner(banner);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this banner?")) {
      deleteBanner.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary">
            Promotional Banners
          </h2>
          <p className="text-sm text-secondary">
            Manage homepage promotional banners
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          <Plus className="h-4 w-4" />
          Create Banner
        </button>
      </div>

      {/* Empty state */}
      {banners.length === 0 ? (
        <div className="rounded-xl border border-primary/10 bg-secondary/20 py-20 text-center">
          <p className="text-secondary">No banners created yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {banners.map((banner, i) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="overflow-hidden rounded-xl border border-primary/10 bg-secondary/20"
            >
              <div className="relative aspect-21/9">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title_en || "Banner image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="space-y-3 p-4">
                {banner.title_en && (
                  <h3 className="font-semibold text-primary">
                    {banner.title_en}
                  </h3>
                )}

                {banner.ctaLink && (
                  <p className="truncate text-xs text-accent">
                    {banner.ctaLink}
                  </p>
                )}

                <p className="text-xs text-tertiary">
                  Created {new Date(banner.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => openEdit(banner)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-primary/20 px-3 py-2 text-sm hover:border-accent hover:text-accent"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(banner.id)}
                    disabled={deleteBanner.isPending}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    {deleteBanner.isPending ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <BannerForm
            banner={editingBanner}
            onClose={() => setFormOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
