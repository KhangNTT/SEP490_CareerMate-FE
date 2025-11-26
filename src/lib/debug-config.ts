/**
 * Security-aware debug configuration
 * 
 * ⚠️ IMPORTANT: Never log sensitive data in production!
 * - Tokens (JWT, access token, refresh token)
 * - User credentials (email, password)
 * - Personal information (name, phone, address)
 * - Decoded JWT payloads
 */

// Check if we're in development mode
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';

// Debug flags - only enable in development
export const DEBUG = {
  // Authentication flow
  AUTH: IS_DEV,
  LOGIN: IS_DEV,
  LOGOUT: IS_DEV,
  
  // Token management (CAREFUL: never log actual token values)
  TOKEN: IS_DEV,
  
  // Middleware
  MIDDLEWARE: IS_DEV,
  
  // State management
  STORE: IS_DEV,
  SYNC: IS_DEV,
  
  // Admin checks
  ADMIN_GUARD: IS_DEV,
  
  // Security
  SECURITY: true, // Always enable security logs
} as const;

/**
 * Safe logging helpers - automatically redact sensitive data
 */
export const safeLog = {
  /**
   * Log auth state without exposing tokens
   */
  authState: (label: string, state: any) => {
    if (!DEBUG.AUTH) return;
    
    console.log(label, {
      isAuthenticated: state.isAuthenticated,
      hasToken: !!state.accessToken,
      tokenLength: state.accessToken?.length || 0,
      role: state.role,
      // NEVER log: accessToken, refreshToken, user email
    });
  },
  
  /**
   * Log token info without exposing the actual token
   */
  token: (label: string, token: string | null) => {
    if (!DEBUG.TOKEN) return;
    
    if (!token) {
      console.log(label, 'No token');
      return;
    }
    
    console.log(label, {
      length: token.length,
      prefix: token.substring(0, 10) + '...',
      // NEVER log: full token value
    });
  },
  
  /**
   * Log JWT claims without exposing sensitive data
   */
  jwtClaims: (label: string, decoded: any) => {
    if (!DEBUG.TOKEN) return;
    
    console.log(label, {
      hasEmail: !!decoded?.sub,
      role: decoded?.scope || decoded?.roles,
      exp: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null,
      // NEVER log: sub (email), full decoded object
    });
  },
  
  /**
   * Log middleware action
   */
  middleware: (label: string, data: any) => {
    if (!DEBUG.MIDDLEWARE) return;
    console.log(label, data);
  },
  
  /**
   * Log security events (always enabled)
   */
  security: (label: string, data: any) => {
    if (!DEBUG.SECURITY) return;
    console.warn(`[SECURITY] ${label}`, data);
  },
  
  /**
   * Log error without exposing sensitive data
   */
  error: (label: string, error: any) => {
    console.error(label, {
      message: error?.message || String(error),
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      type: typeof error,
    });
  },
};

/**
 * Redact sensitive data from objects before logging
 */
export function redactSensitive(obj: any): any {
  if (!obj) return obj;
  
  const sensitive = ['accessToken', 'refreshToken', 'password', 'email', 'sub', 'token'];
  const redacted: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (sensitive.some(s => key.toLowerCase().includes(s.toLowerCase()))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitive(value);
    } else {
      redacted[key] = value;
    }
  }
  
  return redacted;
}

/**
 * Production-safe console wrapper
 * Automatically strips sensitive data in production
 */
export const secureConsole = {
  log: (...args: any[]) => {
    if (IS_PROD) return; // No logs in production
    console.log(...args.map(redactSensitive));
  },
  
  warn: (...args: any[]) => {
    console.warn(...args.map(redactSensitive));
  },
  
  error: (...args: any[]) => {
    console.error(...args.map(redactSensitive));
  },
};
