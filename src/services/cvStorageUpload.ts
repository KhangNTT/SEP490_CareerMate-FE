/**
 * Firebase Storage Upload Utility for CV Files
 * 
 * File naming convention: [originalName]_CM_[timestamp].[ext]
 * Storage path: candidates/{candidateId}/{storageName}
 * 
 * Example:
 *   CV.pdf → candidates/123/CV_CM_1732702341123.pdf
 */

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import {
  generateStorageName,
  extractOriginalName,
  getFileExtension,
  getContentType,
  isValidFileExtension,
  sanitizeFileName,
} from "@/utils/cvFileNameHelper";

// ===== Type Definitions =====

/**
 * Upload result containing all file information
 */
export interface UploadCvResult {
  originalName: string;      // Original file name (e.g., "CV.pdf")
  storageName: string;        // Renamed file name (e.g., "CV_CM_1732702341123.pdf")
  downloadUrl: string;        // Firebase download URL
  fullPath: string;           // Full storage path (e.g., "candidates/123/CV_CM_1732702341123.pdf")
  extension: string;          // File extension (e.g., "pdf")
  size: number;               // File size in bytes
  contentType: string;        // MIME type
  uploadedAt: string;         // ISO timestamp
}

/**
 * Upload options
 */
export interface UploadOptions {
  sanitize?: boolean;         // Sanitize file name (default: true)
  validate?: boolean;         // Validate file extension (default: true)
  allowedExtensions?: string[]; // Allowed extensions (default: pdf, doc, docx, jpg, png)
}

// ===== Constants =====

const CANDIDATES_PATH = 'candidates';
const DEFAULT_ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'png'];

// ===== Helper Functions =====

/**
 * Build full storage path
 * 
 * @param candidateId - Candidate ID
 * @param storageName - Storage file name
 * @returns Full path (e.g., "candidates/123/CV_CM_1732702341123.pdf")
 */
function buildStoragePath(candidateId: string, storageName: string): string {
  return `${CANDIDATES_PATH}/${candidateId}/${storageName}`;
}

/**
 * Format file size to human-readable string
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// ===== Main Upload Function =====

/**
 * Upload CV file to Firebase Storage
 * 
 * @param candidateId - Candidate ID (user ID)
 * @param file - File to upload
 * @param options - Upload options
 * @returns Upload result with file information
 * 
 * @example
 * const result = await uploadCvFile("123", file);
 * // result.originalName → "CV.pdf"
 * // result.storageName → "CV_CM_1732702341123.pdf"
 * // result.downloadUrl → "https://firebasestorage.googleapis.com/..."
 * // result.fullPath → "candidates/123/CV_CM_1732702341123.pdf"
 * 
 * @throws Error if upload fails or validation fails
 */
