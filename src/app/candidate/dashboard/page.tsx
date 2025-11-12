"use client";

import { useState, useEffect } from "react";
import CVSidebar from "@/components/layout/CVSidebar";
import Link from "next/link";
import { FileText, Briefcase, Mail } from "lucide-react";
import { useLayout } from "@/contexts/LayoutContext";

export default function CandidateDashboard() {
  const { headerHeight } = useLayout();
  const [headerH, setHeaderH] = useState(headerHeight || 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHeight = localStorage.getItem("headerHeight");
      if (savedHeight && !headerHeight) {
        setHeaderH(parseInt(savedHeight));
      } else if (headerHeight) {
        setHeaderH(headerHeight);
      }
    }
  }, [headerHeight]);

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div
          className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-6 items-start transition-all duration-300"
          style={{
            ["--sticky-offset" as any]: `${headerH}px`,
            ["--content-pad" as any]: "24px",
          }}
        >
          {/* Sidebar */}
          <aside className="hidden lg:block sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <CVSidebar activePage="dashboard" />
          </aside>

          {/* Main Content */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300">
            {/* Welcome Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-2xl font-semibold text-gray-600">
                      LA
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                      
                    </h1>
                    <p className="text-sm text-gray-600 mb-1">
                      💼 Back-end Developer
                    </p>
                    <p className="text-sm text-gray-500">
                      ✉️ anhlqde180272@fpt.edu.vn
                    </p>
                    <Link
                      href="/candidate/cm-profile"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1 inline-block"
                    >
                      Update your profile →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Attached CV */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Attached CV
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <p className="text-gray-600 mb-3">
                  You have not attached a CV yet. Please upload your CV for
                  quick application.
                </p>
                <Link
                  href="/candidate/cv-management"
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center space-x-1"
                >
                  <span>Manage CV Management</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* CM Profile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                CM Profile
              </h2>
              <div className="flex items-start gap-8 flex-wrap xl:flex-nowrap">
                {/* Progress Circle */}
                <div className="flex-shrink-0">
                  <div className="relative w-36 h-36">
                    <svg className="w-36 h-36 transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="64"
                        stroke="#fee2e2"
                        strokeWidth="14"
                        fill="none"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="64"
                        stroke="#ef4444"
                        strokeWidth="14"
                        fill="none"
                        strokeDasharray={`${64 * 2 * Math.PI * 0.2} ${64 * 2 * Math.PI
                          }`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">
                          20%
                        </div>
                        <div className="text-sm text-gray-500">completed</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Chat bubble for complete profile */}
                <div className="flex-1 flex flex-col justify-center min-w-[220px]">
                  <div className="relative inline-block">
                    <div
                      className="bg-white border border-gray-200 shadow-md rounded-2xl px-5 py-4 text-gray-800 text-base leading-snug max-w-xs mb-2"
                      style={{ position: "relative" }}
                    >
                      <span>
                        Complete profile to{" "}
                        <span className="text-gray-600 font-semibold">70%</span>{" "}
                        to generate CV template for IT professionals.
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/candidate/cm-profile"
                    className="inline-block text-base text-blue-600 hover:text-blue-700 font-medium mt-2"
                  >
                    Complete your profile →
                  </Link>
                </div>
                {/* CV Templates grid */}
                <div className="flex-1 min-w-[260px]">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Template 1 */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-2 flex flex-col items-center justify-center min-h-[180px]">
                      <div className="w-full h-24 bg-gray-100 rounded mb-2"></div>
                      <div className="w-3/4 h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
                    </div>
                    {/* Template 2 */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-2 flex flex-col items-center justify-center min-h-[180px]">
                      <div className="w-full h-24 bg-gray-100 rounded mb-2"></div>
                      <div className="w-3/4 h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
                    </div>
                    {/* Explore CV templates */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-2 flex flex-col items-center justify-center min-h-[180px] relative cursor-pointer group">
                      <div className="flex flex-col items-center justify-center h-full w-full">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 mb-2">
                          <span className="text-gray-600 text-xl">⊕</span>
                        </div>
                        <span className="text-gray-600 font-semibold text-base text-center">
                          Explore CV templates
                        </span>
                      </div>
                      <span className="absolute inset-0 rounded-xl border-2 border-gray-500 opacity-0 group-hover:opacity-100 transition"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Your Activities
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Applied Jobs */}
                <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <Briefcase className="w-32 h-32 text-blue-600" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Applied Jobs
                    </h3>
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      0
                    </div>
                    <p className="text-sm text-gray-600">Total applications</p>
                  </div>
                </div>

                {/* Saved Jobs */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <svg
                      className="w-32 h-32 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Saved Jobs
                    </h3>
                    <div className="text-5xl font-bold text-gray-600 mb-2">
                      0
                    </div>
                    <p className="text-sm text-gray-600">
                      Bookmarked positions
                    </p>
                  </div>
                </div>

                {/* Job Invitations */}
                <div className="relative bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <Mail className="w-32 h-32 text-green-600" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Job invitations
                    </h3>
                    <div className="text-5xl font-bold text-green-600 mb-2">
                      0
                    </div>
                    <p className="text-sm text-gray-600">Pending invitations</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
