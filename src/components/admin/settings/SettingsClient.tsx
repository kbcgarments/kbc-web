"use client";

import { useState } from "react";
import { Save, Bell, Globe, Shield } from "lucide-react";
import { useToastStore } from "@/stores/useToastStore";

export function SettingsClient() {
  const { success } = useToastStore();

  const [settings, setSettings] = useState({
    siteName: "KBC Fashion",
    siteEmail: "admin@kbcfashion.com",
    enableNotifications: true,
    enableEmailAlerts: true,
    orderEmailNotifications: true,
    lowStockAlerts: true,
    defaultCurrency: "USD",
    allowGuestCheckout: true,
  });

  const handleSave = () => {
    success("Settings saved successfully!");
  };

  return (
    <div className="max-w-8xl space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          Settings
        </h1>
        <p className="text-secondary">Manage your store settings</p>
      </div>

      <div className="space-y-6">
        <div className="bg-secondary border border-primary rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            General Settings
          </h2>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Site Name
            </label>
            <input
              title="Sitename"
              type="text"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              className="w-full px-4 py-2 bg-primary border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Admin Email
            </label>
            <input
              title="Email"
              type="email"
              value={settings.siteEmail}
              onChange={(e) =>
                setSettings({ ...settings, siteEmail: e.target.value })
              }
              className="w-full px-4 py-2 bg-primary border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Default Currency
            </label>
            <select
              title="Currency Selector"
              value={settings.defaultCurrency}
              onChange={(e) =>
                setSettings({ ...settings, defaultCurrency: e.target.value })
              }
              className="w-full px-4 py-2 bg-primary border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="ZAR">ZAR - South African Rand</option>
            </select>
          </div>
        </div>

        <div className="bg-secondary border border-primary rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  enableNotifications: e.target.checked,
                })
              }
              className="w-5 h-5 text-accent rounded focus:ring-2 focus:ring-accent"
            />
            <div>
              <p className="text-sm font-medium text-primary">
                Enable Push Notifications
              </p>
              <p className="text-xs text-secondary">
                Receive browser notifications for new orders
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableEmailAlerts}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  enableEmailAlerts: e.target.checked,
                })
              }
              className="w-5 h-5 text-accent rounded focus:ring-2 focus:ring-accent"
            />
            <div>
              <p className="text-sm font-medium text-primary">Email Alerts</p>
              <p className="text-xs text-secondary">
                Receive email notifications for important events
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.orderEmailNotifications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  orderEmailNotifications: e.target.checked,
                })
              }
              className="w-5 h-5 text-accent rounded focus:ring-2 focus:ring-accent"
            />
            <div>
              <p className="text-sm font-medium text-primary">
                Order Email Notifications
              </p>
              <p className="text-xs text-secondary">
                Send customers email updates about their orders
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.lowStockAlerts}
              onChange={(e) =>
                setSettings({ ...settings, lowStockAlerts: e.target.checked })
              }
              className="w-5 h-5 text-accent rounded focus:ring-2 focus:ring-accent"
            />
            <div>
              <p className="text-sm font-medium text-primary">
                Low Stock Alerts
              </p>
              <p className="text-xs text-secondary">
                Get notified when products are running low
              </p>
            </div>
          </label>
        </div>

        <div className="bg-secondary border border-primary rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Store Preferences
          </h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowGuestCheckout}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  allowGuestCheckout: e.target.checked,
                })
              }
              className="w-5 h-5 text-accent rounded focus:ring-2 focus:ring-accent"
            />
            <div>
              <p className="text-sm font-medium text-primary">
                Allow Guest Checkout
              </p>
              <p className="text-xs text-secondary">
                Let customers checkout without creating an account
              </p>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-primary rounded-lg hover:bg-tertiary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
