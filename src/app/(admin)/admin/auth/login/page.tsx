import { AdminLoginForm } from "@/components/admin/auth/AdminLoginForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | KBC Universe",
  description: "Login to KBC Universe admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-accent text-3xl font-bold mb-2">KBC Universe</h1>
          <p className="text-secondary">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-secondary/20 rounded-2xl shadow-2xl p-8 border border-primary/10">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-primary mb-1">
              Welcome Back
            </h2>
            <p className="text-secondary text-sm">
              Sign in to manage your store
            </p>
          </div>

          <AdminLoginForm />

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary">
              Don&apos;t have an account?{" "}
              <Link
                href="/admin/auth/register"
                className="text-accent font-semibold hover:underline"
              >
                Create admin account
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
