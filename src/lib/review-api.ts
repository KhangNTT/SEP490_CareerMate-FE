/**
 * Company Review API
 * Handles application, interview, and work experience reviews
 */

import api from '@/lib/api';

// ==================== Types & Interfaces ====================

// Review types - backend may use short or full names
export type ReviewType = 
  | 'APPLICATION' | 'APPLICATION_EXPERIENCE'
  | 'INTERVIEW' | 'INTERVIEW_EXPERIENCE'
  | 'WORK' | 'WORK_EXPERIENCE';

// Normalized review type for API calls (use short names)
export type NormalizedReviewType = 'APPLICATION' | 'INTERVIEW' | 'WORK';

// Convert any review type to normalized short form
export const normalizeReviewType = (type: ReviewType): NormalizedReviewType => {
  if (type.includes('APPLICATION')) return 'APPLICATION';
  if (type.includes('INTERVIEW')) return 'INTERVIEW';
  if (type.includes('WORK')) return 'WORK';
  return type as NormalizedReviewType;
};

// Qualification levels for review eligibility
export type ReviewQualification = 'APPLICANT' | 'INTERVIEWED' | 'EMPLOYED' | 'FORMER_EMPLOYEE';

export interface ReviewEligibilityResponse {
  // Primary fields (either naming convention)
  eligible?: boolean;
  canReview?: boolean;
  reason?: string;
  message?: string;
  
  // Review types (short or long names)
  reviewTypes?: ReviewType[];
  allowedReviewTypes?: ReviewType[];
  eligibleReviewTypes?: ReviewType[]; // Alias used by some pages
  
  // Existing reviews tracking
  existingReviews?: {
    reviewType: string;
    reviewId: number;
  }[];
  alreadyReviewed?: Record<string, boolean>;
  
  // Qualification level
  qualification?: ReviewQualification;
}

export interface SubmitReviewRequest {
  candidateId: number;
  jobApplyId: number;
  reviewType: NormalizedReviewType;
  overallRating: number; // 1-5 stars
  reviewTitle?: string;
  reviewText: string; // 20-2000 chars
  
  // Rating categories (flexible - backend may use different field names)
  // Application/Interview ratings
  communicationRating?: number;
  responsivenessRating?: number;
  interviewProcessRating?: number;
  
  // Work experience ratings
  workEnvironmentRating?: number;
  workCultureRating?: number;
  managementRating?: number;
  compensationRating?: number;
  benefitsRating?: number;
  careerGrowthRating?: number;
  workLifeBalanceRating?: number;
  
  // Category ratings (grouped object for form state)
  categoryRatings?: {
    workEnvironment?: number;
    management?: number;
    compensation?: number;
    careerGrowth?: number;
    workLifeBalance?: number;
  };
  
  // Optional fields
  pros?: string;
  cons?: string;
  wouldRecommend?: boolean;
  isAnonymous?: boolean;
}

export interface ReviewResponse {
  id: number;
  candidateId: number;
  candidateName?: string; // Only if not anonymous
  jobApplyId: number;
  recruiterId: number;
  companyName: string;
  jobTitle: string;
  reviewType: ReviewType;
  overallRating: number;
  reviewTitle?: string;
  reviewText: string;
  
  // Category ratings (flexible naming)
  communicationRating?: number;
  responsivenessRating?: number;
  interviewProcessRating?: number;
  workEnvironmentRating?: number;
  workCultureRating?: number;
  managementRating?: number;
  compensationRating?: number;
  benefitsRating?: number;
  careerGrowthRating?: number;
  workLifeBalanceRating?: number;
  
  // Optional fields
  pros?: string;
  cons?: string;
  wouldRecommend?: boolean;
  isAnonymous: boolean;
  
  // Status
  reviewStatus: 'ACTIVE' | 'FLAGGED' | 'REMOVED' | 'ARCHIVED';
  flagCount: number;
  helpfulCount: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CompanyReviewsResponse {
  reviews: ReviewResponse[];
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>; // { 1: count, 2: count, ... }
  reviewTypeBreakdown: {
    APPLICATION: number;
    INTERVIEW: number;
    WORK: number;
  };
}

export interface CompanyStatisticsResponse {
  totalReviews: number;
  averageRating: number;
  wouldRecommendPercentage: number;
  
