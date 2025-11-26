"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type TabKey = "account" | "organization" | "update-history";

const TABS: { key: TabKey; label: string; href: string }[] = [
    { key: "account", label: "Recruiter Account", href: "/recruiter/recruiter-feature/profile/account" },
    { key: "organization", label: "Organization Profile", href: "/recruiter/recruiter-feature/profile/organization" },
    { key: "update-history", label: "Update History", href: "/recruiter/recruiter-feature/profile/update-history" },
];

export function AccountTabs() {
    const router = useRouter();
    const pathname = usePathname();

    // Determine active tab based on current pathname
    const getActiveTab = (): TabKey => {
        if (pathname.includes("/update-history")) {
            return "update-history";
        }
        if (pathname.includes("/organization")) {
            return "organization";
        }
        if (pathname.includes("/account")) {
            return "account";
        }
        // Default to account for base profile route
        return "account";
    };

    const activeTab = getActiveTab();

    function setTab(key: TabKey) {
        const tab = TABS.find(t => t.key === key);
        if (tab) {
            router.push(tab.href);
        }
    }

    return (
        <div className="mb-6 flex items-center gap-1 border-b border-gray-200">
            {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <button
                        key={tab.key}
                        onClick={() => setTab(tab.key)}
                        className={cn(
                            "relative px-4 py-3 text-sm font-medium transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-t-lg",
                            isActive
                                ? "text-sky-700 bg-sky-50/50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {tab.label}
                        {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-t-sm" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default AccountTabs;


