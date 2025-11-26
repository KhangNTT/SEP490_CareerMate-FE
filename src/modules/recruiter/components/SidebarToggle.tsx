"use client";

import { Menu, X } from "lucide-react";

type SidebarToggleProps = {
    isOpen: boolean;
    onToggle: () => void;
};

export function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
    return (
        <div className="flex items-center justify-center p-4">
            <button
                onClick={onToggle}
                className="flex h-8 w-8 items-center justify-center rounded-md text-sky-600 hover:bg-sky-50"
                aria-label={isOpen ? "Close sidebar menu" : "Open sidebar menu"}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
        </div>
    );
}

export default SidebarToggle;
