import ClientHeader from "@/modules/client/components/ClientHeader";
import ClientFooter from "@/modules/client/components/ClientFooter";
import { AuthProvider } from "@/store/auth-provider";
import { LayoutProvider } from "@/contexts/LayoutContext";

export default function CompaniesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutProvider>
        <div className="min-h-screen flex flex-col">
          <ClientHeader />
          <main className="flex-1">
            {children}
          </main>
          <ClientFooter />
        </div>
      </LayoutProvider>
    </AuthProvider>
  );
}
