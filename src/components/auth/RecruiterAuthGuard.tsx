"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Briefcase, AlertTriangle, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthHydration } from "@/hooks/useAuthHydration";
import { safeLog, DEBUG } from "@/lib/debug-config";
import { getRoleFromToken, canAccessRecruiter, getRoleDisplayName } from "@/lib/role-utils";

interface RecruiterAuthGuardProps {
  children: ReactNode;
  redirectIfGuest?: string; // mặc định: /sign-in
  redirectIfNotRecruiter?: string; // mặc định: /
}

export default function RecruiterAuthGuard({
  children,
  redirectIfGuest = "/sign-in",
  redirectIfNotRecruiter = "/",
}: RecruiterAuthGuardProps) {
  // ✅ ALWAYS call ALL hooks at the top - unconditionally
  const hasHydrated = useAuthHydration();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const role = useAuthStore((s) => s.role);
  const accessToken = useAuthStore((s) => s.accessToken);

  // Now check localStorage (after hooks)
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // Decode role from JWT instead of reading from localStorage
  const tokenRole = storedToken ? getRoleFromToken(storedToken) : null;
  const hasRecruiterAccess = canAccessRecruiter(tokenRole);

  // ⚠️ SECURITY: Don't log token values
  if (DEBUG.ADMIN_GUARD) {
    safeLog.authState("🔍 [RecruiterAuthGuard] Initial check", {
      hasToken: !!storedToken,
      role: tokenRole,
      hasRecruiterAccess,
    });
  }

  // If we have valid token and recruiter role in JWT, render immediately
  // This prevents the flash of "no permission" screen
  if (storedToken && hasRecruiterAccess) {
    if (DEBUG.ADMIN_GUARD) {
      safeLog.authState(
        "✅ [RecruiterAuthGuard] Has stored recruiter credentials - rendering children immediately",
        {}
      );
    }
    return <>{children}</>;
  }

  const hasRecruiterRole = canAccessRecruiter(role);

  // 3) Điều hướng sau khi đã hydrate + hết loading
  useEffect(() => {
    if (!hasHydrated || isLoading) {
      console.debug("🔍 Recruiter Guard: Still loading or not hydrated yet");
      return;
    }

    // Additional check from localStorage to avoid race condition
    const storedToken =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    // Get role from token instead of localStorage (security)
    const currentTokenRole = storedToken ? getRoleFromToken(storedToken) : null;

    // Debug gọn
    console.debug("🔍 Recruiter Guard Check", {
      isAuthenticated,
      role,
      hasRecruiterRole,
      hasToken: !!accessToken,
      storedToken: storedToken ? "present" : "missing",
      roleFromToken: currentTokenRole,
    });

    // If NOT authenticated => redirect to sign-in
    if (!isAuthenticated || !accessToken) {
      console.debug(
        "🔍 Recruiter Guard: Not authenticated, redirecting to",
        redirectIfGuest
      );
      setTimeout(() => {
        router.replace(redirectIfGuest);
      }, 100);
      return;
    }

    // Check recruiter from both current state and stored state
    const hasAccess =
      hasRecruiterRole || canAccessRecruiter(currentTokenRole);

    // If authenticated but waiting for role to sync
    if (isAuthenticated && !role && currentTokenRole) {
      console.debug(
        "🔍 Recruiter Guard: Authenticated but role not synced yet, waiting..."
      );
      return;
    }

    // Only redirect if we're SURE user is not recruiter
    if (isAuthenticated && !hasAccess && !currentTokenRole) {
      console.debug(
        "🔍 Recruiter Guard: Authenticated but not recruiter/admin, redirecting to",
        redirectIfNotRecruiter
      );
      setTimeout(() => {
        router.replace(redirectIfNotRecruiter);
      }, 100);
      return;
    }

    if (hasAccess) {
      console.debug("✅ Recruiter Guard: Access granted - user is recruiter or admin");
    }
  }, [
    hasHydrated,
    isLoading,
    isAuthenticated,
    hasRecruiterRole,
    accessToken,
    role,
    router,
    redirectIfGuest,
    redirectIfNotRecruiter,
  ]);

  // 4) UI trạng thái
  if (!hasHydrated || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Briefcase className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <LoaderCircle className="h-8 w-8 mx-auto animate-spin" />
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập…</p>
        </div>
      </div>
    );
  }

  // Re-check after hydration with updated state
  // Decode role from token again if needed
  const currentTokenRole = storedToken ? getRoleFromToken(storedToken) : null;
  const hasAccessFromToken = canAccessRecruiter(currentTokenRole);
  const hasAccess = hasRecruiterRole || hasAccessFromToken;

  if (DEBUG.ADMIN_GUARD) {
    safeLog.authState("🔍 [RecruiterAuthGuard] Render check", {
      hasHydrated,
      isLoading,
      isAuthenticated,
      role,
      hasRecruiterRole,
      hasToken: !!accessToken,
      tokenRole: currentTokenRole,
      hasAccess,
    });
  }

  // If we have token and recruiter role (from either source), render children
  if ((isAuthenticated && hasRecruiterRole) || (storedToken && hasAccess)) {
    if (DEBUG.ADMIN_GUARD) {
      safeLog.authState("✅ [RecruiterAuthGuard] Rendering children - access granted", {});
    }
    return <>{children}</>;
  }

  // ===== LOADING UI =====
  // If we're still waiting for things to settle, show spinner
  if (!isAuthenticated || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Briefcase className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <LoaderCircle className="h-8 w-8 mx-auto text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // ===== ACCESS DENIED UI =====
  // If authenticated but NO recruiter role
  if (isAuthenticated && !hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600 mb-6">
            Trang này chỉ dành cho <strong>Nhà tuyển dụng</strong> và{" "}
            <strong>Quản trị viên</strong>.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Vai trò hiện tại:</strong>{" "}
              <span className="text-blue-600">{getRoleDisplayName(role)}</span>
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Về trang chủ
          </button>

          {/* Debug Info (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                🔍 Debug Info (Dev Only)
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono space-y-1">
                <p>
                  <strong>Authenticated:</strong>{" "}
                  {isAuthenticated ? "✅" : "❌"}
                </p>
                <p>
                  <strong>Role (Store):</strong> {role || "(none)"}
                </p>
                <p>
                  <strong>Role (Token):</strong> {currentTokenRole || "(none)"}{" "}
                  {hasAccess ? "✅ Has Access" : "❌ No Access"}
                </p>
                <p>
                  <strong>Token:</strong>{" "}
                  {accessToken || storedToken ? "✅ Present" : "❌ Missing"}
                </p>
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Show loading while state is syncing
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Briefcase className="h-12 w-12 mx-auto text-blue-600 mb-4" />
        <LoaderCircle className="h-8 w-8 mx-auto animate-spin" />
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    </div>
  );
}
