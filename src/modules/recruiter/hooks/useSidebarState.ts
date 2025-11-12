"use client";

import { useState, useEffect } from "react";

export function useSidebarState() {
    const [isOpen, setIsOpen] = useState(false);

    // Keep hamburger open when navigating if it was already open
    useEffect(() => {
        const savedState = localStorage.getItem('sidebar-open');
        if (savedState === 'true') {
            setIsOpen(true);
        }
    }, []);

    // Save hamburger state to localStorage
    const toggleSidebar = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        localStorage.setItem('sidebar-open', newState.toString());
    };

    // Auto-manage sidebar based on navigation - check if section has sub-menu items
    const handleNavigation = (sectionLabel: string, getActiveMenuItem: (label: string) => any) => {
        const activeMenuItem = getActiveMenuItem(sectionLabel);
        const hasSubMenuItems = activeMenuItem?.subItems && activeMenuItem.subItems.length > 0;

        setIsOpen(hasSubMenuItems);
        localStorage.setItem('sidebar-open', hasSubMenuItems.toString());
    };

    return {
        isOpen,
        toggleSidebar,
        handleNavigation
    };
}
