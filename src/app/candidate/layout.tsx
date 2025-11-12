"use client";

import CandidateHeader from "@/modules/client/components/CandidateHeader";
import CandidateFooter from "@/modules/client/components/CandidateFooter";
import { AuthProvider } from "@/store/auth-provider";
import { LayoutProvider } from "@/contexts/LayoutContext";
import HomeBg from "@/components/home-bg";
import { SecurityCleanup } from "@/components/auth/SecurityCleanup";

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <LayoutProvider>
                {/* Security cleanup for candidate routes */}
                <SecurityCleanup />

                <HomeBg>
                    <CandidateHeader />
                    <main className="flex-1">
                        {children}
                    </main>
                    <CandidateFooter />
                </HomeBg>
            </LayoutProvider>
        </AuthProvider>
    );
}






