"use client";

import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

/**
 * Client-only providers that should not block server rendering
 * Lazy loaded to reduce initial bundle size
 */
export function ClientProviders() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
      <Analytics />
    </>
  );
}
