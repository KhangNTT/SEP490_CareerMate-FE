"use client";

import { useEffect, useState } from "react";
import { Link, Menu } from "lucide-react";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { useAuthStore } from "@/store/use-auth-store";
import { decodeJWT } from "@/lib/auth-admin";
import { getCurrentUser } from "@/lib/user-api";
import { NotificationBell } from "@/components/notifications";

interface AdminHeaderProps {
  sidebarOpen?: boolean;
}

export function AdminHeader({ sidebarOpen = false }: AdminHeaderProps) {
  const { user } = useAuthStore();
  const { isAuthenticated, accessToken, logout, role } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    username?: string;
  } | null>(null);

  // Load sidebar state from localStorage after mount
  useEffect(() => {
    const savedState = localStorage.getItem("admin-sidebar-open");
    if (savedState) {
      setIsOpen(savedState === "true");
    }
  }, []);

  // Fetch current user info from API
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!accessToken || !isAuthenticated) {
        setUserInfo(null);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        console.log('📋 Current admin from API:', currentUser);
        
        setUserInfo({
          username: currentUser.username,
          email: currentUser.email,
          name: currentUser.username || currentUser.email,
        });
      } catch (error) {
        console.error('Failed to fetch current admin:', error);
        // Fallback to JWT decode
        try {
          const decoded = decodeJWT(accessToken);
          setUserInfo({
            email: decoded?.sub || decoded?.email || "Admin",
            name: decoded?.name || decoded?.sub || "Admin",
          });
        } catch {
          setUserInfo(null);
        }
      }
    };

    fetchCurrentUser();
  }, [accessToken, isAuthenticated]);

  useEffect(() => {
    const checkSidebarState = () => {
      const savedState = localStorage.getItem("admin-sidebar-open");
      const newIsOpen = savedState === "true";
      setIsOpen(newIsOpen);
    };

    // Listen to hover events from sidebar
    const handleSidebarHover = (event: CustomEvent) => {
      setIsOpen(event.detail.isOpen);
    };

    window.addEventListener("admin-sidebar-toggle", checkSidebarState);
    window.addEventListener(
      "admin-sidebar-hover",
      handleSidebarHover as EventListener
    );

    checkSidebarState();

    return () => {
      window.removeEventListener("admin-sidebar-toggle", checkSidebarState);
      window.removeEventListener(
        "admin-sidebar-hover",
        handleSidebarHover as EventListener
      );
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("admin-sidebar-open", newState.toString());
    localStorage.setItem("admin-sidebar-pinned", newState.toString());

    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("admin-sidebar-toggle"));
      window.dispatchEvent(
        new CustomEvent("admin-sidebar-hover", {
          detail: { isOpen: newState, isHover: false, isPinned: newState },
        })
      );
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1b1b20f5] text-[#ffffff] w-full">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-6">
          {/* Menu button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-[#436a9d] transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Title */}
          <h1 className="text-lg font-semibold">CareerMate Admin</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Right side header */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <span className="sm:block text-gray-300 hover:text-white transition-colors hidden text-xs md:inline">
                  For Admin {userInfo?.username || userInfo?.name || "Admin"}
                </span>

                <ProfileDropdown
                  userName={userInfo?.username || userInfo?.name || user?.email || "Admin"}
                  userEmail={userInfo?.email || user?.email}
                  role={role || undefined}
                  userAvatar="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTPMg7sLIhRN7k0UrPxSsHzujqgLqdTq67Pj4uVqKmr4sFR0eH4h4h-sWjxVvi3vKOl47pyShZMal8qcNuipNE4fbSfblUL99EfUtDrBto"
                />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="border-b border-[#1f4171]"></div>
    </header>
  );
}
