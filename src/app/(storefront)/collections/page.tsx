"use client";
import { CategoriesPageClient } from "@/components/storefront/categories/CategoriesPageClient";
import BreadCrumb from "@/components/ui/layout/BreadCrumb";
import { useLanguageStore } from "@/stores";

export default function CollectionsIndexPage() {
  const { translate } = useLanguageStore();
  const breadcrumbItems = [
    { label: translate("navigation.primary.home"), href: "/" },
    { label: translate("navigation.primary.categories") },
  ];
  return (
    <div className="max-w-7xl mx-auto px-2 md:px-12 pb-20 space-y-8">
      <BreadCrumb items={breadcrumbItems} />
      <CategoriesPageClient />
    </div>
  );
}
