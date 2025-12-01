import axios from "axios";
import { useAuthStore } from "@/store/use-auth-store";
import { unifiedRefresh } from "./refresh-manager";
import { setCookie } from "@/lib/cookies";

// Debug the API URL being used
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL,
  timeout: 30000, // ✅ Increased from 10000 to 30000ms (30 seconds)
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Important: enables cookies for token rotation
});

// ========================================
// ✅ FIXED: initializeAuth - Proper token restoration & silent refresh
// ========================================
let isInitializing = false;
let lastInitResult: boolean | null = null;

export const initializeAuth = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  // Prevent multiple concurrent initializations
  if (isInitializing) {
    console.debug("🔄 Auth initialization already in progress, skipping");
    return lastInitResult || false;
  }
  
  isInitializing = true;
  
  const ACCESS_TOKEN_KEY = "access_token";
  const TOKEN_EXPIRES_AT_KEY = "token_expires_at";
  
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const expiresAtStr = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
  
  console.debug("🔍 [initializeAuth] Starting initialization...");
  
  // ✅ CASE 1: No access token - Try silent refresh from httpOnly cookie
  if (!accessToken || !expiresAtStr) {
    console.debug("📭 [initializeAuth] No access token found, attempting silent refresh from cookie");
    try {
      const newToken = await unifiedRefresh();
      if (newToken) {
        console.debug("✅ [initializeAuth] Silent refresh succeeded - session restored");
        lastInitResult = true;
        isInitializing = false;
        
        // ✅ Fetch user profile after successful refresh
        const { fetchCandidateProfile } = useAuthStore.getState();
        fetchCandidateProfile().catch(() => {}); // Non-blocking
        
        return true;
      } else {
        console.debug("❌ [initializeAuth] No valid refresh token cookie - user not authenticated");
        // ⚠️ DON'T call clearAuth() - just mark as not initialized
        lastInitResult = false;
        isInitializing = false;
        return false;
      }
    } catch (error: any) {
      console.debug("❌ [initializeAuth] Refresh failed:", error?.message || "Unknown");
      lastInitResult = false;
      isInitializing = false;
      return false;
    }
  }
  
  // ✅ CASE 2: Access token exists - Validate expiration
  const expiresAt = parseInt(expiresAtStr, 10);
  const timeRemaining = expiresAt - Date.now();
  const isTokenExpired = timeRemaining <= 0;
  
  console.debug(`⏱️ [initializeAuth] Token status: ${isTokenExpired ? 'EXPIRED' : 'VALID'} (${timeRemaining}ms remaining)`);
  
  // If token is expired, try to refresh
  if (isTokenExpired) {
    console.debug("🔄 [initializeAuth] Token expired, attempting refresh");
    try {
      const newToken = await unifiedRefresh();
      if (newToken) {
        console.debug("✅ [initializeAuth] Expired token refreshed successfully");
        lastInitResult = true;
        isInitializing = false;
        
        // ✅ Fetch user profile after successful refresh
        const { fetchCandidateProfile } = useAuthStore.getState();
        fetchCandidateProfile().catch(() => {}); // Non-blocking
        
        return true;
      } else {
        console.debug("❌ [initializeAuth] Failed to refresh expired token");
        // Clear expired token
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
        lastInitResult = false;
        isInitializing = false;
        return false;
      }
    } catch (error: any) {
      console.debug("❌ [initializeAuth] Error refreshing expired token:", error?.message);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
      lastInitResult = false;
      isInitializing = false;
      return false;
    }
  }
  
  // ✅ CASE 3: Token is valid - Restore to store
  console.debug("✅ [initializeAuth] Valid token found, restoring session");
  
  // Decode JWT to extract user info
  const decoded = decodeJwt(accessToken);
  const roles = decoded ? extractRoles(decoded) : [];
  const role = roles[0] || null;
  const userInfo = decoded ? {
    id: decoded.sub || null,
    email: decoded.email || null,
    name: decoded.name || decoded.email || null,
    username: decoded.username || null
  } : null;
  
  // Restore to Zustand store
  useAuthStore.setState({
    accessToken,
    tokenExpiresAt: expiresAt,
    isAuthenticated: true,
    role,
    user: userInfo
  });
  
  // ✅ Fetch user profile (non-blocking)
  const { fetchCandidateProfile } = useAuthStore.getState();
  fetchCandidateProfile().catch(() => {});
  
  // ✅ If token expires soon (< 3 seconds), refresh proactively
  if (timeRemaining < 3000 && timeRemaining > 0) {
    console.debug("⚠️ [initializeAuth] Token expires soon, refreshing proactively");
    unifiedRefresh().catch(() => {}); // Don't wait, non-blocking
  }
  
  lastInitResult = true;
  isInitializing = false;
  return true;
};

// Helper to decode JWT
function decodeJwt(token: string): any | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function extractRoles(decoded: any): string[] {
  if (!decoded) return [];
  if (Array.isArray(decoded.roles)) return decoded.roles;
  if (Array.isArray(decoded.authorities)) return decoded.authorities;
  if (typeof decoded.scope === "string") return decoded.scope.split(" ");
  if (Array.isArray(decoded.scope)) return decoded.scope;
  return [];
}

