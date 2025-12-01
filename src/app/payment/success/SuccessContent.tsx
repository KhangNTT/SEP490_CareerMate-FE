"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FiCheckCircle } from "react-icons/fi";
import confetti from "canvas-confetti";
import { useAuthStore } from "@/store/use-auth-store";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageName = searchParams.get('package') || 'PREMIUM';
  const { role } = useAuthStore();

  // Normalize role
  const normalizedRole = role?.toUpperCase().includes("CANDIDATE")
    ? "CANDIDATE"
    : role?.toUpperCase().includes("RECRUITER")
    ? "RECRUITER"
    : "USER";

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const handleDashboard = () => {
    if (normalizedRole === "CANDIDATE") {
      router.push('/candidate/dashboard');
    } else if (normalizedRole === "RECRUITER") {
      router.push('/recruiter/recruiter-feature/dashboard');
    } else {
      router.push('/');
    }
  };

  const handleProfile = () => {
    if (normalizedRole === "CANDIDATE") {
      router.push('/candidate/cm-profile');
    } else if (normalizedRole === "RECRUITER") {
      router.push('/recruiter/recruiter-feature/profile/account');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <FiCheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your <span className="font-semibold text-blue-600">{packageName}</span> package has been activated
          </p>

          {/* Details */}
          <div className="bg-green-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">What's next?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-3 text-lg">✓</span>
                Your account has been upgraded to {packageName}
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 text-lg">✓</span>
                All premium features are now available
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 text-lg">✓</span>
                Receipt has been sent to your email
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 text-lg">✓</span>
                You can start using your benefits immediately
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDashboard}
              className="px-8 py-6 text-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={handleProfile}
              variant="outline"
              className="px-8 py-6 text-lg border-2 hover:bg-gray-50"
            >
              View Profile
            </Button>
          </div>

          {/* Support Link */}
          <p className="text-sm text-gray-500 mt-8">
            Need help?{' '}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
