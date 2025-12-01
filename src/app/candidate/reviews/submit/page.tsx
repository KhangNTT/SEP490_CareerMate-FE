"use client";

import { Suspense } from "react";
import { SubmitReviewContent } from "./SubmitReviewContent";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function SubmitReviewPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SubmitReviewContent />
    </Suspense>
  );
}
