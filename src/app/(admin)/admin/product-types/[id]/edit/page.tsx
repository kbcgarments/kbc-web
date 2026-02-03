import { EditProductTypeClient } from "@/components/admin/product-types/EditProductTypeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Category | Admin",
  description: "Edit category details",
};

export default async function EditProductTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditProductTypeClient productTypeId={id} />;
}
