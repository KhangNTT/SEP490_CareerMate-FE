"use client";

import { useState, useEffect } from "react";
import CVSidebar from "@/components/layout/CVSidebar";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";

const SettingsPage = () => {
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
            <CVSidebar activePage="settings" />
          </aside>

          {/* Main Content */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300">
            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h1>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                  <div className="flex items-center">
                    <span className="text-gray-900">user@example.com</span>
                    <div className="ml-2 text-xs text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      You cannot change your account email.
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name:</label>
                  <div className="flex items-center">
                    <span className="text-gray-900">Lê Quang Anh</span>
                    <div className="ml-2 text-xs text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Your account name is synchronized with profile information.
                    </div>
                  </div>
                  <Link href="/profile" className="text-gray-600 hover:text-gray-800 text-sm mt-2 inline-flex items-center">
                    Update profile information
                    <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Password */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Password</h2>
              
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You signed up with Google, so your account doesn't have a password.
              </div>
            </div>
            
            {/* Job Invitation Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Job Invitation Settings</h2>
                <Link href="#" className="text-gray-600 hover:text-gray-800 text-sm inline-flex items-center">
                  Learn more
                  <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </Link>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
                  <span className="text-gray-700">Receive job invitations from employers via email, SMS and CM Inbox</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Yes</span>
                  </label>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Don't receive invitations from:</h3>
                  <p className="text-xs text-gray-500 mb-4">Maximum 5 employers</p>
                  
                  <div className="relative mb-2">
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500" 
                      placeholder="Search company" 
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">No companies selected</p>
                </div>
              </div>
            </div>
            
            {/* Delete Account */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Delete Account</h2>
              
              <p className="text-gray-600 mb-6">
                Account deletion is a permanent action and cannot be undone. If you are deleting your account due to an excessive email
                notifications, you can unsubscribe from emails <Link href="#" className="text-gray-600 underline">here</Link>.
              </p>
              
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Delete your account
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default SettingsPage;