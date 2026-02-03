import { OrderDetailsClient } from "@/components/admin/orders/OrderDetailsClient";

export default async function AdminOrderDetails({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <OrderDetailsClient orderId={orderId} />;
}
