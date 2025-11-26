// CV Service - Simple re-export wrapper for Firebase Storage service
// This file is deprecated and kept only for backward compatibility
// New code should import directly from cvFirebaseService.ts

import * as firebaseCV from "./cvFirebaseService";

// Re-export CV interface and types from Firebase service
export type { 
  CV, 
  CVType, 
  CVSource, 
  CVVisibility, 
  CVParsedStatus,
  CVStatus 
} from "./cvFirebaseService";

// Re-export Firebase Storage functions
export const {
  uploadCvFile,
  uploadAvatar,
  uploadCVPDF,
  deleteFile,
  deleteFileByUrl,
  getDownloadUrl,
  formatFileSize,
} = firebaseCV;

// ===== DEPRECATED FUNCTIONS =====
// The following functions used Firestore and are no longer supported
// Use REST API through hooks/services instead

class CVService {
  /**
   * @deprecated Use REST API with useResumeData hook instead
   */
  async fetchCVs(userId: string): Promise<{ uploaded: firebaseCV.CV[]; built: firebaseCV.CV[]; draft: firebaseCV.CV[] }> {
    console.warn("CVService.fetchCVs is deprecated. Use REST API with useResumeData hook instead.");
    throw new Error("This method is deprecated. Use REST API with useResumeData hook instead.");
  }

  /**
   * @deprecated Use uploadCvFile from cvFirebaseService directly
   */
  async uploadCV(userId: string, file: File, metadata?: Partial<firebaseCV.CV>): Promise<firebaseCV.CV> {
    console.warn("CVService.uploadCV is deprecated. Use uploadCvFile from cvFirebaseService instead.");
    throw new Error("This method is deprecated. Use uploadCvFile from cvFirebaseService instead.");
  }

  /**
   * @deprecated Use REST API to set default CV
   */
  async setDefaultCV(userId: string, cvId: string): Promise<void> {
    console.warn("CVService.setDefaultCV is deprecated. Use REST API instead.");
    throw new Error("This method is deprecated. Use REST API instead.");
  }

  /**
   * @deprecated Use deleteFile from cvFirebaseService for storage cleanup only
   */
  async deleteCV(cvId: string): Promise<void> {
    console.warn("CVService.deleteCV is deprecated. Use REST API for CV deletion + deleteFile for storage cleanup.");
    throw new Error("This method is deprecated. Use REST API for CV deletion.");
  }

  /**
   * @deprecated Feature removed
   */
  async syncCVToProfile(cvId: string): Promise<void> {
    console.warn("CVService.syncCVToProfile is deprecated and not implemented.");
    throw new Error("This method is deprecated.");
  }

  /**
   * Download a CV from its download URL
   */
  async downloadCV(cvId: string, downloadUrl: string): Promise<Blob> {
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error("Failed to download CV");
      }
      return await response.blob();
    } catch (error) {
      console.error("Error downloading CV:", error);
      throw error;
    }
  }

  /**
   * @deprecated Use REST API to rename CV
   */
  async renameCV(cvId: string, newName: string): Promise<void> {
    console.warn("CVService.renameCV is deprecated. Use REST API instead.");
    throw new Error("This method is deprecated. Use REST API instead.");
  }

  /**
   * @deprecated Use REST API to update CV privacy
   */
  async updateCVPrivacy(cvId: string, privacy: "private" | "public"): Promise<void> {
    console.warn("CVService.updateCVPrivacy is deprecated. Use REST API instead.");
    throw new Error("This method is deprecated. Use REST API instead.");
  }

  /**
   * @deprecated Use REST API to update CV
   */
  async updateCV(cvId: string, updates: Partial<firebaseCV.CV>): Promise<void> {
    console.warn("CVService.updateCV is deprecated. Use REST API instead.");
    throw new Error("This method is deprecated. Use REST API instead.");
  }

  /**
   * @deprecated Use REST API to get CV by ID
   */
  async getCVById(cvId: string): Promise<firebaseCV.CV | null> {
    console.warn("CVService.getCVById is deprecated. Use REST API instead.");
    throw new Error("This method is deprecated. Use REST API instead.");
  }

  /**
   * @deprecated Use REST API to get default CV
   */
  async getDefaultCV(userId: string): Promise<firebaseCV.CV | null> {
    console.warn("CVService.getDefaultCV is deprecated. Use REST API instead.");
    throw new Error("This method is deprecated. Use REST API instead.");
  }

  /**
   * @deprecated Firestore sync is no longer used
   */
  async syncStorageWithFirestore(userId: string): Promise<void> {
    console.warn("CVService.syncStorageWithFirestore is deprecated. Firestore is no longer used.");
    throw new Error("This method is deprecated. Firestore is no longer used.");
  }
}

export const cvService = new CVService();

