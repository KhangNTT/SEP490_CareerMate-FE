import api from './api';

/**
 * User Profile API
 * Get current logged-in user's information
 */

export interface UserRole {
  name: string;
  description: string;
  permissions: any[];
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  status: string;
  roles: UserRole[];
}

export interface UserProfileResponse {
  code: number;
  result: UserProfile;
}

/**
 * Candidate Profile from /api/candidates/profiles/current
 */
export interface CandidateProfile {
  candidateId: number;
  dob: string;
  title: string;
  fullName: string;
  phone: string;
  address: string;
  image: string;
  gender: string;
  link: string;
}

export interface CandidateProfileResponse {
  code: number;
  message: string;
  result: CandidateProfile;
}

/**
 * Fetch current candidate profile
 * GET /api/candidates/profiles/current
 * 
 * This API returns the authenticated candidate's profile including:
 * - candidateId: Candidate ID (number) - THIS IS WHAT WE NEED
 * - fullName, dob, title, phone, address, etc.
 */
export const fetchCurrentCandidateProfile = async (): Promise<CandidateProfile> => {
  try {
    const response = await api.get<CandidateProfileResponse>(
      '/api/candidates/profiles/current'
    );

    const responseData = response.data;

    // Check for success - handle both direct response and nested result
    if (!responseData) {
      throw new Error('Empty response from server');
    }

    // If response has code field, check it
    if ('code' in responseData) {
      if (responseData.code !== 200) {
        throw new Error(responseData.message || 'Failed to fetch candidate profile');
      }
      
      // Return the result
      if (!responseData.result) {
        throw new Error('No result in response');
      }
      
      return responseData.result;
    }

    // If response doesn't have code field, it might be the direct data
    return responseData as unknown as CandidateProfile;
    
  } catch (error: any) {
    // If 400/404, profile doesn't exist yet - this is expected for new users
    if (error.response?.status === 400 || error.response?.status === 404) {
      throw new Error('PROFILE_NOT_FOUND');
    }
    
    if (error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch candidate profile'
      );
    }
    
    throw error;
  }
};

/**
 * Fetch current user profile
 * GET /api/users/current
 * 
 * This API returns the authenticated user's basic info including:
 * - id: User ID (number) - THIS IS WHAT WE NEED for candidateId
 * - username: User's display name
 * - email: User's email
 * - status: Account status (ACTIVE, etc.)
 * - roles: User's roles (CANDIDATE, RECRUITER, etc.)
 */
export const fetchCurrentUser = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfileResponse>(
      '/api/users/current'
    );

    const responseData = response.data;

    // Check for success
    const isSuccess = 
      responseData.code === 200 || 
      responseData.code === 1000 || 
      responseData.code === 0;

    if (!isSuccess) {
      throw new Error('Failed to fetch user profile');
    }

    return responseData.result;
    
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to fetch user profile'
      );
    }
    
    throw error;
  }
};

/**
 * DEPRECATED: Use fetchCurrentCandidateProfile instead
 * Kept for backward compatibility
 */
export const fetchCandidateProfile = fetchCurrentCandidateProfile;

/**
 * Update candidate profile
 * PUT /api/candidates/profiles
 * 
 * Updates the candidate's profile information including avatar image
 */
export interface UpdateCandidateProfileRequest {
  fullName?: string;
  dob?: string;
  title?: string;
  phone?: string;
  address?: string;
  image?: string;
  gender?: string;
  link?: string;
}

export const updateCandidateProfile = async (
  data: UpdateCandidateProfileRequest
): Promise<CandidateProfile> => {
  try {
    const response = await api.put<CandidateProfileResponse>(
      '/api/candidates/profiles',
      data
    );

    const responseData = response.data;

    // Check for success
    if (responseData.code !== 200) {
      throw new Error(responseData.message || 'Failed to update candidate profile');
    }

    if (!responseData.result) {
      throw new Error('No result in update response');
    }

    return responseData.result;
    
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || 'Failed to update candidate profile'
      );
    }
    
    throw error;
  }
};
