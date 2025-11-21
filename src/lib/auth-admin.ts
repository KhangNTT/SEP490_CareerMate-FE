import { useAuthStore } from '@/store/use-auth-store';
import { useEffect, useState } from 'react';

export const ADMIN_ROLES = ['ROLE_ADMIN', 'ADMIN'];

export const useAdminCheck = () => {
    const { accessToken, isAuthenticated } = useAuthStore();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAdminStatus = () => {
            // Check localStorage first (immediate, doesn't wait for store hydration)
            const storedToken = typeof window !== 'undefined' 
                ? localStorage.getItem('access_token') 
                : null;
            
            // Use stored token if available, otherwise wait for store
            const tokenToCheck = accessToken || storedToken;
            
            if (!tokenToCheck) {
                // No token anywhere - definitely not authenticated
                console.log('🔍 [AdminAuthGuard] No token found:', {
                    hasStoreToken: !!accessToken,
                    hasStoredToken: !!storedToken,
                    isAuthenticated
                });
                setIsAdmin(false);
                setIsChecking(false);
                return;
            }

            try {
                const decoded = decodeJWT(tokenToCheck);
                console.log('🔍 [AdminAuthGuard] Decoded token:', decoded);
                
                // Check scope field first (which contains roles like "ROLE_ADMIN" or "ROLE_ADMIN PERMISSION1 PERMISSION2")
                if (decoded?.scope) {
                    console.log('🔍 [AdminAuthGuard] Token scope (raw):', decoded.scope);
                    
                    // Handle both single role and space-separated roles
                    const scopeParts = typeof decoded.scope === 'string' 
                        ? decoded.scope.split(' ') 
                        : [decoded.scope];
                        
                    console.log('🔍 [AdminAuthGuard] Token scope parts:', scopeParts);
                    
                    const hasAdminRole = ADMIN_ROLES.some(role => scopeParts.includes(role));
                    console.log('🔍 [AdminAuthGuard] Has admin role from scope:', hasAdminRole);
                    
                    if (hasAdminRole) {
                        setIsAdmin(true);
                        setIsChecking(false);
                        return;
                    }
                }
                
                // Check direct scope match (in case scope is just "ROLE_ADMIN")
                if (decoded?.scope && ADMIN_ROLES.includes(decoded.scope)) {
                    console.log('🔍 [AdminAuthGuard] Direct scope match for admin:', decoded.scope);
                    setIsAdmin(true);
                    setIsChecking(false);
                    return;
                }
                
                // Fallback to roles field
                const roles = decoded?.roles || [];
                console.log('🔍 [AdminAuthGuard] Token roles field:', roles);
                const hasAdminFromRoles = ADMIN_ROLES.some(role => roles.includes(role));
                console.log('🔍 [AdminAuthGuard] Has admin role from roles field:', hasAdminFromRoles);
                
                setIsAdmin(hasAdminFromRoles);
                setIsChecking(false);
            } catch (error) {
                console.error('🔍 [AdminAuthGuard] Error checking admin role:', error);
                setIsAdmin(false);
                setIsChecking(false);
            }
        };

        checkAdminStatus();
    }, [accessToken, isAuthenticated]); // Re-run when token or auth state changes

    return {
        isAuthenticated,
        isAdmin,
        isChecking,
        accessToken: !!accessToken
    };
};

export const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
};

export const requireAdmin = () => {
    const check = useAdminCheck();
    if (!check.isAuthenticated || !check.isAdmin) {
        throw new Error('Admin access required');
    }
    return check;
};
