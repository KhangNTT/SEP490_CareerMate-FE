"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PendingApprovalConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 8000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-50 p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-10">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-sky-100 flex items-center justify-center">
            <svg
              className="h-10 w-10 text-sky-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Thông tin đã được gửi thành công!
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6 text-lg">
            Cảm ơn bạn đã cập nhật thông tin doanh nghiệp. Yêu cầu của bạn đang được xem xét.
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-start">
              <svg
                className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Các bước tiếp theo:
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>
                      Đội ngũ của chúng tôi sẽ xem xét thông tin của bạn trong vòng
                      <strong> 24-48 giờ</strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>
                      Bạn sẽ nhận được email thông báo kết quả phê duyệt
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>
                      Sau khi được phê duyệt, bạn có thể đăng nhập và sử dụng đầy đủ
                      các tính năng
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Cần hỗ trợ? Liên hệ với chúng tôi qua email:
              <a
                href="mailto:support@careermate.example"
                className="text-sky-600 font-medium hover:underline ml-1"
              >
                support@careermate.example
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors shadow-sm"
            >
              Về trang chủ
            </button>
            <button
              onClick={() => router.push("/auth/signin")}
              className="px-8 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              Đăng nhập
            </button>
          </div>

          {/* Auto redirect notice */}
          <p className="text-xs text-gray-500 mt-6">
            Tự động chuyển về trang chủ sau 8 giây...
          </p>
        </div>
      </div>
    </div>
  );
}
