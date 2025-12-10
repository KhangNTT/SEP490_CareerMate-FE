"use client";

import { useState, useEffect } from "react";
import CVSidebar from "@/components/layout/CVSidebar";
import { Mail, Trash2, PauseCircle } from "lucide-react";
import { useLayout } from "@/contexts/LayoutContext";

export default function CandidateEmailSubscriptions() {
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
            <CVSidebar activePage="email-subscriptions" />
          </aside>
          {/* Main Content */}
          <section className="space-y-6 min-w-0 transition-all duration-300">
            {/* Skills you subscribed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Skills you subscribed (1/5)</h2>
              <p className="text-gray-600 mb-4 text-sm">By subscribing, Job Robot will suggest in-demand jobs that match your skill via email.</p>
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <input className="border rounded px-3 py-2 text-sm flex-1" placeholder="Search skill, job title" />
                <select className="border rounded px-3 py-2 text-sm">
                  <option>Ho Chi Minh</option>
                  <option>Ha Noi</option>
                </select>
                <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded text-sm">Subscribe</button>
              </div>
              <div className="border rounded-lg px-4 py-3 flex items-center justify-between bg-gray-50">
                <span className="text-sm"><b>1.</b> <a href="#" className="underline font-medium">java</a> in Ho Chi Minh</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold text-sm">Subscribed</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600"><PauseCircle className="w-5 h-5" /></button>
                  <button className="p-1 text-gray-400 hover:text-gray-600"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
            {/* Company you followed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Company you followed (0/5)</h2>
              <p className="text-gray-600 mb-4 text-sm">By following, Job Robot will update new reviews and job openings from your favorite company via email.</p>
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <input className="border rounded px-3 py-2 text-sm flex-1" placeholder="Search company" />
                <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-2 rounded text-sm">Follow</button>
              </div>
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#F3F4F6"/><path d="M24 30c-4.418 0-8-1.79-8-4v-2c0-2.21 3.582-4 8-4s8 1.79 8 4v2c0 2.21-3.582 4-8 4Zm0-10c-2.21 0-4-1.343-4-3s1.79-3 4-3 4 1.343 4 3-1.79 3-4 3Z" fill="#D1D5DB"/><path d="M24 18c-2.21 0-4-1.343-4-3s1.79-3 4-3 4 1.343 4 3-1.79 3-4 3Z" fill="#E5E7EB"/></svg>
                <span className="mt-2 text-sm">You are not following any companies.</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
