"use client";

import { useState } from "react";
import {
  CreditCard,
  Trash2,
  Star,
  Edit3,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useCustomerPaymentMethods, useUpdatePaymentMethod } from "@/hooks";
import { PaymentMethod } from "@/types";
import { useLanguageStore } from "@/stores";
import { interpolate } from "@/utils";

export default function PaymentMethods() {
  const { translate } = useLanguageStore();
  const { data, isLoading } = useCustomerPaymentMethods();
  const updatePaymentMethod = useUpdatePaymentMethod();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [billingName, setBillingName] = useState("");
  const [billingCountry, setBillingCountry] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-xl border border-primary/10 bg-secondary/20 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CreditCard className="h-8 w-8 text-accent" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-primary mb-2">
          {translate("profile.payment.noPaymentMethods")}
        </h3>
        <p className="text-sm text-secondary">
          {translate("profile.payment.addNew")}
        </p>
      </div>
    );
  }

  const startEdit = (pm: PaymentMethod) => {
    setEditingId(pm.id);
    setBillingName(pm.billingName ?? "");
    setBillingCountry(pm.billingCountry ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setBillingName("");
    setBillingCountry("");
  };

  const saveEdit = (id: string) => {
    updatePaymentMethod.mutate(
      {
        paymentMethodId: id,
        billingName: billingName.trim(),
        billingCountry: billingCountry.trim(),
      },
      { onSuccess: cancelEdit },
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this payment method?")) {
      updatePaymentMethod.mutate({
        paymentMethodId: id,
        delete: true,
      });
    }
  };

  const brandColors: Record<string, string> = {
    visa: "bg-linear-to-br from-blue-600 to-blue-700",
    mastercard: "bg-linear-to-br from-red-600 to-orange-600",
    amex: "bg-linear-to-br from-blue-500 to-cyan-600",
    discover: "bg-linear-to-br from-orange-500 to-orange-600",
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((pm) => {
        const isEditing = editingId === pm.id;
        const gradient =
          brandColors[pm.brand.toLowerCase()] ||
          "bg-linear-to-br from-gray-600 to-gray-700";

        return (
          <div
            key={pm.id}
            className={`rounded-xl border transition-all ${
              pm.isDefault
                ? "border-accent/30 bg-linear-to-br from-accent/5 via-transparent to-accent/5 shadow-sm"
                : "border-primary/10 bg-secondary/20 hover:border-accent/20"
            } ${isEditing && "ring-2 ring-accent/30"}`}
          >
            <div className="p-5">
              {/* Card Visual */}
              <div
                className={`${gradient} rounded-lg p-4 mb-4 shadow-md relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <CreditCard
                      className="w-8 h-8 text-white/80"
                      strokeWidth={1.5}
                    />
                    {pm.isDefault && !isEditing && (
                      <div className=" bg-white flex items-center justify-center rounded-lg py-1 text-xs font-semibold ">
                        <span className="inline-flex items-center gap-1 rounded-full  px-2.5 py-1 text-sm font-semibold  text-emerald-400">
                          <Star
                            className="w-5 h-5 fill-current"
                            strokeWidth={2}
                          />
                          {translate("profile.payment.card.default")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white uppercase tracking-wider font-semibold">
                      {pm.brand}
                    </p>
                    <p className="text-xl font-mono font-bold text-white tracking-wider">
                      •••• {pm.last4}
                    </p>
                    <p className="text-xs text-white">
                      {interpolate(translate("profile.payment.card.expires"), {
                        date:
                          String(pm.expMonth).padStart(2, "0") +
                          "/" +
                          pm.expYear,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Billing Info */}
              {(pm.billingName || pm.billingCountry) && !isEditing && (
                <div className="mb-4 space-y-1">
                  {pm.billingName && (
                    <p className="text-sm font-medium text-primary truncate">
                      {pm.billingName}
                    </p>
                  )}
                  {pm.billingCountry && (
                    <p className="text-xs text-tertiary truncate">
                      {pm.billingCountry}
                    </p>
                  )}
                </div>
              )}

              {/* Edit Mode */}
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                      {translate("profile.payment.billingName")}
                    </label>
                    <input
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      placeholder={translate(
                        "profile.payment.billingNamePlaceholder",
                      )}
                      className="w-full rounded-lg border border-primary/20 bg-primary px-3 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                      {translate("profile.payment.billingCountry")}
                    </label>
                    <input
                      value={billingCountry}
                      onChange={(e) => setBillingCountry(e.target.value)}
                      placeholder="United States"
                      className="w-full rounded-lg border border-primary/20 bg-primary px-3 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => saveEdit(pm.id)}
                      disabled={updatePaymentMethod.isPending}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" strokeWidth={2} />
                      {updatePaymentMethod.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        translate("profile.payment.actions.save")
                      )}
                    </button>
                    <button
                      title={translate("profile.payment.actions.cancelEdit")}
                      onClick={cancelEdit}
                      disabled={updatePaymentMethod.isPending}
                      className="rounded-lg border-2 border-primary/20 px-4 py-2.5 hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Actions */
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      title={translate("profile.payment.actions.edit")}
                      onClick={() => startEdit(pm)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary px-3 py-2 text-sm font-semibold text-secondary hover:text-primary hover:bg-secondary transition-all"
                    >
                      <Edit3 className="h-4 w-4" strokeWidth={1.5} />
                      {translate("profile.payment.actions.edit")}
                    </button>
                    {!pm.isDefault && (
                      <button
                        title={translate("profile.payment.actions.setDefault")}
                        onClick={() =>
                          updatePaymentMethod.mutate({
                            paymentMethodId: pm.id,
                            makeDefault: true,
                          })
                        }
                        disabled={updatePaymentMethod.isPending}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
                      >
                        <Star className="h-4 w-4" strokeWidth={1.5} />
                        {translate("profile.payment.actions.setDefault")}
                      </button>
                    )}
                  </div>
                  <button
                    title={translate("profile.payment.actions.remove")}
                    onClick={() => handleDelete(pm.id)}
                    disabled={updatePaymentMethod.isPending}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    {translate("profile.payment.actions.remove")}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
