import ClientHeader from "@/modules/client/components/ClientHeader";
import ClientFooter from "@/modules/client/components/ClientFooter";
import { AuthProvider } from "@/store/auth-provider";
import { LayoutProvider } from "@/contexts/LayoutContext";
import HomeBg from "@/components/home-bg";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <LayoutProvider>
                <HomeBg>
                    <ClientHeader />
                    <main className="flex-1">
                        {children}
                    </main>
                    <ClientFooter />
                </HomeBg>
            </LayoutProvider>
        </AuthProvider>
    );
}






