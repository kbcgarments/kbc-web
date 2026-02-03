import { EditCategoryClient } from "@/components/admin/categories/EditCategoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Category | Admin",
  description: "Edit category details",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditCategoryClient categoryId={id} />;
}
