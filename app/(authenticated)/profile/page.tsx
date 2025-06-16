// app/(authenticated)/profile/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

const settingsSections = [
  {
    title: "Account",
    items: [
      {
        name: "Edit Profile",
        description: "Update your profile information",
        href: "/profile/edit",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
      },
      {
        name: "Past Reports",
        description: "View your noise report history",
        href: "/profile/reports",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        name: "Notifications",
        description: "Manage your notification settings",
        href: "/profile/notifications",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: "About",
    items: [
      {
        name: "App Information",
        description: "Version and system info",
        href: "/profile/about",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        name: "Help",
        description: "Get support and FAQs",
        href: "/profile/help",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
    ],
  },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatJoinDate = (date?: string | Date) => {
    if (!date) return "Member";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return `Joined ${dateObj.getFullYear()}`;
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
          <h1 className="text-xl font-semibold">Settings</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 mb-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                width={96}
                height={96}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(session?.user?.name)
            )}
          </div>
          <h2 className="text-xl font-semibold mb-1">
            {session?.user?.name || "User"}
          </h2>
          <p className="text-gray-500 text-sm mb-1">{session?.user?.email}</p>
          <p className="text-gray-400 text-xs">
            {formatJoinDate(session?.user?.createdAt)}
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="bg-white rounded-lg overflow-hidden">
                {section.items.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                      index !== section.items.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-400">{item.icon}</div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-8 py-3 text-center text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
