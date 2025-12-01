/**
 * Example: CV Upload Component with new file naming system
 * 
 * This component demonstrates how to:
 * 1. Upload CV with format: [originalName]_CM_[timestamp].[ext]
 * 2. Display original name to users
 * 3. Use storage name internally
 */

"use client";

import { useState } from "react";
import { uploadCvFile, extractOriginalName, UploadCvResult } from "@/services/cvStorageUpload";
import { createResume } from "@/services/resumeService";
import { useAuthStore } from "@/store/use-auth-store";
import toast from "react-hot-toast";

interface UploadedCV {
  resumeId: number;
  originalName: string;      // Display name
  storageName: string;        // Storage reference
  downloadUrl: string;        // Firebase URL
  uploadedAt: string;
  size: string;
}

export default function ExampleCVUpload() {
  const [uploadedCVs, setUploadedCVs] = useState<UploadedCV[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { candidateId } = useAuthStore();

  /**
   * Handle file upload
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!candidateId) {
      toast.error("Please login first");
      return;
    }

    setIsUploading(true);

    try {
      console.log("=== Upload Flow Start ===");

      // Step 1: Upload to Firebase Storage
      console.log("📤 Step 1: Uploading to Firebase...");
      const uploadResult: UploadCvResult = await uploadCvFile(String(candidateId), file);

      console.log("✅ Firebase upload result:", {
        original: uploadResult.originalName,
        storage: uploadResult.storageName,
        url: uploadResult.downloadUrl.substring(0, 50) + "...",
      });

      // Step 2: Save to backend database
      console.log("📤 Step 2: Saving to database...");
      const resume = await createResume({
        aboutMe: "",
        resumeUrl: uploadResult.downloadUrl,
        // NOTE: You need to update your backend to accept storageName
        // storageName: uploadResult.storageName,
        type: "UPLOAD",
        isActive: uploadedCVs.length === 0, // First CV is active
      });

      console.log("✅ Database save result:", {
        resumeId: resume.resumeId,
        type: resume.type,
      });

      // Step 3: Add to UI list
      console.log("📤 Step 3: Updating UI...");
      const newCV: UploadedCV = {
        resumeId: resume.resumeId,
        originalName: uploadResult.originalName,      // "CV.pdf"
        storageName: uploadResult.storageName,        // "CV_CM_1732702341123.pdf"
        downloadUrl: uploadResult.downloadUrl,
        uploadedAt: uploadResult.uploadedAt,
        size: formatBytes(uploadResult.size),
      };

      setUploadedCVs(prev => [newCV, ...prev]);

      console.log("✅ Upload flow complete!");
      console.log("=== Upload Flow End ===");

      toast.success(`"${uploadResult.originalName}" uploaded successfully!`);

      // Reset input
      e.target.value = "";
    } catch (error: any) {
      console.error("❌ Upload failed:", error);
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Handle CV preview
   */
  const handlePreview = (cv: UploadedCV) => {
    console.log("🔍 Opening preview:", {
      display: cv.originalName,      // Show to user: "CV.pdf"
      storage: cv.storageName,       // Internal: "CV_CM_1732702341123.pdf"
      url: cv.downloadUrl,
    });

    // Open in new tab
    window.open(cv.downloadUrl, "_blank");
  };

  /**
   * Handle CV download
   */
  const handleDownload = (cv: UploadedCV) => {
    console.log("📥 Downloading:", {
      display: cv.originalName,
      storage: cv.storageName,
    });

    // Create temporary link
    const link = document.createElement("a");
    link.href = cv.downloadUrl;
    link.download = cv.originalName; // Use original name for download
    link.click();
  };

  /**
   * Format bytes to human readable
   */
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">CV Upload Example</h1>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Upload New CV</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id="cv-upload"
          />
          
          <label
            htmlFor="cv-upload"
            className={`cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isUploading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Choose File
              </>
            )}
          </label>
          
          <p className="text-sm text-gray-500 mt-2">
            PDF, DOC, or DOCX (max 3MB)
          </p>
        </div>
      </div>

      {/* CV List Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Uploaded CVs ({uploadedCVs.length})
        </h2>

        {uploadedCVs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No CVs uploaded yet
          </div>
        ) : (
          <div className="space-y-4">
            {uploadedCVs.map((cv) => (
              <div
                key={cv.resumeId}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Display original name to user */}
                    <h3 className="font-semibold text-gray-900">
                      {cv.originalName}
                    </h3>
                    
                    {/* Show metadata */}
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>Size: {cv.size}</span>
                      <span>
                        Uploaded: {new Date(cv.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Show storage name for debugging (can remove in production) */}
                    <div className="mt-2 text-xs text-gray-400 font-mono" title="Storage Name">
                      🗄️ {cv.storageName}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(cv)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleDownload(cv)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📝 File Naming System</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Display Name:</strong> Original file name (e.g., "CV.pdf")</li>
          <li>• <strong>Storage Name:</strong> With timestamp (e.g., "CV_CM_1732702341123.pdf")</li>
          <li>• <strong>Storage Path:</strong> candidates/{"{candidateId}"}/{"{storageName}"}</li>
          <li>• <strong>UI Shows:</strong> Always display original name to users</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Example: Display CV in a list (from database)
 */
export function CVListExample({ resumes }: { resumes: any[] }) {
  return (
    <div className="space-y-2">
      {resumes.map((resume) => {
        // Extract original name for display
        const displayName = extractOriginalName(resume.storageName || resume.resumeUrl);

        return (
          <div key={resume.resumeId} className="p-4 border rounded">
            {/* Show original name to user */}
            <h3 className="font-semibold">{displayName}</h3>
            
            {/* Actions use downloadUrl */}
            <div className="flex gap-2 mt-2">
              <a
                href={resume.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Preview
              </a>
              <a
                href={resume.resumeUrl}
                download={displayName}
                className="text-green-600 hover:underline"
              >
                Download
              </a>
            </div>

            {/* Debug info (remove in production) */}
            <div className="mt-2 text-xs text-gray-400">
              Storage: {resume.storageName}
            </div>
          </div>
        );
      })}
    </div>
  );
}
