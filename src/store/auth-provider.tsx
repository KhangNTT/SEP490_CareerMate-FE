"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";

// ========================================
// ✅ FIXED: AuthProvider - Silent refresh on mount when token missing
// ========================================
const REFRESH_INTERVAL = 60 * 1000; // 60 seconds
const REFRESH_THRESHOLD = 30 * 1000; // Refresh if less than 30 seconds left

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, tokenExpiresAt, refresh, introspect, clearAuth } =
    useAuthStore();
  
  const hasAttemptedSilentRefreshRef = useRef(false);
  const isRefreshingRef = useRef(false);
  const lastCheckRef = useRef<number>(0);

  // ✅ CRITICAL FIX: Attempt silent refresh if no access token on mount
  useEffect(() => {
    const attemptSilentRefresh = async () => {
      // Only try once per session
      if (hasAttemptedSilentRefreshRef.current) return;
      
      // Only attempt if no access token
      if (accessToken) {
        console.debug("✅ [AuthProvider] Access token exists, skipping silent refresh");
        return;
      }
      
      hasAttemptedSilentRefreshRef.current = true;
      console.debug("� [AuthProvider] No access token, attempting silent refresh from cookie...");

      try {
        const newToken = await refresh();
        if (newToken) {
          console.debug("✅ [AuthProvider] Silent refresh succeeded - session restored");
        } else {
          console.debug("⚠️ [AuthProvider] No valid refresh token cookie found");
        }
      } catch (error: any) {
        console.debug("❌ [AuthProvider] Silent refresh failed:", error?.message || "Unknown");
      }
    };

    attemptSilentRefresh();
  }, [accessToken, refresh]);

  // ✅ Periodic token validation (with strong throttling)
  useEffect(() => {
    const validateToken = async () => {
      if (!accessToken || !tokenExpiresAt) return;

      const now = Date.now();
      
      // Throttle validation checks (minimum 60 seconds between checks)
      if (now - lastCheckRef.current < REFRESH_INTERVAL) {
        return;
      }
      lastCheckRef.current = now;

      const timeRemaining = tokenExpiresAt - now;
      
      // If token has plenty of time (> 2 minutes), skip validation
      if (timeRemaining > 120000) {
        console.debug(`⏱️ [AuthProvider] Token valid for ${Math.floor(timeRemaining / 1000)}s, skipping check`);
        return;
      }

      // If token is expired, try refresh
      if (timeRemaining <= 0) {
        console.debug("⏰ [AuthProvider] Token expired, attempting refresh");
        try {
          if (!isRefreshingRef.current) {
            isRefreshingRef.current = true;
            await refresh();
            isRefreshingRef.current = false;
          }
        } catch (error: any) {
          console.debug("❌ [AuthProvider] Refresh failed:", error?.message);
          isRefreshingRef.current = false;
        }
        return;
      }

      // If token expires soon (< 30 seconds), refresh proactively
      if (timeRemaining < REFRESH_THRESHOLD) {
        console.debug(`⚠️ [AuthProvider] Token expires in ${Math.floor(timeRemaining / 1000)}s, refreshing proactively`);
        try {
          if (!isRefreshingRef.current) {
            isRefreshingRef.current = true;
            await refresh();
            isRefreshingRef.current = false;
          }
        } catch (error: any) {
          console.debug("⚠️ [AuthProvider] Proactive refresh failed:", error?.message);
          isRefreshingRef.current = false;
        }
        return;
      }

      // Validate with server only if close to expiry
      try {
        console.debug("🔍 [AuthProvider] Validating token with server");
        const { valid } = await introspect(accessToken);
        if (!valid) {
          console.debug("⚠️ [AuthProvider] Server reports token invalid, refreshing");
          if (!isRefreshingRef.current) {
            isRefreshingRef.current = true;
            await refresh();
            isRefreshingRef.current = false;
          }
        }
      } catch (error: any) {
        // Handle network errors gracefully - don't treat as critical
        const isNetworkError = !error.response;
        if (isNetworkError) {
          console.debug("🌐 [AuthProvider] Network error during validation - skipping");
        } else if (error.response?.status === 401) {
          console.debug("🔄 [AuthProvider] Token validation returned 401, refreshing");
          try {
            if (!isRefreshingRef.current) {
              isRefreshingRef.current = true;
              await refresh();
              isRefreshingRef.current = false;
            }
          } catch (refreshError: any) {
            console.debug("❌ [AuthProvider] Refresh after 401 failed:", refreshError?.message);
            isRefreshingRef.current = false;
          }
        }
      }
    };

    // Initial validation after a delay to avoid conflicts with guards
    const initialTimeout = setTimeout(validateToken, 5000);

    // Periodic validation
    const intervalId = setInterval(validateToken, REFRESH_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [accessToken, tokenExpiresAt, refresh, introspect]);

  return <>{children}</>;
}
