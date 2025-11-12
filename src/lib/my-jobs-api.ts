import api from '@/lib/api';

// API Response Interfaces
export interface JobApplication {
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
  status: 'SUBMITTED' | 'REVIEWED' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';
  createAt: string;
}

export interface MyJobsResponse {
  code: number;
  message: string;
  result: JobApplication[];
}

/**
 * Fetch job applications for a specific candidate
 * @param candidateId - The ID of the candidate
 * @returns Promise with job applications array
 */
export const fetchMyJobApplications = async (candidateId: number): Promise<JobApplication[]> => {
  try {
    console.log(`📋 Fetching job applications for candidate ID: ${candidateId}`);
    
    const response = await api.get<MyJobsResponse>(`/api/job-apply/candidate/${candidateId}`);
    
    console.log('✅ My Jobs API Response:', response.data);
    
    if (response.data?.result) {
      return response.data.result;
    }
    
    return [];
  } catch (error: any) {
    console.error('❌ Error fetching my job applications:', error);
    console.error('Error details:', error?.response?.data);
    throw error;
  }
};

/**
 * Get status badge color based on application status
 */
export const getStatusColor = (status: JobApplication['status']): string => {
  switch (status) {
    case 'SUBMITTED':
      return 'bg-yellow-100 text-yellow-800';
    case 'REVIEWED':
      return 'bg-blue-100 text-blue-800';
    case 'INTERVIEW':
      return 'bg-purple-100 text-purple-800';
    case 'ACCEPTED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get status display text
 */
export const getStatusText = (status: JobApplication['status']): string => {
  switch (status) {
    case 'SUBMITTED':
      return 'Awaiting review';
    case 'REVIEWED':
      return 'Reviewed';
    case 'INTERVIEW':
      return 'Interview scheduled';
    case 'ACCEPTED':
      return 'Accepted';
    case 'REJECTED':
      return 'Rejected';
    default:
      return status;
  }
};

/**
 * Format date to display format
 */
export const formatApplicationDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  } catch {
    return dateString;
  }
};
