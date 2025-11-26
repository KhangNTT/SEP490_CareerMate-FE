import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    console.log(
      "🔵 [LOGIN API] Attempting login to:",
      `${apiUrl}/api/auth/token`
    );

    // Make a direct request to the backend login endpoint
    const response = await axios.post(
      `${apiUrl}/api/auth/token`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status < 500, // Allow non-server error responses
        maxRedirects: 0, // Don't follow redirects
      }
    );

    console.log("🔵 [LOGIN API] Backend response status:", response.status);
    console.log(
      "🔵 [LOGIN API] Has accessToken:",
      !!response.data?.result?.accessToken
    );
    console.log(
      "🔵 [LOGIN API] Has expiresIn:",
      !!response.data?.result?.expiresIn
    );

    // Check if response is valid
    const result = response.data.result || response.data;
    console.log("🧩 [LOGIN API] Response body:", response.data);
    if (response.status === 200 && (result?.accessToken || result?.token)) {
      console.log("🟢 [LOGIN API] Login successful, preparing response");

      // Create the response
      const nextResponse = NextResponse.json(
        {
          result,
          success: true,
        },
        {
          status: 200,
        }
      );

      // ✅ CRITICAL: Set access_token cookie for SSE authentication
      const accessToken = result?.accessToken || result?.token;
      if (accessToken) {
        console.log("🍪 [LOGIN] Setting access_token cookie:", accessToken.substring(0, 20) + "...");
        nextResponse.cookies.set({
          name: "access_token",
          value: accessToken,
          httpOnly: false, // Must be false for JavaScript to read it
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: result?.expiresIn || 900, // Use expiresIn from backend or default 15 minutes
        });
        console.log("✅ [LOGIN] access_token cookie set successfully");
      }

      // Forward any refresh token cookie
      console.log(
        "🔍 [LOGIN] Response headers set-cookie:",
        response.headers["set-cookie"]
      );

      if (response.headers["set-cookie"]) {
        const cookies = response.headers["set-cookie"];
        for (const cookie of cookies) {
          console.log(
            "🔍 [LOGIN] Processing cookie:",
            cookie.substring(0, 100)
          );

          if (cookie.startsWith("refreshToken=")) {
            const cookieParts = cookie.split(";");
            const cookieValue = cookieParts[0].split("=")[1];
            console.log(
              "🔍 [LOGIN] Setting refreshToken cookie:",
              cookieValue.substring(0, 20) + "..."
            );

            // Set cookie with proper settings
            nextResponse.cookies.set({
              name: "refreshToken",
              value: cookieValue,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            console.log("🔍 [LOGIN] refreshToken cookie set successfully");
            break;
          }
        }
      } else {
        console.log("🔍 [LOGIN] No set-cookie headers found");
      }

      return nextResponse;
    } else {
      // Return the error from the backend
      console.log("🔴 [LOGIN API] Login failed with status:", response.status);
      console.log("🔴 [LOGIN API] Error data:", response.data);
      return NextResponse.json(
        response.data || { message: "Authentication failed" },
        { status: response.status || 401 }
      );
    }
  } catch (error: any) {
    console.error("🔴 [LOGIN API] Login error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      hasResponse: !!error.response,
    });

    return NextResponse.json(
      { message: "Login failed", error: error.message },
      { status: 500 }
    );
  }
}
