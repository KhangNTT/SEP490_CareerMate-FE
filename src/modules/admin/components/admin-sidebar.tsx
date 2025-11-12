"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutGrid,
    BookOpen,
    Users,
    Briefcase,
    Clock,
    Ban,
    Settings,
    ChevronDown,
    ChevronRight,
    Brain,
    BookUser
} from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: SubMenuItem[];
}

export interface SubMenuItem {
    label: string;
    href: string;
}

const NAV_ITEMS: NavItem[] = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutGrid,
    },
    {
        label: "Blog Management",
        href: "/admin/blog",
        icon: BookOpen,
        subItems: [
            { label: "All Blogs", href: "/admin/blog" },
            { label: "Create Blog", href: "/admin/blog/create" },
        ],
    },
    {
        label: "User Management",
        href: "/admin/user-management",
        icon: Users,
    },
    {
        label: "Recruiter Management",
        href: "/admin/recruiters",
        icon: Briefcase,
        subItems: [
            { label: "All Recruiters", href: "/admin/recruiters" },
            { label: "Pending Approval", href: "/admin/pending-approval" },
            { label: "Profile Updates", href: "/admin/profile-updates" },
            { label: "Banned Recruiters", href: "/admin/banned-recruiters" },
        ],
    },
    {
        label: "Job Postings",
        href: "/admin/job-postings",
        icon: BookUser,
    },
    {
        label: "Skill Management",
        href: "/admin/skills",
        icon: Brain,
    },
    {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showText, setShowText] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isPinned, setIsPinned] = useState(false);
    const pathname = usePathname();

    // Load initial state
    React.useEffect(() => {
        localStorage.removeItem("admin-sidebar-pinned");
        localStorage.setItem("admin-sidebar-open", "false");
        
        setIsOpen(false);
        setShowText(false);
        setIsPinned(false);

        const savedExpanded = localStorage.getItem("admin-sidebar-expanded-items");
        if (savedExpanded) {
            setExpandedItems(JSON.parse(savedExpanded));
        }
    }, []);

    // Hover open sidebar
    const handleMouseEnter = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        
        setIsOpen(true);
        setTimeout(() => setShowText(true), 150);
        
        window.dispatchEvent(new CustomEvent('admin-sidebar-hover', {
            detail: { isOpen: true, isHover: true }
        }));
    };

    // Hover leave sidebar
    const handleMouseLeave = () => {
        if (isPinned) {
            return;
        }

        const timeout = setTimeout(() => {
            setIsOpen(false);
            setShowText(false);
            
            window.dispatchEvent(new CustomEvent('admin-sidebar-hover', {
                detail: { isOpen: false, isHover: false }
            }));
            
            if (!isPinned) {
                localStorage.setItem("admin-sidebar-open", "false");
                window.dispatchEvent(new CustomEvent("admin-sidebar-toggle"));
            }
        }, 200);

        setHoverTimeout(timeout);
    };

    React.useEffect(() => {
        return () => {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
        };
    }, [hoverTimeout]);

    // Sync when toggle from hamburger button
    React.useEffect(() => {
        const handleSidebarToggle = () => {
            const savedState = localStorage.getItem("admin-sidebar-open");
            const savedPinned = localStorage.getItem("admin-sidebar-pinned");

            const newIsOpen = savedState === "true";
            const newIsPinned = savedPinned === "true";

            setIsOpen(newIsOpen);
            setIsPinned(newIsPinned);

            if (newIsOpen) {
                setTimeout(() => setShowText(true), 150);
            } else {
                setShowText(false);
            }
        };

        window.addEventListener("admin-sidebar-toggle", handleSidebarToggle);
        return () => {
            window.removeEventListener("admin-sidebar-toggle", handleSidebarToggle);
        };
    }, []);

    const toggleExpanded = (label: string) => {
        setExpandedItems((prev) => {
            const newItems = prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label];
            localStorage.setItem("admin-sidebar-expanded-items", JSON.stringify(newItems));
            return newItems;
        });
    };

    const isItemActive = (item: NavItem) =>
        pathname === item.href ||
        (item.subItems && item.subItems.some((sub) => pathname === sub.href));

    const isSubItemActive = (sub: SubMenuItem) => pathname === sub.href;

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r bg-white shadow-sm transition-all duration-300 ease-in-out",
                isOpen ? "w-64" : "w-16"
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex flex-col h-full max-h-screen">
                {/* Navigation */}
                <nav
                    className="flex-1 p-2 space-y-1 overflow-y-auto hide-scrollbar"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = isItemActive(item);
                        const isExpanded = expandedItems.includes(item.label);
                        const hasSubItems = item.subItems && item.subItems.length > 0;

                        return (
                            <div key={item.href} className="space-y-1">
                                {hasSubItems && showText ? (
                                    <button
                                        onClick={() => toggleExpanded(item.label)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full text-left",
                                            isActive
                                                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        )}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        <span className="truncate flex-1">{item.label}</span>
                                        {isExpanded ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        )}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        {showText && <span className="truncate">{item.label}</span>}
                                    </Link>
                                )}

                                {showText && hasSubItems && isExpanded && (
                                    <div className="ml-8 space-y-1">
                                        {item.subItems?.map((subItem) => (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className={cn(
                                                    "block px-3 py-2 rounded-md text-sm transition-colors",
                                                    isSubItemActive(subItem)
                                                        ? "bg-blue-50 text-blue-700"
                                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                                )}
                                            >
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}

export default AdminSidebar;
