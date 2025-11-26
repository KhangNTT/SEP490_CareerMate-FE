import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
  try {
    console.log("🔵 [OAuth Callback] Processing OAuth callback...");

    // Get session cookie from request
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("JSESSIONID");

    console.log("🔵 [OAuth Callback] Session cookie:", sessionCookie?.value ? "Present" : "Missing");

    // Call backend to get OAuth result
    const response = await fetch(`${API_URL}/api/oauth2/google/success`, {
      credentials: "include",
      headers: {
        Cookie: sessionCookie ? `JSESSIONID=${sessionCookie.value}` : "",
      },
    });

    const data = await response.json();
    console.log("🔵 [OAuth Callback] Response from backend:", data);

    if (data.code === 200) {
      // Successful login - user is active candidate or approved recruiter
      console.log("✅ [OAuth Callback] Login successful, redirecting to success page");
      return NextResponse.redirect(
        new URL(`/auth/oauth/success?token=${data.result.accessToken}&email=${data.result.email}`, request.url)
      );
    } else if (data.code === 202 && data.result.recruiter) {
      // Recruiter needs to complete profile
      console.log("🔵 [OAuth Callback] Recruiter needs to complete profile");
      return NextResponse.redirect(
        new URL(`/auth/oauth/complete-recruiter?email=${data.result.email}`, request.url)
      );
    } else {
      // Some other status - handle accordingly
      console.error("❌ [OAuth Callback] Unexpected status code:", data.code);
      return NextResponse.redirect(
        new URL(`/auth/oauth/error?message=${encodeURIComponent(data.message || "Authentication failed")}`, request.url)
      );
    }
  } catch (error) {
    console.error("❌ [OAuth Callback] Error:", error);
    return NextResponse.redirect(
      new URL("/auth/oauth/error?message=An error occurred during authentication", request.url)
    );
  }
}
