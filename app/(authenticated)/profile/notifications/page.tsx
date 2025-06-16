// app/(authenticated)/profile/notifications/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [savedLocations] = useState<NotificationSetting[]>([
    {
      id: "home",
      label: "Home",
      description: "Noise level changes",
      enabled: false,
    },
    {
      id: "work",
      label: "Work",
      description: "Noise level changes",
      enabled: false,
    },
  ]);

  const [community] = useState<NotificationSetting[]>([
    {
      id: "community_reports",
      label: "Community reports",
      description: "New reports in your area",
      enabled: false,
    },
    {
      id: "comments",
      label: "Comments",
      description: "New comments on your reports",
      enabled: false,
    },
    {
      id: "reactions",
      label: "Reactions",
      description: "New reactions on your reports",
      enabled: false,
    },
  ]);

  const handleToggle = async (category: string, id: string) => {
    // TODO: Implement notification settings update
    toast.success("Settings updated");
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Save notification preferences to backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification settings saved");
      router.back();
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">Notifications</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Saved Locations */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Saved locations</h2>
          <div className="bg-white rounded-lg overflow-hidden">
            {savedLocations.map((setting, index) => (
              <div
                key={setting.id}
                className={`flex items-center justify-between p-4 ${
                  index !== savedLocations.length - 1 ? "border-b" : ""
                }`}
              >
                <div>
                  <p className="font-medium">{setting.label}</p>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
                <button
                  onClick={() => handleToggle("locations", setting.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    setting.enabled ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      setting.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Community */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Community</h2>
          <div className="bg-white rounded-lg overflow-hidden">
            {community.map((setting, index) => (
              <div
                key={setting.id}
                className={`flex items-center justify-between p-4 ${
                  index !== community.length - 1 ? "border-b" : ""
                }`}
              >
                <div>
                  <p className="font-medium">{setting.label}</p>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
                <button
                  onClick={() => handleToggle("community", setting.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    setting.enabled ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      setting.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
