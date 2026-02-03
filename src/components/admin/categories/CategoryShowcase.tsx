"use client";

import { useGetCategoryBySlug } from "@/hooks";
import { CategorySection } from "./CategorySection";

export function CategoryShowcase({ slug }: { slug: string }) {
  const { data: category, isLoading, isError } = useGetCategoryBySlug(slug);

  if (isLoading) return null;
  if (isError || !category) return null;

  return (
    <main>
      <CategorySection key={category?.id} category={category} />
    </main>
  );
}
