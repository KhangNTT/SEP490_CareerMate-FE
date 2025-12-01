/**
 * CV File Name Helper Utilities
 * 
 * Handles file naming convention: [originalName]_CM_[timestamp].[ext]
 * Example: CV.pdf → CV_CM_1732702341123.pdf
 */

const CV_SEPARATOR = '_CM_';

/**
 * Extract original file name from storage name
 * 
 * @param storageName - The renamed file name from Firebase (e.g., "CV_CM_1732702341123.pdf")
 * @returns Original file name (e.g., "CV.pdf")
 * 
 * @example
 * extractOriginalName("CV_CM_1732702341123.pdf") // → "CV.pdf"
 * extractOriginalName("My Resume_CM_1732702341123.pdf") // → "My Resume.pdf"
 * extractOriginalName("CV.pdf") // → "CV.pdf" (no separator, return as-is)
 */
export function extractOriginalName(storageName: string): string {
  if (!storageName) {
    return 'Unknown.pdf';
  }

  // If no separator found, return as-is
  if (!storageName.includes(CV_SEPARATOR)) {
    return storageName;
  }

  try {
    // Split at _CM_ separator
    const parts = storageName.split(CV_SEPARATOR);
    
    if (parts.length < 2) {
      return storageName;
    }

    // Get original name (before _CM_)
    const originalNameWithoutExt = parts[0];
    
    // Get the extension from the storage name
    const lastPart = parts[parts.length - 1]; // "1732702341123.pdf"
    const extMatch = lastPart.match(/\.([^.]+)$/);
    const extension = extMatch ? extMatch[1] : 'pdf';

    // Reconstruct: originalName + extension
    return `${originalNameWithoutExt}.${extension}`;
  } catch (error) {
    console.error('Error extracting original name:', error);
    return storageName;
  }
}

/**
 * Generate storage file name with timestamp
 * 
 * @param originalFileName - Original file name from user (e.g., "CV.pdf")
 * @returns Storage file name with timestamp (e.g., "CV_CM_1732702341123.pdf")
 * 
 * @example
 * generateStorageName("CV.pdf") // → "CV_CM_1732702341123.pdf"
 * generateStorageName("My Resume.pdf") // → "My Resume_CM_1732702341123.pdf"
 * generateStorageName("document") // → "document_CM_1732702341123.pdf"
 */
export function generateStorageName(originalFileName: string): string {
  if (!originalFileName) {
    return `file${CV_SEPARATOR}${Date.now()}.pdf`;
  }

  try {
    // Extract file name without extension
    const lastDotIndex = originalFileName.lastIndexOf('.');
    
    let nameWithoutExt: string;
    let extension: string;

    if (lastDotIndex > 0) {
      nameWithoutExt = originalFileName.substring(0, lastDotIndex);
      extension = originalFileName.substring(lastDotIndex + 1);
    } else {
      // No extension found, default to pdf
      nameWithoutExt = originalFileName;
      extension = 'pdf';
    }

    // Generate timestamp
    const timestamp = Date.now();

    // Build storage name: [originalName]_CM_[timestamp].[ext]
    return `${nameWithoutExt}${CV_SEPARATOR}${timestamp}.${extension}`;
  } catch (error) {
    console.error('Error generating storage name:', error);
    return `file${CV_SEPARATOR}${Date.now()}.pdf`;
  }
}

/**
 * Extract file extension from file name
 * 
 * @param fileName - File name
 * @returns Extension (without dot)
 * 
 * @example
 * getFileExtension("CV.pdf") // → "pdf"
 * getFileExtension("document.docx") // → "docx"
 * getFileExtension("noextension") // → "pdf"
 */
export function getFileExtension(fileName: string): string {
  if (!fileName) {
    return 'pdf';
  }

  const lastDotIndex = fileName.lastIndexOf('.');
  
  if (lastDotIndex > 0) {
    return fileName.substring(lastDotIndex + 1).toLowerCase();
  }

  return 'pdf'; // Default extension
}

/**
 * Validate file extension
 * 
 * @param fileName - File name to validate
 * @param allowedExtensions - Array of allowed extensions (default: pdf, doc, docx, jpg, png)
 * @returns true if valid, false otherwise
 * 
 * @example
 * isValidFileExtension("CV.pdf") // → true
 * isValidFileExtension("photo.jpg") // → true
 * isValidFileExtension("virus.exe") // → false
 */
export function isValidFileExtension(
  fileName: string, 
  allowedExtensions: string[] = ['pdf', 'doc', 'docx', 'jpg', 'png']
): boolean {
  const extension = getFileExtension(fileName);
  return allowedExtensions.includes(extension);
}

/**
 * Get content type from file extension
 * 
 * @param extension - File extension (without dot)
 * @returns MIME type
 */
export function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
  };

  return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
}

/**
 * Sanitize file name (remove special characters)
 * 
 * @param fileName - Original file name
 * @returns Sanitized file name
 * 
 * @example
 * sanitizeFileName("My CV (final)!.pdf") // → "My CV final.pdf"
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) {
    return 'file';
  }

  // Get extension first
  const extension = getFileExtension(fileName);
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.') || fileName.length);

  // Remove special characters except spaces, hyphens, and underscores
  const sanitized = nameWithoutExt
    .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  return sanitized ? `${sanitized}.${extension}` : `file.${extension}`;
}
