"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";

// Significantly increase intervals to prevent infinite loops
const REFRESH_INTERVAL = 60 * 1000; // 60 seconds
const REFRESH_THRESHOLD = 30 * 1000; // Refresh if less than 30 seconds left

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, introspect, refresh, logout, getTokenExpiration } =
    useAuthStore();
  const lastCheckRef = useRef<number>(0);
  const isRefreshingRef = useRef(false);
  const hasAttemptedRefreshRef = useRef(false);

  // ✅ FIX: Check if access token is missing but might have refresh token cookie
  useEffect(() => {
    const checkForMissingToken = async () => {
      // If no access token in state but we haven't tried refreshing yet
      if (!accessToken && !hasAttemptedRefreshRef.current) {
        hasAttemptedRefreshRef.current = true;
        console.debug("🔍 AuthProvider: No access token in state, attempting refresh from cookie...");

        try {
          const newToken = await refresh();
          if (newToken) {
            console.debug("✅ AuthProvider: Successfully restored session from refresh token cookie");
          } else {
            console.debug("❌ AuthProvider: No valid refresh token cookie found");
          }
        } catch (error) {
          console.debug("❌ AuthProvider: Failed to refresh from cookie:", error);
        }
      } else if (accessToken) {
        console.debug("✅ AuthProvider: Access token found in state");
      }
    };

    checkForMissingToken();
  }, [accessToken, refresh]);

  // Re-enable with stronger throttling
  useEffect(() => {
    const validateToken = async () => {
      const { accessToken, tokenExpiresAt } = useAuthStore.getState();
      if (!accessToken) return;

      // First check if token is expired based on stored expiration time
      if (tokenExpiresAt) {
        const timeRemaining = tokenExpiresAt - Date.now();
        if (timeRemaining > 120000) {
          // If more than 2 minutes remaining, skip validation
          console.debug(
            "Token has plenty of time remaining, skipping validation"
          );
          return;
        }
        if (timeRemaining <= 0) {
          // If expired, try refresh directly
          console.debug(
            "Token expired based on stored time, attempting refresh..."
          );
          try {
            await refresh();
          } catch (refreshError) {
            console.debug("Refresh attempt failed on startup");
          }
          return;
        }
      }

      // Only validate with server if token is close to expiry
      try {
        console.debug("Validating token with server...");
        const { valid } = await introspect(accessToken);
        if (!valid) {
          console.debug("Server reports token invalid, attempting refresh...");
          await refresh();
        }
      } catch (error: any) {
        // Handle network errors gracefully - don't treat as critical
        const isNetworkError = !error.response;
        if (isNetworkError) {
          console.debug(
            "Network error during token validation - skipping validation"
          );
          // Don't do anything on network errors during initial validation
        } else if (error.response?.status === 401) {
          console.debug("Token validation returned 401, attempting refresh...");
          try {
            await refresh();
          } catch (refreshError) {
            console.debug("Refresh attempt after validation error also failed");
          }
        }
      }
    };

    // Add a much larger delay to prevent conflicts with guards
    const timer = setTimeout(() => {
      validateToken();
    }, 15000); // 15 second delay to avoid conflicts

    return () => clearTimeout(timer);
  }, []); // Remove dependencies to prevent multiple calls

  const checkAndRefreshToken = useCallback(async () => {
    // Prevent concurrent refreshes
    if (isRefreshingRef.current) return;

    // Don't check if no token
    if (!accessToken) return;

    // Rate limit checks
    const now = Date.now();
    if (now - lastCheckRef.current < REFRESH_INTERVAL) return;
    lastCheckRef.current = now;

    try {
      isRefreshingRef.current = true;

      // Get token expiration time from state
      const { tokenExpiresAt } = useAuthStore.getState();
      // If we don't have an expiration time, calculate it from the token
      const tokenExp = tokenExpiresAt || getTokenExpiration(accessToken);
      const timeLeft = tokenExp - now;

      if (timeLeft <= REFRESH_THRESHOLD) {
        console.debug("Token expiring soon - refreshing");
        try {
          // Import axios directly to avoid circular imports
          const axios = (await import("axios")).default;

          // Create a dedicated axios instance using our specialized Next.js endpoint
          const refreshAxios = axios.create({
            timeout: 5000,
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });

          // Attempt refresh using our specialized Next.js endpoint
          try {
            // Use our dedicated token refresh endpoint that handles redirects properly
            const response = await refreshAxios.post("/api/auth/token-refresh");

            if (response.data?.result?.accessToken) {
              const { accessToken, expiresIn } = response.data.result;
              const expiresAt = Date.now() + expiresIn * 1000;

              // Update auth store manually
              localStorage.setItem("access_token", accessToken);
              localStorage.setItem("token_expires_at", expiresAt.toString());

              useAuthStore.setState({
                accessToken,
                tokenExpiresAt: expiresAt,
                isAuthenticated: true,
              });

              console.debug(
                "✅ Token refreshed successfully via Next.js proxy"
              );
            } else {
              // If proxy refresh failed, try through store method
              const newToken = await refresh();
              if (!newToken) {
                console.debug("Token refresh failed - logging out");
                await logout();
              } else {
                console.debug(
                  "✅ Token refreshed successfully via store method"
                );
              }
            }
          } catch (directError) {
            console.debug("Direct refresh failed, trying store method");
            // Fall back to store refresh method
            const newToken = await refresh();
            if (!newToken) {
              console.debug("Token refresh failed - logging out");
              await logout();
            } else {
              console.debug("✅ Token refreshed successfully via store method");
            }
          }
        } catch (refreshError: any) {
          // Handle network errors differently
          const isNetworkError = !refreshError.response;
          if (isNetworkError) {
            console.debug(
              "Network error during scheduled token refresh - will try again later"
            );
            // Don't logout on network errors, just try again next interval
          } else {
            console.debug(
              "Token refresh error:",
              refreshError?.message || "Unknown error"
            );
            await logout();
          }
        }
      }
    } catch (err: any) {
      console.debug(
        "Token refresh check failed:",
        err?.message || "Unknown error"
      );
      // Only logout for non-network errors
      if (err.response) {
        await logout();
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [accessToken, refresh, logout, getTokenExpiration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const start = async () => {
      if (!accessToken) return;

      // Initial check but wait a bit to prevent immediate refresh
      const initialDelay = setTimeout(() => {
        checkAndRefreshToken();
      }, 1000);

      // Start periodic checks
      interval = setInterval(checkAndRefreshToken, REFRESH_INTERVAL);

      return () => {
        clearTimeout(initialDelay);
        if (interval) {
          clearInterval(interval);
        }
      };
    };

    const cleanup = start();
    return () => {
      cleanup.then((cleanup) => cleanup?.());
    };
  }, [accessToken, checkAndRefreshToken]);

  return <>{children}</>;
}
