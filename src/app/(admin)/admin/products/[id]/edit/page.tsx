import { EditProductClient } from "@/components/admin/products/EditProductClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Product | Admin",
  description: "Edit product details",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditProductClient productId={id} />;
}
