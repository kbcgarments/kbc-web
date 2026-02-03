import type { Metadata } from "next";
import { OrdersListClient } from "@/components/admin/orders/OrdersListClient";

export const metadata: Metadata = {
  title: "Orders | Admin",
  description: "Manage customer orders",
};

export default function OrdersPage() {
  return <OrdersListClient />;
}
