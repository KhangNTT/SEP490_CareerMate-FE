"use client";

import { useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

/**
 * Redirect page - forwards to the main success page at /jobs-detail/[id]/apply/success
 * This page exists for backward compatibility with old URLs
 */
export default function CandidateJobApplySuccessRedirect() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const jobId = params.id as string;

  useEffect(() => {
    // Redirect to the main success page with all query params
    const queryString = searchParams.toString();
    const url = queryString 
      ? `/jobs-detail/${jobId}/apply/success?${queryString}`
      : `/jobs-detail/${jobId}/apply/success`;
    router.replace(url);
  }, [router, jobId, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading success page...</p>
      </div>
    </div>
  );
}
