import React from 'react';

const JobDetailSkeleton: React.FC = () => {
  return (
    <div className="sticky top-20 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* Header with company and job title */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {/* Company badge and verification */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-28 bg-gray-200 rounded-full" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
            
            {/* Job title */}
            <div className="h-8 w-3/4 bg-gray-200 rounded mb-2" />

            {/* Tags row: salary, work mode, job type */}
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="h-8 w-32 bg-gray-200 rounded-lg" />
              <div className="h-8 w-24 bg-gray-200 rounded-full" />
              <div className="h-8 w-20 bg-gray-200 rounded-full" />
            </div>

            {/* Location and info */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* Action buttons: Apply, Like, Save */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 h-10 bg-gray-200 rounded-md" />
          <div className="w-12 h-10 bg-gray-200 rounded-md" />
          <div className="w-12 h-10 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
        <div className="p-6">
          {/* Compensation bar */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="h-8 w-28 bg-gray-200 rounded-md" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Left column */}
            <div>
              {/* Skills section */}
              <div className="h-5 w-16 bg-gray-200 rounded mb-3" />
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-7 w-20 bg-gray-200 rounded-full" />
                <div className="h-7 w-24 bg-gray-200 rounded-full" />
                <div className="h-7 w-16 bg-gray-200 rounded-full" />
                <div className="h-7 w-28 bg-gray-200 rounded-full" />
                <div className="h-7 w-22 bg-gray-200 rounded-full" />
              </div>

              {/* Job Expertise section */}
              <div className="h-5 w-28 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-4" />

              {/* Job Domain section */}
              <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
              <div className="h-7 w-32 bg-gray-200 rounded-full" />
            </div>

            {/* Right column - Why you'll love working here */}
            <div>
              <div className="h-5 w-52 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full mt-2" />
                    <div className="h-4 flex-1 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compensation & Benefits */}
          <div className="mb-6">
            <div className="h-5 w-48 bg-gray-200 rounded mb-3" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-200 rounded-full mt-2" />
                  <div className="h-4 bg-gray-200 rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Job description */}
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="h-4 bg-gray-200 rounded" style={{ width: `${80 + Math.random() * 20}%` }} />
              ))}
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
              
              {/* More description lines */}
              <div className="mt-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-4 bg-gray-200 rounded mb-2" style={{ width: `${70 + Math.random() * 25}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailSkeleton;
