"use client";
import ForgotPasswordClient from "@/components/storefront/account/auth/ForgotPasswordClient";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-fit bg-primary pb-20">
      <div className="max-w-7xl mx-auto  flex flex-col space-y-4">
        <ForgotPasswordClient />
      </div>
    </div>
  );
}
