import type { Metadata } from "next";
import { ProductTypesListClient } from "@/components/admin/product-types/ProductTypesListClient";

export const metadata: Metadata = {
  title: "Product Types | Admin",
  description: "Manage product types in your store",
};

export default function ProductTypesPage() {
  return <ProductTypesListClient />;
}
