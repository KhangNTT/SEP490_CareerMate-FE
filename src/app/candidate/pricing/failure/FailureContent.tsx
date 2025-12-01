"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FiXCircle, FiRefreshCw } from "react-icons/fi";

export default function PaymentFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageName = searchParams.get('package') || 'PREMIUM';
  const errorMessage = searchParams.get('message') || 'Payment was cancelled or failed';

  const handleTryAgain = () => {
    router.push(`/candidate/pricing/confirm?package=${packageName}`);
  };

  const handleBackToPlans = () => {
    router.push('/candidate/pricing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <FiXCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {errorMessage}
          </p>

          {/* Details */}
          <div className="bg-red-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">What happened?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-600 mr-3">•</span>
                The payment transaction was not completed
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3">•</span>
                Your account has not been charged
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3">•</span>
                No changes were made to your subscription
              </li>
            </ul>
          </div>

          {/* Common Reasons */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Common reasons for payment failure:</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Insufficient funds in your account</li>
              <li>• Incorrect card details</li>
              <li>• Card expired or blocked</li>
              <li>• Payment gateway timeout</li>
              <li>• Transaction cancelled by user</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-6">
            <Button
              onClick={handleTryAgain}
              className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <FiRefreshCw className="w-5 h-5" />
              Try Again
            </Button>
            <Button
              onClick={handleBackToPlans}
              variant="outline"
              className="px-8 py-6 text-lg"
            >
              Back to Plans
            </Button>
          </div>

          {/* Support Link */}
          <p className="text-sm text-gray-500">
            Still having issues?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Contact Support
            </a>
            {' '}for assistance
          </p>
        </div>
      </div>
    </div>
  );
}
