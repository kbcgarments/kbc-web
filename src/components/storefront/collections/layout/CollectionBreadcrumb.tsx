"use client";

import BreadCrumb from "@/components/ui/layout/BreadCrumb";
import { Category } from "@/types";
import { useLanguageStore } from "@/stores";
import { localizeField } from "@/utils";

export default function CollectionBreadcrumb({
  category,
}: {
  category: Category | null;
}) {
  const { language, translate } = useLanguageStore();

  return (
    <BreadCrumb
      items={[
        { label: translate("navigation.primary.home"), href: "/" },
        { label: localizeField(category, "name", language) },
      ]}
    />
  );
}
