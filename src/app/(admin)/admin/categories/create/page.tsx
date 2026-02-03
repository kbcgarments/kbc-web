import { CategoryFormClient } from "@/components/admin/categories/CategoryFormClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Category | Admin",
  description: "Add a new category",
};

export default function CreateCategoryPage() {
  return <CategoryFormClient />;
}
