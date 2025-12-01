"use client";

import { useState, useEffect } from "react";
import { ClientHeader, ClientFooter } from "@/modules/client/components";
import CVSidebar from "@/components/layout/CVSidebar";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";

type TabType = "pending" | "accepted" | "expired";

const JobInvitationPage = () => {
  // Sử dụng context thay vì useEffect
  const { headerHeight } = useLayout();

  // Backup solution nếu context chưa hoạt động
  const [headerH, setHeaderH] = useState(headerHeight || 0);

  // Chỉ sử dụng localStorage ở client-side
  useEffect(() => {
    // Kiểm tra nếu đang ở client-side
    if (typeof window !== "undefined") {
      const savedHeight = localStorage.getItem("headerHeight");
      if (savedHeight && !headerHeight) {
        setHeaderH(parseInt(savedHeight));
      } else if (headerHeight) {
        setHeaderH(headerHeight);
      }
    }
  }, [headerHeight]);

  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {/* GRID 2 cột: sidebar | content */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-6 items-start transition-all duration-300"
          style={{
            ["--sticky-offset" as any]: `${headerH}px`, // cao header
            ["--content-pad" as any]: "24px", // vì main có py-6 = 24px
          }}
        >
          {/* Sidebar trái: sticky + ẩn mobile */}
          <aside className="hidden lg:block sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <CVSidebar activePage="job-invitation" />
          </aside>

          {/* Main Content */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Job Invitation
              </h1>

              <p className="text-gray-600 mb-6">
                CM provides a service that connects anonymous candidates with
                suitable job opportunities.
                <Link href="#" className="text-blue-600 hover:underline ml-1">
                  Learn more here.
                </Link>
              </p>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`pb-3 px-1 mr-8 relative ${
                    activeTab === "pending"
                      ? "text-gray-500 font-medium border-b-2 border-gray-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Pending
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-500 text-white rounded-full">
                    0
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("accepted")}
                  className={`pb-3 px-1 mr-8 relative ${
                    activeTab === "accepted"
                      ? "text-gray-500 font-medium border-b-2 border-gray-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Accepted
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                    0
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("expired")}
                  className={`pb-3 px-1 mr-8 relative ${
                    activeTab === "expired"
                      ? "text-gray-500 font-medium border-b-2 border-gray-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Expired
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                    0
                  </span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-4">
                {activeTab === "pending" && (
                  <div>
                    <div className="flex items-center mb-8 text-gray-500 text-sm">
                      <svg
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3"
                        />
                      </svg>
                      This tab stores valid invitations, you can view job
                      details and share your CV.
                    </div>

                    {/* Empty state */}
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="bg-gray-200 p-4 rounded-lg mb-4">
                        <svg
                          className="w-16 h-16 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500">
                        You have 0 Pending Invitations
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "accepted" && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="bg-gray-200 p-4 rounded-lg mb-4">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      You have 0 Accepted Invitations
                    </p>
                  </div>
                )}

                {activeTab === "expired" && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="bg-gray-200 p-4 rounded-lg mb-4">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      You have 0 Expired Invitations
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default JobInvitationPage;
