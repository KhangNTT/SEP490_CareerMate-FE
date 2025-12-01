"use client";
import { Suspense } from "react";
import { RejectedContent } from "./RejectedContent";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );
}

export default function AccountRejectedPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RejectedContent />
    </Suspense>
  );
}
