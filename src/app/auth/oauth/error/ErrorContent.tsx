"use client";

import { XCircle, Home, RefreshCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "An error occurred during authentication";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Authentication Failed
        </h1>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-left">
          <p className="text-sm text-red-700">
            Please try logging in again. If the problem persists, contact support.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex-1 inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </button>
          <button
            onClick={() => router.back()}
            className="flex-1 inline-flex items-center justify-center bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors font-medium"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
