import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { safeLog, DEBUG } from './lib/debug-config';

// 🧩 Decode JWT safely
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

// 🧠 Extract roles
function extractRoles(token: string): string[] {
  try {
    const decoded = decodeJWT(token);

    let roles = [];
    if (decoded?.scope) {
      if (typeof decoded.scope === 'string') {
        roles = decoded.scope.split(' ');
      } else {
        roles = [decoded.scope];
      }
    } else {
      roles = decoded?.roles || [];
    }

    return roles;
  } catch (error) {
    safeLog.error('🔍 [MIDDLEWARE] Error extracting roles:', error);
    return [];
  }
}

// 🔑 Role helpers
function isAdmin(token: string): boolean {
  try {
    const roles = extractRoles(token);
    safeLog.middleware('🔍 [MIDDLEWARE] Extracted roles:', { roles });
    return ['ROLE_ADMIN', 'ADMIN'].some((r) => roles.includes(r));
  } catch (error) {
    safeLog.error('🔍 [MIDDLEWARE] Error in isAdmin check:', error);
    return false;
  }
}

function isRecruiter(token: string): boolean {
  try {
    const roles = extractRoles(token);
    return ['ROLE_RECRUITER', 'RECRUITER'].some((r) => roles.includes(r));
  } catch (error) {
    safeLog.error('🔍 [MIDDLEWARE] Error in isRecruiter check:', error);
    return false;
  }
}

function isCandidate(token: string): boolean {
  try {
    const roles = extractRoles(token);
    return ['ROLE_CANDIDATE', 'CANDIDATE'].some((r) => roles.includes(r));
  } catch (error) {
    safeLog.error('🔍 [MIDDLEWARE] Error in isCandidate check:', error);
    return false;
  }
}

// 🧱 Middleware
export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // Don't log on every request - only when needed
  // if (DEBUG.MIDDLEWARE) {
  //   safeLog.middleware('🔍 [MIDDLEWARE] Cookies check:', {
  //     hasCookies: request.cookies.size > 0,
  //     hasRefreshToken: !!refreshToken,
  //   });
  // }

  // 🧭 Auth pages - allow access to sign-in/sign-up even if user has token
  // This allows users to logout and sign in with different account
  // if (refreshToken) {
  //   try {
  //     const decoded = decodeJWT(refreshToken);
  //     const now = Math.floor(Date.now() / 1000);
  //     if (decoded && decoded.exp && decoded.exp > now) {
  //       if (
  //         request.nextUrl.pathname.startsWith('/sign-in') ||
  //         request.nextUrl.pathname.startsWith('/sign-up')
  //       ) {
  //         return NextResponse.redirect(new URL('/', request.url));
  //       }
  //     }
  //   } catch (error) {
  //     safeLog.error('Invalid refresh token in middleware:', error);
  //   }
  // }

  // 🧩 Common validation helper
  const validateToken = (token?: string) => {
    if (!token) return false;
    try {
      const decoded = decodeJWT(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded && decoded.exp && decoded.exp > now;
    } catch {
      return false;
    }
  };

  // 🔐 Admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    safeLog.middleware('🔍 [MIDDLEWARE] Admin route accessed:', {
      path: request.nextUrl.pathname,
    });

    if (!validateToken(refreshToken)) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (!isAdmin(refreshToken!)) {
      safeLog.middleware('❌ [MIDDLEWARE] Not an admin', {
        path: request.nextUrl.pathname,
      });
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (DEBUG.MIDDLEWARE) {
      safeLog.middleware('✅ [MIDDLEWARE] Admin access granted', {});
    }
  }

  // 👔 Recruiter routes
  if (request.nextUrl.pathname.startsWith('/recruiter')) {
    safeLog.middleware('🔍 [MIDDLEWARE] Recruiter route accessed:', {
      path: request.nextUrl.pathname,
    });

    if (!validateToken(refreshToken)) {
      return NextResponse.redirect(
        new URL(
          '/sign-in?redirect=' +
            encodeURIComponent(request.nextUrl.pathname),
          request.url
        )
      );
    }

    // 🚫 Explicitly reject non-recruiter roles
    if (isAdmin(refreshToken!) || isCandidate(refreshToken!)) {
      safeLog.middleware('❌ [MIDDLEWARE] Wrong role accessing recruiter route', {
        path: request.nextUrl.pathname,
        isAdmin: isAdmin(refreshToken!),
        isCandidate: isCandidate(refreshToken!),
      });
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (!isRecruiter(refreshToken!)) {
      safeLog.middleware('❌ [MIDDLEWARE] Not a recruiter', {
        path: request.nextUrl.pathname,
      });
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (DEBUG.MIDDLEWARE) {
      safeLog.middleware('✅ [MIDDLEWARE] Recruiter access granted', {});
    }
  }

  // 👩‍💼 Candidate routes
  if (request.nextUrl.pathname.startsWith('/candidate')) {
    // ✨ Allow unauthenticated access to print pages (for PDF export)
    if (request.nextUrl.pathname.startsWith('/candidate/cv/print/')) {
      safeLog.middleware('✅ [MIDDLEWARE] Print page - allowing unauthenticated access', {
        path: request.nextUrl.pathname,
      });
      return NextResponse.next();
    }

    safeLog.middleware('🔍 [MIDDLEWARE] Candidate route accessed:', {
      path: request.nextUrl.pathname,
    });

    if (!validateToken(refreshToken)) {
      return NextResponse.redirect(
        new URL(
          '/sign-in?redirect=' +
            encodeURIComponent(request.nextUrl.pathname),
          request.url
        )
      );
    }

    // 🚫 Explicitly reject non-candidate roles
    if (isAdmin(refreshToken!) || isRecruiter(refreshToken!)) {
      safeLog.middleware('❌ [MIDDLEWARE] Wrong role accessing candidate route', {
        path: request.nextUrl.pathname,
        isAdmin: isAdmin(refreshToken!),
        isRecruiter: isRecruiter(refreshToken!),
      });
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (!isCandidate(refreshToken!)) {
      safeLog.middleware('❌ [MIDDLEWARE] Not a candidate', {
        path: request.nextUrl.pathname,
      });
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (DEBUG.MIDDLEWARE) {
      safeLog.middleware('✅ [MIDDLEWARE] Candidate access granted', {});
    }
  }

  return NextResponse.next();
}

// 🧭 Config matcher
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/admin/:path*',
    '/candidate/:path*',
    '/recruiter/:path*',
    '/recruiter2/:path*',
  ],
};
