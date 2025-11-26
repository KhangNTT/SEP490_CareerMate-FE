// export default function CandidateSearchPage() {
//     return (
//         <>
//             <header className="mb-6 flex items-center justify-between">
//                 <h1 className="text-xl font-semibold text-sky-800">Candidate Search</h1>
//             </header>
//             <div className="rounded-lg border bg-white p-6 shadow-sm">
//                 <p className="text-gray-600">Candidate search features will be implemented here.</p>
//             </div>
//         </>
//     );
// }


"use client";

import React from "react";

// Component Placeholder Icon (Sử dụng Emoji)
interface PlaceholderIconProps {
    children: React.ReactNode;
    className?: string;
}

const PlaceholderIcon = ({ children, className = "" }: PlaceholderIconProps) => (
    <div className={`inline-block ${className}`}>{children}</div>
);

// Dữ liệu cho các dịch vụ chính
const servicesData = [
    {
        icon: "🚀",
        title: "Tăng Tốc Tin Tuyển Dụng (Job Boosting)",
        description: "Đưa tin đăng của bạn lên vị trí nổi bật nhất. Tăng gấp 5 lần khả năng hiển thị và tốc độ tiếp cận ứng viên chất lượng cao.",
        link: "/services/job-boosting",
        cta: "Xem Gói Boosting",
        color: "text-red-500",
    },
    {
        icon: "🔍",
        title: "Tìm Kiếm Ứng Viên Nâng Cao (Candidate Search)",
        description: "Truy cập cơ sở dữ liệu ứng viên độc quyền. Sử dụng bộ lọc AI và công cụ tìm kiếm chuyên sâu để săn lùng nhân tài 'ngủ đông'.",
        link: "/services/candidate-search",
        cta: "Khám Phá Hồ Sơ",
        color: "text-blue-500",
    },
    {
        icon: "📊",
        title: "Bảng Phân Tích Hiệu Suất (Analytics Dashboard)",
        description: "Cung cấp cái nhìn toàn diện về hiệu quả tuyển dụng, nguồn ứng viên, và tỷ lệ chuyển đổi. Tối ưu hóa chiến lược với dữ liệu thời gian thực.",
        link: "/services/analytics",
        cta: "Tìm Hiểu Chi Tiết",
        color: "text-green-500",
    },
    {
        icon: "🤝",
        title: "Giải Pháp Doanh Nghiệp (Enterprise Solution)",
        description: "Gói dịch vụ tùy chỉnh cho các doanh nghiệp lớn. Bao gồm API tích hợp, hỗ trợ quản lý tài khoản 1-1, và chiến dịch tuyển dụng quy mô lớn.",
        link: "/services/enterprise",
        cta: "Liên Hệ Tư Vấn",
        color: "text-yellow-600",
    },
];

export default function CandidateSearchPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <header className="mb-8 max-w-4xl mx-auto text-center pt-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Các Giải Pháp Tuyển Dụng Chuyên Nghiệp
                </h1>
                <p className="text-lg text-gray-600">
                    Chọn dịch vụ phù hợp để biến thách thức tuyển dụng thành lợi thế cạnh tranh.
                </p>
                <div className="w-12 h-0.5 bg-sky-500 mx-auto mt-4"></div>
            </header>

            {/* Nội dung chính - Danh sách dịch vụ */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {servicesData.map((service, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col transition duration-300 hover:shadow-lg hover:border-sky-400"
                    >
                        <div className="flex items-start mb-4">
                            {/* Icon */}
                            <PlaceholderIcon className={`w-12 h-12 mr-4 text-4xl leading-none ${service.color}`}>
                                {service.icon}
                            </PlaceholderIcon>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    {service.title}
                                </h2>
                                <p className="text-gray-600 text-sm">{service.description}</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            {/* Nút Kêu gọi Hành động */}
                            <button
                                onClick={() => console.log(`Chuyển đến: ${service.link}`)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-300 
                                            bg-sky-500 text-white hover:bg-sky-600 shadow-md`}
                            >
                                {service.cta}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Khu vực CTA Tóm tắt */}
            <div className="mt-16 text-center max-w-3xl mx-auto p-8 bg-sky-50 rounded-xl border border-sky-200">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Tăng Cường Năng Lực Tuyển Dụng Của Bạn
                </h3>
                <p className="text-gray-600 mb-6">
                    Chúng tôi có mọi công cụ bạn cần để tìm kiếm, sàng lọc và tuyển dụng nhân tài hàng đầu. Bắt đầu ngay hôm nay!
                </p>
                <button
                    onClick={() => console.log('Chuyển đến trang liên hệ/giá')}
                    className="px-8 py-3 bg-sky-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-sky-700 transition duration-300 transform hover:scale-105"
                >
                    Xem Bảng Giá Dịch Vụ
                </button>
            </div>
        </div>
    );
}