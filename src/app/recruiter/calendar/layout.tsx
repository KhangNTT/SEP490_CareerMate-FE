import type { ReactNode } from "react";
import { RecruiterLayoutWrapper } from "@/modules/recruiter";

export default function CalendarLayout({ children }: { children: ReactNode }) {
    return <RecruiterLayoutWrapper>{children}</RecruiterLayoutWrapper>;
}
