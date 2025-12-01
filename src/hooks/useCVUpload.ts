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
  setDefaultCV: React.Dispatch<React.SetStateAction<CV | null>>,
  refresh?: () => Promise<void> // Optional refresh callback to reload data from API
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
    console.log("📤 CV Upload Flow Start:", {
      fileName: file.name,
      fileSize: (file.size / 1024 / 1024).toFixed(2) + " MB",
      fileType: file.type,
    });

    // Validation
    const maxSize = 3 * 1024 * 1024; // 3MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      console.error("❌ Invalid file type:", file.type);
      toast.error("Only .pdf, .doc, .docx files are supported");
      return;
    }

    if (file.size > maxSize) {
      console.error("❌ File too large:", file.size, "bytes");
      toast.error("File size must not exceed 3MB");
      return;
    }

    // Get candidateId from authStore root (not from user object)
    const { candidateId, user } = useAuthStore.getState();
    const uid = candidateId ?? user?.id; // fallback to user.id if candidateId not loaded yet

    if (!uid) {
      console.error("❌ Authentication error: No candidateId found");
      toast.error("Authentication error: No candidateId found");
      return;
    }

    console.log("✅ Validation passed. CandidateId:", uid);

    setIsUploading(true);

    try {
      // 🚀 STEP 1: Upload to Firebase Storage
      console.log("🚀 STEP 1: Uploading to Firebase Storage...");
      const uploadedCv = await uploadCvFile(String(uid), file);

      console.log("✅ Firebase upload result:", {
        id: uploadedCv.id,
        name: uploadedCv.name,
        downloadUrl: uploadedCv.downloadUrl,
        storagePath: uploadedCv.storagePath,
        size: uploadedCv.fileSize,
      });

      // �️ CRITICAL: Validate downloadUrl before proceeding
      if (!uploadedCv.downloadUrl) {
        console.error("❌ CRITICAL ERROR: uploadedCv.downloadUrl is undefined!");
        console.error("Full uploadedCv object:", uploadedCv);
        throw new Error(
          "Firebase upload succeeded but downloadUrl is missing. This should never happen. Check uploadCvFile() implementation."
        );
      }

      console.log("✅ downloadUrl validation passed:", uploadedCv.downloadUrl);

      // �🚀 STEP 2: Create resume entry in backend
      const isActive = uploadedCVs.length === 0 && !defaultCV;
      
      const payload = {
        aboutMe: "",
        resumeUrl: uploadedCv.downloadUrl, // GUARANTEED to be defined
        type: "UPLOAD",
        isActive: isActive,
      };

      console.log("🚀 STEP 2: Creating resume in backend...");
      console.log("Resume payload:", payload);

      await createResume(payload);

      console.log("✅ Backend resume created successfully");

      // 🚀 STEP 3: Refresh data from API to get the latest state
      console.log("🚀 STEP 3: Refreshing data from API...");
      if (refresh) {
        await refresh();
        console.log("✅ Data refreshed from API successfully");
      } else {
        // Fallback: Update CV list in frontend locally
        console.log("⚠️ No refresh callback, updating frontend state locally...");
        setUploadedCVs(prev => [uploadedCv, ...prev]);

        // Auto set default if this is the first CV
        if (isActive) {
          setDefaultCV(uploadedCv);
          console.log("✅ Set as default CV (first upload)");
        }
      }

      console.log("✅ CV Upload Flow Complete!");
      toast.success("CV uploaded successfully!");

    } catch (error: any) {
      console.error("❌ CV upload error:", {
        error,
        message: error?.message,
        stack: error?.stack,
      });

      // Provide user-friendly error messages based on error type
      let errorMessage = "CV upload failed. Please try again";

      if (error?.message?.includes("Firebase Storage")) {
        errorMessage = "Failed to upload file to storage. Please check your internet connection.";
      } else if (error?.message?.includes("downloadUrl")) {
        errorMessage = "File uploaded but URL retrieval failed. Please contact support.";
      } else if (error?.message?.includes("Permission denied")) {
        errorMessage = "Storage permission error. Please contact support.";
      } else if (error?.message?.includes("Backend resume creation")) {
        errorMessage = "File uploaded but failed to save to database. Please try again.";
      }

      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      console.log("🔚 Upload process ended (isUploading set to false)");
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
