"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useLanguageStore } from "@/stores";

export interface AddressFormPayload {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export function AddressForm({
  onSave,
  onCancel,
  initialData,
  isSaving,
}: {
  onSave: (data: AddressFormPayload) => void;
  onCancel: () => void;
  initialData?: Partial<AddressFormPayload>;
  isSaving?: boolean;
}) {
  const { translate } = useLanguageStore();
  const [form, setForm] = useState<AddressFormPayload>({
    fullName: initialData?.fullName ?? "",
    phone: initialData?.phone ?? "",
    street: initialData?.street ?? "",
    city: initialData?.city ?? "",
    state: initialData?.state ?? "",
    postalCode: initialData?.postalCode ?? "",
    country: initialData?.country ?? "United States",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.street.trim()) e.street = "Street is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.country.trim()) e.country = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onSave(form);
  };

  return (
    <div className="space-y-4">
      {/* NAME + PHONE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          title={translate("profile.addresses.form.fullName")}
          label={translate("profile.addresses.form.fullName")}
          value={form.fullName}
          error={errors.fullName}
          onChange={(v) => setForm({ ...form, fullName: v })}
        />
        <Input
          title={translate("profile.addresses.form.phone")}
          label={translate("profile.addresses.form.phone")}
          value={form.phone}
          error={errors.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />
      </div>

      <Input
        title={translate("profile.addresses.form.streetAddress")}
        label={translate("profile.addresses.form.streetAddress")}
        value={form.street}
        error={errors.street}
        onChange={(v) => setForm({ ...form, street: v })}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Input
          title={translate("profile.addresses.form.city")}
          label={translate("profile.addresses.form.city")}
          value={form.city}
          error={errors.city}
          onChange={(v) => setForm({ ...form, city: v })}
        />
        <Input
          title={translate("profile.addresses.form.state")}
          label={translate("profile.addresses.form.state")}
          value={form.state ?? ""}
          onChange={(v) => setForm({ ...form, state: v })}
        />
        <Input
          title={translate("profile.addresses.form.postalCode")}
          label={translate("profile.addresses.form.postalCode")}
          value={form.postalCode ?? ""}
          onChange={(v) => setForm({ ...form, postalCode: v })}
        />
      </div>

      <Select
        title={translate("profile.addresses.form.country")}
        label={translate("profile.addresses.form.country")}
        value={form.country}
        error={errors.country}
        onChange={(v) => setForm({ ...form, country: v })}
      />

      {/* ACTIONS */}
      <div className="flex gap-3 pt-2">
        <button
          title={
            initialData
              ? translate("profile.addresses.form.actions.update")
              : translate("profile.addresses.form.actions.save")
          }
          onClick={submit}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
          ) : (
            <>
              <Check className="w-4 h-4" />
              {initialData
                ? translate("profile.addresses.form.actions.update")
                : translate("profile.addresses.form.actions.save")}
            </>
          )}
        </button>

        <button
          title={translate("profile.addresses.form.actions.cancel")}
          onClick={onCancel}
          className="flex-1 py-3 border border-primary/20 rounded-lg text-primary hover:bg-secondary transition"
        >
          {translate("profile.addresses.form.actions.cancel")}
        </button>
      </div>
    </div>
  );
}

/* ======================================================
   INPUT HELPERS
====================================================== */

function Input({
  label,
  value,
  onChange,
  error,
  title,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  title?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-secondary mb-1">
        {label}
      </label>
      <input
        title={title}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? "border-red-300" : "border-primary/20"
        } focus:ring-2 focus:ring-accent/20`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  error,
  title,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  title?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-secondary mb-1">
        {label}
      </label>
      <select
        title={title}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? "border-red-300" : "border-primary/20"
        } focus:ring-2 focus:ring-accent/20`}
      >
        <option>United States</option>
        <option>Canada</option>
        <option>United Kingdom</option>
        <option>Nigeria</option>
        <option>South Africa</option>
      </select>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
