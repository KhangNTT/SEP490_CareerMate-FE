import type { ReactNode } from "react";
import { RecruiterLayoutWrapper } from "@/modules/recruiter";

export default function RecruiterLayout({ children }: { children: ReactNode }) {
    return <RecruiterLayoutWrapper>{children}</RecruiterLayoutWrapper>;
}


