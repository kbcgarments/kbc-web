import { AdminCreateForm } from "@/components/admin/auth/AdminCreateForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Admin Account | KBC Universe",
  description: "Create an admin account for KBC Universe dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRegisterPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-accent text-3xl font-bold mb-2">KBC Universe</h1>
          <p className="text-secondary">Admin Dashboard</p>
        </div>

        {/* Register Card */}
        <div className="bg-secondary/20 rounded-2xl shadow-2xl p-8 border border-primary/10">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-primary mb-1">
              Create Admin Account
            </h2>
            <p className="text-secondary text-sm">
              Set up your admin credentials to manage the store
            </p>
          </div>

          <AdminCreateForm />

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary">
              Already have an account?{" "}
              <Link
                href="/admin/auth/login"
                className="text-accent font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-tertiary text-sm mt-6">
          © {new Date().getFullYear()} KBC Universe. All rights reserved.
        </p>
      </div>
    </div>
  );
}
