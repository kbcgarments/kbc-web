"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Loader,
  GripVertical,
  Power,
  Loader2,
} from "lucide-react";

import {
  useListWhyChooseUs,
  useUpdateWhyChooseUs,
  useDeleteWhyChooseUs,
} from "@/hooks";

import WhyChooseUsForm from "./WhyChooseUsForm";
import type { WhyChooseUsAdmin } from "@/types";
import { getLucideIcon } from "@/lib";

export default function WhyChooseUsManager() {
  const { data: features = [], isLoading } = useListWhyChooseUs();
  const updateFeature = useUpdateWhyChooseUs();
  const deleteFeature = useDeleteWhyChooseUs();

  const [formOpen, setFormOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<WhyChooseUsAdmin | null>(
    null,
  );

  const openCreate = () => {
    setEditingFeature(null);
    setFormOpen(true);
  };

  const openEdit = (feature: WhyChooseUsAdmin) => {
    setEditingFeature(feature);
    setFormOpen(true);
  };

  const toggleActive = (feature: WhyChooseUsAdmin) => {
    updateFeature.mutate({
      id: feature.id,
      isActive: !feature.isActive,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this feature?")) {
      deleteFeature.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary">
            Why Choose Us Features
          </h2>
          <p className="mt-1 text-sm text-secondary">
            Highlight key benefits of your store
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          <Plus className="h-4 w-4" />
          Add Feature
        </button>
      </div>

      {/* Empty */}
      {features.length === 0 ? (
        <div className="rounded-xl border border-primary/10 bg-secondary/20 py-20 text-center">
          <p className="text-secondary">No features added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {features.map((feature, index) => {
            const Icon = getLucideIcon(feature.icon);

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border p-4 transition-all ${
                  feature.isActive
                    ? "border-primary/10 bg-secondary/20"
                    : "border-primary/5 bg-secondary/10 opacity-60"
                }`}
              >
                <div className="flex gap-4">
                  {/* Drag Handle (future sorting) */}
                  <span className="cursor-grab text-tertiary">
                    <GripVertical className="h-5 w-5" />
                  </span>

                  {/* Icon */}
                  {feature.icon && (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-2xl">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary">
                      {feature.title_en}
                    </h3>
                    <p className="line-clamp-2 text-sm text-secondary">
                      {feature.description_en}
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-xs text-tertiary">
                      <span>Order: {feature.order}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-medium ${
                          feature.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-secondary/30"
                        }`}
                      >
                        {feature.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(feature)}
                      title={feature.isActive ? "Deactivate" : "Activate"}
                      className={`rounded-lg p-2 ${
                        feature.isActive
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30"
                          : "bg-secondary/30 text-tertiary"
                      }`}
                    >
                      <Power className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => openEdit(feature)}
                      title="Edit Feature"
                      className="rounded-lg border border-primary/20 p-2 text-secondary hover:border-accent hover:text-accent"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(feature.id)}
                      disabled={deleteFeature.isPending}
                      className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {deleteFeature.isPending ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <WhyChooseUsForm
            feature={editingFeature}
            onClose={() => setFormOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
