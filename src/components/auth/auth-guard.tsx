"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useAuthHydration } from "@/hooks/useAuthHydration";

interface AuthGuardProps {
  children: React.ReactNode;
  mode: "auth" | "guest"; // 'auth' for protected routes, 'guest' for non-authenticated only routes
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  mode = "auth",
  redirectTo = mode === "auth" ? "/sign-in" : "/",
}: AuthGuardProps) {
  // Use the hydration hook to ensure auth state is synced immediately
  const hasHydrated = useAuthHydration();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  // Initialize auth state from localStorage - but don't show loading during this
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Only initialize if not already authenticated
        if (!isAuthenticated) {
          // Safely import and initialize
          const apiModule = await import("@/lib/api").catch((e) => {
            console.debug("Could not import api module:", e?.message);
            return { initializeAuth: () => Promise.resolve(false) };
          });

          const { initializeAuth } = apiModule;
          let success = false;

          try {
            success = await initializeAuth();
            console.debug(
              `Auth initialization ${success ? "successful" : "failed"}`
            );
          } catch (initError: any) {
            // Just log the error without throwing
            console.debug(
              "Auth initialization error:",
              initError?.message || "Unknown error"
            );
          }
        }
      } catch (error) {
        console.debug("Error in auth initialization process");
      }
    };

    initAuth();
  }, [isAuthenticated]);

  // Handle redirects based on auth state and mode
  useEffect(() => {
    if (!hasHydrated || isLoading) return;

    // Use a small delay to ensure the state is fully updated
    const timer = setTimeout(() => {
      if (mode === "guest" && isAuthenticated) {
        // If this is a guest-only route and user is authenticated, redirect away
        router.replace(redirectTo);
      } else if (mode === "auth" && !isAuthenticated) {
        // If this is a protected route and user is not authenticated, redirect to login
        router.replace(redirectTo);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, mode, router, redirectTo, hasHydrated]);

  // Reduce loading screen time to minimize flashing
  if (!hasHydrated || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="size-16 animate-spin text-green-600" />
      </div>
    );
  }

  // For guest routes, we only render if not authenticated
  if (mode === "guest" && isAuthenticated) {
    return null;
  }

  // For protected routes, we only render if authenticated
  if (mode === "auth" && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
