"use client";

import { FcGoogle } from "react-icons/fc";

interface GoogleOAuthButtonProps {
  accountType: "candidate" | "recruiter";
  label?: string;
  variant?: "default" | "outline";
}

export default function GoogleOAuthButton({
  accountType,
  label,
  variant = "default",
}: GoogleOAuthButtonProps) {
  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const oauthUrl = `${backendUrl}/api/oauth2/google/login?account_type=${accountType}`;
    
    console.log("🔵 [Google OAuth] Redirecting to:", oauthUrl);
    window.location.href = oauthUrl;
  };

  const variantClasses = variant === "outline" 
    ? "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50";

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className={`flex items-center justify-center gap-3 w-full px-4 py-3 
                 rounded-lg transition-all duration-200 font-medium
                 shadow-sm hover:shadow-md ${variantClasses}`}
    >
      <FcGoogle className="text-2xl" />
      <span>{label || `Continue with Google`}</span>
    </button>
  );
}
