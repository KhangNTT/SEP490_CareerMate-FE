import type { ReactNode } from "react";
import { RecruiterLayoutWrapper } from "@/modules/recruiter";

export default function InterviewsLayout({ children }: { children: ReactNode }) {
    return <RecruiterLayoutWrapper>{children}</RecruiterLayoutWrapper>;
}
