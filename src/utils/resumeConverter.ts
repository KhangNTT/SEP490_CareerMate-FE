import { Resume, ResumeType } from "@/services/resumeService";
import { CV, CVSource } from "@/services/cvService";
import { extractOriginalName } from "./cvFileNameHelper";

/**
 * Convert Resume type to CV source
 */
function resumeTypeToSource(type: ResumeType): CVSource {
  switch (type) {
    case "WEB":
      return "builder";
    case "UPLOAD":
      return "upload";
    case "DRAFT":
      return "draft";
    default:
      return "upload";
  }
}

/**
 * Convert Resume type to CV type
 */
function resumeTypeToType(type: ResumeType): "uploaded" | "built" {
  return type === "UPLOAD" ? "uploaded" : "built";
}

/**
 * Get file size from resume URL
 */
async function getFileSizeFromUrl(url: string): Promise<number> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentLength = response.headers.get("content-length");
    return contentLength ? parseInt(contentLength, 10) : 0;
  } catch (error) {
    console.error("Error getting file size:", error);
    return 0;
  }
}

/**
 * Format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "Unknown";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Extract file name from URL
 */
function getFileNameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const encodedName = pathname.split("%2F").pop(); // lấy phần sau ký tự %2F cuối cùng
    const decoded = decodeURIComponent(encodedName || "");
    return extractOriginalName(decoded); // bỏ _CM_timestamp
  } catch {
    return "Unknown.pdf";
  }
}

/**
 * Convert Resume from API to CV for UI
 */
export async function resumeToCV(resume: Resume, candidateId?: number): Promise<CV> {
  const source = resumeTypeToSource(resume.type);
  const type = resumeTypeToType(resume.type);
  const fileName = getFileNameFromUrl(
    resume.resumeUrl,
    `CV_${resume.type}_${resume.resumeId}.pdf`
  );

  // Try to get file size (this will be async)
  let size = 0;
  try {
    size = await getFileSizeFromUrl(resume.resumeUrl);
  } catch (error) {
    console.warn("Could not fetch file size:", error);
  }

  return {
    id: resume.resumeId.toString(),
    name: fileName,
    type,
    source,
    createdAt: resume.createdAt,
    updatedAt: resume.createdAt, // API doesn't provide updatedAt
    size,
    fileSize: formatFileSize(size),
    isDefault: resume.isActive,
    visibility: "private", // Default to private
    privacy: "private",
    downloadUrl: resume.resumeUrl,
    fileUrl: resume.resumeUrl,
    userId: candidateId?.toString() || resume.candidateId.toString(),
    storagePath: resume.resumeUrl,
    parsedStatus: resume.parsedStatus ?? "ready", // Use API status or default to ready
  };
}

/**
 * Convert multiple Resumes to CVs
 */
export async function resumesToCVs(
  resumes: Resume[],
  candidateId?: number
): Promise<CV[]> {
  const cvPromises = resumes.map((resume) => resumeToCV(resume, candidateId));
  return Promise.all(cvPromises);
}

/**
 * Convert Resume from API to CV for UI (synchronous version without size fetch)
 */
export function resumeToCVSync(resume: Resume, candidateId?: number): CV {
  const source = resumeTypeToSource(resume.type);
  const type = resumeTypeToType(resume.type);
  const fileName = getFileNameFromUrl(
    resume.resumeUrl,
    `CV_${resume.type}_${resume.resumeId}.pdf`
  );

  return {
    id: resume.resumeId.toString(),
    name: fileName,
    type,
    source,
    createdAt: resume.createdAt,
    updatedAt: resume.createdAt,
    size: 0, // Will be 0 for sync version
    fileSize: "Unknown",
    isDefault: resume.isActive,
    visibility: "private",
    privacy: "private",
    downloadUrl: resume.resumeUrl,
    fileUrl: resume.resumeUrl,
    userId: candidateId?.toString() || resume.candidateId.toString(),
    storagePath: resume.resumeUrl,
    parsedStatus: resume.parsedStatus ?? "ready", // Use API status or default to ready
  };
}

/**
 * Convert multiple Resumes to CVs (synchronous)
 */
export function resumesToCVsSync(resumes: Resume[], candidateId?: number): CV[] {
  return resumes.map((resume) => resumeToCVSync(resume, candidateId));
}
