"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Check,
  User,
  Shield,
  Loader2,
  PenIcon,
} from "lucide-react";
import { useUpdateCustomerProfile } from "@/hooks";
import { useAuthStore, useLanguageStore } from "@/stores";
import { Input } from "@/components/ui/Input";

export default function PersonalInfo() {
  const updateProfile = useUpdateCustomerProfile();
  const { user } = useAuthStore();
  const { translate } = useLanguageStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const handleSave = () => {
    setIsSaving(true);

    updateProfile.mutate(
      {
        name: formData.name || undefined,
        phone: formData.phone || undefined,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onSettled: () => {
          setIsSaving(false);
        },
      },
    );
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary mb-1">
            {translate("profile.settings.personalInfo.title")}
          </h2>
          <p className="text-sm text-gray-500">
            {translate("profile.settings.personalInfo.description")}
          </p>
        </div>

        {!isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              title="Edit profile"
              className="hidden md:inline-flex px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors"
            >
              {translate("profile.settings.actions.editProfile")}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="md:hidden p-3 rounded-lg bg-accent flex items-center justify-center"
            >
              <PenIcon className="h-5 w-5 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-secondary rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Full Name */}
          <div>
            {isEditing ? (
              <Input
                icon={User}
                title={translate("profile.settings.personalInfo.name")}
                type="text"
                label={translate("profile.settings.personalInfo.name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            ) : (
              <p className="text-base font-medium text-primary">
                {formData.name || (
                  <span className="text-gray-400">
                    {translate("profile.settings.personalInfo.notSet")}
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* EMAIL — READ ONLY */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
              {translate("profile.settings.personalInfo.email")}
            </label>
            <p className="text-base font-medium text-primary">{user?.email}</p>
          </div>

          <div className="border-t border-gray-100" />

          {/* Phone */}
          <div>
            {isEditing ? (
              <Input
                title={translate("profile.settings.personalInfo.phone")}
                type="tel"
                label={translate("profile.settings.personalInfo.phone")}
                icon={Phone}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            ) : (
              <p className="text-base font-medium text-primary">
                {formData.phone || (
                  <span className="text-gray-400">
                    {translate("profile.settings.personalInfo.notSet")}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Actions */}
          {isEditing && (
            <>
              <div className="border-t border-gray-100" />
              <div className="w-full flex flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full md:w-[50%] flex items-center justify-center gap-2 py-3 bg-accent text-white rounded-lg"
                >
                  {updateProfile.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {translate("profile.settings.actions.saveChanges")}
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-full md:w-[50%] flex-1 py-3 border border-gray-200 rounded-lg"
                >
                  {translate("profile.settings.actions.cancel")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900">
            {translate("profile.settings.personalInfo.title")}
          </h3>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>{translate("profile.settings.personalInfo.memberSince")}</span>
          <span className="font-semibold">
            {user?.createdAt ? new Date(user.createdAt).getFullYear() : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
