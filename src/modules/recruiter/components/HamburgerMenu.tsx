"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SubMenuItem = {
    label: string;
    href: string;
};

type HamburgerMenuProps = {
    isOpen: boolean;
    activeMenuItem: {
        label: string;
        subItems?: SubMenuItem[];
    } | null;
};

export function HamburgerMenu({ isOpen, activeMenuItem }: HamburgerMenuProps) {
    const pathname = usePathname();

    if (!isOpen) return null;

    const showSubMenu = activeMenuItem?.subItems && activeMenuItem.subItems.length > 0;

    return (
        <div className="bg-slate-50 w-60 overflow-hidden">
            <div className="w-60 p-4">
                {showSubMenu && activeMenuItem ? (
                    <>
                        <h3 className="mb-3 text-sm font-semibold text-sky-900 whitespace-nowrap">
                            {activeMenuItem.label}
                        </h3>
                        <nav className="space-y-1">
                            {activeMenuItem.subItems?.map((subItem) => (
                                <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={cn(
                                        "block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-sky-50 hover:text-sky-700 whitespace-nowrap",
                                        pathname === subItem.href && "bg-sky-50 text-sky-700"
                                    )}
                                >
                                    {subItem.label}
                                </Link>
                            ))}
                        </nav>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-sm text-slate-500">
                            {activeMenuItem ?
                                `${activeMenuItem.label} has no sub-menu options` :
                                "Navigate to a section to see available options"
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HamburgerMenu;
