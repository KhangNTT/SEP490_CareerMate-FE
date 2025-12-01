import api from './api';

// Types for Job Application
export interface JobApplicationRequest {
  jobPostingId: number;
  candidateId: number;
  cvFilePath: string;
  fullName: string;
  phoneNumber: string;
  preferredWorkLocation: string;
  coverLetter: string;
  status: string;
}

export interface JobApplicationResponse {
  code: number;
  message: string;
  result: {
    id: number;
    jobPostingId: number;
    jobTitle: string;
    jobDescription: string;
    expirationDate: string;
    candidateId: number;
    cvFilePath: string;
    fullName: string;
    phoneNumber: string;
    preferredWorkLocation: string;
    coverLetter: string;
    status: string;
    createAt: string;
  };
}

/**
 * Submit job application
 * POST /api/job-apply
 */
export const submitJobApplication = async (
  data: JobApplicationRequest
): Promise<JobApplicationResponse> => {
  try {
    // ✅ Validate data is not undefined
    if (!data) {
      throw new Error('Application data is undefined');
    }

    // ✅ Validate required fields
    const requiredFields = [
      'jobPostingId',
      'candidateId',
      'fullName',
      'phoneNumber',
      'preferredWorkLocation'
    ];
    
    for (const field of requiredFields) {
      if (!data[field as keyof JobApplicationRequest]) {
        throw new Error(`Required field missing: ${field}`);
      }
    }

    // ✅ Ensure coverLetter is always a string (never null/undefined)
    const requestPayload: JobApplicationRequest = {
      jobPostingId: data.jobPostingId,
      candidateId: data.candidateId,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      preferredWorkLocation: data.preferredWorkLocation,
      cvFilePath: data.cvFilePath || "",
      coverLetter: data.coverLetter ?? "", // Use "" if null/undefined
      status: data.status || "PENDING"
    };

    // ✅ Log request data BEFORE sending
    console.log('📝 ===== JOB APPLICATION REQUEST =====');
    console.log('📝 Endpoint: POST /api/job-apply');
    console.log('📝 Full URL:', `${api.defaults.baseURL}/api/job-apply`);
    console.log('📝 Request Payload:', JSON.stringify(requestPayload, null, 2));

    // ✅ Send as JSON (not FormData)
    const response = await api.post<JobApplicationResponse>(
      '/api/job-apply',
      requestPayload,  // Use sanitized payload
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    console.log('✅ ===== JOB APPLICATION RESPONSE =====');
    console.log('✅ Status:', response.status);
    console.log('✅ Response Data:', JSON.stringify(response.data, null, 2));

    const responseData = response.data;

    // Check for success (accept 200, 201, 1000, 0 as success codes)
    const isSuccess = 
      responseData.code === 200 || 
      responseData.code === 201 ||
      responseData.code === 1000 || 
      responseData.code === 0;

    if (!isSuccess) {
      console.error('❌ Job application error:', responseData);
      throw new Error(responseData.message || 'Failed to submit job application');
    }

    return responseData;
  } catch (error: any) {
    console.error('❌ ===== JOB APPLICATION ERROR =====');
    console.error('❌ Error Type:', error.constructor.name);
    console.error('❌ Error Code:', error.code);
    console.error('❌ Error Message:', error.message);
    
    // ✅ Extract detailed error information
    if (error.response) {
      // Server responded with error status
      console.error('❌ Response Status:', error.response.status);
      console.error('❌ Response Data:', JSON.stringify(error.response.data, null, 2));
      console.error('❌ Response Headers:', error.response.headers);
      
      // Handle 401 Unauthorized specifically
      if (error.response.status === 401) {
        console.error('❌ 401 Unauthorized - Token may be missing or expired');
        throw new Error('Session expired. Please login again.');
      }
      
      // Extract the actual backend error message
      const backendMessage = 
        error.response.data?.message || 
        error.response.data?.error ||
        error.response.statusText;
      
      throw new Error(backendMessage || 'Failed to submit job application');
      
    } else if (error.request) {
      // Request was made but no response
      console.error('❌ No response received - possible causes:');
      console.error('   1. Server not running at', api.defaults.baseURL);
      console.error('   2. CORS blocking the request');
      console.error('   3. Network connectivity issue');
      console.error('   4. Request timeout');
      console.error('❌ Request config:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout,
        headers: error.config?.headers
      });
      
      // Check if it's a timeout
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Server is taking too long to respond.');
      }
      
      throw new Error('Cannot connect to server. Please check if backend is running.');
      
    } else {
      // Error in request setup
      console.error('❌ Request setup error:', error.message);
      throw new Error(error.message || 'Failed to submit job application');
    }
  }
};

/**
 * Upload CV file
 * POST /api/upload/cv (or similar endpoint)
 */
export const uploadCV = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ code: number; message: string; result: { url: string } }>(
      '/api/upload/cv',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.code === 200 || response.data.code === 1000) {
      return response.data.result.url;
    }

    throw new Error(response.data.message || 'Failed to upload CV');
  } catch (error: any) {
    console.error('❌ Error uploading CV:', error);
    throw new Error(error?.response?.data?.message || 'Failed to upload CV');
  }
};
