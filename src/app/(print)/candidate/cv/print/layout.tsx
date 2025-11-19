import type { Metadata } from "next";
import "@/app/globals.css"; // Import Tailwind CSS
import "./print.css";
import "./fonts.css";

// Force dynamic rendering for print pages
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Print CV",
  robots: "noindex, nofollow",
};

/**
 * FULLY ISOLATED PRINT LAYOUT
 * 
 * This layout is in a route group (print) which makes it completely 
 * independent from the main application layout hierarchy.
 * 
 * It does NOT inherit from:
 * - /app/layout.tsx
 * - /app/candidate/layout.tsx
 * 
 * ✅ NO Navbar
 * ✅ NO Footer
 * ✅ NO Next.js Logo
 * ✅ NO Context Providers (AuthProvider, LayoutProvider)
 * ✅ NO Theme Providers
 * ✅ NO CandidateHeader / CandidateFooter
 * ✅ NO HomeBg wrapper
 * ✅ NO SecurityCleanup
 * 
 * Only includes:
 * - Tailwind CSS (for utility classes)
 * - print.css (print-optimized styles)
 * - fonts.css (font definitions)
 */
export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={false} data-no-hydrate="true">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "white", overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
