"use client";

import { Clock, ArrowLeft, Info, Home, CheckCircle2, Mail, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountPendingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-12 text-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-white/30 animate-pulse">
              <Clock className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Account Pending Approval
            </h1>
            <p className="text-amber-50 text-lg">
              Your profile is currently under review by an administrator
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Important Information Box */}
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6 mb-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Info className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-900 mb-3 text-lg">
                    Important Information:
                  </h3>
                  <ul className="space-y-2.5 text-sm text-amber-800">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>The review process usually takes <strong>24-48 business hours</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>You will receive an <strong>email notification</strong> when your account is approved</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>Please check your <strong>spam/junk folder</strong> as well</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>You cannot log in until your account is activated</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-5 flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-5 h-5" />
                What happens next?
              </h3>
              <div className="space-y-5">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                      1
                    </div>
                  </div>
                  <div className="flex-1 pt-1.5">
                    <h4 className="font-semibold text-blue-900 mb-1">Verify Information</h4>
                    <p className="text-sm text-blue-700">
                      Admin will verify your business information and business license
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                      2
                    </div>
                  </div>
                  <div className="flex-1 pt-1.5">
                    <h4 className="font-semibold text-blue-900 mb-1">Account Approval</h4>
                    <p className="text-sm text-blue-700">
                      If your profile is valid, you will receive an approval confirmation email
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                      3
                    </div>
                  </div>
                  <div className="flex-1 pt-1.5">
                    <h4 className="font-semibold text-blue-900 mb-1">Activate Account</h4>
                    <p className="text-sm text-blue-700">
                      Log in again to access full recruiter features
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Email Tips */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Check Email
                </h3>
                <ul className="space-y-2.5 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Primary Inbox</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Spam/Junk Folder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Promotions Folder</span>
                  </li>
                </ul>
              </div>

              {/* Notification Tips */}
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h3>
                <ul className="space-y-2.5 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>Approval Email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>Activation Guide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>Login Link</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Sign In
                </button>
                
                <button
                  onClick={() => router.push("/")}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a href="/contact" className="text-sky-600 hover:text-sky-700 font-medium underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
