import { useState } from "react";
import toast from "react-hot-toast";
import { CV } from "@/services/cvService";
import { useCVStore } from "@/stores/cvStore";

interface UseCVActionsReturn {
  showPreview: boolean;
  previewUrl: string | null;
  selectedCV: CV | null;
  handleSetDefault: (cv: CV) => void;
  handleSyncToProfile: (cv: CV) => Promise<void>;
  handlePreview: (cv: CV) => void;
  handleClosePreview: () => void;
  handleDelete: (cvId: string) => void;
}

export const useCVActions = (
  uploadedCVs: CV[],
  setUploadedCVs: React.Dispatch<React.SetStateAction<CV[]>>,
  builtCVs: CV[],
  setBuiltCVs: React.Dispatch<React.SetStateAction<CV[]>>,
  draftCVs: CV[],
  setDraftCVs: React.Dispatch<React.SetStateAction<CV[]>>,
  defaultCV: CV | null,
  setDefaultCV: React.Dispatch<React.SetStateAction<CV | null>>
): UseCVActionsReturn => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);

  // Extract Zustand store action
  const setDefaultCvInStore = useCVStore((state) => state.setDefaultCv);

  const handleSetDefault = (cv: CV) => {
    // Update all local state CVs
    setUploadedCVs(prev => prev.map(c => ({ ...c, isDefault: c.id === cv.id })));
    setBuiltCVs(prev => prev.map(c => ({ ...c, isDefault: c.id === cv.id })));
    setDraftCVs(prev => prev.map(c => ({ ...c, isDefault: c.id === cv.id })));
    setDefaultCV(cv);
    
    // Sync to Zustand store
    setDefaultCvInStore(cv.id);
    console.log('⭐ Set default synced to Zustand:', cv.id);
    
    toast.success(`"${cv.name}" set as default CV`);
  };

  const handleSyncToProfile = async (cv: CV) => {
    if (cv.parsedStatus !== "ready") {
      toast.error("CV analysis not complete yet");
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("CV data synced to profile");
    } catch (error) {
      toast.error("Sync failed. Please try again");
    }
  };

  const handlePreview = (cv: CV) => {
    setSelectedCV(cv);
    setPreviewUrl(cv.fileUrl ?? null);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedCV(null);
    setPreviewUrl(null);
  };

  const handleDelete = (cvId: string) => {
    if (window.confirm("Are you sure you want to delete this CV?")) {
      setUploadedCVs(prev => prev.filter(cv => cv.id !== cvId));
      setBuiltCVs(prev => prev.filter(cv => cv.id !== cvId));
      setDraftCVs(prev => prev.filter(cv => cv.id !== cvId));

      // Update default if deleted CV was default
      if (defaultCV?.id === cvId) {
        const remaining = [...uploadedCVs, ...builtCVs, ...draftCVs].filter(cv => cv.id !== cvId);
        setDefaultCV(remaining[0] || null);
      }

      toast.success("CV deleted");
    }
  };

  return {
    showPreview,
    previewUrl,
    selectedCV,
    handleSetDefault,
    handleSyncToProfile,
    handlePreview,
    handleClosePreview,
    handleDelete
  };
};
