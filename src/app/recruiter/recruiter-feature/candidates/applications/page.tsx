"use client";

import { Suspense } from "react";
import { RefreshCw } from "lucide-react";
import ApplicationsPageContent from "./ApplicationsPageContent";

function ApplicationsLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <RefreshCw className="h-8 w-8 text-sky-600 animate-spin mb-4" />
      <p className="text-sm text-slate-600">Loading applications...</p>
    </div>
  );
}

export default function CandidateApplicationsPage() {
  return (
    <Suspense fallback={<ApplicationsLoading />}>
      <ApplicationsPageContent />
    </Suspense>
  );
}