  // Average category ratings
  avgWorkEnvironment?: number;
  avgManagement?: number;
  avgCompensation?: number;
  avgCareerGrowth?: number;
  avgWorkLifeBalance?: number;
  
  // Review type breakdown
  applicationReviews: number;
  interviewReviews: number;
  workReviews: number;
  
  // Rating distribution
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// ==================== Review Eligibility ====================

/**
 * Check review eligibility for a candidate
 * GET /api/v1/reviews/eligibility?candidateId={id}&jobApplyId={id}
 */
export const checkReviewEligibility = async (
  candidateId: number,
  jobApplyId: number
): Promise<ReviewEligibilityResponse> => {
  try {
    console.log(`✅ [CHECK ELIGIBILITY] Candidate: ${candidateId}, Job Apply: ${jobApplyId}`);
    const response = await api.get<ApiResponse<ReviewEligibilityResponse>>(
      '/api/v1/reviews/eligibility',
      { params: { candidateId, jobApplyId } }
    );
    console.log('✅ [CHECK ELIGIBILITY] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [CHECK ELIGIBILITY] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to check review eligibility');
  }
};

// ==================== Review Submission ====================

/**
 * Submit a company review
 * POST /api/v1/reviews
 */
export const submitReview = async (
  request: SubmitReviewRequest
): Promise<ReviewResponse> => {
  try {
    console.log('⭐ [SUBMIT REVIEW]', request);
    const response = await api.post<ApiResponse<ReviewResponse>>(
      '/api/v1/reviews',
      request
    );
    console.log('✅ [SUBMIT REVIEW] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [SUBMIT REVIEW] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to submit review');
  }
};

// ==================== Review Management ====================

/**
 * Get all reviews for a company (recruiter)
 * GET /api/v1/reviews/company/{recruiterId}
 */
export const getCompanyReviews = async (
  recruiterId: number,
  params?: {
    reviewType?: NormalizedReviewType;
    minRating?: number;
    page?: number;
    size?: number;
  }
): Promise<CompanyReviewsResponse> => {
  try {
    console.log(`⭐ [GET COMPANY REVIEWS] Recruiter: ${recruiterId}`, params);
    const response = await api.get<ApiResponse<CompanyReviewsResponse>>(
      `/api/v1/reviews/company/${recruiterId}`,
      { params }
    );
    console.log('✅ [GET COMPANY REVIEWS] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [GET COMPANY REVIEWS] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch company reviews');
  }
};

/**
 * Get company review statistics
 * GET /api/v1/reviews/company/{recruiterId}/statistics
 */
export const getCompanyStatistics = async (
  recruiterId: number
): Promise<CompanyStatisticsResponse> => {
  try {
    console.log(`📊 [GET STATISTICS] Recruiter: ${recruiterId}`);
    const response = await api.get<ApiResponse<CompanyStatisticsResponse>>(
      `/api/v1/reviews/company/${recruiterId}/statistics`
    );
    console.log('✅ [GET STATISTICS] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [GET STATISTICS] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch company statistics');
  }
};

/**
 * Get company overall rating
 * GET /api/v1/reviews/company/{recruiterId}/rating
 */
export const getCompanyRating = async (
  recruiterId: number
): Promise<{ averageRating: number; totalReviews: number }> => {
  try {
    console.log(`⭐ [GET RATING] Recruiter: ${recruiterId}`);
    const response = await api.get<ApiResponse<{ averageRating: number; totalReviews: number }>>(
      `/api/v1/reviews/company/${recruiterId}/rating`
    );
    console.log('✅ [GET RATING] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [GET RATING] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch company rating');
  }
};

/**
 * Get candidate's submitted reviews
 * GET /api/v1/reviews/my-reviews?candidateId={id}
 */
export const getCandidateReviews = async (
  candidateId: number
): Promise<ReviewResponse[]> => {
  try {
    console.log(`⭐ [GET MY REVIEWS] Candidate: ${candidateId}`);
    const response = await api.get<ApiResponse<ReviewResponse[]>>(
      '/api/v1/reviews/my-reviews',
      { params: { candidateId } }
    );
    console.log('✅ [GET MY REVIEWS] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [GET MY REVIEWS] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch candidate reviews');
  }
};

/**
 * Delete a review (candidate only, within 30 days)
 * DELETE /api/v1/reviews/{reviewId}
 */
export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    console.log(`🗑️ [DELETE REVIEW] Review ID: ${reviewId}`);
    await api.delete(`/api/v1/reviews/${reviewId}`);
    console.log('✅ [DELETE REVIEW] Success');
  } catch (error: any) {
    console.error('❌ [DELETE REVIEW] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to delete review');
  }
};

