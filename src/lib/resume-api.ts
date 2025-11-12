import api from "./api";

// Award API types
export interface AwardData {
  resumeId: number;
  name: string;
  organization: string;
  getDate: string; // Format: "YYYY-MM-DD"
  description?: string;
}

export interface AwardResponse {
  awardId: number;
  resumeId: number;
  name: string;
  organization: string;
  getDate: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Add award to resume
 * POST /api/award
 */
export const addAward = async (awardData: AwardData): Promise<any> => {
  const response = await api.post("/api/award", awardData);
  // Handle both direct response and wrapped response
  return response.data.result || response.data;
};

/**
 * Get all awards for a resume
 * GET /api/award/{resumeId}
 */
export const getAwardsByResumeId = async (resumeId: number): Promise<any[]> => {
  const response = await api.get(`/api/award/${resumeId}`);
  // Handle both direct response and wrapped response
  return response.data.result || response.data;
};

/**
 * Update award
 * PUT /api/award/{resumeId}/{awardId}
 */
export const updateAward = async (resumeId: number, awardId: number, awardData: Partial<AwardData>): Promise<AwardResponse> => {
  const response = await api.put(`/api/award/${resumeId}/${awardId}`, awardData);
  return response.data;
};

/**
 * Delete award
 * DELETE /api/award/{awardId}
 */
export const deleteAward = async (awardId: number): Promise<void> => {
  await api.delete(`/api/award/${awardId}`);
};

// ==================== RESUME/ABOUT ME API ====================

export interface UpdateResumeData {
  aboutMe?: string;
}

/**
 * Update resume (About Me section)
 * PUT /api/resume/{resumeId}
 * 
 * Common field names that backends might expect:
 * - aboutMe (our current choice)
 * - description
 * - about
 * - summary
 */
export const updateResume = async (resumeId: number, data: UpdateResumeData): Promise<any> => {
  console.log('📝 ===== UPDATE RESUME API =====');
  console.log('Endpoint: PUT /api/resume/' + resumeId);
  console.log('Request Data:', JSON.stringify(data, null, 2));
  
  try {
    // Try PUT first (standard update method)
    const response = await api.put(`/api/resume/${resumeId}`, data);
    
    console.log('✅ Update Resume Response:', response.data);
    
    // Handle both direct response and wrapped response
    return response.data.result || response.data;
  } catch (putError: any) {
    // If PUT fails with 400/405, try PATCH
    if (putError.response?.status === 400 || putError.response?.status === 405) {
      console.log('⚠️  PUT failed, trying PATCH method...');
      try {
        const response = await api.put(`/api/resume/${resumeId}`, data);
        console.log('✅ Update Resume Response (PATCH):', response.data);
        return response.data.result || response.data;
      } catch (patchError: any) {
        console.error('❌ PATCH also failed:', patchError.response?.data);
        throw patchError;
      }
    }
    
    console.error('❌ Update Resume Error:', putError);
    console.error('Error Response:', putError.response?.data);
    console.error('Error Status:', putError.response?.status);
    console.error('Error Message:', putError.response?.data?.message || putError.message);
    
    // If 400 error, log additional debugging info
    if (putError.response?.status === 400) {
      console.error('🔍 400 Bad Request - Possible causes:');
      console.error('   - Wrong endpoint (try /api/resume vs /api/resume)');
      console.error('   - Wrong field name (try aboutMe vs description vs about)');
      console.error('   - Missing required fields');
      console.error('   - Invalid data format');
      console.error('   - Resume ID not found:', resumeId);
      console.error('   - Backend validation error:', putError.response?.data?.message);
    }
    
    throw putError;
  }
};

// ==================== EDUCATION API ====================

export interface EducationData {
  resumeId: number;
  school: string;
  major: string;
  degree: string;
  startDate: string; // Format: "YYYY-MM-DD"
  endDate: string; // Format: "YYYY-MM-DD"
}

export interface EducationResponse {
  educationId: number;
  resumeId: number;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export const addEducation = async (data: EducationData): Promise<any> => {
  const response = await api.post("/api/education", data);
  // Handle both direct response and wrapped response
  return response.data.result || response.data;
};

export const updateEducation = async (resumeId: number, educationId: number, data: Partial<EducationData>): Promise<any> => {
  const response = await api.put(`/api/education/${resumeId}/${educationId}`, data);
  return response.data.result || response.data;
};

export const deleteEducation = async (educationId: number): Promise<void> => {
  await api.delete(`/api/education/${educationId}`);
};

// ==================== CERTIFICATE API ====================

export interface CertificateData {
  resumeId: number;
  name: string;
  organization: string;
  getDate: string; // Format: "YYYY-MM-DD"
  certificateUrl?: string;
  description?: string;
}

export interface CertificateResponse {
  certificateId: number;
  resumeId: number;
  name: string;
  organization: string;
  getDate: string;
  certificateUrl?: string;
  description?: string;
}

export const addCertificate = async (data: CertificateData): Promise<any> => {
  const response = await api.post("/api/certificate", data);
  return response.data.result || response.data;
};

export const updateCertificate = async (resumeId: number, certificateId: number, data: Partial<CertificateData>): Promise<any> => {
  const response = await api.put(`/api/certificate/${resumeId}/${certificateId}`, data);
  return response.data.result || response.data;
};

export const deleteCertificate = async (certificateId: number): Promise<void> => {
  await api.delete(`/api/certificate/${certificateId}`);
};

// ==================== HIGHLIGHT PROJECT API ====================

export interface HighlightProjectData {
  resumeId: number;
  name: string;
  startDate: string; // Format: "YYYY-MM-DD"
  endDate: string; // Format: "YYYY-MM-DD" - REQUIRED by backend (use startDate if currently working)
  description: string;
  projectUrl?: string;
}

export interface HighlightProjectResponse {
  highlightProjectId: number;
  resumeId: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  projectUrl?: string;
}

export const addHighlightProject = async (data: HighlightProjectData): Promise<any> => {
  const response = await api.post("/api/highlight-project", data);
  return response.data.result || response.data;
};

export const updateHighlightProject = async (resumeId: number, highlightProjectId: number, data: Partial<HighlightProjectData>): Promise<any> => {
  const response = await api.put(`/api/highlight-project/${resumeId}/${highlightProjectId}`, data);
  return response.data.result || response.data;
};

export const deleteHighlightProject = async (highlightProjectId: number): Promise<void> => {
  await api.delete(`/api/highlight-project/${highlightProjectId}`);
};

// ==================== WORK EXPERIENCE API ====================

export interface WorkExperienceData {
  resumeId: number;
  jobTitle: string;
  company: string;
  startDate: string; // Format: "YYYY-MM-DD"
  endDate?: string; // Format: "YYYY-MM-DD"
  description: string;
  project?: string;
}

export interface WorkExperienceResponse {
  workExperienceId: number;
  resumeId: number;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  project?: string;
}

export const addWorkExperience = async (data: WorkExperienceData): Promise<any> => {
  const response = await api.post("/api/work-exp", data);
  return response.data.result || response.data;
};

export const updateWorkExperience = async (resumeId: number, workExpId: number, data: Partial<WorkExperienceData>): Promise<any> => {
  const response = await api.put(`/api/work-exp/${resumeId}/${workExpId}`, data);
  return response.data.result || response.data;
};

export const deleteWorkExperience = async (workExpId: number): Promise<void> => {
  await api.delete(`/api/work-exp/${workExpId}`);
};

// ==================== FOREIGN LANGUAGE API ====================

export interface ForeignLanguageData {
  resumeId: number;
  language: string;
  level: string;
}

export interface ForeignLanguageResponse {
  foreignLanguageId: number;
  resumeId: number;
  language: string;
  level: string;
}

export const addForeignLanguage = async (data: ForeignLanguageData): Promise<any> => {
  const response = await api.post("/api/foreign-language", data);
  return response.data.result || response.data;
};

export const deleteForeignLanguage = async (foreignLanguageId: number): Promise<void> => {
  await api.delete(`/api/foreign-language/${foreignLanguageId}`);
};

// ==================== SKILL API ====================

export interface SkillData {
  resumeId: number;
  skillType: string; // "core" or "soft"
  skillName: string;
  yearOfExperience?: number; // Optional, only for core skills
}

export interface SkillResponse {
  skillId: number;
  resumeId: number;
  skillType: string;
  skillName: string;
  yearOfExperience?: number;
}

export const addSkill = async (data: SkillData): Promise<any> => {
  const response = await api.post("/api/skill", data);
  return response.data.result || response.data;
};

export const deleteSkill = async (resumeId: number, skillId: number): Promise<void> => {
  await api.delete(`/api/skill/${resumeId}/${skillId}`);
};
