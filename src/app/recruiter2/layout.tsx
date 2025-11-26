"use client";

import { RecruiterSidebar } from "@/modules/recruiter";
import RecruiterAuthGuard from "@/components/auth/RecruiterAuthGuard";
import { AuthProvider } from "@/store/auth-provider";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { SecurityCleanup } from "@/components/auth/SecurityCleanup";

// Recruiter navigation items
const recruiterNavItems = [
  {
    title: "Dashboard",
    url: "/recruiter",
    icon: "LayoutDashboard",
  },
  {
    title: "Quản lý Jobs",
    url: "/recruiter/jobs",
    icon: "Briefcase",
  },
  {
    title: "Đơn ứng tuyển",
    url: "/recruiter/applications",
    icon: "FileText",
  },
  {
    title: "Ứng viên",
    url: "/recruiter/candidates",
    icon: "Users",
  },
  {
    title: "Thống kê",
    url: "/recruiter/analytics",
    icon: "TrendingUp",
  },
  {
    title: "Cài đặt",
    url: "/recruiter/settings",
    icon: "Settings",
  },
];

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <LayoutProvider>
        <SecurityCleanup />

        <RecruiterAuthGuard>
          <div className="flex min-h-screen bg-gray-100">
            <RecruiterSidebar />
            <main className="flex-1">{children}</main>
          </div>
        </RecruiterAuthGuard>
      </LayoutProvider>
    </AuthProvider>
  );
}
