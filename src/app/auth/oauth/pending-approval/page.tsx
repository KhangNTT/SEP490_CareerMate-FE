"use client";

import { Clock, CheckCircle, Mail, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PendingApprovalPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-yellow-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Registration Complete!
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          Your recruiter account is pending admin approval.
        </p>

        <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
          <h2 className="flex items-center text-sm font-semibold text-blue-900 mb-3">
            <CheckCircle className="w-5 h-5 mr-2" />
            What happens next?
          </h2>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Our team will review your company information</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>You'll receive an email notification within 24-48 hours</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Once approved, you can log in and start posting jobs</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center text-gray-600 mb-2">
            <Mail className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Check your email</span>
          </div>
          <p className="text-xs text-gray-500">
            We've sent a confirmation email to your registered address
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex-1 inline-flex items-center justify-center bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Home
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Questions? Contact us at support@careermate.com
        </p>
      </div>
    </div>
  );
}
