"use client";

import Link from "next/link";
import React from "react";
import { recruiterMenuItems } from "@/lib/recruiter-menu-item";

interface RecruiterMenuListProps {
  onItemClick?: () => void; // khi click menu thì đóng dropdown
  prefixRecruiter?: boolean; // thêm prefix /recruiter
  compact?: boolean; // hiển thị gọn
}

const RecruiterMenuList: React.FC<RecruiterMenuListProps> = ({
  onItemClick,
  prefixRecruiter = false,
  compact = false,
}) => {
  // Ensure we don't double-prefix '/recruiter'
  const ensureRecruiterPrefix = (href: string) => {
    let h = (href || "").trim();
    if (!h.startsWith("/")) h = "/" + h;
    if (h.startsWith("/recruiter")) return h;
    return `/recruiter${h}`;
  };

  const menuItems = prefixRecruiter
    ? recruiterMenuItems.map((item) => ({
        ...item,
        href: ensureRecruiterPrefix(item.href),
      }))
    : recruiterMenuItems;

  return (
    <>
      {menuItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          onClick={onItemClick}
          className={`flex items-center space-x-2 ${
            compact
              ? "px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              : "px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          }`}
        >
          <span className="w-5 h-5 text-gray-500">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );
};

export default RecruiterMenuList;
