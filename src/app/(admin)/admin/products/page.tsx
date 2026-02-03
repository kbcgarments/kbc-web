import type { Metadata } from "next";
import { ProductsListClient } from "@/components/admin/products/ProductsListClient";

export const metadata: Metadata = {
  title: "Products | Admin",
  description: "Manage products",
};

export default function ProductsPage() {
  return <ProductsListClient />;
}
