import api from './api';

export interface Invoice {
  startDate: string;      // "2025-11-24"
  endDate: string;        // "2025-12-24"
  packageName: string;    // "PREMIUM"
  amount: number;         // 199000
}

export interface InvoiceResponse {
  code: number;
  message: string;
  result: Invoice;
}

/**
 * Get user's invoice/transaction history
 * GET /api/candidate-invoice/my-invoice
 * 
 * Returns null if user has no invoice (404)
 */
export const getMyInvoice = async (): Promise<Invoice | null> => {
  try {
    const response = await api.get<InvoiceResponse>('/api/candidate-invoice/my-invoice');
    
    if (response.data.code === 200) {
      return response.data.result;
    }
    
    // If not success code, return null
    return null;
  } catch (error: any) {
    // 404 means no invoice found - this is expected for new users
    if (error.response?.status === 404) {
      console.log('ℹ️ No invoice found for user (404) - this is normal for new users');
      return null;
    }
    
    // Log other errors but don't crash
    console.error('❌ Error fetching invoice:', error.response?.data?.message || error.message);
    return null;
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
 * Format price in VND
 */
export const formatInvoicePrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};