/**
 * Flag a review as inappropriate
 * POST /api/v1/reviews/{reviewId}/flag
 */
export const flagReview = async (
  reviewId: number,
  reason: string
): Promise<void> => {
  try {
    console.log(`🚩 [FLAG REVIEW] Review ID: ${reviewId}, Reason: ${reason}`);
    await api.post(`/api/v1/reviews/${reviewId}/flag`, { reason });
    console.log('✅ [FLAG REVIEW] Success');
  } catch (error: any) {
    console.error('❌ [FLAG REVIEW] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to flag review');
  }
};

// ==================== Utility Functions ====================

/**
 * Get review type display text
 */
export const getReviewTypeText = (type: 'APPLICATION' | 'INTERVIEW' | 'WORK'): string => {
  const typeMap: Record<string, string> = {
    APPLICATION: 'Application Process',
    INTERVIEW: 'Interview Experience',
    WORK: 'Work Experience',
  };
  return typeMap[type] || type;
};

/**
 * Get review type icon
 */
export const getReviewTypeIcon = (type: 'APPLICATION' | 'INTERVIEW' | 'WORK'): string => {
  const iconMap: Record<string, string> = {
    APPLICATION: 'FileText',
    INTERVIEW: 'Calendar',
    WORK: 'Briefcase',
  };
  return iconMap[type] || 'Star';
};

/**
 * Format star rating for display
 */
export const formatRating = (rating: number): string => {
  return `${rating.toFixed(1)} ⭐`;
};

/**
 * Get rating color based on score
 */
export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 3.5) return 'text-blue-600';
  if (rating >= 2.5) return 'text-yellow-600';
  if (rating >= 1.5) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Get rating background color
 */
export const getRatingBgColor = (rating: number): string => {
  if (rating >= 4.5) return 'bg-green-100 text-green-800 border-green-300';
  if (rating >= 3.5) return 'bg-blue-100 text-blue-800 border-blue-300';
  if (rating >= 2.5) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  if (rating >= 1.5) return 'bg-orange-100 text-orange-800 border-orange-300';
  return 'bg-red-100 text-red-800 border-red-300';
};

/**
 * Calculate review age
 */
export const getReviewAge = (createdAt: string): string => {
  try {
    const reviewDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - reviewDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return 'Recently';
  }
};

/**
 * Check if review is recent (within 30 days)
 */
export const isRecentReview = (createdAt: string): boolean => {
  try {
    const reviewDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - reviewDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  } catch {
    return false;
  }
};

/**
 * Check if review can be deleted (within 30 days)
 */
export const canDeleteReview = (createdAt: string): boolean => {
  return isRecentReview(createdAt);
};

/**
 * Calculate average rating from category ratings
 */
export const calculateAverageFromCategories = (ratings: {
  workEnvironment?: number;
  management?: number;
  compensation?: number;
  careerGrowth?: number;
  workLifeBalance?: number;
}): number => {
  const values = Object.values(ratings).filter((v): v is number => v !== undefined);
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Render star rating (string representation)
 */
export const renderStarRating = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '⭐'.repeat(fullStars) + 
         (hasHalfStar ? '⭐' : '') + 
         '☆'.repeat(emptyStars);
};

/**
 * Get review status color
 */
export const getReviewStatusColor = (status: ReviewResponse['reviewStatus']): string => {
  const colorMap: Record<ReviewResponse['reviewStatus'], string> = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-300',
    FLAGGED: 'bg-amber-100 text-amber-800 border-amber-300',
    REMOVED: 'bg-red-100 text-red-800 border-red-300',
    ARCHIVED: 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-300';
};
