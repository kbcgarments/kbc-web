import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | KBC Universe Admin",
    default: "Admin Portal | KBC Universe",
  },
  description: "KBC Universe admin dashboard - Manage your e-commerce store",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
  },
  openGraph: {
    title: "KBC Universe Admin Portal",
    description: "Secure admin dashboard for KBC Universe",
    type: "website",
  },
};

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
