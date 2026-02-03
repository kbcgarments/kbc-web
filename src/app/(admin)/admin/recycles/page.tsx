import { ProductsRecycleClient } from "@/components/admin/recycles/ProductsRecycleClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Admin",
  description: "Recycle products",
};

export default function ProductsPage() {
  return <ProductsRecycleClient />;
}
