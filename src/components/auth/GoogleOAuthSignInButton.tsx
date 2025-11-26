"use client";

import { FcGoogle } from "react-icons/fc";

interface GoogleOAuthSignInButtonProps {
  label?: string;
  accountType?: "candidate" | "recruiter";
}

export default function GoogleOAuthSignInButton({
  label = "Sign in with Google",
  accountType = "candidate",
}: GoogleOAuthSignInButtonProps) {
  const handleGoogleSignIn = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    // Đăng nhập không cần account_type, hoặc có thể truyền nếu muốn phân biệt
    window.location.href = `${backendUrl}/api/oauth2/google/login?account_type=${accountType}`;
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      className="flex items-center justify-center gap-3 w-full px-4 py-3 
                 rounded-lg transition-all duration-200 font-medium
                 shadow-sm hover:shadow-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
    >
      <FcGoogle className="text-2xl" />
      <span>{label}</span>
    </button>
  );
}
