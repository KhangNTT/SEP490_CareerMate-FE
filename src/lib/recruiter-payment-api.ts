import api from './api';

// Package types for Recruiter
export type RecruiterPackageName = 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';

export interface RecruiterEntitlement {
  name: string;
  code: string;
  unit: string;
  hasLimit: boolean;
  enabled: boolean;
  limitValue: number;
}

export interface RecruiterPackage {
  name: RecruiterPackageName;
  price: number;
  durationDays: number;
  entitlements: RecruiterEntitlement[];
  recommended?: boolean;
}

export interface RecruiterPaymentUrlResponse {
  code: number;
  message?: string;
  result: string;
}

/**
 * Fetch recruiter packages from backend
 * GET /api/package/recruiter
 */
export const fetchRecruiterPackages = async (): Promise<RecruiterPackage[]> => {
  try {
    const response = await api.get<{ code: number; message: string; result: RecruiterPackage[] }>(
      '/api/package/recruiter'
    );
    
    if (response.data.code === 200) {
      // Mark PROFESSIONAL as recommended
      return response.data.result.map(pkg => ({
        ...pkg,
        recommended: pkg.name === 'PROFESSIONAL'
      }));
    }
    
    throw new Error(response.data.message || 'Failed to fetch recruiter packages');
  } catch (error) {
    console.error('❌ Error fetching recruiter packages:', error);
    throw error;
  }
};

/**
 * Helper function to format features from entitlements
 */
export const formatRecruiterPackageFeatures = (entitlements: RecruiterEntitlement[]): string[] => {
  return entitlements
    .filter(e => e.enabled)
    .map(e => {
      if (e.hasLimit && e.limitValue > 0) {
        return `${e.name}: ${e.limitValue} ${e.unit}`;
      } else if (!e.hasLimit || e.limitValue === 0) {
        return `${e.name}: Unlimited`;
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
 * Get package by name
 */
export const getRecruiterPackage = (
  packages: RecruiterPackage[], 
  name: RecruiterPackageName
): RecruiterPackage | undefined => {
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

/**
 * Create payment URL for recruiter package purchase
 * POST /api/recruiter-payment?packageName={packageName}
 */
export const createRecruiterPaymentUrl = async (packageName: RecruiterPackageName): Promise<string> => {
  try {
    console.log('📡 Creating payment URL for recruiter package:', packageName);
    
    const response = await api.post<RecruiterPaymentUrlResponse>(
      `/api/recruiter-payment?packageName=${packageName}`
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
    console.error('❌ Error creating recruiter payment URL:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    if (error.response?.data?.code === 2004) {
      const customError = new Error('ACTIVE_PACKAGE_EXISTS');
      (customError as any).response = error.response;
      throw customError;
    }
    
    throw error;
  }
};