export async function uploadCvFile(
  candidateId: string,
  file: File,
  options: UploadOptions = {}
): Promise<UploadCvResult> {
  console.log("📤 Starting CV upload:", {
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    fileType: file.type,
    candidateId,
  });

  // Validate candidate ID
  if (!candidateId) {
    throw new Error("Candidate ID is required");
  }

  // Validate file
  if (!file) {
    throw new Error("File is required");
  }

  // Default options
  const {
    sanitize = true,
    validate = true,
    allowedExtensions = DEFAULT_ALLOWED_EXTENSIONS,
  } = options;

  // Extract original file name
  let originalName = file.name;

  // Sanitize file name if requested
  if (sanitize) {
    originalName = sanitizeFileName(originalName);
    console.log("🧹 Sanitized file name:", originalName);
  }

  // Validate file extension
  if (validate && !isValidFileExtension(originalName, allowedExtensions)) {
    const extension = getFileExtension(originalName);
    throw new Error(
      `Invalid file type: ${extension}. Allowed types: ${allowedExtensions.join(', ')}`
    );
  }

  try {
    // Generate storage name with timestamp
    const storageName = generateStorageName(originalName);
    console.log("📝 Generated storage name:", storageName);

    // Build full storage path
    const fullPath = buildStoragePath(candidateId, storageName);
    console.log("📁 Storage path:", fullPath);

    // Get file extension and content type
    const extension = getFileExtension(storageName);
    const contentType = getContentType(extension);

    // Create storage reference
    const storageRef = ref(storage, fullPath);

    // Upload file with metadata
    console.log("⬆️ Uploading to Firebase Storage...");
    const uploadResult = await uploadBytes(storageRef, file, {
      contentType: contentType,
      customMetadata: {
        candidateId: candidateId,
        originalName: originalName,
        storageName: storageName,
        uploadedAt: new Date().toISOString(),
      },
    });

    console.log("✅ Upload successful:", {
      path: uploadResult.ref.fullPath,
      size: uploadResult.metadata.size,
    });

    // Get download URL with retry logic
    let downloadUrl: string | undefined;
    let retries = 3;
    let lastError: Error | undefined;

    console.log("🔗 Fetching download URL...");

    while (retries > 0 && !downloadUrl) {
      try {
        downloadUrl = await getDownloadURL(storageRef);
        console.log("✅ Download URL obtained:", downloadUrl);
      } catch (error: any) {
        lastError = error;
        retries--;

        console.error(`⚠️ getDownloadURL attempt failed (${3 - retries}/3):`, {
          code: error?.code,
          message: error?.message,
        });

        if (retries > 0) {
          console.log(`⏳ Retrying in 1 second... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // Validate download URL
    if (!downloadUrl) {
      console.error("❌ CRITICAL: Download URL is undefined after all retries");
      console.error("Last error:", lastError);
      throw new Error(
        `Failed to get download URL after 3 attempts. ${
          lastError?.message || 'Unknown error'
        }`
      );
    }

    // Build result object
    const result: UploadCvResult = {
      originalName: originalName,
      storageName: storageName,
      downloadUrl: downloadUrl,
      fullPath: fullPath,
      extension: extension,
      size: file.size,
      contentType: contentType,
      uploadedAt: new Date().toISOString(),
    };

    console.log("✅ Upload complete:", {
      originalName: result.originalName,
      storageName: result.storageName,
      size: formatFileSize(result.size),
    });

    return result;
  } catch (error: any) {
    console.error("❌ Upload failed:", {
      error,
      code: error?.code,
      message: error?.message,
      fileName: file.name,
      candidateId,
    });

    // Re-throw with more context
    throw new Error(
      `Failed to upload CV file: ${error?.message || 'Unknown error'}. ${
        error?.code ? `Error code: ${error.code}` : ''
      }`
    );
  }
}

/**
 * Upload multiple CV files
 * 
 * @param candidateId - Candidate ID
 * @param files - Array of files to upload
 * @param options - Upload options
 * @returns Array of upload results
 */
export async function uploadMultipleCvFiles(
  candidateId: string,
  files: File[],
  options: UploadOptions = {}
): Promise<UploadCvResult[]> {
  console.log(`📤 Uploading ${files.length} files...`);

  const results: UploadCvResult[] = [];
  const errors: Error[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`📄 Processing file ${i + 1}/${files.length}: ${file.name}`);

    try {
      const result = await uploadCvFile(candidateId, file, options);
      results.push(result);
      console.log(`✅ File ${i + 1}/${files.length} uploaded successfully`);
    } catch (error: any) {
      console.error(`❌ File ${i + 1}/${files.length} failed:`, error.message);
      errors.push(error);
    }
  }

  console.log(`✅ Upload complete: ${results.length}/${files.length} successful`);

  if (errors.length > 0) {
    console.warn(`⚠️ ${errors.length} files failed to upload`);
  }

  return results;
}

// ===== Export helper functions =====
export {
  extractOriginalName,
  generateStorageName,
  getFileExtension,
  isValidFileExtension,
  sanitizeFileName,
  formatFileSize,
};
