"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { memo } from "react";
import { PiHandWavingLight } from "react-icons/pi";
import { candidateMenuItems } from "@/lib/candidate-menu-item";

type Item = {
  href: string;
  label: string;
  key: string; // dùng để so khớp/aria
  icon: React.ReactNode;
  badge?: string | number;
  enabled?: boolean;
};

interface CVSidebarProps {
  activePage?: string;
}

const CVSidebar: React.FC<CVSidebarProps> = memo(({ activePage }) => {
  const pathname = usePathname();

  const items: Item[] = candidateMenuItems;

  const isActive = (href: string, key: string) => {
    // Sử dụng cả pathname và activePage prop
    return (
      pathname === href ||
      pathname.startsWith(href + "/") ||
      (activePage && key === activePage)
    );
  };

  return (
    <aside className="lg:w-64 bg-white shadow-sm rounded-xl border border-gray-200 h-fit">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-1">
          <PiHandWavingLight className="w-5 h-5 text-gray-500" />
          <p className="text-xs text-gray-500">Welcome</p>
        </div>
        <div>
          <p className="font-medium">Lê Quang Anh</p>
        </div>
      </div>

      <nav className="space-y-1 px-3 pb-4">
        {items.map((item) => {
          const active = isActive(item.href, item.key);
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 py-2 px-3 rounded-md ${
                active
                  ? "bg-gray-100 text-gray-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span
                className={`shrink-0 ${
                  active ? "text-gray-600" : "text-gray-500"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
});

CVSidebar.displayName = "CVSidebar";

export default CVSidebar;
