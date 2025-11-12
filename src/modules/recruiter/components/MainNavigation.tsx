"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutGrid, BriefcaseBusiness, Users2, Sparkles, IdCard, LifeBuoy } from "lucide-react";

type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
    {
        label: "Dashboard",
        href: "/recruiter/dashboard",
        icon: LayoutGrid
    },
    {
        label: "Blog",
        href: "/recruiter/jobs",
        icon: BriefcaseBusiness
    },
    {
        label: "Candidates",
        href: "/recruiter/candidates/applications",
        icon: Users2
    },
    {
        label: "Services",
        href: "/recruiter/services",
        icon: Sparkles
    },
    {
        label: "Account",
        href: "/recruiter/profile?tab=account",
        icon: IdCard
    },
    {
        label: "Support",
        href: "/recruiter/support",
        icon: LifeBuoy
    },
];

type MainNavigationProps = {
    onNavigate?: (sectionLabel: string) => void;
};

export function MainNavigation({ onNavigate }: MainNavigationProps) {
    const pathname = usePathname();

    const handleClick = (item: NavItem) => {
        // Pass the section label to determine if hamburger should open
        if (onNavigate) {
            onNavigate(item.label);
        }
    };

    return (
        <nav className="flex flex-col gap-3 px-2">
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/recruiter/profile" && pathname?.startsWith(item.href));
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => handleClick(item)}
                        className={cn(
                            "flex flex-col items-center justify-center rounded-md text-sky-600 transition w-16 h-16 gap-1",
                            isActive ? "bg-sky-100 text-sky-700 ring-1 ring-sky-200" : "hover:bg-sky-50"
                        )}
                        aria-current={isActive ? "page" : undefined}
                    >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default MainNavigation;
