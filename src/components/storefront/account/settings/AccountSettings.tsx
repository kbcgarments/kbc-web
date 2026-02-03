"use client";
import { useState } from "react";
import { Shield, Lock, Trash2, User, Loader2 } from "lucide-react";
import { SectionCard } from "./SettingsCard";
import { Input } from "@/components/ui/Input";
import { TogglePasswordButton } from "./ToggleRow";
import PersonalInfo from "../PersonalInfo";
import { useLanguageStore, useToastStore } from "@/stores";
import { useChangePassword, useDeactivateCustomerAccount } from "@/hooks";

export default function AccountSettings() {
  const { error } = useToastStore();
  const { translate } = useLanguageStore();
  const changePassword = useChangePassword();
  const deactivateAccount = useDeactivateCustomerAccount();
  /* PASSWORD */
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  /* NOTIFICATIONS */
  // const [notifications, setNotifications] = useState({
  //   orderUpdates: true,
  //   promotions: false,
  //   newsletter: true,
  //   securityAlerts: true,
  // });

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      error(translate("profile.settings.security.allFieldsRequired"));
      return;
    }

    if (passwords.new !== passwords.confirm) {
      error(translate("profile.settings.security.passwordsDoNotMatch"));
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      setPasswords({
        current: "",
        new: "",
        confirm: "",
      });

      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
    } catch {}
  };
  async function handleDeactivateAccount() {
    const confirmed = window.confirm(
      translate("profile.settings.dangerZone.confirmDeactivate") ??
        "Are you sure you want to deactivate your account?",
    );

    if (!confirmed) return;

    await deactivateAccount.mutateAsync();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard title={translate("profile.settings.title")} icon={User}>
        <PersonalInfo />
      </SectionCard>
      {/* SECURITY */}
      <SectionCard
        title={translate("profile.settings.security.title")}
        icon={Shield}
      >
        <div className="space-y-4">
          <Input
            label={translate("profile.settings.security.currentPassword")}
            type={showPasswords.current ? "text" : "password"}
            placeholder="••••••••"
            value={passwords.current}
            onChange={(e) =>
              setPasswords({ ...passwords, current: e.target.value })
            }
            icon={Lock}
            rightSlot={
              <TogglePasswordButton
                show={showPasswords.current}
                onClick={() =>
                  setShowPasswords((s) => ({ ...s, current: !s.current }))
                }
              />
            }
          />

          <Input
            label={translate("profile.settings.security.newPassword")}
            type={showPasswords.new ? "text" : "password"}
            placeholder={translate("profile.settings.security.passwordHint")}
            value={passwords.new}
            onChange={(e) =>
              setPasswords({ ...passwords, new: e.target.value })
            }
            icon={Lock}
            rightSlot={
              <TogglePasswordButton
                show={showPasswords.new}
                onClick={() => setShowPasswords((s) => ({ ...s, new: !s.new }))}
              />
            }
          />

          <Input
            label={translate("profile.settings.security.confirmNewPassword")}
            type={showPasswords.confirm ? "text" : "password"}
            placeholder={translate(
              "profile.settings.security.confirmNewPassword",
            )}
            value={passwords.confirm}
            onChange={(e) =>
              setPasswords({ ...passwords, confirm: e.target.value })
            }
            icon={Lock}
            rightSlot={
              <TogglePasswordButton
                show={showPasswords.confirm}
                onClick={() =>
                  setShowPasswords((s) => ({ ...s, confirm: !s.confirm }))
                }
              />
            }
          />

          <button
            title={translate("profile.settings.security.updatePassword")}
            onClick={handlePasswordUpdate}
            disabled={changePassword.isPending}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {changePassword.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              translate("profile.settings.security.updatePassword")
            )}
          </button>
        </div>
      </SectionCard>

      {/* NOTIFICATIONS */}
      {/* <SectionCard
        title={translate("profile.settings.notifications.title")}
        icon={Bell}
      >
        <div className="space-y-4">
          <ToggleRow
            label={translate(
              "profile.settings.notifications.orderUpdates.label",
            )}
            description={translate(
              "profile.settings.notifications.orderUpdates.description",
            )}
            checked={notifications.orderUpdates}
            onChange={(checked) =>
              setNotifications({ ...notifications, orderUpdates: checked })
            }
          />
          <ToggleRow
            label={translate("profile.settings.notifications.promotions.label")}
            description={translate(
              "profile.settings.notifications.promotions.description",
            )}
            checked={notifications.promotions}
            onChange={(checked) =>
              setNotifications({ ...notifications, promotions: checked })
            }
          />
          <ToggleRow
            label={translate("profile.settings.notifications.newsletter.label")}
            description={translate(
              "profile.settings.notifications.newsletter.description",
            )}
            checked={notifications.newsletter}
            onChange={(checked) =>
              setNotifications({ ...notifications, newsletter: checked })
            }
          />
          <ToggleRow
            label={translate(
              "profile.settings.notifications.securityAlerts.label",
            )}
            description={translate(
              "profile.settings.notifications.securityAlerts.description",
            )}
            checked={notifications.securityAlerts}
            onChange={(checked) =>
              setNotifications({ ...notifications, securityAlerts: checked })
            }
          />
        </div>
      </SectionCard> */}

      {/* DANGER ZONE */}
      <SectionCard
        title={translate("profile.settings.dangerZone.title")}
        icon={Trash2}
        variant="danger"
      >
        <p className="text-sm text-secondary mb-4">
          {translate("profile.settings.dangerZone.description")}
        </p>
        <button
          disabled={deactivateAccount.isPending}
          onClick={handleDeactivateAccount}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          {deactivateAccount.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <>
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
              {translate("profile.settings.dangerZone.deleteAccount")}
            </>
          )}
        </button>
      </SectionCard>
    </div>
  );
}

// function ToggleRow({
//   label,
//   description,
//   checked,
//   onChange,
// }: {
//   label: string;
//   description: string;
//   checked: boolean;
//   onChange: (checked: boolean) => void;
// }) {
//   return (
//     <div className="flex items-start justify-between gap-4 py-3 border-b border-primary/10 last:border-0">
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium text-primary">{label}</p>
//         <p className="text-xs text-secondary mt-0.5">{description}</p>
//       </div>
//       <Toggle checked={checked} onChange={onChange} />
//     </div>
//   );
// }
