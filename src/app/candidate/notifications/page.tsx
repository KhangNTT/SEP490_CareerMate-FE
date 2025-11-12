"use client";

import { useState, useEffect } from "react";
import { ClientHeader, ClientFooter } from "@/modules/client/components";
import CVSidebar from "@/components/layout/CVSidebar";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";

type TabType = "all" | "unread" | "read";

const NotificationsPage = () => {
  // Sử dụng context thay vì useEffect
  const { headerHeight } = useLayout();
  
  // Backup solution nếu context chưa hoạt động
  const [headerH, setHeaderH] = useState(headerHeight || 0);
  
  // Chỉ sử dụng localStorage ở client-side
  useEffect(() => {
    // Kiểm tra nếu đang ở client-side
    if (typeof window !== 'undefined') {
      const savedHeight = localStorage.getItem("headerHeight");
      if (savedHeight && !headerHeight) {
        setHeaderH(parseInt(savedHeight));
      } else if (headerHeight) {
        setHeaderH(headerHeight);
      }
    }
  }, [headerHeight]);

  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState<TabType>("all");

  return (
    <>
      <ClientHeader />

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
            <CVSidebar activePage="notifications" />
          </aside>

          {/* Main Content */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Notifications
              </h1>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`pb-3 px-1 mr-8 relative ${
                    activeTab === "all"
                      ? "text-gray-500 font-medium border-b-2 border-gray-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-500 text-white rounded-full">
                    0
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("unread")}
                  className={`pb-3 px-1 mr-8 relative ${
                    activeTab === "unread"
                      ? "text-gray-500 font-medium border-b-2 border-gray-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Unread
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                    0
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("read")}
                  className={`pb-3 px-1 mr-8 relative ${
                    activeTab === "read"
                      ? "text-gray-500 font-medium border-b-2 border-gray-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Read
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                    0
                  </span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-4">
                {activeTab === "all" && (
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
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      There are no notifications here.
                    </p>
                  </div>
                )}

                {activeTab === "unread" && (
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
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      You have no unread notifications.
                    </p>
                  </div>
                )}

                {activeTab === "read" && (
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
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      You have no read notifications.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <ClientFooter />
    </>
  );
};

export default NotificationsPage;