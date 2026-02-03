import type { Metadata } from "next";
import { ProductFormClient } from "@/components/admin/products/ProductFormClient";

export const metadata: Metadata = {
  title: "Create Product | Admin",
  description: "Add a new product",
};

export default function CreateProductPage() {
  return <ProductFormClient />;
}
