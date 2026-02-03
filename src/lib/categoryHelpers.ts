import { Category, Language } from "@/types";

export function getCategoryName(
  category: Category,
  language: Language,
): string {
  const nameKey = `name_${language}` as keyof Category;
  return (category[nameKey] as string) || category.name_en || "Untitled";
}

export function getCategoryDescription(
  category: Category,
  language: Language,
): string {
  const descKey = `description_${language}` as keyof Category;
  return (category[descKey] as string) || category.description_en || "";
}

export function getCategoryRoute(slug: string): string {
  return `/collections/${slug}`;
}

export function getFeaturedCategories(
  categories: Category[],
  limit: number = 6,
): Category[] {
  // Return first N categories as featured
  // You can add logic to filter by a "featured" flag if backend provides it
  return categories.slice(0, limit);
}

export function sortCategoriesByName(
  categories: Category[],
  language: Language,
): Category[] {
  return [...categories].sort((a, b) => {
    const nameA = getCategoryName(a, language).toLowerCase();
    const nameB = getCategoryName(b, language).toLowerCase();
    return nameA.localeCompare(nameB);
  });
}

export function searchCategories(
  categories: Category[],
  query: string,
  language: Language,
): Category[] {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) return categories;

  return categories.filter((category) => {
    const name = getCategoryName(category, language).toLowerCase();
    const description = getCategoryDescription(
      category,
      language,
    ).toLowerCase();

    return name.includes(lowerQuery) || description.includes(lowerQuery);
  });
}

export function getCategoryById(
  categories: Category[],
  categoryId: string,
): Category | undefined {
  return categories.find((cat) => cat.id === categoryId);
}

export function getCategoryBySlug(
  categories: Category[],
  slug: string,
): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}
