"use client";

import dynamic from "next/dynamic";

// Lazy load CVSidebar since it's not needed immediately
const CVSidebarLazy = dynamic(() => import("./CVSidebar"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  ),
});

export default CVSidebarLazy;
