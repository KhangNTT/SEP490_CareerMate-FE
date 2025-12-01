"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

/**
 * Redirect page - forwards to the main apply page at /jobs-detail/[id]/apply
 * This page exists for backward compatibility with old URLs
 */
export default function CandidateJobApplyRedirect() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  useEffect(() => {
    // Redirect to the main apply page
    router.replace(`/jobs-detail/${jobId}/apply`);
  }, [router, jobId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to application page...</p>
      </div>
    </div>
  );
}
