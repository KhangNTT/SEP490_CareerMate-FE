import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

// ===== Type Definitions =====
export type CVType = "CREATED" | "UPLOADED";
export type CVSource = "upload" | "builder" | "draft";
export type CVVisibility = "public" | "private";
export type CVParsedStatus = "processing" | "ready" | "failed";
export type CVStatus = "DRAFT" | "READY";

// ===== CV Interface =====
export interface CV {
  // Core fields (always present)
  id: string;
  name: string;
  type: CVType;
  source?: CVSource; // Optional for compatibility with legacy components
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  size?: number; // bytes (optional)
  fileSize?: string; // formatted size (e.g., "1.2 MB") (optional)
  isDefault: boolean;
  visibility?: CVVisibility; // Optional
  privacy?: CVVisibility; // alias for visibility (optional, for compatibility)
  downloadUrl: string;
  fileUrl?: string; // alias for downloadUrl (optional, for compatibility)
  userId?: string; // Optional
  candidateId?: string; // Optional
  storagePath: string; // path in Firebase Storage
  parsedStatus?: CVParsedStatus; // Optional for UI display
  status: CVStatus; // DRAFT or READY
}

// ===== Constants =====
const CV_ROOT = 'careermate-files/candidates';

// ===== Helper Functions =====

/**
 * Format file size from bytes to human-readable
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Generate CV storage path
 * Path: careermate-files/candidates/{candidateId}/cv/{filename}
 */
function getCvStoragePath(candidateId: string, filename: string): string {
  return `${CV_ROOT}/${candidateId}/cv/${filename}`;
}

// ===== Firebase Storage Functions =====

/**
 * Upload CV file to Firebase Storage with metadata
 * Path: careermate-files/candidates/{candidateId}/cv/{generatedFilename}
 * @param candidateId - The candidate's ID
 * @param file - The CV file to upload
 * @returns Metadata object (does NOT include File/Blob)
 */
export async function uploadCvFile(candidateId: string, file: File) {
  try {
    // Extract file extension
    const ext = file.name.split('.').pop() || 'pdf';
    
    // Generate unique filename using crypto.randomUUID()
    const filename = crypto.randomUUID() + '.' + ext;
    
    // Build storage path using helper function
    const path = getCvStoragePath(candidateId, filename);
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        candidateId,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });
    const downloadUrl = await getDownloadURL(storageRef);
    
    // Return ONLY metadata (no File/Blob)
    return {
      id: filename,
      name: file.name,
      candidateId,
      storagePath: path,
      downloadUrl,
      type: 'UPLOADED' as const,
      source: 'upload' as const,
      status: 'READY' as const,
      isDefault: false,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      size: file.size,
      fileSize: formatFileSize(file.size),
    };
  } catch (error) {
    console.error("Error uploading CV file:", error);
    throw new Error("Failed to upload CV file");
  }
}

/**
 * Upload avatar to Firebase Storage (public)
 * Path: /careermate-files/candidates/{userId}/profile/{fileName}
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const fileRef = ref(storage, `careermate-files/candidates/${userId}/profile/${fileName}`);
    
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error("Failed to upload avatar");
  }
}

/**
 * Upload CV PDF from Blob to Firebase Storage (private)
 * Used after generating PDF with Puppeteer
 * Path: /careermate-files/candidates/{candidateId}/cv/{fileName}
 */
export async function uploadCVPDF(
  candidateId: string, 
  pdfBlob: Blob, 
  customFileName?: string
): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileName = customFileName 
      ? `${timestamp}_${customFileName}.pdf`
      : `cv_${timestamp}.pdf`;
    
    const path = getCvStoragePath(candidateId, fileName);
    const fileRef = ref(storage, path);
    
    // Upload blob with metadata
    await uploadBytes(fileRef, pdfBlob, {
      contentType: "application/pdf",
      customMetadata: {
        candidateId,
        uploadedAt: new Date().toISOString(),
        type: "generated-cv",
      },
    });
    
    const downloadURL = await getDownloadURL(fileRef);
    
    console.log("✅ CV PDF uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("❌ Error uploading CV PDF:", error);
    throw new Error("Failed to upload CV PDF to Firebase");
  }
}

/**
 * Delete file from Firebase Storage by storage path
 * @param storagePath - The full storage path (e.g., "careermate-files/candidates/123/cv/file.pdf")
 */
export async function deleteFile(storagePath: string): Promise<void> {
  try {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
    console.log("✅ File deleted successfully:", storagePath);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file from Firebase Storage");
  }
}

/**
 * Delete file from Firebase Storage by download URL
 * Extracts the storage path from the URL and deletes the file
 * @param downloadUrl - The Firebase download URL
 */
export async function deleteFileByUrl(downloadUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, downloadUrl);
    await deleteObject(fileRef);
    console.log("✅ File deleted successfully from URL");
  } catch (error) {
    console.error("Error deleting file by URL:", error);
    throw new Error("Failed to delete file from Firebase Storage");
  }
}

/**
 * Get download URL from Firebase Storage path
 * @param storagePath - The storage path
 * @returns Download URL
 */
export async function getDownloadUrl(storagePath: string): Promise<string> {
  try {
    const storageRef = ref(storage, storagePath);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error getting download URL:", error);
    throw new Error("Failed to get download URL");
  }
}

