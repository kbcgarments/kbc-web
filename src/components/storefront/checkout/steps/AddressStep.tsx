"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore, useLanguageStore } from "@/stores";
import type { CustomerAddress, ShippingInfo } from "@/types";
import AccentButton from "@/components/ui/buttons/AccentButton";
import { FilterCheckbox } from "@/components/common/filters/FilterCheckbox";
import { Input } from "@/components/ui/Input";
import SavedAddressPickerDropdown from "../actions/SavedAddressPicker";
import UniversalDropdown from "@/components/common/layout/UniversalDropdown";

interface AddressStepProps {
  initialData: ShippingInfo;
  initialEmail: string;
  initialPhone: string;
  isSubmitting: boolean;

  isUsingSavedAddress: boolean;
  onAddressChangeType: (usingSaved: boolean) => void;

  canSaveAddress: boolean;
  saveAddress: boolean;
  setSaveAddress: (v: boolean) => void;

  onContinue: (data: { email: string; shipping: ShippingInfo }) => void;
}

export default function AddressStep({
  initialData,
  initialEmail,
  isUsingSavedAddress,
  onAddressChangeType,
  canSaveAddress,
  saveAddress,
  setSaveAddress,
  onContinue,
  isSubmitting,
}: AddressStepProps) {
  const { translate } = useLanguageStore();
  const { user } = useAuthStore();

  const [email, setEmail] = useState(initialEmail);

  const [shipping, setShipping] = useState<ShippingInfo>(initialData);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setShipping(initialData);
  }, [initialData]);

  const updateShipping = (patch: Partial<ShippingInfo>) => {
    if (isUsingSavedAddress) onAddressChangeType(false);
    setShipping((prev) => ({ ...prev, ...patch }));
  };

  const isValid =
    Boolean(email.trim()) &&
    Boolean(shipping.phone.trim()) &&
    Boolean(shipping.fullName.trim()) &&
    Boolean(shipping.street.trim()) &&
    Boolean(shipping.city.trim()) &&
    Boolean(shipping.state?.trim()) &&
    Boolean(shipping.postal?.trim()) &&
    Boolean(shipping.country.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onContinue({
      email: email.trim(),
      shipping: {
        ...shipping,
        fullName: shipping.fullName.trim(),
        phone: shipping.phone.trim(),
        street: shipping.street.trim(),
        city: shipping.city.trim(),
        postal: shipping.postal?.trim(),
        state: shipping.state?.trim(),
        country: shipping.country.trim(),
      },
    });
  };

  const handleSelectSavedAddress = (address: CustomerAddress) => {
    setSelectedAddressId(address.id);

    setShipping({
      fullName: address.fullName,
      phone: address.phone ?? "",
      street: address.street,
      city: address.city,
      state: address.state ?? "",
      postal: address.postalCode ?? "",
      country: address.country,
    });

    onAddressChangeType(true);
  };

  return (
    <div className="min-w-full rounded-lg md:rounded-xl border border-primary/10 p-4">
      {/* HEADER */}
      <label className="flex items-center gap-2 mb-4 text-sm font-semibold text-primary">
        <MapPin className="w-4 h-4 text-accent" strokeWidth={1.5} />
        {translate("checkout.form.deliveryAddress")}
      </label>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Saved Address Dropdown */}
        {user?.addresses?.length ? (
          <SavedAddressPickerDropdown
            addresses={user.addresses}
            selectedId={selectedAddressId ?? undefined}
            onSelect={handleSelectSavedAddress}
          />
        ) : null}

        {/* EMAIL */}

        <Input
          label={translate("checkout.form.email") + " *"}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={translate("checkout.form.emailPlaceholder")}
          required
        />

        {/* PHONE */}

        <Input
          label={translate("checkout.form.phone") + " *"}
          type="tel"
          value={shipping.phone}
          onChange={(e) => updateShipping({ phone: e.target.value })}
          placeholder={translate("checkout.form.phonePlaceholder")}
          required
        />

        {/* FULL NAME */}
        <Input
          label={translate("checkout.form.fullName") + " *"}
          type="text"
          value={shipping.fullName}
          onChange={(e) => updateShipping({ fullName: e.target.value })}
          placeholder={translate("checkout.form.fullNamePlaceholder")}
          required
        />

        {/* STATE */}
        <Input
          label={translate("checkout.form.state") + " *"}
          type="text"
          value={shipping.state}
          onChange={(e) => updateShipping({ state: e.target.value })}
          placeholder={translate("checkout.form.statePlaceholder")}
        />

        {/* STREET */}
        <Input
          label={translate("checkout.form.streetAddress") + " *"}
          type="text"
          value={shipping.street}
          onChange={(e) => updateShipping({ street: e.target.value })}
          placeholder={translate("checkout.form.streetAddressPlaceholder")}
          required
        />

        <Input
          label={translate("checkout.form.city") + " *"}
          type="text"
          value={shipping.city}
          onChange={(e) => updateShipping({ city: e.target.value })}
          placeholder={translate("checkout.form.cityPlaceholder")}
          required
        />

        <Input
          label={translate("checkout.form.postalCode") + " *"}
          type="text"
          value={shipping.postal}
          onChange={(e) => updateShipping({ postal: e.target.value })}
          placeholder={translate("checkout.form.postalCodePlaceholder")}
          required
        />

        {/* COUNTRY */}
        <div>
          <label className="block text-xs font-semibold uppercase text-secondary mb-2">
            {translate("checkout.form.country")} *
          </label>

          <UniversalDropdown
            value={shipping.country}
            onChange={(v) => updateShipping({ country: v })}
            options={[
              "United States",
              "Canada",
              "United Kingdom",
              "Nigeria",
              "South Africa",
            ]}
            placeholder="Select Country"
          />
        </div>

        {/* SAVE ADDRESS CHECKBOX */}
        {canSaveAddress && !isUsingSavedAddress && (
          <FilterCheckbox
            label="Save this address for future orders"
            checked={saveAddress}
            onToggle={() => setSaveAddress(!saveAddress)}
          />
        )}

        {/* SUBMIT */}
        <AccentButton
          type="submit"
          className="w-full mt-4"
          text={translate("checkout.actions.continue")}
          disabled={!isValid || isSubmitting}
        />
      </form>
    </div>
  );
}
