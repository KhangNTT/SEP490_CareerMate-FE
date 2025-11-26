"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { CV, getCVsByUser, getDefaultCV } from "@/services/cvFirebaseService";
import { useAuthStore } from "@/store/use-auth-store";

interface UseCVDataReturn {
  cvs: CV[];
  defaultCV: CV | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook để fetch và subscribe CVs từ Firebase
 * 
 * @param userId - User ID để fetch CVs (optional, sẽ lấy từ auth store nếu không có)
 * @returns Object chứa cvs, defaultCV, loading, error, và refresh function
 * 
 * @example
 * ```tsx
 * const { cvs, defaultCV, loading, error, refresh } = useCVData();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <div>
 *     {defaultCV && <CVCard cv={defaultCV} isDefault />}
 *     {cvs.map(cv => <CVCard key={cv.id} cv={cv} />)}
 *   </div>
 * );
 * ```
 */
export function useCVData(userId?: string): UseCVDataReturn {
  // State
  const [cvs, setCvs] = useState<CV[]>([]);
  const [defaultCV, setDefaultCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Get userId from auth store if not provided
  const { user, candidateId } = useAuthStore();
  const effectiveUserId = userId || user?.id || candidateId?.toString() || "";

  /**
   * Fetch CVs một lần (không realtime)
   */
  const fetchCVs = useCallback(async () => {
    if (!effectiveUserId) {
      setLoading(false);
      setError(new Error("User ID not found"));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch CVs
      const fetchedCVs = await getCVsByUser(effectiveUserId);
      setCvs(fetchedCVs);

      // Find default CV
      const defaultCv = fetchedCVs.find((cv) => cv.isDefault) || null;
      setDefaultCV(defaultCv);

      // Nếu không có default CV, fetch riêng
      if (!defaultCv) {
        const fetchedDefaultCV = await getDefaultCV(effectiveUserId);
        setDefaultCV(fetchedDefaultCV);
      }
    } catch (err) {
      console.error("Error fetching CVs:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch CVs"));
    } finally {
      setLoading(false);
    }
  }, [effectiveUserId]);

  /**
   * Refresh CVs (gọi lại fetch)
   */
  const refresh = useCallback(async () => {
    await fetchCVs();
  }, [fetchCVs]);

  /**
   * Setup realtime listener với Firestore
   */
  useEffect(() => {
    if (!effectiveUserId) {
      setLoading(false);
      setError(new Error("User ID not found"));
      return;
    }

    setLoading(true);
    setError(null);

    // Query Firestore
    const cvsRef = collection(firestore, "cvs");
    const q = query(
      cvsRef,
      where("userId", "==", effectiveUserId),
      orderBy("createdAt", "desc")
    );

    // Subscribe to realtime updates
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const updatedCVs: CV[] = [];

          for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            const createdAt =
              data.createdAt?.toDate?.()?.toISOString() ||
              new Date().toISOString();
            const updatedAt =
              data.updatedAt?.toDate?.()?.toISOString() || createdAt;

            const cv: CV = {
              id: docSnap.id,
              name: data.name || "Untitled CV",
              type: data.type || "uploaded",
              createdAt,
              updatedAt,
              size: data.size || 0,
              fileSize: formatFileSize(data.size || 0),
              isDefault: data.isDefault || false,
              visibility: data.visibility || "private",
              downloadUrl: data.downloadUrl || "",
              userId: data.userId || "",
              storagePath: data.storagePath || "",
              parsedStatus: data.parsedStatus || "ready",
              source: data.type === "built" ? "builder" : "upload",
              privacy: data.visibility || "private",
              fileUrl: data.downloadUrl || "",
            };

            updatedCVs.push(cv);
          }

          setCvs(updatedCVs);

          // Update default CV
          const newDefaultCV = updatedCVs.find((cv) => cv.isDefault) || null;
          setDefaultCV(newDefaultCV);

          setLoading(false);
        } catch (err) {
          console.error("Error processing CV snapshot:", err);
          setError(
            err instanceof Error ? err : new Error("Failed to process CVs")
          );
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error in CV snapshot listener:", err);
        setError(err instanceof Error ? err : new Error("Failed to listen to CVs"));
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, [effectiveUserId]);

  return {
    cvs,
    defaultCV,
    loading,
    error,
    refresh,
  };
}

/**
 * Helper function để format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Hook đơn giản hơn, chỉ fetch 1 lần không realtime
 */
export function useCVDataSimple(userId?: string): UseCVDataReturn {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [defaultCV, setDefaultCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { user, candidateId } = useAuthStore();
  const effectiveUserId = userId || user?.id || candidateId?.toString() || "";

  const fetchCVs = useCallback(async () => {
    if (!effectiveUserId) {
      setLoading(false);
      setError(new Error("User ID not found"));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fetchedCVs = await getCVsByUser(effectiveUserId);
      setCvs(fetchedCVs);

      const defaultCv = fetchedCVs.find((cv) => cv.isDefault) || null;
      setDefaultCV(defaultCv);
    } catch (err) {
      console.error("Error fetching CVs:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch CVs"));
    } finally {
      setLoading(false);
    }
  }, [effectiveUserId]);

  useEffect(() => {
    fetchCVs();
  }, [fetchCVs]);

  return {
    cvs,
    defaultCV,
    loading,
    error,
    refresh: fetchCVs,
  };
}
