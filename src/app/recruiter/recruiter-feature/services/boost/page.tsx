// export default function JobBoostPage() {
//     return (
//         <>
//             <header className="mb-6 flex items-center justify-between">
//                 <h1 className="text-xl font-semibold text-sky-800">Job Boosting</h1>
//             </header>
//             <div className="rounded-lg border bg-white p-6 shadow-sm">
//                 <p className="text-gray-600">Job boosting features will be implemented here.</p>
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

export default function JobBoostPage() {
    return (
        <div className="min-h-screen bg-white p-4 sm:p-8 lg:p-16">
            {/* Header - Thanh lịch */}
            <header className="mb-14 text-center max-w-4xl mx-auto pt-6">
                <h1 className="text-5xl font-extralight text-gray-900 mb-4 tracking-tight">
                    Giải Pháp Tăng Tốc Tin Tuyển Dụng
                </h1>
                <p className="text-xl text-gray-500 font-light">
                    Đầu tư vào sự nổi bật. Tiếp cận những ứng viên tài năng nhất một cách chính xác và hiệu quả.
                </p>
                {/* Dải phân cách tinh tế */}
                <div className="w-16 h-0.5 bg-sky-400 mx-auto mt-6"></div>
            </header>

            {/* Phần Lợi Ích Chính - Hiệu ứng thẻ mượt mà */}
            <section className="mb-20 max-w-7xl mx-auto">
                <h2 className="text-3xl font-light text-gray-800 text-center mb-12">
                    Lợi Ích Khi Nâng Cấp
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Lợi ích 1 */}
                    <div className="p-8 bg-white border border-gray-100 rounded-xl shadow-sm transition duration-300 hover:shadow-md text-center">
                        <PlaceholderIcon className="w-12 h-12 text-gray-700 mx-auto mb-4 text-4xl leading-none">🚀</PlaceholderIcon>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Đẩy Tốc Độ</h3>
                        <p className="text-gray-500 text-sm">
                            Giảm thời gian tuyển dụng bằng cách ưu tiên hiển thị tin đăng trên mọi nền tảng.
                        </p>
                    </div>
                    {/* Lợi ích 2 */}
                    <div className="p-8 bg-white border border-gray-100 rounded-xl shadow-sm transition duration-300 hover:shadow-md text-center">
                        <PlaceholderIcon className="w-12 h-12 text-gray-700 mx-auto mb-4 text-4xl leading-none">🎯</PlaceholderIcon>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Độ Chính Xác Cao</h3>
                        <p className="text-gray-500 text-sm">
                            Thu hút ứng viên có kinh nghiệm phù hợp nhờ khả năng lọc và gợi ý nâng cao.
                        </p>
                    </div>
                    {/* Lợi ích 3 */}
                    <div className="p-8 bg-white border border-gray-100 rounded-xl shadow-sm transition duration-300 hover:shadow-md text-center">
                        <PlaceholderIcon className="w-12 h-12 text-gray-700 mx-auto mb-4 text-4xl leading-none">📈</PlaceholderIcon>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Đo Lường Hiệu Quả</h3>
                        <p className="text-gray-500 text-sm">
                            Báo cáo chi tiết giúp bạn hiểu rõ hiệu suất của từng tin đăng và tối ưu ROI.
                        </p>
                    </div>
                </div>
            </section>

            {/* Các Gói Boosting - Bảng giá cao cấp */}
            <section className="mb-20 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Gói Cơ Bản */}
                    <div className="bg-white p-10 rounded-xl border-2 border-gray-200 flex flex-col transition duration-300 hover:border-gray-300 shadow-sm">
                        <h3 className="text-2xl font-light text-gray-900 mb-1 text-center">Nổi Bật</h3>
                        <p className="text-gray-500 text-center mb-6">Khởi đầu hiệu quả</p>
                        <div className="text-center mb-10">
                            <span className="text-6xl font-thin text-gray-800">99</span>
                            <span className="text-xl text-gray-500">K/tuần</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow text-gray-700 font-light text-sm">
                            <li className="flex items-center">
                                <PlaceholderIcon className="w-4 h-4 mr-3 text-sky-500 flex-shrink-0">✓</PlaceholderIcon> Gắn nhãn **Nổi bật** vĩnh viễn
                            </li>
                            <li className="flex items-center">
                                <PlaceholderIcon className="w-4 h-4 mr-3 text-sky-500 flex-shrink-0">✓</PlaceholderIcon> Tăng 2X lượt xem
                            </li>
                            <li className="flex items-center">
                                <PlaceholderIcon className="w-4 h-4 mr-3 text-sky-500 flex-shrink-0">✓</PlaceholderIcon> Hỗ trợ ưu tiên qua email
                            </li>
                        </ul>
                        <button className="w-full py-3 text-lg font-medium text-gray-700 border border-gray-400 rounded-lg hover:bg-gray-100 transition duration-300">
                            Chọn Nổi Bật
                        </button>
                    </div>

                    {/* Gói Phổ Biến Nhất - Điểm nhấn cao cấp */}
                    <div className="bg-sky-50 p-12 rounded-xl border-2 border-sky-400 shadow-lg flex flex-col relative transform scale-105 transition duration-500">
                        <span className="absolute top-0 right-0 -mt-4 -mr-4 bg-sky-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                            GIẢI PHÁP VÀNG
                        </span>
                        <h3 className="text-3xl font-medium text-sky-800 mb-1 text-center">Tăng Trưởng</h3>
                        <p className="text-sky-600 text-center mb-6 font-light">Lựa chọn của các chuyên gia</p>
                        <div className="text-center mb-10">
                            <span className="text-7xl font-light text-sky-700">249</span>
                            <span className="text-xl text-sky-600">K/2 tuần</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow text-gray-800 font-medium text-base">
                            <li className="flex items-center">
                                <PlaceholderIcon className="w-5 h-5 mr-3 text-sky-600 flex-shrink-0">🚀</PlaceholderIcon> **Tất cả Nổi Bật**
                            </li>
                            <li className="flex items-center">
                                <PlaceholderIcon className="w-5 h-5 mr-3 text-sky-600 flex-shrink-0">✓</PlaceholderIcon> Tăng **5X** lượt xem
                            </li>
                            <li className="flex items-center">
                                <PlaceholderIcon className="w-5 h-5 mr-3 text-sky-600 flex-shrink-0">✓</PlaceholderIcon> Xuất hiện **TOP 5** tìm kiếm
                            </li>
                            <li className="flex items-center">
                                <PlaceholderIcon className="w-5 h-5 mr-3 text-sky-600 flex-shrink-0">✓</PlaceholderIcon> Báo cáo hiệu suất chi tiết (Weekly Report)
                            </li>
                        </ul>
                        <button className="w-full py-4 text-xl font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition duration-300 shadow-md">
                            Kích Hoạt Ngay
                        </button>
                    </div>

                    {/* Gói Cao Cấp */}
                    <div className="bg-white p-10 rounded-xl border-2 border-gray-200 flex flex-col transition duration-300 hover:border-gray-300 shadow-sm">
                        <h3 className="text-2xl font-light text-gray-900 mb-1 text-center">Tối Ưu</h3>
                        <p className="text-gray-500 text-center mb-6">Giải pháp tuyển dụng cao cấp</p>
                        <div className="text-center mb-10">
                            <span className="text-6xl font-thin text-gray-800">499</span>
                            <span className="text-xl text-gray-500">K/tháng</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow text-gray-700 font-light text-sm">
                            <li className="flex items-center">
                                <PlaceholderIcon className="w-4 h-4 mr-3 text-sky-500 flex-shrink-0">✓</PlaceholderIcon> **Tất cả Tăng Trưởng**
                            </li>
                            <li className="flex items-center">
                                <PlaceholderIcon className="w-4 h-4 mr-3 text-sky-500 flex-shrink-0">✓</PlaceholderIcon> Đảm bảo vị trí **TOP 3**
                            </li>
                            <li className="flex items-center">
                                <PlaceholderIcon className="w-4 h-4 mr-3 text-sky-500 flex-shrink-0">✓</PlaceholderIcon> Quản lý tài khoản chuyên trách 1-1
                            </li>
                            <li className="flex items-center">
                                <PlaceholderIcon className="w-4 h-4 mr-3 text-sky-500 flex-shrink-0">✓</PlaceholderIcon> Quảng cáo đa kênh (Social + Partner)
                            </li>
                        </ul>
                        <button className="w-full py-3 text-lg font-medium text-gray-700 border border-gray-400 rounded-lg hover:bg-gray-100 transition duration-300">
                            Chọn Tối Ưu
                        </button>
                    </div>
                </div>
            </section>

            {/* Kêu gọi Hành động Cuối cùng */}
            <div className="text-center max-w-xl mx-auto border-t pt-10 mt-16">
                <h3 className="text-2xl font-light text-gray-800 mb-4">Bạn vẫn chưa chắc chắn?</h3>
                <p className="text-lg text-gray-500 mb-6">
                    Hãy liên hệ với chúng tôi để được tư vấn gói giải pháp Doanh nghiệp cá nhân hóa.
                </p>
                <button
                    onClick={() => console.log('Liên hệ Sales')}
                    className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-full border border-gray-300 hover:bg-gray-200 transition duration-300"
                >
                    Tư Vấn Ngay
                </button>
            </div>

            {/* Footer Minimal */}
            <footer className="mt-24 text-center text-sm text-gray-400">
                © 2025 | Nâng cấp để trải nghiệm sự khác biệt.
            </footer>
        </div>
    );
}