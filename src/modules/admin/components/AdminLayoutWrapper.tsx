"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./admin-sidebar";

interface AdminLayoutWrapperProps {
    children: ReactNode;
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        const savedState = localStorage.getItem('admin-sidebar-open');
        if (savedState !== null) {
            setSidebarOpen(savedState === 'true');
        }

        const handleSidebarToggle = () => {
            const isOpen = localStorage.getItem('admin-sidebar-open') === 'true';
            setSidebarOpen(isOpen);
        };

        window.addEventListener('admin-sidebar-toggle', handleSidebarToggle);

        return () => {
            window.removeEventListener('admin-sidebar-toggle', handleSidebarToggle);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header full width */}
            <AdminHeader sidebarOpen={sidebarOpen} />
            
            <div className="flex">
                {/* Sidebar */}
                <AdminSidebar />
                
                {/* Main content */}
                <main
                    className={`flex-1 transition-all duration-300 ${
                        sidebarOpen ? 'ml-64' : 'ml-16'
                    }`}
                >
                    <div className="px-4 py-8">
                        <div className="mx-auto max-w-6xl">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
