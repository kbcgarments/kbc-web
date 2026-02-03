"use client";

import { use } from "react";
import { useGetProduct } from "@/hooks";
import type { Product } from "@/types";
import { Loader } from "lucide-react";
import ProductPageClient from "@/components/storefront/product/details/ProductPageClient";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: product, isLoading, error } = useGetProduct(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader className="animate-spin text-accent" />
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-red-500 font-medium text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-screen">
      <ProductPageClient product={product as Product} />
    </div>
  );
}
