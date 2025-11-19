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
 * ISOLATED PRINT LAYOUT
 * 
 * This layout is completely isolated from the main application layout.
 * It does NOT import or inherit from /app/layout.tsx.
 * 
 * ✅ NO Navbar
 * ✅ NO Footer
 * ✅ NO Next.js Logo
 * ✅ NO Context Providers
 * ✅ NO Theme Providers
 * ✅ NO ClientHeader/ClientFooter
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "white" }}>
        {children}
      </body>
    </html>
  );
}
