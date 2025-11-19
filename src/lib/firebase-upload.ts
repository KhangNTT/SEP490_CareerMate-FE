import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

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
 * Upload CV to Firebase Storage (private)
 * Path: /careermate-files/candidates/{userId}/cv/{fileName}
 */
export async function uploadCV(userId: string, file: File): Promise<string> {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const fileRef = ref(storage, `careermate-files/candidates/${userId}/cv/${fileName}`);
    
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading CV:", error);
    throw new Error("Failed to upload CV");
  }
}

/**
 * Upload CV PDF from Blob to Firebase Storage (private)
 * Used after generating PDF with Puppeteer
 * Path: /careermate-files/candidates/{userId}/cv/{fileName}
 */
export async function uploadCVPDF(
  userId: string, 
  pdfBlob: Blob, 
  customFileName?: string
): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileName = customFileName 
      ? `${timestamp}_${customFileName}.pdf`
      : `cv_${timestamp}.pdf`;
    
    const fileRef = ref(storage, `careermate-files/candidates/${userId}/cv/${fileName}`);
    
    // Upload blob với metadata
    await uploadBytes(fileRef, pdfBlob, {
      contentType: "application/pdf",
      customMetadata: {
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
 * Delete file from Firebase Storage
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
}
