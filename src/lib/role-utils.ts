/**
 * Role Utility Functions
 * Helper functions để decode và check roles từ JWT
 */

import { USER_ROLES, isRoleInCategory, normalizeRole, getRoleCategory as _getRoleCategory, type RoleType, type RoleCategory } from '@/types/roles';

// Re-export types
export type { RoleType, RoleCategory } from '@/types/roles';
export { getRoleCategory } from '@/types/roles';

/**
 * Decode role from JWT token
 */
export function getRoleFromToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Extract role from scope field (string or array)
    if (payload.scope) {
      if (typeof payload.scope === 'string') {
        const roles = payload.scope.split(' ');
        return roles[0] || null;
      }
      return payload.scope;
    }
    
    // Extract from roles array
    if (Array.isArray(payload.roles) && payload.roles.length > 0) {
      return payload.roles[0];
    }
    
    return null;
  } catch (error) {
    console.error('Failed to decode role from token:', error);
    return null;
  }
}

/**
 * Check if user is admin
 */
export function isAdmin(role: string | null | undefined): boolean {
  return isRoleInCategory(role, 'ADMIN');
}

/**
 * Check if user is recruiter
 */
export function isRecruiter(role: string | null | undefined): boolean {
  return isRoleInCategory(role, 'RECRUITER');
}

/**
 * Check if user is candidate
 */
export function isCandidate(role: string | null | undefined): boolean {
  return isRoleInCategory(role, 'CANDIDATE');
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(userRole: string | null | undefined, allowedRoles: RoleCategory[]): boolean {
  if (!userRole) return false;
  
  return allowedRoles.some(category => isRoleInCategory(userRole, category));
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: string | null | undefined): string {
  const category = _getRoleCategory(role);
  
  switch (category) {
    case 'ADMIN':
      return 'Quản trị viên';
    case 'RECRUITER':
      return 'Nhà tuyển dụng';
    case 'CANDIDATE':
      return 'Ứng viên';
    default:
      return 'Người dùng';
  }
}

/**
 * Get default redirect path after login based on role
 */
export function getDefaultRedirectPath(role: string | null | undefined): string {
  const category = _getRoleCategory(role);
  
  switch (category) {
    case 'ADMIN':
      return '/admin';
    case 'RECRUITER':
      return '/recruiter';
    case 'CANDIDATE':
      return '/candidate';
    default:
      return '/';
  }
}

/**
 * Check if user can access admin panel
 */
export function canAccessAdmin(role: string | null | undefined): boolean {
  return isAdmin(role);
}

/**
 * Check if user can access recruiter panel
 */
export function canAccessRecruiter(role: string | null | undefined): boolean {
  return isAdmin(role) || isRecruiter(role);
}

/**
 * Check if user can access candidate features
 */
export function canAccessCandidate(role: string | null | undefined): boolean {
  // All authenticated users can access candidate features
  return !!role;
}
