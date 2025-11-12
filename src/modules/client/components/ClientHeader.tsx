"use client";

import Link from "next/link";
import { ChevronDown, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useClientAuth } from "@/hooks/useClientAuth";
import { decodeJWT } from "@/lib/auth-admin";
import toast from "react-hot-toast";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import UserTypeSelectionModal from "@/components/auth/UserTypeSelectionModal";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getCurrentUser } from "@/lib/user-api";


export default function ClientHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    username?: string;
  } | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Auth state (hook đã chuẩn hoá role nếu bạn theo code trước đó)
  const { mounted, isAuthenticated, accessToken, role } = useClientAuth();
  const { logout, user } = useAuthStore();
  
  // Lấy username từ database
  const { username } = useUserProfile();

  // Debug log
  console.log("🔍 ClientHeader State:", {
    mounted,
    isAuthenticated,
    hasAccessToken: !!accessToken,
    role,
    hasUser: !!user,
    userName: user?.name,
    userEmail: user?.email,
  });

  // Phòng trường hợp role trả về format khác, chuẩn hoá nhẹ tại đây
  const normalizedRole = role?.includes("CANDIDATE")
    ? "ROLE_CANDIDATE"
    : role?.includes("RECRUITER")
    ? "ROLE_RECRUITER"
    : role?.includes("ADMIN")
    ? "ROLE_ADMIN"
    : "ROLE_USER";

  const isCandidate = normalizedRole === "ROLE_CANDIDATE";
  const isRecruiter = normalizedRole === "ROLE_RECRUITER";

  // Mark hydrated để tránh SSR mismatch
  useEffect(() => setIsHydrated(true), []);

  // Fetch current user info from API
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!accessToken || !isAuthenticated) {
        setUserInfo(null);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        console.log('📋 Current user from API (ClientHeader):', currentUser);
        
        setUserInfo({
          username: currentUser.username,
          email: currentUser.email,
          name: currentUser.username || currentUser.email,
        });

        // Update store user if not set
        if (!user && currentUser) {
          useAuthStore.setState({
            user: {
              id: currentUser.email,
              email: currentUser.email,
              name: currentUser.username || currentUser.email,
              username: currentUser.username,
            },
          });
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        // Fallback to JWT decode
        try {
          const decoded = decodeJWT(accessToken);
          setUserInfo({
            email: decoded?.sub || decoded?.email || "User",
            name: decoded?.name || decoded?.sub || "User",
          });
        } catch {
          setUserInfo(null);
        }
      }
    };

    fetchCurrentUser();
  }, [accessToken, isAuthenticated]);

  // Đóng dropdown khi click ra ngoài / nhấn ESC
  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsUserMenuOpen(false);
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", onClickOutside);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      setIsUserMenuOpen(false);
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    }
  };

  // Skeleton trong lúc chưa hydrate/mounted
  if (!isHydrated || !mounted) {
    return (
      <header
        suppressHydrationWarning
        className="bg-[#1b1b20f5] text-white shadow-lg fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/images/general/newlogo.png"
              alt="Logo"
              className="h-14 w-auto"
            />
            <span className="text-xl font-bold">CareerMate</span>
          </Link>
          <div className="hidden lg:flex items-center space-x-6">
            <div className="h-4 w-24 bg-white/20 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-white/20 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-white/20 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-white/20 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-20 bg-white/20 rounded-lg animate-pulse" />
            <div className="h-8 w-24 bg-white/20 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#1b1b20f5] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src="/images/general/newlogo.png"
                  alt="Logo"
                  className="h-14 w-auto"
                />
                <span className="text-xl font-bold text-[#ffffff]">
                  Home Header 2
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/recruiter/recruiter-feature/dashboard"
              className="text-[#ffffff] hover:text-[#c8c8c8]"
            >
              Dashboard
            </Link>
            <Link
              href="/recruiter/recruiter-feature/profile?tab=account"
              className="text-[#ffffff] hover:text-[#c8c8c8]"
            >
              Account
            </Link>
            <Link
              href="/recruiter/recruiter-feature/candidates/applications"
              className="text-[#ffffff] hover:text-[#c8c8c8]"
            >
              Candidates
            </Link>
            <Link
              href="/recruiter/recruiter-feature/services"
              className="text-[#ffffff] hover:text-[#c8c8c8]"
            >
              Services
            </Link>
            <Link
              href="/recruiter/recruiter-feature/jobs"
              className="text-[#ffffff] hover:text-[#c8c8c8]"
            >
              Upload Jobs
            </Link>
            <Link
              href="/recruiter/recruiter-feature/support"
              className="text-[#ffffff] hover:text-[#c8c8c8]"
            >
              Support
            </Link>
          </nav>

          {/* Bên phải header */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <span className="sm:block text-gray-300 hover:text-white transition-colors hidden text-xs md:inline">
                  {isRecruiter ? `For Recruiter ${userInfo?.username || username || user?.username || "abc"}` : `For Candidate ${userInfo?.username || username || user?.username || "abc"}`}
                </span>

                <ProfileDropdown
                  userName={userInfo?.username || username || user?.username || userInfo?.name || "User"}
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
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Type Selection Modal */}
      <UserTypeSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  );
}