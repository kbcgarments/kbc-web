import type { Metadata } from "next";
import { CustomersListClient } from "@/components/admin/customers/CustomersListClient";

export const metadata: Metadata = {
  title: "Customers | Admin",
  description: "Manage customers",
};

export default function CustomersPage() {
  return <CustomersListClient />;
}
