"use client";

import Link from "next/link";
import React from "react";
import { candidateMenuItems } from "@/lib/candidate-menu-item";

interface CandidateMenuListProps {
  onItemClick?: () => void; // khi click menu thì đóng dropdown
  prefixCandidate?: boolean; // thêm prefix /candidate
  compact?: boolean; // hiển thị gọn
}

const CandidateMenuList: React.FC<CandidateMenuListProps> = ({
  onItemClick,
  prefixCandidate = false,
  compact = false,
}) => {
  // Ensure we don't double-prefix '/candidate'
  const ensureCandidatePrefix = (href: string) => {
    let h = (href || "").trim();
    if (!h.startsWith("/")) h = "/" + h;
    if (h.startsWith("/candidate")) return h;
    return `/candidate${h}`;
  };

  const menuItems = prefixCandidate
    ? candidateMenuItems.map((item) => ({
        ...item,
        href: ensureCandidatePrefix(item.href),
      }))
    : candidateMenuItems;

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

export default CandidateMenuList;
