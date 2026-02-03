"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Loader, CheckCircle, Circle } from "lucide-react";
import Image from "next/image";

import { useListHeroes, useDeleteHero } from "@/hooks";
import type { HeroAdmin } from "@/types/";
import HeroSectionForm from "./HeroSectionForm";

export default function HeroSectionManager() {
  const { data: heroes = [], isLoading } = useListHeroes();
  const deleteHero = useDeleteHero();
  const [formOpen, setFormOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroAdmin | null>(null);

  const handleEdit = (hero: HeroAdmin) => {
    setEditingHero(hero);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this hero section?")) {
      deleteHero.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingHero(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary">Hero Sections</h2>
          <p className="text-sm text-secondary mt-1">
            Only one hero can be active at a time
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Hero
        </button>
      </div>
      {/* Hero Grid */}
      {heroes.length === 0 ? (
        <div className="text-center py-20 bg-secondary/20 border border-primary/10 rounded-xl">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            No hero sections yet
          </h3>
          <p className="text-sm text-secondary mb-6">
            Create your first hero section to showcase on the homepage
          </p>
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark"
          >
            <Plus className="w-5 h-5" />
            Create Hero Section
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroes.map((hero, index) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-secondary/20 border border-primary/10 rounded-xl overflow-hidden hover:border-accent/30 transition-all"
            >
              {/* Image */}
              <div className="relative aspect-video bg-secondary/30">
                <Image
                  src={hero.imageUrl}
                  alt={hero.headline_en}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Status */}
                <div className="absolute top-3 right-3">
                  {hero.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/60 text-tertiary rounded-full text-xs">
                      <Circle className="w-3.5 h-3.5" />
                      Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-primary line-clamp-1">
                    {hero.headline_en}
                  </h3>
                  {hero.subheadline_en && (
                    <p className="text-sm text-secondary line-clamp-2">
                      {hero.subheadline_en}
                    </p>
                  )}
                </div>

                {hero.ctaText_en && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-tertiary">CTA:</span>
                    <span className="font-medium text-accent">
                      {hero.ctaText_en}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(hero)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm hover:border-accent hover:text-accent"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hero.id)}
                    disabled={deleteHero.isPending}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-100 disabled:opacity-50"
                  >
                    {deleteHero.isPending ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {/* Modal */}
      <AnimatePresence>
        {formOpen && (
          <HeroSectionForm hero={editingHero} onClose={handleCloseForm} />
        )}
      </AnimatePresence>
    </div>
  );
}
