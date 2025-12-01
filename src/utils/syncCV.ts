/**
 * CV Sync Utility - Uploads CV to Python API and polls for parsing results
 * 
 * @module syncCV
 * @description Handles uploading CV files to Python parsing API and polling for results
 * 
 * Flow:
 * 1. Download CV PDF from Firebase URL
 * 2. Convert to File/Blob
 * 3. Upload to Python API via FormData
 * 4. Poll task status every 2.5 seconds (max 20 retries = ~50 seconds)
 * 5. Return parsed CV data when completed
 */

import { ParsedCV, TaskResponse, TaskStatusResponse, SyncCVResult } from "@/types/parsedCV";

// ===== Configuration =====
const PYTHON_API_BASE_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000";
const POLLING_INTERVAL_MS = 2500; // 2.5 seconds
const MAX_POLLING_RETRIES = 20; // 20 retries = 50 seconds max
const REQUEST_TIMEOUT_MS = 30000; // 30 seconds timeout for upload

// ===== Helper Functions =====

/**
 * Download file from URL and convert to File object
 * @param url - Firebase Storage download URL
 * @param fileName - Original file name
 * @returns File object ready for upload
 */
async function downloadFileFromUrl(url: string, fileName: string = "cv.pdf"): Promise<File> {
  console.log("========== DOWNLOAD FILE FROM URL DEBUG ==========");
  console.log("📥 CALLING downloadFileFromUrl");
  console.log("📍 URL:", url);
  console.log("📍 URL Type:", typeof url);
  console.log("📍 URL Length:", url?.length);
  console.log("📍 FileName:", fileName);
  
  // Validate URL
  if (!url) {
    console.error("❌ URL is null or undefined!");
    throw new Error("Download URL is missing");
  }
  
  // Check if URL is a valid Firebase Storage URL
  const isFirebaseUrl = /^https:\/\/firebasestorage\.googleapis\.com/.test(url);
  console.log("🔍 Is Firebase Storage URL:", isFirebaseUrl);
  
  if (!isFirebaseUrl) {
    console.error("❌ URL is NOT a Firebase Storage URL!");
    console.error("❌ URL starts with:", url.substring(0, 50));
    console.error(`
❌ Firebase download validation failed!

Possible causes:
  1. Wrong storage path saved in database
  2. Backend saved 'storagePath' instead of full download URL
  3. URL is expired or malformed
  4. Missing getDownloadURL() call in backend

Expected format: https://firebasestorage.googleapis.com/v0/b/...
Actual URL: ${url.substring(0, 100)}...

Solution: Backend should call:
  const downloadURL = await getDownloadURL(storageRef);
  // Save downloadURL to database, not storagePath
    `);
    throw new Error("Invalid Firebase Storage URL format");
  }
  
  console.log("✅ URL validation passed");
  console.log("🌐 Starting fetch...");
  
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
    
    console.log("📡 FETCH RESPONSE RECEIVED");
    console.log("📊 Response status:", response.status);
    console.log("📊 Response statusText:", response.statusText);
    console.log("📊 Response ok:", response.ok);
    console.log("📊 Response headers:", Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error("❌ FETCH FAILED!");
      console.error("❌ Status:", response.status);
      console.error("❌ Status Text:", response.statusText);
      
      if (response.status === 404) {
        console.error(`
❌ Firebase download failed: 404 Not Found

Possible causes:
  1. File was deleted from Firebase Storage
  2. Wrong storage path in database
  3. Backend saved path instead of full download URL
  4. Token expired (download URL has expiration)
  5. Bucket name is incorrect

Debug steps:
  1. Check Firebase Console → Storage → Verify file exists
  2. Verify database has full download URL, not just path
  3. Backend should save: await getDownloadURL(ref(storage, path))
  4. Check if URL has valid token parameter
        `);
      } else if (response.status === 403) {
        console.error(`
❌ Firebase download failed: 403 Forbidden

Possible causes:
  1. Storage security rules deny access
  2. Token expired
  3. Missing authentication
  4. CORS issue
        `);
      }
      
      throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
    }
    
    console.log("✅ Fetch successful, converting to blob...");
    const blob = await response.blob();
    console.log("✅ Blob created:", {
      size: blob.size,
      type: blob.type
    });
    
    // Convert Blob to File
    const file = new File([blob], fileName, {
      type: blob.type || "application/pdf",
      lastModified: Date.now()
    });
    
    console.log("✅ File downloaded successfully:", {
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.type
    });
    console.log("========== DOWNLOAD COMPLETE ==========\n");
    
    return file;
  } catch (error: any) {
    console.error("========== DOWNLOAD ERROR ==========");
    console.error("❌ FETCH ERROR:", error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      console.error("❌ Timeout after", REQUEST_TIMEOUT_MS, "ms");
      throw new Error("Download timeout: File took too long to download");
    }
    
    throw new Error(`Failed to download CV file: ${error.message}`);
  }
}

