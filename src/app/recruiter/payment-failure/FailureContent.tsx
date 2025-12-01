"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FiXCircle, FiRefreshCw, FiArrowLeft, FiAlertTriangle, FiHelpCircle } from "react-icons/fi";

export default function RecruiterPaymentFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('error') || 'Đã xảy ra lỗi trong quá trình thanh toán';
  const errorCode = searchParams.get('code') || '';
  const packageName = searchParams.get('package') || '';

  const handleRetry = () => {
    // Navigate back to pricing/services page to retry
    router.push('/recruiter/recruiter-feature/services');
  };

  const handleGoBack = () => {
    router.push('/recruiter/recruiter-feature/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
              <FiXCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thanh toán thất bại
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Rất tiếc, giao dịch của bạn không thể hoàn thành
          </p>
          {packageName && (
            <p className="text-gray-500 mb-4">
              Gói: <span className="font-medium">{packageName}</span>
            </p>
          )}
          
          {/* Error Details */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-left">
            <div className="flex items-start">
              <FiAlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Chi tiết lỗi:</p>
                <p className="text-red-600 mt-1">{errorMessage}</p>
                {errorCode && (
                  <p className="text-red-500 text-sm mt-1">Mã lỗi: {errorCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* What Happened */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <FiHelpCircle className="w-5 h-5 mr-2 text-gray-600" />
              Nguyên nhân có thể xảy ra
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>Thẻ hoặc tài khoản không đủ số dư</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>Thông tin thẻ không chính xác</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>Kết nối mạng bị gián đoạn trong quá trình thanh toán</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>Giao dịch bị từ chối bởi ngân hàng</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>Phiên thanh toán đã hết hạn</span>
              </li>
            </ul>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left">
            <h4 className="font-medium text-blue-800 mb-2">💡 Gợi ý:</h4>
            <p className="text-blue-700 text-sm">
              Bạn có thể thử lại với phương thức thanh toán khác hoặc liên hệ ngân hàng để được hỗ trợ. 
              Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ đội ngũ hỗ trợ của chúng tôi.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleRetry}
              className="px-8 py-6 text-lg bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="w-5 h-5" />
              Thử lại
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="px-8 py-6 text-lg border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <FiArrowLeft className="w-5 h-5" />
              Về Dashboard
            </Button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Bạn không bị trừ tiền cho giao dịch thất bại này.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Cần hỗ trợ?{' '}
              <a href="/recruiter/recruiter-feature/support" className="text-red-600 hover:underline">
                Liên hệ với chúng tôi
              </a>
              {' '}hoặc gọi hotline: <span className="font-medium">1900-xxxx</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
