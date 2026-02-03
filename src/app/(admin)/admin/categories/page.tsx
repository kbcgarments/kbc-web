import type { Metadata } from "next";
import { CategoriesListClient } from "@/components/admin/categories/CategoriesListClient";

export const metadata: Metadata = {
  title: "Categories | Admin",
  description: "Manage product categories",
};

export default function CategoriesPage() {
  return <CategoriesListClient />;
}
