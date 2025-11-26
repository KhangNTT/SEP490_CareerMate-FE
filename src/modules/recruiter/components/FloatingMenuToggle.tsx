"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingMenuToggle() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkSidebarState = () => {
            const savedState = localStorage.getItem('sidebar-open');
            setIsOpen(savedState === 'true');
        };

        // Check initial state
        checkSidebarState();

        // Listen for storage changes and custom events
        window.addEventListener('storage', checkSidebarState);
        window.addEventListener('sidebar-toggle', checkSidebarState);

        return () => {
            window.removeEventListener('storage', checkSidebarState);
            window.removeEventListener('sidebar-toggle', checkSidebarState);
        };
    }, []);

    const toggleSidebar = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        localStorage.setItem('sidebar-open', newState.toString());
        window.dispatchEvent(new CustomEvent('sidebar-toggle'));
    };

    return (
        <button
            onClick={toggleSidebar}
            className={`fixed top-4 z-50 flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-300 ${isOpen ? 'left-60' : 'left-4'
                }`}
        >
            <Menu className="h-5 w-5" />
        </button>
    );
}
