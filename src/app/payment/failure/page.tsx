"use client";
import { Suspense } from "react";
import { FailureContent } from "./FailureContent";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FailureContent />
    </Suspense>
  );
}
