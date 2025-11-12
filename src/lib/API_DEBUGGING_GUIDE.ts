/**
 * API Request Debugging Guide
 * 
 * This file explains how to debug API calls and common issues
 */

// ==================== COMMON ERRORS ====================

/**
 * ERROR 1: "Request failed with status code 400"
 * 
 * Causes:
 * - Missing required fields in request body
 * - Invalid data types (string instead of number, etc.)
 * - Backend validation failed
 * - Wrong Content-Type header
 * 
 * How to debug:
 * 1. Check browser DevTools → Network tab
 * 2. Look at the request payload
 * 3. Compare with backend @RequestBody expectations
 * 4. Check console logs for detailed error message
 */

/**
 * ERROR 2: "Invalid JSON format or missing request body"
 * 
 * Causes:
 * - Request body is undefined
 * - Sending FormData instead of JSON
 * - Missing Content-Type: application/json header
 * - Data is null or empty object
 * 
 * How to debug:
 * 1. Log request data BEFORE sending: console.log('Data:', data)
 * 2. Check if data is undefined or null
 * 3. Verify Content-Type header is set correctly
 * 4. Check backend expects JSON, not FormData
 */

// ==================== CORRECT PATTERNS ====================

/**
 * PATTERN 1: Sending JSON (Most common for @RequestBody)
 */
const sendJSON = async () => {
  const data = {
    jobPostingId: 26,
    candidateId: 123,
    fullName: "John Doe"
  };

  // ✅ Correct: Axios automatically sends as JSON
  const response = await api.post('/api/job-apply', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

/**
 * PATTERN 2: Sending FormData (For file uploads)
 */
const sendFormData = async () => {
  const formData = new FormData();
  formData.append('jobPostingId', '26');
  formData.append('candidateId', '123');
  formData.append('file', fileBlob);

  // ✅ Correct: Let browser set Content-Type with boundary
  const response = await api.post('/api/upload', formData);
  // Do NOT manually set Content-Type for FormData
};

/**
 * PATTERN 3: Sending JSON with file reference
 */
const sendJSONWithFileRef = async () => {
  // First upload file
  const formData = new FormData();
  formData.append('file', fileBlob);
  const uploadResponse = await api.post('/api/upload/cv', formData);
  const filePath = uploadResponse.data.result.url;

  // Then send JSON with file path
  const data = {
    jobPostingId: 26,
    cvFilePath: filePath,  // ✅ File reference, not file itself
    fullName: "John Doe"
  };

  const response = await api.post('/api/job-apply', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// ==================== VALIDATION CHECKLIST ====================

/**
 * Before calling API, check:
 */
const validateBeforeAPI = (data: any) => {
  // ✅ 1. Data is not undefined
  if (!data) {
    throw new Error('Data is undefined');
  }

  // ✅ 2. Required fields are present
  const required = ['jobPostingId', 'candidateId', 'fullName'];
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // ✅ 3. Data types are correct
  if (typeof data.jobPostingId !== 'number') {
    throw new Error('jobPostingId must be a number');
  }

  // ✅ 4. Values are not empty strings
  if (data.fullName.trim() === '') {
    throw new Error('fullName cannot be empty');
  }

  // ✅ 5. Log final data
  console.log('Validated data:', JSON.stringify(data, null, 2));
};

// ==================== ERROR HANDLING ====================

/**
 * Extract meaningful error messages
 */
const handleAPIError = (error: any) => {
  console.error('=== API ERROR DEBUG ===');
  
  if (error.response) {
    // Server responded with error
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
    console.error('Headers:', error.response.headers);
    
    // Extract backend message
    const backendMessage = 
      error.response.data?.message ||
      error.response.data?.error ||
      error.response.statusText;
    
    throw new Error(backendMessage);
    
  } else if (error.request) {
    // No response received
    console.error('No response from server');
    throw new Error('Network error: No response from server');
    
  } else {
    // Request setup error
    console.error('Request error:', error.message);
    throw error;
  }
};

// ==================== DEBUGGING TIPS ====================

/**
 * TIP 1: Use Browser DevTools
 * 
 * 1. Open DevTools (F12)
 * 2. Go to Network tab
 * 3. Filter by "Fetch/XHR"
 * 4. Click on the failed request
 * 5. Check:
 *    - Request URL
 *    - Request Method
 *    - Request Headers (Content-Type!)
 *    - Request Payload (is it JSON or FormData?)
 *    - Response (backend error message)
 */

/**
 * TIP 2: Add Strategic Console Logs
 */
const debugExample = async (data: any) => {
  console.log('1. Data before API call:', data);
  console.log('2. Data type:', typeof data);
  console.log('3. Data keys:', Object.keys(data));
  console.log('4. Data JSON:', JSON.stringify(data, null, 2));
  
  try {
    const response = await api.post('/api/endpoint', data);
    console.log('5. Response:', response.data);
  } catch (error: any) {
    console.error('6. Error:', error);
    console.error('7. Error response:', error.response?.data);
  }
};

/**
 * TIP 3: Check Backend Expectations
 * 
 * Backend Controller:
 * ```java
 * @PostMapping("/job-apply")
 * public ResponseEntity<?> apply(@RequestBody JobApplicationRequest request) {
 *     // Expects JSON with Content-Type: application/json
 * }
 * ```
 * 
 * Frontend must send:
 * - JSON object (not FormData)
 * - Content-Type: application/json header
 * - All required fields from JobApplicationRequest
 */

/**
 * TIP 4: Compare Working vs Broken Request
 * 
 * Use Postman/Insomnia to test backend directly:
 * 1. Send request from Postman → Works
 * 2. Copy exact same payload to frontend
 * 3. If frontend fails, issue is in how data is sent
 * 4. Compare headers, payload format between Postman and frontend
 */

// ==================== BACKEND EXPECTATIONS ====================

/**
 * If backend uses @RequestBody (Spring Boot example):
 */
interface BackendExpects {
  // These must match exactly
  jobPostingId: number;      // NOT string "26"
  candidateId: number;       // NOT string "123"
  fullName: string;
  phoneNumber: string;
  preferredWorkLocation: string;
  coverLetter: string;       // Can be empty ""
  cvFilePath: string;
  status: string;
}

/**
 * Common mistakes:
 */
const mistakes = {
  // ❌ Wrong: Sending strings instead of numbers
  wrong1: {
    jobPostingId: "26",  // Should be number
    candidateId: "123"   // Should be number
  },

  // ❌ Wrong: Sending FormData to @RequestBody endpoint
  wrong2: () => {
    const formData = new FormData();
    formData.append('jobPostingId', '26');
    // Backend with @RequestBody cannot parse FormData
  },

  // ❌ Wrong: Missing required fields
  wrong3: {
    jobPostingId: 26
    // Missing candidateId, fullName, etc.
  },

  // ✅ Correct: JSON with proper types
  correct: {
    jobPostingId: 26,           // number
    candidateId: 123,           // number
    fullName: "John Doe",       // string
    phoneNumber: "0123456789",  // string
    preferredWorkLocation: "Ho Chi Minh",
    coverLetter: "",            // empty string is OK
    cvFilePath: "path/to/cv.pdf",
    status: "PENDING"
  }
};

export {};
