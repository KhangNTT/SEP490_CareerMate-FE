import api from './api';

export interface UserPackageStatus {
  hasActivePackage: boolean;
  currentPackage?: string;
  expiryDate?: string;
  canPurchase: boolean;
}

export interface PackageStatusResponse {
  code: number;
  message?: string;
  result: UserPackageStatus;
}

/**
 * Check if user has an active package
 * GET /api/candidate-payment/status
 */
export const checkPackageStatus = async (): Promise<UserPackageStatus> => {
  try {
    console.log('📡 Checking package status...');
    
    const response = await api.get<PackageStatusResponse>(
      '/api/candidate-payment/status'
    );

    console.log('✅ Package status response:', response.data);

    if (response.data.code === 200 && response.data.result) {
      return response.data.result;
    }

    // Default: allow purchase if status check fails
    return {
      hasActivePackage: false,
      canPurchase: true
    };
  } catch (error: any) {
    console.error('❌ Error checking package status:', error);
    // Allow purchase if check fails
    return {
      hasActivePackage: false,
      canPurchase: true
    };
  }
};
