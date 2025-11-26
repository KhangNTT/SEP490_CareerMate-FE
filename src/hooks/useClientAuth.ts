// Simple client-side auth state loader
import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/use-auth-store";

export const useClientAuth = () => {
  const [mounted, setMounted] = useState(false);
  const { role: rawRole } = useAuthStore();
  const [clientAuth, setClientAuth] = useState<{
    isAuthenticated: boolean;
    accessToken: string | null;
  }>({ isAuthenticated: false, accessToken: null });
  const normalizedRole = useMemo(() => {
    if (!rawRole) return null;
    const upper = rawRole.toUpperCase();
    if (upper.includes("CANDIDATE")) return "CANDIDATE";
    if (upper.includes("RECRUITER")) return "RECRUITER";
    if (upper.includes("ADMIN")) return "ADMIN";
    return "USER";
  }, [rawRole]);
  useEffect(() => {
    setMounted(true);

    // Load from localStorage on client
    try {
      const storedToken = localStorage.getItem("access_token");
      const storedExpiry = localStorage.getItem("token_expires_at");

      if (storedToken && storedExpiry) {
        const expiresAt = parseInt(storedExpiry, 10);
        const isValid = expiresAt > Date.now();

        if (isValid) {
          // Decode user info & role từ JWT thay vì localStorage (an toàn hơn)
          let userInfo = null;
          let role = null;

          try {
            const parts = storedToken.split(".");
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              userInfo = {
                id: payload.sub,
                email: payload.email,
                name: payload.name || payload.email,
              };

              // Extract role from JWT
              if (payload.scope) {
                role =
                  typeof payload.scope === "string"
                    ? payload.scope.split(" ")[0]
                    : payload.scope;
              } else if (Array.isArray(payload.roles)) {
                role = payload.roles[0];
              }
            }
          } catch (e) {
            // Failed to decode JWT
          }

          // Update auth store immediately
          useAuthStore.setState({
            accessToken: storedToken,
            tokenExpiresAt: expiresAt,
            isAuthenticated: true,
            user: userInfo,
            role: role,
          });

          setClientAuth({ isAuthenticated: true, accessToken: storedToken });
          return;
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_expires_at");
          // Xóa legacy keys nếu còn
          localStorage.removeItem("user_role");
          localStorage.removeItem("user_info");
        }
      }

      setClientAuth({ isAuthenticated: false, accessToken: null });
    } catch (error) {
      setClientAuth({ isAuthenticated: false, accessToken: null });
    }
  }, []);

  // Get current store state for comparison
  const storeState = useAuthStore();

  return {
    mounted,
    isAuthenticated: mounted
      ? storeState.isAuthenticated
      : clientAuth.isAuthenticated,
    accessToken: mounted ? storeState.accessToken : clientAuth.accessToken,
    user: storeState.user,
    // role: storeState.role,
    role: normalizedRole,
  };
};
