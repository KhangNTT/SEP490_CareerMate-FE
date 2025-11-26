import type { ReactNode } from "react";
import { AdminLayoutWrapper } from "@/modules/admin/components";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";
import { AuthProvider } from "@/store/auth-provider";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { SecurityCleanup } from "@/components/auth/SecurityCleanup";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGuard>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </AdminAuthGuard>
  );
}