/**
 * Upload CV file to Python API for parsing
 * @param file - CV file to upload
 * @returns Task response with task_id
 */
async function uploadCVForParsing(file: File): Promise<TaskResponse> {
  console.log("📤 Uploading CV to Python API for parsing...");
  
  const formData = new FormData();
  formData.append("file", file);
  
  const uploadUrl = `${PYTHON_API_BASE_URL}/api/v1/cv/analyze_cv/`;
  
  console.log("🔗 POST:", uploadUrl);
  
  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Upload failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
    
    const data: TaskResponse = await response.json();
    
    console.log("✅ CV uploaded successfully:", {
      task_id: data.task_id,
      status: data.status
    });
    
    return data;
  } catch (error: any) {
    console.error("❌ Error uploading CV:", error);
    
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw new Error("Upload timeout: Request took too long");
    }
    
    throw new Error(`Failed to upload CV: ${error.message}`);
  }
}

/**
 * Poll task status until completed or timeout
 * @param taskId - Task ID from upload response
 * @returns Parsed CV data
 */
async function pollTaskStatus(taskId: string): Promise<ParsedCV> {
  console.log("🔄 Starting polling for task:", taskId);
  
  let retries = 0;
  const statusUrl = `${PYTHON_API_BASE_URL}/api/v1/cv/task-status/${taskId}/`;
  
  while (retries < MAX_POLLING_RETRIES) {
    retries++;
    
    console.log(`⏳ Polling attempt ${retries}/${MAX_POLLING_RETRIES}...`);
    
    try {
      const response = await fetch(statusUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      // Handle HTTP status codes
      // 200 = completed/success
      // 202 = processing/accepted (task still running)
      // 404 = not found
      // 500+ = server error
      if (!response.ok && response.status !== 202) {
        console.warn(`⚠️ Status check failed: ${response.status} ${response.statusText}`);
        
        // Don't throw on 404 or 500, just continue polling
        if (response.status === 404 || response.status >= 500) {
          console.log("⏳ Task not found or server error, retrying...");
          await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
          continue;
        }
        
        throw new Error(`Status check failed: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      console.log(`📊 Task status response:`, {
        status: responseData.status,
        hasData: !!responseData.data,
        hasResult: !!responseData.result,
        hasDataResult: !!responseData.data?.result
      });
      
      // Check status
      if (responseData.status === "completed") {
        // API structure: data.result (nested) or data (flat) or result (legacy)
        const parsedData = responseData.data?.result || responseData.data || responseData.result;
        
        if (!parsedData) {
          console.error("❌ Task completed but no data returned");
          console.error("❌ Response:", JSON.stringify(responseData, null, 2));
          throw new Error("Task completed but no parsed data returned");
        }
        
        console.log("✅ CV parsing completed successfully!");
        console.log("📄 Full parsed data:", JSON.stringify(parsedData, null, 2));
        console.log("📄 Parsed data preview:", {
          name: parsedData.name,
          email: parsedData.email,
          phone: parsedData.phone,
          title: parsedData.title,
          hasPersonalInfo: !!parsedData.personal_info,
          educationCount: parsedData.education?.length || 0,
          experienceCount: parsedData.experience?.length || 0,
          projectsCount: parsedData.projects?.length || 0,
          skillsType: typeof parsedData.skills,
          hasSkills: !!parsedData.skills,
          certificationsCount: parsedData.certificates?.length || parsedData.certifications?.length || 0,
          languagesCount: parsedData.languages?.length || 0,
          hasFeedback: !!parsedData.feedback
        });
        
        return parsedData;
      }
      
      if (responseData.status === "failed") {
        console.error("❌ Task failed:", responseData.error || responseData.message);
        throw new Error(responseData.error || responseData.message || "CV parsing failed");
      }
      
      // Status is still "processing", continue polling
      console.log(`⏳ Task still processing... waiting ${POLLING_INTERVAL_MS}ms`);
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
      
    } catch (error: any) {
      console.error(`❌ Error checking task status (attempt ${retries}):`, error);
      
      // If we've exhausted retries, throw
      if (retries >= MAX_POLLING_RETRIES) {
        throw error;
      }
      
      // Otherwise wait and retry
      console.log(`⏳ Retrying in ${POLLING_INTERVAL_MS}ms...`);
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
    }
  }
  
  // Timeout reached
  console.error("❌ Polling timeout: Max retries exceeded");
  throw new Error(
    `Parsing timeout: CV is taking longer than expected (>${MAX_POLLING_RETRIES * POLLING_INTERVAL_MS / 1000}s). Please try again later.`
  );
}

// ===== Main Export =====

/**
 * Sync CV: Download from Firebase, upload to Python API, poll for results
 * 
 * @param cvUrl - Firebase Storage download URL
 * @param cvName - Original CV file name (optional)
 * @returns Parsed CV data
 * 
 * @throws Error if download, upload, or parsing fails
 * 
 * @example
 * ```typescript
 * try {
 *   const parsedData = await syncCV(cv.downloadUrl, cv.name);
 *   console.log("Parsed CV:", parsedData);
 * } catch (error) {
 *   console.error("Sync failed:", error);
 *   toast.error(error.message);
 * }
 * ```
 */
export async function syncCV(
  cvUrl: string,
  cvName: string = "cv.pdf"
): Promise<ParsedCV> {
  console.log("🚀 Starting CV sync process...", {
    url: cvUrl,
    name: cvName
  });
  
  try {
    // Step 1: Download CV from Firebase
    const file = await downloadFileFromUrl(cvUrl, cvName);
    
    // Step 2: Upload to Python API
    const taskResponse = await uploadCVForParsing(file);
    
    // Step 3: Poll for results
    const parsedData = await pollTaskStatus(taskResponse.task_id);
    
    console.log("🎉 CV sync completed successfully!");
    return parsedData;
    
  } catch (error: any) {
    console.error("❌ CV sync failed:", error);
    throw error;
  }
}

/**
 * Check Python API health
 * @returns true if API is reachable, false otherwise
 */
export async function checkPythonAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${PYTHON_API_BASE_URL}/health`, {
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch (error) {
    console.error("Python API health check failed:", error);
    return false;
  }
}

/**
 * Sync CV with real-time updates via callback
 * 
 * @param cvUrl - Firebase Storage download URL
 * @param cvName - Original CV file name
 * @param onUpdate - Callback function called with updates during sync process
 * @returns Final parsed CV data
 * 
 * @example
 * ```typescript
 * await syncCVWithUpdates(
 *   cv.downloadUrl, 
 *   cv.name,
 *   (update) => {
 *     setTaskId(update.taskId);
 *     setStatus(update.status);
 *     if (update.data) setParsedData(update.data);
 *     if (update.rawResponse) setRawResponse(update.rawResponse);
 *   }
 * );
 * ```
 */
export async function syncCVWithUpdates(
  cvUrl: string,
  cvName: string = "cv.pdf",
  onUpdate?: (update: SyncCVResult) => void
): Promise<ParsedCV> {
  console.log("========== SYNC CV WITH UPDATES START ==========");
  console.log("🚀🚀🚀 ENTER → syncCVWithUpdates CALLED");
  console.log("🚀🚀🚀 This function was actually invoked!");
  console.log("� Parameters:");
  console.log("  - cvUrl:", cvUrl);
  console.log("  - cvName:", cvName);
  console.log("  - onUpdate callback:", typeof onUpdate);
  console.log("  - PYTHON_API_BASE_URL:", PYTHON_API_BASE_URL);
  
  // Pre-flight validation
  if (!cvUrl) {
    console.error("❌ CRITICAL: cvUrl is null/undefined/empty!");
    throw new Error("CV URL is required");
  }
  
  console.log("✅ Pre-flight validation passed");
  console.log("🚀 Starting CV sync with real-time updates...");
  
  try {
    console.log("\n========== STEP 1: DOWNLOAD FROM FIREBASE ==========");
    console.log("📥 Calling downloadFileFromUrl...");
    const file = await downloadFileFromUrl(cvUrl, cvName);
    console.log("✅ Step 1 complete - File downloaded:", file.name, file.size, "bytes");
    
    console.log("\n========== STEP 2: UPLOAD TO PYTHON API ==========");
    console.log("📤 Calling uploadCVForParsing...");
    const taskResponse = await uploadCVForParsing(file);
    console.log("✅ Step 2 complete - Task created:", taskResponse.task_id);
    
    // Notify: Task created
    if (onUpdate) {
      console.log("📢 Notifying callback: task created");
      onUpdate({
        taskId: taskResponse.task_id,
        status: "processing",
        rawResponse: {
          task_id: taskResponse.task_id,
          status: taskResponse.status
        }
      });
    }
    
    console.log("\n========== STEP 3: POLL FOR RESULTS ==========");
    console.log("🔄 Calling pollTaskStatusWithUpdates...");
    const parsedData = await pollTaskStatusWithUpdates(
      taskResponse.task_id,
      onUpdate
    );
    console.log("✅ Step 3 complete - Data parsed successfully");
    
    console.log("\n========== SYNC COMPLETE ==========");
    console.log("🎉 CV sync completed successfully!");
    console.log("📊 Parsed data summary:", {
      // Top-level fields
      name: parsedData.name,
      email: parsedData.email,
      phone: parsedData.phone,
      title: parsedData.title,
      // Nested fields
      personalInfoName: parsedData.personal_info?.name,
      personalInfoEmail: parsedData.personal_info?.email,
      personalInfoPhone: parsedData.personal_info?.phone,
      educationCount: parsedData.education?.length,
      experienceCount: parsedData.experience?.length,
      projectsCount: parsedData.projects?.length,
      skillsType: typeof parsedData.skills,
      hasSkills: !!parsedData.skills,
      certificationsCount: Array.isArray(parsedData.certifications) ? parsedData.certifications.length : 0,
      certificatesCount: Array.isArray(parsedData.certificates) ? parsedData.certificates.length : 0,
      languagesCount: parsedData.languages?.length,
      hasFeedback: !!parsedData.feedback,
      overallScore: parsedData.feedback?.overall_score
    });
    
    return parsedData;
    
  } catch (error: any) {
    console.error("\n========== SYNC FAILED ==========");
    console.error("❌ CV sync failed at some step");
    console.error("❌ Error:", error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    // Notify: Failed
    if (onUpdate) {
      console.log("📢 Notifying callback: sync failed");
      onUpdate({
        taskId: "",
        status: "failed"
      });
    }
    
    console.error("========== END SYNC ERROR ==========\n");
    throw error;
  }
}

/**
 * Poll task status with real-time updates
 */
async function pollTaskStatusWithUpdates(
  taskId: string,
  onUpdate?: (update: SyncCVResult) => void
): Promise<ParsedCV> {
  console.log("🔄 Starting polling with updates for task:", taskId);
  
  let retries = 0;
  const statusUrl = `${PYTHON_API_BASE_URL}/api/v1/cv/task-status/${taskId}/`;
  
  while (retries < MAX_POLLING_RETRIES) {
    retries++;
    
    console.log(`⏳ Polling attempt ${retries}/${MAX_POLLING_RETRIES}...`);
    
    try {
      const response = await fetch(statusUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      // Handle HTTP 202 (processing) and 200 (completed)
      if (!response.ok && response.status !== 202) {
        console.warn(`⚠️ Status check failed: ${response.status} ${response.statusText}`);
        
        if (response.status === 404 || response.status >= 500) {
          console.log("⏳ Task not found or server error, retrying...");
          await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
          continue;
        }
        
        throw new Error(`Status check failed: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      console.log(`📊 Task status response:`, {
        status: responseData.status,
        hasData: !!responseData.data,
        hasResult: !!responseData.result,
        hasDataResult: !!responseData.data?.result
      });
      
      // Notify update
      if (onUpdate) {
        // API structure: data.result (nested) or data (flat) or result (legacy)
        const parsedData = responseData.data?.result || responseData.data || responseData.result;
        
        onUpdate({
          taskId: taskId,
          status: responseData.status,
          data: parsedData,
          rawResponse: responseData
        });
      }
      
      // Check status
      if (responseData.status === "completed") {
        // API structure: data.result (nested) or data (flat) or result (legacy)
        const parsedData = responseData.data?.result || responseData.data || responseData.result;
        
        if (!parsedData) {
          console.error("❌ Task completed but no data returned");
          console.error("❌ Response:", JSON.stringify(responseData, null, 2));
          throw new Error("Task completed but no parsed data returned");
        }
        
        console.log("✅ CV parsing completed successfully!");
        console.log("📄 Full parsed data:", JSON.stringify(parsedData, null, 2));
        console.log("📄 Parsed data:", {
          name: parsedData.name,
          email: parsedData.email,
          phone: parsedData.phone,
          title: parsedData.title,
          hasPersonalInfo: !!parsedData.personal_info,
          educationCount: parsedData.education?.length || 0,
          experienceCount: parsedData.experience?.length || 0,
          projectsCount: parsedData.projects?.length || 0,
          skillsType: typeof parsedData.skills,
          hasSkills: !!parsedData.skills,
          certificationsCount: parsedData.certificates?.length || parsedData.certifications?.length || 0,
          languagesCount: parsedData.languages?.length || 0,
          hasFeedback: !!parsedData.feedback,
          feedbackScore: parsedData.feedback?.overall_score
        });
        
        return parsedData;
      }
      
      if (responseData.status === "failed") {
        console.error("❌ Task failed:", responseData.error || responseData.message);
        throw new Error(responseData.error || responseData.message || "CV parsing failed");
      }
      
      // Still processing, continue polling
      console.log(`⏳ Task still processing... waiting ${POLLING_INTERVAL_MS}ms`);
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
      
    } catch (error: any) {
      console.error(`❌ Error checking task status (attempt ${retries}):`, error);
      
      if (retries >= MAX_POLLING_RETRIES) {
        throw error;
      }
      
      console.log(`⏳ Retrying in ${POLLING_INTERVAL_MS}ms...`);
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
    }
  }
  
  console.error("❌ Polling timeout: Max retries exceeded");
  throw new Error(
    `Parsing timeout: CV is taking longer than expected (>${MAX_POLLING_RETRIES * POLLING_INTERVAL_MS / 1000}s). Please try again later.`
  );
}
