import React from 'react';

interface JobCardSkeletonProps {
  count?: number;
}

const JobCardSkeletonItem: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 animate-pulse">
      {/* Header with HOT badge and title */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {/* HOT badge skeleton */}
            <div className="h-6 w-12 bg-gray-200 rounded" />
            {/* Title skeleton */}
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
          </div>

          {/* Company name skeleton */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-gray-200 rounded-sm" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>

          {/* Salary badge skeleton */}
          <div className="mb-2">
            <div className="h-7 w-28 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Negotiate and work mode info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-200 rounded-full" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>

        <div className="flex items-center gap-4">
          {/* Work mode skeleton */}
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
          {/* Location skeleton */}
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Company type skeleton */}
        <div className="h-4 w-28 bg-gray-200 rounded" />
      </div>

      {/* Skills skeleton */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          <div className="h-6 w-16 bg-gray-200 rounded" />
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-14 bg-gray-200 rounded" />
          <div className="h-6 w-18 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Posted time skeleton */}
      <div className="h-3 w-24 bg-gray-200 rounded" />
    </div>
  );
};

const JobCardSkeleton: React.FC<JobCardSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <JobCardSkeletonItem key={index} />
      ))}
    </div>
  );
};

export default JobCardSkeleton;
