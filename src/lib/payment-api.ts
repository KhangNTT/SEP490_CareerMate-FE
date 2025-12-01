import api from './api';

// Package types
export type PackageName = 'FREE' | 'PLUS' | 'PREMIUM';

export interface Entitlement {
  name: string;
  code: string;
  unit: string | null;
  hasLimit: boolean;
  enabled: boolean;
  limitValue: number;
}

export interface Package {
  name: PackageName;
  price: number;
  durationDays: number;
  entitlements: Entitlement[];
  recommended?: boolean;
}

export interface PaymentUrlResponse {
  code: number;
  message?: string;
  result: string; // Can be direct URL or "redirect:URL"
}

/**
 * Fetch packages from backend
 * GET /api/package/candidate
 */
export const fetchPackages = async (): Promise<Package[]> => {
  try {
    const response = await api.get<{ code: number; message: string; result: Package[] }>(
      '/api/package/candidate'
    );
    
    if (response.data.code === 200) {
      // Mark PREMIUM as recommended
      return response.data.result.map(pkg => ({
        ...pkg,
        recommended: pkg.name === 'PREMIUM'
      }));
    }
    
    throw new Error(response.data.message || 'Failed to fetch packages');
  } catch (error) {
    console.error('❌ Error fetching packages:', error);
    throw error;
  }
};

/**
 * Helper function to format features from entitlements
 */
export const formatPackageFeatures = (entitlements: Entitlement[]): string[] => {
  return entitlements
    .filter(e => e.enabled)
    .map(e => {
      if (e.hasLimit && e.limitValue > 0) {
        return `${e.name}: ${e.limitValue} ${e.unit || ''}`;
      }
      return e.name;
    });
};

/**
 * Get duration text from days
 */
export const formatDuration = (days: number): string => {
  if (days === 0) return 'Forever';
  if (days === 30) return '1 month';
  if (days === 365) return '1 year';
  return `${days} days`;
};

/**
 * Create payment URL for package purchase
 * POST /api/candidate-payment?packageName={packageName}
 */
export const createPaymentUrl = async (packageName: PackageName): Promise<string> => {
  try {
    console.log('📡 Creating payment URL for package:', packageName);
    
    // Convert to proper case for backend (e.g., PREMIUM -> Premium)
    const formattedPackageName = packageName.charAt(0).toUpperCase() + packageName.slice(1).toLowerCase();
    
    const response = await api.post<PaymentUrlResponse>(
      `/api/candidate-payment?packageName=${formattedPackageName}`
    );

    console.log('✅ Payment URL response:', response.data);

    if (response.data.code === 200 && response.data.result) {
      let url = response.data.result;
      
      // Handle "redirect:URL" format
      if (url.startsWith('redirect:')) {
        url = url.substring('redirect:'.length);
      }
      
      return url;
    }

    // Handle code 2004: Already have active package
    if (response.data.code === 2004) {
      throw new Error('ACTIVE_PACKAGE_EXISTS');
    }

    throw new Error(response.data.message || 'Failed to create payment URL');
  } catch (error: any) {
    console.error('❌ Error creating payment URL:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    // Check if backend returned code 2004
    if (error.response?.data?.code === 2004) {
      const customError = new Error('ACTIVE_PACKAGE_EXISTS');
      (customError as any).response = error.response;
      throw customError;
    }
    
    throw error;
  }
};

/**
 * Get package by name
 */
export const getPackage = (packages: Package[], name: PackageName): Package | undefined => {
  return packages.find(pkg => pkg.name === name);
};

/**
 * Format price in VND
 */
export const formatPrice = (price: number): string => {
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};
