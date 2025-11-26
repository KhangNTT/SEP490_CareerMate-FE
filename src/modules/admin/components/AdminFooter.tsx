"use client";

import Link from "next/link";

interface AdminFooterProps {
  sidebarOpen?: boolean;
}

export function AdminFooter({ sidebarOpen = false }: AdminFooterProps) {
  return (
    <footer
      className={`mt-10 border-t bg-sky-50 transition-all duration-300 ${
        sidebarOpen ? "ml-64" : "ml-16"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-sm font-semibold">CareerMate Admin</p>
            <p className="text-xs text-muted-foreground">
              Administrative portal for managing the CareerMate platform.
            </p>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold">Resources</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Admin Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  System Status
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold">Company</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} CareerMate Admin. All rights reserved.
          </span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
