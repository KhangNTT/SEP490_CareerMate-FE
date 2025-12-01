import { useState, useEffect, useCallback } from "react";
import { Resume, resumeService } from "@/services/resumeService";

interface UseResumeDataReturn {
  resumes: Resume[];
  webResumes: Resume[];
  uploadedResumes: Resume[];
  draftResumes: Resume[];
  activeResume: Resume | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage resume data
 */
export function useResumeData(): UseResumeDataReturn {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [webResumes, setWebResumes] = useState<Resume[]>([]);
  const [uploadedResumes, setUploadedResumes] = useState<Resume[]>([]);
  const [draftResumes, setDraftResumes] = useState<Resume[]>([]);
  const [activeResume, setActiveResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await resumeService.fetchResumesByType();

      setWebResumes(data.web);
      setUploadedResumes(data.uploaded);
      setDraftResumes(data.draft);
      setActiveResume(data.active);
      
      // Combine all resumes
      const allResumes = [...data.web, ...data.uploaded, ...data.draft];
      setResumes(allResumes);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch resumes");
      setError(error);
      console.error("Error in useResumeData:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    resumes,
    webResumes,
    uploadedResumes,
    draftResumes,
    activeResume,
    loading,
    error,
    refresh,
  };
}
