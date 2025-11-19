"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Shield, AlertTriangle, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthHydration } from "@/hooks/useAuthHydration";
import { safeLog, DEBUG } from "@/lib/debug-config";

interface AdminAuthGuardProps {
  children: ReactNode;
  redirectIfGuest?: string; // mặc định: /sign-in
  redirectIfNotAdmin?: string; // mặc định: /
}

// Helper: Decode role from JWT
function getRoleFromToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Extract role from scope or roles field
    if (payload.scope) {
      if (typeof payload.scope === 'string') {
        const roles = payload.scope.split(' ');
        return roles[0] || null;
      }
      return payload.scope;
    }
    
    if (Array.isArray(payload.roles) && payload.roles.length > 0) {
      return payload.roles[0];
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export default function AdminAuthGuard({
  children,
  redirectIfGuest = "/sign-in",
  redirectIfNotAdmin = "/",
}: AdminAuthGuardProps) {
  // First, check localStorage immediately (synchronous)
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  // Decode role from JWT instead of reading from localStorage
  const tokenRole = storedToken ? getRoleFromToken(storedToken) : null;
  const hasStoredAdminRole =
    tokenRole === "ROLE_ADMIN" || tokenRole === "ADMIN";

  // ⚠️ SECURITY: Don't log token values
  if (DEBUG.ADMIN_GUARD) {
    safeLog.authState("🔍 [AdminAuthGuard] Initial check", {
      hasToken: !!storedToken,
      role: tokenRole,
      hasStoredAdminRole,
    });
  }

  // If we have valid token and admin role in JWT, render immediately
  // This prevents the flash of "no permission" screen
  if (storedToken && hasStoredAdminRole) {
    if (DEBUG.ADMIN_GUARD) {
      safeLog.authState(
        "✅ [AdminAuthGuard] Has stored admin credentials - rendering children immediately",
        {}
      );
    }
    return <>{children}</>;
  }

  // 1) Đảm bảo store đã rehydrate từ localStorage *trước khi* kiểm tra gì thêm
  const hasHydrated = useAuthHydration(); // <-- VT: hook nên return boolean
  const router = useRouter();

  // 2) Đọc state từ store (reactive)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const role = useAuthStore((s) => s.role);
  const accessToken = useAuthStore((s) => s.accessToken);

  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

  // 3) Điều hướng sau khi đã hydrate + hết loading
  useEffect(() => {
    if (!hasHydrated || isLoading) {
      console.debug("🔍 Admin Guard: Still loading or not hydrated yet");
      return;
    }

    // Additional check from localStorage to avoid race condition
    const storedToken =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    
    // Get role from token instead of localStorage (security)
    const currentTokenRole = storedToken ? getRoleFromToken(storedToken) : null;

    // Debug gọn, tránh getState() rời rạc
    console.debug("🔍 Admin Guard Check", {
      isAuthenticated,
      role,
      isAdmin,
      hasToken: !!accessToken,
      storedToken: storedToken ? "present" : "missing",
      roleFromToken: currentTokenRole,
    });

    // If we have stored credentials but state hasn't updated yet, wait
    if (storedToken && !isAuthenticated) {
      console.debug(
        "🔍 Admin Guard: Have token but not authenticated yet, waiting for auth state to sync..."
      );
      // Give more time for auth state to sync
      return;
    }

    // Only redirect if we're sure there's no authentication
    if (!isAuthenticated && !storedToken) {
      console.debug(
        "🔍 Admin Guard: Not authenticated and no stored token, redirecting to",
        redirectIfGuest
      );
      // Increased delay to allow silent refresh to complete
      setTimeout(() => {
        router.replace(redirectIfGuest);
      }, 500);
      return;
    }

    // Check admin from both current state and stored state
    const hasAdminRole =
      isAdmin || currentTokenRole === "ROLE_ADMIN" || currentTokenRole === "ADMIN";

    // If authenticated but waiting for role to sync
    if (isAuthenticated && !role && currentTokenRole) {
      console.debug(
        "🔍 Admin Guard: Authenticated but role not synced yet, waiting..."
      );
      return;
    }

    // Only redirect if we're SURE user is not admin
    if (isAuthenticated && !hasAdminRole && !currentTokenRole) {
      console.debug(
        "🔍 Admin Guard: Authenticated but not admin, redirecting to",
        redirectIfNotAdmin
      );
      // Increased delay to allow silent refresh to complete
      setTimeout(() => {
        router.replace(redirectIfNotAdmin);
      }, 500);
      return;
    }

    if (hasAdminRole) {
      console.debug("✅ Admin Guard: Access granted - user is admin");
    }
    // else: render children
  }, [
    hasHydrated,
    isLoading,
    isAuthenticated,
    isAdmin,
    accessToken,
    role,
    router,
    redirectIfGuest,
    redirectIfNotAdmin,
  ]);

  // 4) UI trạng thái
  if (!hasHydrated || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <LoaderCircle className="h-8 w-8 mx-auto animate-spin" />
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập…</p>
        </div>
      </div>
    );
  }

  // Re-check after hydration with updated state
  // Decode role from token again if needed
  const currentTokenRole = storedToken ? getRoleFromToken(storedToken) : null;
  const hasAdminRoleFromToken =
    currentTokenRole === "ROLE_ADMIN" || currentTokenRole === "ADMIN";
  const hasAdminRole = isAdmin || hasAdminRoleFromToken;

  if (DEBUG.ADMIN_GUARD) {
    safeLog.authState("🔍 [AdminAuthGuard] Render check", {
      hasHydrated,
      isLoading,
      isAuthenticated,
      role,
      isAdmin,
      hasToken: !!accessToken,
      tokenRole: currentTokenRole,
      hasAdminRole,
    });
  }

  // If we have token and admin role (from either source), render children
  if ((isAuthenticated && isAdmin) || (storedToken && hasAdminRole)) {
    if (DEBUG.ADMIN_GUARD) {
      safeLog.authState("✅ [AdminAuthGuard] Rendering children - access granted", {});
    }
    return <>{children}</>;
  }

  // Only show error page if we're certain user doesn't have access
  if (!isAuthenticated && !storedToken) {
    // Not authenticated at all - show error
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Admin Access Required
            </h2>
            <p className="text-red-600 mb-6">
              Bạn cần đăng nhập với quyền quản trị để truy cập khu vực này.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.replace(redirectIfGuest)}
                className="w-full rounded-xl bg-blue-600 text-white py-2 hover:bg-blue-700"
              >
                Sign In
              </button>
              <button
                onClick={() => router.replace(redirectIfNotAdmin)}
                className="w-full rounded-xl border py-2"
              >
                <span className="inline-flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Về trang chủ
                </span>
              </button>
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <details>
              <summary className="cursor-pointer">Debug Info</summary>
              <div className="mt-2 text-left bg-gray-100 p-3 rounded">
                <p>
                  <strong>Authenticated:</strong>{" "}
                  {isAuthenticated ? "✅" : "❌"}
                </p>
                <p>
                  <strong>Role (Store):</strong> {role || "(none)"}
                </p>
                <p>
                  <strong>Role (Token):</strong> {currentTokenRole || "(none)"}{" "}
                  {hasAdminRole ? "✅ Admin" : "❌ Not admin"}
                </p>
                <p>
                  <strong>Token:</strong>{" "}
                  {accessToken || storedToken ? "✅ Present" : "❌ Missing"}
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while state is syncing
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Shield className="h-12 w-12 mx-auto text-blue-600 mb-4" />
        <LoaderCircle className="h-8 w-8 mx-auto animate-spin" />
        <p className="mt-4 text-gray-600">Đang xác thực quyền truy cập…</p>
      </div>
    </div>
  );
}
