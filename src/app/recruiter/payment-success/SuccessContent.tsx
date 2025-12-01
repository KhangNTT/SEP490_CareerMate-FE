"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FiCheckCircle, FiBriefcase, FiUsers, FiZap } from "react-icons/fi";
import confetti from "canvas-confetti";

export default function RecruiterPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageName = searchParams.get('package') || 'Premium';
  const serviceName = searchParams.get('service') || 'Package';

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center animate-pulse">
              <FiCheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thanh toán thành công!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Gói <span className="font-semibold text-green-600">{packageName}</span> đã được kích hoạt
          </p>
          <p className="text-gray-500 mb-8">
            {serviceName}
          </p>

          {/* Features Unlocked */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Các tính năng đã được mở khóa</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <FiBriefcase className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Đăng tin tuyển dụng</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <FiUsers className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Tìm kiếm ứng viên</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <FiZap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Boost tin tuyển dụng</p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Tiếp theo bạn có thể:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-0.5">✓</span>
                <span>Tài khoản của bạn đã được nâng cấp thành công</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-0.5">✓</span>
                <span>Tất cả các tính năng premium đều có thể sử dụng ngay</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-0.5">✓</span>
                <span>Hóa đơn đã được gửi đến email của bạn</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-0.5">✓</span>
                <span>Bắt đầu đăng tin tuyển dụng để tìm kiếm ứng viên phù hợp</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/recruiter/recruiter-feature/dashboard')}
              className="px-8 py-6 text-lg bg-green-600 hover:bg-green-700"
            >
              Về trang Dashboard
            </Button>
            <Button
              onClick={() => router.push('/recruiter/recruiter-feature/jobs')}
              variant="outline"
              className="px-8 py-6 text-lg border-green-600 text-green-600 hover:bg-green-50"
            >
              Đăng tin tuyển dụng
            </Button>
          </div>

          {/* Transaction Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Mã giao dịch: <span className="font-mono text-gray-700">{searchParams.get('transactionId') || 'N/A'}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Cần hỗ trợ?{' '}
              <a href="/recruiter/recruiter-feature/support" className="text-green-600 hover:underline">
                Liên hệ với chúng tôi
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
