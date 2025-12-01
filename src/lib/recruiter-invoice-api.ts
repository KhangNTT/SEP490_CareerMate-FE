import api from './api';

export interface RecruiterInvoice {
  startDate: string;      // "2025-11-25"
  endDate: string;        // "2025-12-25"
  packageName: string;    // "ENTERPRISE"
  amount: number;         // 299000
}

export interface RecruiterInvoiceResponse {
  code: number;
  message: string;
  result: RecruiterInvoice;
}

/**
 * Get recruiter's invoice/transaction history
 * GET /api/recruiter-invoice/my-invoice
 */
export const getRecruiterInvoice = async (): Promise<RecruiterInvoice> => {
  try {
    const response = await api.get<RecruiterInvoiceResponse>('/api/recruiter-invoice/my-invoice');
    
    if (response.data.code === 200) {
      return response.data.result;
    }
    
    throw new Error(response.data.message || 'Failed to fetch recruiter invoice');
  } catch (error: any) {
    console.error('❌ Error fetching recruiter invoice:', error);
    
    // If 404 or no invoice found, return null or throw
    if (error.response?.status === 404) {
      throw new Error('NO_INVOICE_FOUND');
    }
    
    throw error;
  }
};

/**
 * Format date from YYYY-MM-DD to readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Format date to relative time (e.g., "2 hours ago", "1 day ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
};

/**
 * Format price in VND
 */
export const formatInvoicePrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};
