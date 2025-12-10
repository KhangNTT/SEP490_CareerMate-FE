"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./admin-sidebar";

interface AdminLayoutWrapperProps {
    children: ReactNode;
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarHover, setSidebarHover] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        
        // Check if mobile on mount
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const savedState = localStorage.getItem('admin-sidebar-open');
        if (savedState !== null) {
            setSidebarOpen(savedState === 'true');
        }

        const handleSidebarToggle = () => {
            const isOpen = localStorage.getItem('admin-sidebar-open') === 'true';
            setSidebarOpen(isOpen);
        };

        const handleSidebarHover = (event: CustomEvent) => {
            setSidebarHover(event.detail.isOpen);
        };

        window.addEventListener('admin-sidebar-toggle', handleSidebarToggle);
        window.addEventListener('admin-sidebar-hover', handleSidebarHover as EventListener);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('admin-sidebar-toggle', handleSidebarToggle);
            window.removeEventListener('admin-sidebar-hover', handleSidebarHover as EventListener);
        };
    }, []);

    // Determine effective sidebar width - use hover state or pinned state
    const effectiveSidebarOpen = sidebarOpen || sidebarHover;

    // Calculate margin based on sidebar state (64px collapsed, 256px expanded)
    const getMainMargin = () => {
        if (isMobile) return 'ml-0';
        return effectiveSidebarOpen ? 'md:ml-64' : 'md:ml-16';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - fixed at top */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <AdminHeader sidebarOpen={sidebarOpen} />
            </div>
            
            <div className="flex pt-[60px] md:pt-[72px]">
                {/* Sidebar - hidden on mobile, visible on desktop */}
                <div className="hidden md:block">
                    <AdminSidebar />
                </div>

                {/* Mobile sidebar overlay */}
                {isMobile && sidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={() => {
                                localStorage.setItem('admin-sidebar-open', 'false');
                                window.dispatchEvent(new CustomEvent('admin-sidebar-toggle'));
                            }}
                        />
                        {/* Mobile sidebar */}
                        <div className="fixed left-0 top-[60px] z-40 h-[calc(100vh-60px)] w-64 bg-white shadow-lg md:hidden overflow-y-auto">
                            <AdminSidebar />
                        </div>
                    </>
                )}
                
                {/* Main content - dodges sidebar */}
                <main className={`
                    flex-1 
                    min-h-[calc(100vh-60px)] md:min-h-[calc(100vh-72px)]
                    w-full
                    ${getMainMargin()}
                    transition-all duration-300 ease-in-out
                `}>
                    <div className="p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10">
                        <div className="w-full">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
