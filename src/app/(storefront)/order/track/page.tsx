"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/stores";
import Link from "next/link";
import { Input } from "@/components/ui/Input";

export default function TrackOrderPage() {
  const router = useRouter();
  const { translate } = useLanguageStore();
  const [orderNumber, setOrderNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      router.push(`/order/track/${orderNumber.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-accent" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3">
            {translate("order.track.title")}
          </h1>
          <p className="text-base sm:text-lg text-secondary">
            {translate("order.track.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="bg-secondary/20 border border-primary/10 rounded-xl p-6 sm:p-8">
            <label className="block text-sm font-semibold uppercase tracking-wider text-secondary mb-3">
              {translate("order.track.form.label")}
            </label>
            <Input
              type="text"
              icon={Search}
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder={translate("order.track.form.placeholder")}
              required
            />
            <p className="text-xs text-tertiary mt-3">
              {translate("order.track.form.helper")}
            </p>

            <button
              type="submit"
              disabled={!orderNumber.trim()}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white rounded-lg text-base font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {translate("order.track.form.submit")}
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="bg-secondary/20 border border-primary/10 rounded-xl p-6">
          <h2 className="text-lg font-bold text-primary mb-4">
            {translate("order.track.help.title")}
          </h2>
          <div className="space-y-3 text-sm text-secondary">
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
              <span>{translate("order.track.help.emailHint")}</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
              <span>
                {translate("order.track.help.accountHint")}{" "}
                <Link
                  href="/account/me"
                  className="text-accent hover:underline font-medium"
                >
                  {translate("order.track.help.accountLink")}
                </Link>
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
              <span>
                {translate("order.track.help.contactHint")}{" "}
                <Link
                  href="/contact"
                  className="text-accent hover:underline font-medium"
                >
                  {translate("order.track.help.contactLink")}
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
