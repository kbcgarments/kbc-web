"use client";

import { useId, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Upload, X, Star } from "lucide-react";
import type { ProductColor } from "@/types";

/* ======================================================
   TYPES
====================================================== */

export interface UIImage {
  file: File | null;
  preview: string;
  colorId?: string | null;
  isPrimary?: boolean;
}

interface Props {
  images: UIImage[];
  onChange: (images: UIImage[]) => void;

  colors?: ProductColor[];
  maxImages?: number;
  allowMultiple?: boolean;
  enableColor?: boolean;
  enablePrimary?: boolean;
  showInstructions?: boolean;
}

/* ======================================================
   COMPONENT
====================================================== */

export function ImageUploader({
  images,
  onChange,
  colors = [],
  maxImages = 10,
  allowMultiple = true,
  enableColor = false,
  enablePrimary = false,
  showInstructions = true,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  /* ======================================================
     FILE HANDLING (UI ONLY)
  ====================================================== */

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const incoming: UIImage[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;

      incoming.push({
        file,
        preview: URL.createObjectURL(file),
        colorId: enableColor ? null : undefined,
        isPrimary:
          enablePrimary && images.length === 0 && incoming.length === 0
            ? true
            : undefined,
      });
    }

    const next = allowMultiple
      ? [...images, ...incoming].slice(0, maxImages)
      : incoming.slice(0, 1);

    onChange(next);

    // Allow re-selecting the same file
    if (inputRef.current) inputRef.current.value = "";
  };

  /* ======================================================
     REMOVE / UPDATE
  ====================================================== */

  const removeImage = (index: number) => {
    const img = images[index];
    URL.revokeObjectURL(img.preview);

    const next = images.filter((_, i) => i !== index);

    if (enablePrimary && img.isPrimary && next.length > 0) {
      next[0].isPrimary = true;
    }

    onChange(next);
  };

  const setPrimary = (index: number) => {
    if (!enablePrimary) return;

    onChange(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    );
  };

  const setColor = (index: number, colorId: string | null) => {
    if (!enableColor) return;

    const next = [...images];
    next[index].colorId = colorId;
    onChange(next);
  };

  /* ======================================================
     CLEANUP
  ====================================================== */

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="space-y-4">
      {/* DROP ZONE */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition
          ${
            dragActive
              ? "border-accent bg-accent/10"
              : "border-primary/30 hover:border-accent"
          }`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          multiple={allowMultiple}
          onChange={(e) => addFiles(e.target.files)}
          className="hidden"
        />

        <label htmlFor={inputId} className="cursor-pointer space-y-2">
          <Upload className="mx-auto h-10 w-10 text-secondary" />
          <p className="font-medium text-primary">
            Click to upload or drag images here
          </p>
          <p className="text-xs text-secondary">
            {allowMultiple ? `Up to ${maxImages} images` : "Single image only"}
          </p>
        </label>
      </div>

      {/* PREVIEWS */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-primary/20 bg-tertiary"
            >
              <div className="group relative aspect-square">
                <Image
                  src={img.preview}
                  alt={`Preview ${i}`}
                  fill
                  className="object-cover"
                />

                {/* ACTIONS */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                  {enablePrimary && (
                    <button
                      title="mark as primary"
                      type="button"
                      onClick={() => setPrimary(i)}
                      className={`rounded bg-white p-2 ${
                        img.isPrimary ? "text-accent" : "text-sand-900"
                      }`}
                    >
                      <Star
                        className="h-4 w-4"
                        fill={img.isPrimary ? "currentColor" : "none"}
                      />
                    </button>
                  )}

                  <button
                    title="remove image"
                    type="button"
                    onClick={() => removeImage(i)}
                    className="rounded bg-red-600 p-2 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {enablePrimary && img.isPrimary && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs text-white">
                    Primary
                  </span>
                )}
              </div>

              {/* COLOR SELECT */}
              {enableColor && (
                <div className="border-t border-primary/20 p-2">
                  <select
                    title="select color"
                    value={img.colorId ?? ""}
                    onChange={(e) => setColor(i, e.target.value || null)}
                    className="w-full rounded border border-primary/30 bg-primary px-2 py-1 text-xs"
                  >
                    <option value="">Assign color</option>
                    {colors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* INSTRUCTIONS */}
      {showInstructions && images.length > 0 && (
        <div className="space-y-1 text-xs text-secondary">
          {enablePrimary && <p>• Click ★ to set the primary image.</p>}
          {enableColor && <p>• Assign colors to map variants correctly.</p>}
        </div>
      )}
    </div>
  );
}
