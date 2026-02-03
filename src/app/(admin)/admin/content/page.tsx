import type { Metadata } from "next";
import AdminHomepageContentClient from "@/components/admin/content/ContentManagementClient";

export const metadata: Metadata = {
  title: "Content Management | Admin",
  description: "Manage site content",
};

export default function ContentPage() {
  return <AdminHomepageContentClient />;
}
