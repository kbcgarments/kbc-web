/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils";
import { useLanguageStore } from "@/stores";
import { localizeField } from "@/utils";
import { PRODUCT_CONTENT_TYPE, ProductTabsProps } from "@/types";

export const DEFAULT_LABEL_KEYS: Record<PRODUCT_CONTENT_TYPE, string> = {
  DESCRIPTION: "product.tabs.description",
  SHIPPING: "product.tabs.shipping",
  GENERAL: "product.tabs.general",
};
/* ======================================================
   COMPONENT
====================================================== */

export default function ProductTabs({ sections }: ProductTabsProps) {
  const { language, translate } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<string | null>(
    sections[0]?.id ?? null,
  );
  const [openMobileTab, setOpenMobileTab] = useState<string | null>(null);

  /* ======================================================
     NORMALIZE SECTIONS
  ====================================================== */

  const tabs = useMemo(() => {
    return [...sections]
      .sort((a, b) => a.order - b.order)
      .map((section) => {
        const content = localizeField(section as any, "content", language);

        return {
          id: section.id,
          label:
            section.title?.trim() ||
            translate(DEFAULT_LABEL_KEYS[section.type]) ||
            section.type,
          content,
        };
      })
      .filter((tab) => tab.content?.trim());
  }, [sections, language, translate]);

  if (!tabs.length) return null;

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="w-full mt-12">
      {/* ---------------------- DESKTOP TAB BAR ---------------------- */}
      <div className="hidden md:flex border-b border-primary">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-sm font-medium relative transition-colors",
                isActive ? "text-accent" : "text-primary",
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-px h-1 bg-accent rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ---------------------- DESKTOP CONTENT ---------------------- */}
      <div className="hidden md:block py-10">
        {tabs.map(
          (tab) =>
            tab.id === activeTab && (
              <div
                key={tab.id}
                className="animate-fadeIn text-secondary leading-relaxed whitespace-pre-line"
              >
                {tab.content}
              </div>
            ),
        )}
      </div>

      {/* ---------------------- MOBILE ACCORDION ---------------------- */}
      <div className="md:hidden divide-y divide-primary">
        {tabs.map((tab) => {
          const isOpen = openMobileTab === tab.id;

          return (
            <div key={tab.id}>
              <button
                onClick={() => setOpenMobileTab(isOpen ? null : tab.id)}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isOpen ? "text-accent" : "text-primary",
                  )}
                >
                  {tab.label}
                </span>

                <ChevronDown
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isOpen ? "rotate-180 text-accent" : "rotate-0",
                  )}
                />
              </button>

              {isOpen && (
                <div className="pb-6 text-secondary animate-slideDown whitespace-pre-line">
                  {tab.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
