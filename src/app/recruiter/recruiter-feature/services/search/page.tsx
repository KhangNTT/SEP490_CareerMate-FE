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

// Data for services
const servicesData = [
    {
        icon: "🚀",
        title: "Job Boosting",
        description: "Put your job postings in the most prominent positions. Increase visibility and reach top-quality candidates up to 5 times faster.",
        link: "/services/job-boosting",
        cta: "View Boosting Packages",
        color: "text-red-500",
    },
    {
        icon: "🔍",
        title: "Advanced Candidate Search",
        description: "Access an exclusive candidate database. Use AI filters and advanced search tools to hunt for 'dormant' talent.",
        link: "/services/candidate-search",
        cta: "Explore Profiles",
        color: "text-blue-500",
    },
    {
        icon: "📊",
        title: "Analytics Dashboard",
        description: "Provide a comprehensive view of recruitment effectiveness, candidate sources, and conversion rates. Optimize strategies with real-time data.",
        link: "/services/analytics",
        cta: "Learn More",
        color: "text-green-500",
    },
    {
        icon: "🤝",
        title: "Enterprise Solution",
        description: "Custom service packages for large enterprises. Includes API integration, 1-1 account management support, and large-scale recruitment campaigns.",
        link: "/services/enterprise",
        cta: "Contact Us",
        color: "text-yellow-600",
    },
];

export default function CandidateSearchPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <header className="mb-8 max-w-4xl mx-auto text-center pt-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Professional Recruitment Solutions
                </h1>
                <p className="text-lg text-gray-600">
                    Choose the right service to turn recruitment challenges into competitive advantages.
                </p>
                <div className="w-12 h-0.5 bg-sky-500 mx-auto mt-4"></div>
            </header>

            {/* Main Content - Services List */}
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
                            {/* Call to Action Button */}
                            <button
                                onClick={() => console.log(`Navigate to: ${service.link}`)}
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
                    Enhance Your Recruitment Capabilities
                </h3>
                <p className="text-gray-600 mb-6">
                    We have all the tools you need to find, screen, and hire top talent. Get started today!
                </p>
                <button
                    onClick={() => console.log('Chuyển đến trang liên hệ/giá')}
                    className="px-8 py-3 bg-sky-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-sky-700 transition duration-300 transform hover:scale-105"
                >
                    View Services Price
                </button>
            </div>
        </div>
    );
}