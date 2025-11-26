"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";

export function useAuthHydration(): boolean {
  const hasHydrated = useRef(false);

  const setLoading = useAuthStore((s) => s.setLoading);
  const setAuthFromTokens = useAuthStore((s) => s.setAuthFromTokens);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // 1) Đồng bộ ngay từ localStorage trước khi paint (giảm flash)
  useLayoutEffect(() => {
    if (typeof window === "undefined" || hasHydrated.current) return;
    hasHydrated.current = true;

    setLoading(true);

    const storedToken = localStorage.getItem("access_token");
    const storedExpiry = localStorage.getItem("token_expires_at");
    const expiresAt = storedExpiry ? parseInt(storedExpiry, 10) : 0;
    const isValid = !!storedToken && expiresAt > Date.now();

    console.debug("🔍 useAuthHydration: Checking localStorage...", {
      hasToken: !!storedToken,
      expiresAt,
      isValid,
      timeRemaining: expiresAt - Date.now()
    });

    if (isValid) {
      // Cập nhật store ngay lập tức (đồng bộ UI)
      console.debug("✅ useAuthHydration: Token valid, restoring to store");
      setAuthFromTokens({
        accessToken: storedToken!,
        tokenExpiresAt: expiresAt,
        isAuthenticated: true,
        // role sẽ được cập nhật chuẩn ở bước async dưới
      });
    } else if (storedToken && !isValid) {
      // Token expired - will try to refresh in async effect
      console.debug("⚠️ useAuthHydration: Token expired, will attempt refresh in async effect");
      // Don't clear yet - let async effect try to refresh first
    } else {
      // No token at all - will try silent refresh in async effect
      console.debug("❌ useAuthHydration: No token found, will attempt silent refresh in async effect");
      // Don't clear auth yet - let async effect try silent refresh first
    }
  }, [setLoading, setAuthFromTokens, clearAuth]);

  // 2) Xác thực/refresh async (introspect / lấy role)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    (async () => {
      try {
        const api = await import("@/lib/api").catch(() => null);
        const initializeAuth = api?.initializeAuth as
          | (() => Promise<boolean>)
          | undefined;

        let success = false;

        if (initializeAuth) {
          // initializeAuth returns boolean: true if session restored, false otherwise
          success = await initializeAuth();
        }

        if (!cancelled) {
          if (success) {
            // Session already restored inside initializeAuth
            // No need to call setAuthFromTokens - it's already done
            console.debug("✅ useAuthHydration: Auth initialization successful");
          } else {
            // Only clear auth if initialization failed
            console.debug("❌ useAuthHydration: Auth initialization failed, clearing auth");
            clearAuth();
          }
        }
      } catch (error: any) {
        console.debug("❌ useAuthHydration: Error during initialization:", error?.message);
        if (!cancelled) clearAuth();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clearAuth, setLoading]);

  // 3) Đồng bộ đa tab (nếu đăng xuất ở tab khác)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (
        e.key === "access_token" ||
        e.key === "token_expires_at" ||
        e.key === "refresh_token"
      ) {
        const token = localStorage.getItem("access_token");
        const expStr = localStorage.getItem("token_expires_at");
        const exp = expStr ? parseInt(expStr, 10) : 0;
        const valid = !!token && exp > Date.now();

        if (valid) {
          setAuthFromTokens({
            accessToken: token!,
            tokenExpiresAt: exp,
            isAuthenticated: true,
          });
        } else {
          clearAuth();
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [setAuthFromTokens, clearAuth]);

  // Return hydration status
  return hasHydrated.current;
}