// Track if we're currently refreshing to prevent multiple parallel refreshes
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

// Notify subscribers about new token
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Token refresh threshold in ms (3 seconds before expiry)
// For extremely short token lifetime (8s), we need to be more aggressive
const TOKEN_REFRESH_THRESHOLD = 3000;

// Check if token needs refresh
const shouldRefreshToken = () => {
  const { tokenExpiresAt } = useAuthStore.getState();
  if (!tokenExpiresAt) return false;
  
  // Debug token expiration
  const timeRemaining = tokenExpiresAt - Date.now();
  console.debug(`Token time remaining: ${timeRemaining}ms`);
  
  return timeRemaining <= TOKEN_REFRESH_THRESHOLD;
};

// ⚠️ DEPRECATED: Use unifiedRefresh() from refresh-manager.ts instead
// This function is kept for reference only
const _legacySafeRefreshToken = async (): Promise<string | null> => {
  try {
    // Use our specialized Next.js API route for token refresh
    const refreshAxios = axios.create({
      timeout: 5000,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    
    console.debug("🔄 Attempting token refresh through Next.js API endpoint");
    
    // Use our dedicated token refresh endpoint that handles redirects properly
    const response = await refreshAxios.post('/api/auth/token-refresh');
    
    if (response.data?.result?.accessToken) {
      const { accessToken, expiresIn } = response.data.result;
      // For extremely short-lived tokens (8s), add a small buffer
      const bufferTime = expiresIn <= 10 ? 500 : 0;
      const expiresAt = Date.now() + (expiresIn * 1000) - bufferTime;
      
      console.debug(`✅ Token refresh successful. Expires in ${expiresIn}s`);
      
      // Update auth store manually
      if (typeof window !== 'undefined') {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("token_expires_at", expiresAt.toString());
        
        // ✅ ALSO store in cookie for SSE EventSource
        setCookie('access_token', accessToken);
        
        console.debug("✅ [api interceptor] Token refreshed and stored in cookies for SSE");
      }
      
      useAuthStore.setState({
        accessToken,
        refreshToken: null, // Not storing refresh token in state (it's in httpOnly cookie)
        tokenExpiresAt: expiresAt,
        isAuthenticated: true
      });
      
      // ✅ Fetch user profile to get candidateId after successful refresh (non-blocking)
      console.debug("📝 Scheduling user profile fetch after token refresh...");
      const { fetchCandidateProfile } = useAuthStore.getState();
      fetchCandidateProfile().catch((profileError: any) => {
        console.debug("⚠️ Failed to fetch user profile:", profileError?.message || "Unknown error");
      });
      
      return accessToken;
    } else {
      console.debug("⚠️ Invalid response format from refresh endpoint");
      return null;
    }
  } catch (error: any) {
    // Better error handling - distinguish between different error types
    if (!error.response) {
      // Network error - might be offline or CORS issue
      console.debug("⚠️ Network error during token refresh:", error.message || "Unknown error");
      return null;
    } else if (error.response.status === 401 || error.response.status === 403) {
      // Refresh token is invalid/expired
      console.debug(`⚠️ Refresh token invalid (${error.response.status}): ${error.response.data?.message || 'Unauthorized'}`);
      return null;
    } else {
      // Other server error
      console.debug(`⚠️ Token refresh failed with status ${error.response.status}:`, error.response.data?.message || error.message);
      return null;
    }
  }
};

// ========================================
// ✅ FIXED: Request Interceptor - Auto-refresh before requests
// ========================================
api.interceptors.request.use(async (config) => {
  // Block OAuth redirect requests
  if (config.url?.includes('/oauth') || 
      config.url?.includes('oauth2') || 
      config.url?.includes('google.com')) {
    return Promise.reject(new Error("OAuth requests blocked"));
  }
  
  // Skip auth endpoints to prevent infinite loops
  if (config.url?.includes('/api/auth/token') || 
      config.url?.includes('/api/auth/refresh') ||
      config.url?.includes('/api/auth/login')) {
    return config;
  }

  const { accessToken, tokenExpiresAt } = useAuthStore.getState();

  // ✅ CASE 1: No access token - Try silent refresh BEFORE sending request
  if (!accessToken && typeof window !== 'undefined') {
    console.debug("🔄 [Interceptor] No access token, attempting silent refresh before request");
    
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await unifiedRefresh();
        if (newToken) {
          console.debug("✅ [Interceptor] Silent refresh succeeded");
          config.headers.Authorization = `Bearer ${newToken}`;
          isRefreshing = false;
          onTokenRefreshed(newToken);
          return config;
        } else {
          console.debug("⚠️ [Interceptor] No refresh token available");
        }
      } catch (error: any) {
        console.debug("❌ [Interceptor] Silent refresh failed:", error?.message);
      } finally {
        isRefreshing = false;
      }
    } else {
      // Wait for ongoing refresh
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          resolve(config);
        });
      });
    }
  }

  // ✅ CASE 2: Token exists but expires soon - Refresh proactively
  if (accessToken && tokenExpiresAt) {
    const timeRemaining = tokenExpiresAt - Date.now();
    console.debug(`⏱️ [Interceptor] Token expires in ${timeRemaining}ms`);
    
    // Refresh if token expires in < 3 seconds
    if (timeRemaining <= TOKEN_REFRESH_THRESHOLD && !isRefreshing) {
      console.debug("🔄 [Interceptor] Token expiring soon, refreshing proactively");
      isRefreshing = true;
      
      try {
        const newToken = await unifiedRefresh();
        if (newToken) {
          console.debug("✅ [Interceptor] Proactive refresh succeeded");
          config.headers.Authorization = `Bearer ${newToken}`;
          isRefreshing = false;
          onTokenRefreshed(newToken);
          return config;
        }
      } catch (error: any) {
        console.debug("⚠️ [Interceptor] Proactive refresh failed:", error?.message);
      } finally {
        isRefreshing = false;
      }
    }
  }

  // ✅ CASE 3: Wait if refresh is in progress
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        resolve(config);
      });
    });
  }

  // ✅ CASE 4: Add token if available
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log('🔑 [Interceptor] Token attached to request:', config.url);
  } else {
    console.warn('⚠️ [Interceptor] NO TOKEN for request:', config.url);
  }

  // Log final request config for debugging
  console.log('📤 [Interceptor] Final request config:', {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    hasAuth: !!config.headers.Authorization
  });

  return config;
});

