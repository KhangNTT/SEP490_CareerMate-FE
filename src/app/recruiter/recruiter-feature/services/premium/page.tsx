// export default function PremiumFeaturesPage() {
//     return (
//         <>
//             <header className="mb-6 flex items-center justify-between">
//                 <h1 className="text-xl font-semibold text-sky-800">Premium Features</h1>
//             </header>
//             <div className="rounded-lg border bg-white p-6 shadow-sm">
//                 <p className="text-gray-600">Premium features will be implemented here.</p>
//             </div>
//         </>
//     );
// }


"use client";

import { CheckCircle, Zap, TrendingUp, Cpu, Users } from 'lucide-react';

// Dữ liệu cho các tính năng Premium
const premiumFeatures = [
  {
    icon: Zap,
    title: "Tuyển Dụng Tối Ưu Tốc Độ",
    description: "Tăng 50% khả năng hiển thị của tin tuyển dụng, đưa tin của bạn lên vị trí nổi bật và tiếp cận ứng viên tiềm năng nhanh hơn gấp đôi.",
    benefits: [
      "Ưu tiên hiển thị tin tuyển dụng",
      "Gắn thẻ 'Tuyển dụng Gấp' nổi bật",
      "Email thông báo độc quyền tới ứng viên phù hợp",
    ],
    color: "text-amber-500",
  },
  {
    icon: TrendingUp,
    title: "Phân Tích Chuyên Sâu & Hiệu Suất",
    description: "Cung cấp bảng điều khiển (dashboard) với số liệu chi tiết về lượt xem, tỉ lệ nhấp chuột (CTR), và nguồn ứng viên, giúp tối ưu hóa chiến lược tuyển dụng.",
    benefits: [
      "Dashboard thống kê thời gian thực",
      "So sánh hiệu suất giữa các tin tuyển dụng",
      "Báo cáo chi tiết về hành vi ứng viên",
    ],
    color: "text-green-500",
  },
  {
    icon: Cpu,
    title: "AI Kết Nối Thông Minh",
    description: "Sử dụng trí tuệ nhân tạo để tự động quét, xếp hạng, và gợi ý các ứng viên phù hợp nhất với mô tả công việc của bạn, tiết kiệm hàng giờ sàng lọc.",
    benefits: [
      "Bộ lọc nâng cao với tiêu chí chuyên sâu",
      "Công cụ chấm điểm mức độ phù hợp của ứng viên (Match Score)",
      "Đề xuất ứng viên 'ngủ đông' (Passive Candidates)",
    ],
    color: "text-blue-500",
  },
  {
    icon: Users,
    title: "Hỗ Trợ Ưu Tiên Tuyệt Đối",
    description: "Nhận được sự hỗ trợ cá nhân hóa 24/7 từ Quản lý tài khoản chuyên trách, đảm bảo mọi vấn đề kỹ thuật và chiến lược của bạn được giải quyết tức thì.",
    benefits: [
      "Hỗ trợ qua điện thoại và trò chuyện trực tuyến 24/7",
      "Tư vấn tối ưu hóa tin đăng tuyển dụng",
      "Tham gia webinar và tài liệu đào tạo độc quyền",
    ],
    color: "text-red-500",
  },
];

export default function PremiumFeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header - Banner */}
      <header className="mb-8 p-6 bg-sky-700 rounded-xl shadow-lg text-white">
        <div className="flex items-center mb-2">
          <Zap className="w-8 h-8 mr-3 text-amber-300" />
          <h1 className="text-3xl font-extrabold">
            Tuyển Dụng Thượng Hạng (Premium)
          </h1>
        </div>
        <p className="text-sky-200 text-lg">
          Mở khóa các công cụ đột phá để thống trị cuộc chơi tuyển dụng. Tìm kiếm, kết nối và tuyển dụng nhân tài hàng đầu nhanh hơn 10 lần.
        </p>
      </header>

      {/* Nội dung chính - Danh sách tính năng */}
      <div className="space-y-10">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
          Những Quyền Lợi Độc Quyền Dành Cho Nhà Tuyển Dụng
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {premiumFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-xl transition duration-300 hover:shadow-2xl hover:border-sky-500 border border-gray-100"
            >
              <div className="flex items-start">
                <feature.icon
                  className={`w-8 h-8 mr-4 ${feature.color}`}
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                        <span className="font-medium text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Khu vực kêu gọi hành động (Call to Action) */}
      <div className="mt-12 text-center">
        <div className="inline-block bg-white p-6 rounded-xl shadow-2xl border-2 border-sky-500">
          <p className="text-xl font-semibold text-gray-800 mb-4">
            Sẵn sàng chuyển đổi chiến lược tuyển dụng của bạn?
          </p>
          <button
            onClick={() => console.log('Chuyển đến trang Thanh toán')}
            className="px-8 py-3 text-lg font-bold text-white bg-sky-600 rounded-full shadow-lg hover:bg-sky-700 transition duration-300 transform hover:scale-105"
          >
            Nâng Cấp Ngay Bây Giờ & Bắt Đầu Tuyển Dụng Hiệu Quả
          </button>
          <p className="mt-3 text-sm text-gray-500">
            Dùng thử 7 ngày miễn phí (hoặc Hoàn tiền 30 ngày)
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        Liên hệ bộ phận Kinh doanh để được tư vấn gói giải pháp Doanh nghiệp (Enterprise Solution) phù hợp nhất.
      </footer>
    </div>
  );
}