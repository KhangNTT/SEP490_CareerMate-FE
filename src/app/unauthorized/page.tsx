"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 rounded-full"></div>
              <div className="relative bg-red-100 rounded-full p-6">
                <ShieldAlert className="w-16 h-16 text-red-600" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Access Denied
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-2">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Please contact your administrator if you believe this is an error.
          </p>

          {/* Error Code */}
          <div className="bg-gray-100 rounded-lg py-3 px-4 mb-8">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Error Code
            </p>
            <p className="text-lg font-mono font-semibold text-gray-900">
              403 - Forbidden
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help?{" "}
              <Link
                href="/support"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            If you keep seeing this error, try{" "}
            <button
              onClick={() => {
                // Clear auth and redirect to sign in
                document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                localStorage.clear();
                window.location.href = "/sign-in";
              }}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              signing in again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
