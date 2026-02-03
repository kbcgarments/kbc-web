import { ProductTypeFormClient } from "@/components/admin/product-types/ProductTypeFormClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Product Type | Admin",
  description: "Add a new product type to your store",
};

export default function CreateProductTypePage() {
  return <ProductTypeFormClient />;
}
