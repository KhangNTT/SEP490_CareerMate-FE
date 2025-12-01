import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get all query parameters from the VNPay callback
  const searchParams = request.nextUrl.searchParams;
  
  const responseCode = searchParams.get('vnp_ResponseCode');
  const transactionStatus = searchParams.get('vnp_TransactionStatus');
  const orderInfo = searchParams.get('vnp_OrderInfo');
  const txnRef = searchParams.get('vnp_TxnRef');
  const amount = searchParams.get('vnp_Amount');
  
  // Extract package name from orderInfo
  let packageName = 'PREMIUM';
  if (orderInfo) {
    const match = orderInfo.match(/packageName=([^&]+)/);
    if (match) {
      packageName = match[1];
    }
  }

  console.log('🔄 Payment return proxy - Response Code:', responseCode);
  console.log('🔄 Package:', packageName);
  console.log('🔄 Transaction Ref:', txnRef);

  // Check if payment was successful
  const isSuccess = responseCode === '00' || transactionStatus === '00';

  if (isSuccess) {
    try {
      // Call backend to activate package
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const activateResponse = await fetch(`${backendUrl}/api/candidate-payment/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageName,
          transactionRef: txnRef,
          amount: amount ? parseInt(amount) / 100 : 0, // VNPay amount is in VND * 100
          paymentStatus: 'SUCCESS'
        })
      });

      if (!activateResponse.ok) {
        console.error('❌ Failed to activate package:', await activateResponse.text());
      } else {
        console.log('✅ Package activated successfully');
      }
    } catch (error) {
      console.error('❌ Error activating package:', error);
    }

    // Redirect to success page
    const successUrl = new URL(`/payment/success`, request.nextUrl.origin);
    successUrl.searchParams.set('package', packageName);
    
    return NextResponse.redirect(successUrl);
  } else {
    // Redirect to failure page
    const failureUrl = new URL(`/payment/failure`, request.nextUrl.origin);
    failureUrl.searchParams.set('package', packageName);
    failureUrl.searchParams.set('message', getErrorMessage(responseCode || ''));
    
    return NextResponse.redirect(failureUrl);
  }
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
