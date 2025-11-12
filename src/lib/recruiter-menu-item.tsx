import React from "react";

export type MenuItem = {
  href: string;
  label: string;
  key: string;
  icon: React.ReactNode;
  badge?: string | number;
  enabled?: boolean;
};

// ====================
// Recruiter Menu Items
// ====================

const PREFIX = "/recruiter";
export const recruiterMenuItems: MenuItem[] = [
  {
    href: "/recruiter-feature/profile/account",
    label: "My Profile",
    key: "my-profile",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/",
    label: "Settings",
    key: "settings",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    href: "",
    label: "Help Center",
    key: "help-center",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.35 17l.06-.06A1.65 1.65 0 0 0 4.08 15H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9c-.22-.56-.2-1.2.33-1.82l.06-.06A2 2 0 1 1 7.82 4.3H9" />
      </svg>
    ),
  },
].map((item) => ({
  ...item,
  href: `${PREFIX}${item.href}`,
}));
