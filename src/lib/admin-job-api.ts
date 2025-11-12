import api from './api';

export interface JobPostingSkill {
  id: number;
  name: string;
  mustToHave: boolean;
}

export interface JobPostingRecruiter {
  id: number;
  companyName: string;
  email: string;
  phoneNumber: string;
}

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  address: string;
  status: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'EXPIRED';
  expirationDate: string;
  createAt: string;
  rejectionReason: string | null;
  recruiter: JobPostingRecruiter;
  approvedByEmail: string | null;
  skills: JobPostingSkill[];
}

export interface JobPostingListResponse {
  code: number;
  message: string;
  result: {
    content: JobPosting[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
      };
      offset: number;
      unpaged: boolean;
      paged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
  };
}

// Get all job postings with pagination and filtering
export const getJobPostings = async (
  page: number = 0,
  size: number = 20,
  status?: string,
  sortBy: string = 'createAt',
  sortDirection: 'ASC' | 'DESC' = 'DESC'
): Promise<JobPostingListResponse> => {
  try {
    let url = `/api/admin/jobpostings?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    
    if (status) {
      url += `&status=${status}`;
    }
    
    console.log('🔍 [Admin Job API] Fetching job postings:', url);
    const response = await api.get(url);
    console.log('✅ [Admin Job API] Response received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [Admin Job API] Error fetching job postings:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Approve or Reject job posting
export const updateJobPostingStatus = async (
  jobId: number,
  status: 'APPROVED' | 'REJECTED',
  rejectionReason?: string
) => {
  const response = await api.put(`/api/admin/jobpostings/${jobId}/approval`, {
    status,
    ...(rejectionReason && { rejectionReason })
  });
  return response.data;
};
