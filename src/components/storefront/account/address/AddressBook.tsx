"use client";

import { useState } from "react";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Star,
  Home,
  X,
  Loader2,
} from "lucide-react";

import {
  useCustomerAddresses,
  useCreateCustomerAddress,
  useUpdateCustomerAddress,
  useDeleteCustomerAddress,
  useSetDefaultCustomerAddress,
} from "@/hooks";
import { CustomerAddress } from "@/types";
import { AddressForm, AddressFormPayload } from "./AddressForm";
import { useLanguageStore } from "@/stores";
import { interpolate } from "@/utils";

function mapAddressToFormPayload(address: CustomerAddress): AddressFormPayload {
  return {
    fullName: address.fullName,
    phone: address.phone,
    street: address.street,
    city: address.city,
    state: address.state ?? "",
    postalCode: address.postalCode ?? "",
    country: address.country,
  };
}

export default function AddressBook() {
  const { data: addresses = [], isLoading } = useCustomerAddresses();
  const { translate } = useLanguageStore();
  const createAddress = useCreateCustomerAddress();
  const updateAddress = useUpdateCustomerAddress();
  const deleteAddress = useDeleteCustomerAddress();
  const setDefault = useSetDefaultCustomerAddress();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingAddress = editingId
    ? addresses.find((a) => a.id === editingId)
    : null;

  const handleCreate = (data: AddressFormPayload) => {
    createAddress.mutate(data, {
      onSuccess: () => setShowAddForm(false),
    });
  };

  const handleUpdate = (data: AddressFormPayload) => {
    if (!editingId) return;
    updateAddress.mutate(
      { id: editingId, ...data },
      { onSuccess: () => setEditingId(null) },
    );
  };

  const handleDelete = (id: string, isDefault?: boolean) => {
    if (isDefault) return;
    if (confirm(translate("profile.addresses.actions..confirmDelete"))) {
      deleteAddress.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">
            {translate("profile.addresses.title")}
          </h2>
          <p className="text-sm text-tertiary mt-1">
            {interpolate(
              translate(
                addresses.length === 1
                  ? "profile.addresses.addresses.one"
                  : "profile.addresses.addresses.other",
              ),
              { count: addresses.length ?? 0 },
            )}
          </p>
        </div>
        {!showAddForm && !editingId && (
          <button
            title={translate("profile.addresses.actions.addNew")}
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            {translate("profile.addresses.actions.addNew")}
          </button>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-accent/5 border-2 border-accent/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-primary">
                {translate("profile.addresses.actions.addNewAddress")}
              </h3>
            </div>
            <button
              title={translate("profile.addresses.actions.toggleForm")}
              onClick={() => setShowAddForm(false)}
              className="p-2 rounded-lg hover:bg-primary/50 transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
          <AddressForm
            onSave={handleCreate}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Edit Form */}
      {editingAddress && (
        <div className="bg-secondary/30 border-2 border-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-primary">
                {translate("profile.addresses.actions.editAddress")}
              </h3>
            </div>
            <button
              title={translate("profile.addresses.actions.cancelEdit")}
              onClick={() => setEditingId(null)}
              className="p-2 rounded-lg hover:bg-primary/50 transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
          <AddressForm
            initialData={mapAddressToFormPayload(editingAddress)}
            onSave={handleUpdate}
            onCancel={() => setEditingId(null)}
            isSaving={updateAddress.isPending || createAddress.isPending}
          />
        </div>
      )}

      {/* Address Grid */}
      {!showAddForm && !editingId && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address: CustomerAddress) => (
            <div
              key={address.id}
              className={`rounded-xl border p-5 transition-all ${
                address.isDefault
                  ? "border-accent/40 bg-linear-to-br from-(--color-text-accent)/12 via-(--color-text-accent)/6 to-indigo-200/40 shadow-md"
                  : "border-primary/20 hover:border-accent/30 bg-secondary/20"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      address.isDefault ? "bg-accent/10" : "bg-primary/50"
                    }`}
                  >
                    <Home className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">
                      {address.fullName}
                    </h4>
                    <p className="text-xs text-tertiary">{address.phone}</p>
                  </div>
                </div>
                {address.isDefault && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                    <Star className="w-3 h-3 fill-current" strokeWidth={0} />
                    {translate("profile.addresses.default")}
                  </span>
                )}
              </div>

              {/* Address */}
              <div className="space-y-1 text-sm text-secondary mb-5">
                <p>{address.street}</p>
                <p>
                  {address.city}
                  {address.state && `, ${address.state}`} {address.postalCode}
                </p>
                <p>{address.country}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/10">
                {!address.isDefault && (
                  <button
                    onClick={() => setDefault.mutate(address.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-xs font-semibold hover:bg-accent/20 transition-colors"
                  >
                    <Star className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {translate("profile.addresses.actions.setDefault")}
                  </button>
                )}
                <button
                  onClick={() => setEditingId(address.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-secondary transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {translate("profile.addresses.actions.edit")}
                </button>
                <button
                  onClick={() => handleDelete(address.id, address.isDefault)}
                  disabled={address.isDefault}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {deleteAddress.isPending ? (
                    <Loader2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      {translate("profile.addresses.actions.delete")}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!showAddForm && addresses.length === 0 && (
        <div className="text-center py-12 bg-secondary/20 rounded-2xl border border-primary/10">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-accent" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            {translate("profile.addresses.empty.title")}
          </h3>
          <p className="text-sm text-secondary mb-6">
            {translate("profile.addresses.empty.description")}
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            {translate("profile.addresses.empty.cta")}
          </button>
        </div>
      )}
    </div>
  );
}
