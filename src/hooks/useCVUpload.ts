import { useState } from "react";
import toast from "react-hot-toast";
import { CV } from "@/services/cvService";
import { uploadCvFile } from "@/services/cvFirebaseService";
import { createResume } from "@/services/resumeService";
import { useAuthStore } from "@/store/use-auth-store";

interface UseCVUploadReturn {
  isDragging: boolean;
  isUploading: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: (file: File) => Promise<void>;
}

export const useCVUpload = (
  uploadedCVs: CV[],
  setUploadedCVs: React.Dispatch<React.SetStateAction<CV[]>>,
  defaultCV: CV | null,
  setDefaultCV: React.Dispatch<React.SetStateAction<CV | null>>
): UseCVUploadReturn => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validation
    const maxSize = 3 * 1024 * 1024; // 3MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only .pdf, .doc, .docx files are supported");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size must not exceed 3MB");
      return;
    }

    // Get candidateId from authStore root (not from user object)
    const { candidateId, user } = useAuthStore.getState();
    const uid = candidateId ?? user?.id; // fallback to user.id if candidateId not loaded yet

    if (!uid) {
      toast.error("Authentication error: No candidateId found");
      return;
    }

    setIsUploading(true);

    try {
      // 🚀 STEP 1: Upload to Firebase Storage
      const uploadedCv = await uploadCvFile(String(uid), file);

      // 🚀 STEP 2: Create resume entry in backend
      const isActive = uploadedCVs.length === 0 && !defaultCV;
      await createResume({
        aboutMe: "",
        resumeUrl: uploadedCv.downloadUrl,
        type: "UPLOAD",
        isActive: isActive,
      });

      // 🚀 STEP 3: Update CV list in frontend
      setUploadedCVs(prev => [uploadedCv, ...prev]);

      // Auto set default if this is the first CV
      if (isActive) {
        setDefaultCV(uploadedCv);
      }

      toast.success("CV uploaded successfully!");

    } catch (error) {
      console.error("CV upload error:", error);
      toast.error("CV upload failed. Please try again");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isDragging,
    isUploading,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    handleFileUpload
  };
};
