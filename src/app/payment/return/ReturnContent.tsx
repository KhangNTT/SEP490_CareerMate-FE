"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get VNPay response parameters
    const responseCode = searchParams.get('vnp_ResponseCode');
    const transactionStatus = searchParams.get('vnp_TransactionStatus');
    const orderInfo = searchParams.get('vnp_OrderInfo');
    const serverStatus = searchParams.get('serverStatus');
    
    // Extract package name from orderInfo (format: "packageName=PLUS&email=...")
    let packageName = 'PREMIUM';
    if (orderInfo) {
      const match = orderInfo.match(/packageName=([^&]+)/);
      if (match) {
        packageName = match[1];
      }
    }

    console.log('🔄 Payment return params:', {
      responseCode,
      transactionStatus,
      serverStatus,
      packageName
    });

    // Process payment result
    setTimeout(() => {
      // Check multiple success indicators
      const isSuccess = 
        responseCode === '00' || 
        transactionStatus === '00' || 
        serverStatus === 'SUCCESS';

      if (isSuccess) {
        // Success: redirect to success page
        console.log('✅ Payment successful, redirecting to success page');
        router.push(`/payment/success?package=${packageName}`);
      } else {
        // Failed: redirect to failure page
        const errorMessage = getErrorMessage(responseCode || transactionStatus || '');
        console.log('❌ Payment failed, redirecting to failure page');
        router.push(`/payment/failure?package=${packageName}&message=${encodeURIComponent(errorMessage)}`);
      }
    }, 1000); // Small delay for better UX
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <svg
            className="animate-spin h-16 w-16 text-blue-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Processing Payment Result
        </h2>
        <p className="text-gray-600">
          Please wait while we verify your payment...
        </p>
      </div>
    </div>
  );
}

/**
 * Get user-friendly error message based on VNPay response code
 */
function getErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    '07': 'Transaction suspected of fraud',
    '09': 'Card has not been registered for Internet Banking',
    '10': 'Invalid card verification (3 times)',
    '11': 'Payment timeout',
    '12': 'Card is locked',
    '13': 'Invalid OTP',
    '24': 'Transaction cancelled',
    '51': 'Insufficient account balance',
    '65': 'Daily transaction limit exceeded',
    '75': 'Payment bank is under maintenance',
    '79': 'Payment timeout',
  };

  return errorMessages[code] || 'Payment was cancelled or failed';
}