// ========================================
// ✅ FIXED: Response Interceptor - Only logout on refresh token failure
// ========================================
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const { clearAuth } = useAuthStore.getState();
    
    // Log API errors
    if (error.response) {
      console.debug(`API Error: ${error.config?.url} - Status ${error.response.status}`);
    }

    // ✅ Handle 401 Unauthorized - Try refresh BEFORE failing
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.debug("🔴 [Interceptor] 401 detected, attempting token refresh");
      originalRequest._retry = true;

      // Skip refresh for auth endpoints
      const skipRefreshPaths = [
        '/api/auth/token', 
        '/api/auth/refresh', 
        '/api/auth/logout',
        '/api/auth/login',
        '/api/auth/register'
      ];
      
      const isAuthEndpoint = skipRefreshPaths.some(path => originalRequest.url?.includes(path));
      if (isAuthEndpoint) {
        console.debug("⚠️ [Interceptor] Auth endpoint returned 401, clearing state");
        clearAuth();
        return Promise.reject(error);
      }

      try {
        // If already refreshing, wait for it
        if (isRefreshing) {
          console.debug("🔄 [Interceptor] Refresh in progress, waiting...");
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh(token => {
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(api(originalRequest));
              } else {
                reject(error);
              }
            });
          });
        }

        isRefreshing = true;
        console.debug("🔄 [Interceptor] Starting token refresh after 401");
        
        const newToken = await unifiedRefresh();

        if (newToken) {
          console.debug("✅ [Interceptor] Refresh succeeded, retrying original request");
          onTokenRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          isRefreshing = false;
          return api(originalRequest);
        } else {
          // ⚠️ CRITICAL: Refresh failed - Clear auth ONLY if refresh token is invalid
          console.debug("❌ [Interceptor] Refresh token invalid or expired - logging out");
          onTokenRefreshed('');
          clearAuth();
          isRefreshing = false;
          return Promise.reject(error);
        }
      } catch (refreshError: any) {
        console.debug("❌ [Interceptor] Refresh error:", refreshError?.message);
        onTokenRefreshed('');
        isRefreshing = false;
        
        // Check error type
        const isNetworkError = !refreshError.response;
        const isRefreshTokenError = refreshError.response?.status === 401 || 
                                     refreshError.response?.status === 403;
        
        if (isNetworkError) {
          // Network error - DON'T logout (user might be offline)
          console.debug("⚠️ [Interceptor] Network error - NOT logging out");
          return Promise.reject(refreshError);
        } else if (isRefreshTokenError) {
          // Refresh token invalid - Logout
          console.debug("❌ [Interceptor] Refresh token invalid - logging out");
          clearAuth();
          return Promise.reject(refreshError);
        } else {
          // Other error - DON'T logout
          console.debug("⚠️ [Interceptor] Unexpected error - NOT logging out");
          return Promise.reject(refreshError);
        }
      }
    }

    // Handle other errors silently
    if (error.code === "ECONNABORTED") {
      console.debug("⏱️ Request timeout");
    } else if (!error.response) {
      console.debug("🌐 Network error");
    } else {
      // Suppress expected errors
      const isExpectedError = 
        (error.config?.url?.includes('/api/images/') && error.response?.status === 404) ||
        (error.config?.url?.includes('/api/auth/logout') && error.response?.status === 400) ||
        (error.config?.url?.includes('/ratings/my-rating') && error.response?.status === 404) ||
        (error.config?.url?.includes('/api/auth/refresh') && [400, 401].includes(error.response?.status));
      
      if (!isExpectedError) {
        console.debug(`API Error: ${error.config?.url} - ${error.response.status}`, error.response?.data);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
