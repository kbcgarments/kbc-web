"use client";
import { SectionHeader } from "@/components/ui/layout/SectionHeader";
import { Loader } from "lucide-react";
import { useLanguageStore } from "@/stores";
import { DesktopCategoryGrid } from "../sections/DesktopCategoriesGrid";
import { MobileCategoriesCarousel } from "../sections/MobileCategoriesCarousel";
import { useMemo } from "react";
import { Category } from "@/types";

export default function ShopByCategories({
  categories,
  isLoading,
}: {
  categories: Category[];
  isLoading: boolean;
}) {
  const language = useLanguageStore((s) => s.language);
  const { translate } = useLanguageStore();
  const categoriesMemo = useMemo(() => {
    return Array.isArray(categories) ? categories : [];
  }, [categories]);
  const topSix = categoriesMemo.slice(0, 7);

  if (isLoading) {
    return (
      <section className="py-20 bg-transparent min-h-[10vh]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={translate("sections.shopByCategories")} />
          <div className="flex justify-center py-16">
            <Loader className="w-10 h-10 animate-spin text-accent dark:text-accent-light" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-primary min-h-[20vh]">
      <div className="max-w-7xl mx-auto  md:px-12">
        <SectionHeader title={translate("sections.shopByCategories.title")} />

        <div className="block md:hidden mt-12">
          <MobileCategoriesCarousel categories={topSix} language={language} />
        </div>

        <div className="hidden md:block mt-12">
          <DesktopCategoryGrid categories={topSix} language={language} />
        </div>
      </div>
    </section>
  );
}
