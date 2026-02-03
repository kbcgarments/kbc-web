import { CategoryShowcase } from "@/components/admin/categories/CategoryShowcase";

export default async function CategoryViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryShowcase slug={slug} />;
}
