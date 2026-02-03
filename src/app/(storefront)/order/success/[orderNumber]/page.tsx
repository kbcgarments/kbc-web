import OrderSuccessClient from "@/components/storefront/orders/success/OrderSuccessClient";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return <OrderSuccessClient orderNumber={orderNumber} />;
}
