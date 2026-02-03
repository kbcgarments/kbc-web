import CollectionPageClient from "@/components/storefront/collections/layout/CollectionPageClient";

export default async function CollectionSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CollectionPageClient slug={slug} />;
}
