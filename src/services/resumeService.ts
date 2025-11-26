import api from "@/lib/api";

// ===== Type Definitions =====

export type ResumeType = "WEB" | "UPLOAD" | "DRAFT";

export interface Certificate {
  certificateId: number;
  name: string;
  organization: string;
  getDate: string; // YYYY-MM-DD
  certificateUrl: string;
  description: string;
}

export interface Education {
  educationId: number;
  school: string;
  major: string;
  degree: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface HighlightProject {
  highlightProjectId: number;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  description: string;
  projectUrl: string;
}

export interface WorkExperience {
  workExperienceId: number;
  jobTitle: string;
  company: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  description: string;
  project: string;
}

export interface Skill {
  skillId: number;
  skillType: string;
  skillName: string;
  yearOfExperience: number;
}

export interface ForeignLanguage {
  foreignLanguageId: number;
  language: string;
  level: string;
}

export interface Award {
  awardId: number;
  name: string;
  organization: string;
  getDate: string; // YYYY-MM-DD
  description: string;
}

export interface Resume {
  resumeId: number;
  aboutMe: string;
  resumeUrl: string;
  type: ResumeType;
  isActive: boolean;
  createdAt: string; // ISO 8601
  candidateId: number;
  parsedStatus?: "processing" | "ready" | "failed"; // Optional from API
  certificates: Certificate[];
  educations: Education[];
  highlightProjects: HighlightProject[];
  workExperiences: WorkExperience[];
  skills: Skill[];
  foreignLanguages: ForeignLanguage[];
  awards: Award[];
}

export interface ResumeResponse {
  code: number;
  message: string;
  result: Resume[];
}

// ===== Resume Service =====

class ResumeService {
  /**
   * Fetch all resumes for the current user
   */
  async fetchResumes(): Promise<Resume[]> {
    try {
      const response = await api.get<ResumeResponse>("/api/resume");
      
      // Check if response is successful and has result
      if (response.data && response.data.result) {
        return response.data.result;
      }
      
      throw new Error(response.data?.message || "Failed to fetch resumes");
    } catch (error) {
      console.error("Error fetching resumes:", error);
      throw error;
    }
  }

  /**
   * Fetch resumes grouped by type
   */
  async fetchResumesByType(): Promise<{
    web: Resume[];
    uploaded: Resume[];
    draft: Resume[];
    active: Resume | null;
  }> {
    try {
      const resumes = await this.fetchResumes();
      
      return {
        web: resumes.filter((r) => r.type === "WEB"),
        uploaded: resumes.filter((r) => r.type === "UPLOAD"),
        draft: resumes.filter((r) => r.type === "DRAFT"),
        active: resumes.find((r) => r.isActive) || null,
      };
    } catch (error) {
      console.error("Error fetching resumes by type:", error);
      throw error;
    }
  }

  /**
   * Get active resume
   */
  async getActiveResume(): Promise<Resume | null> {
    try {
      const resumes = await this.fetchResumes();
      return resumes.find((r) => r.isActive) || null;
    } catch (error) {
      console.error("Error getting active resume:", error);
      return null;
    }
  }

  /**
   * Set a resume as active
   * TODO: Implement API endpoint
   */
  async setActiveResume(resumeId: number): Promise<void> {
    try {
      // TODO: Replace with actual API call when endpoint is available
      console.log("Setting active resume:", resumeId);
      // await api.put(`/api/resume/${resumeId}/active`);
    } catch (error) {
      console.error("Error setting active resume:", error);
      throw error;
    }
  }

  /**
   * Delete a resume
   * TODO: Implement API endpoint
   */
  async deleteResume(resumeId: number): Promise<void> {
    try {
      // TODO: Replace with actual API call when endpoint is available
      console.log("Deleting resume:", resumeId);
      // await api.delete(`/api/resume/${resumeId}`);
    } catch (error) {
      console.error("Error deleting resume:", error);
      throw error;
    }
  }

  /**
   * Create a new resume entry in backend
   */
  async createResume(payload: {
    aboutMe: string;
    resumeUrl: string;
    type: string;
    isActive: boolean;
  }): Promise<Resume> {
    try {
      const response = await api.post<{ code: number; message: string; result: Resume }>(
        "/api/resume",
        payload
      );

      if (response.data && response.data.result) {
        return response.data.result;
      }

      throw new Error(response.data?.message || "Failed to create resume");
    } catch (error) {
      console.error("Error creating resume:", error);
      throw error;
    }
  }

  /**
   * Get resume size from URL
   */
  async getResumeSize(url: string): Promise<number> {
    try {
      const response = await fetch(url, { method: "HEAD" });
      const contentLength = response.headers.get("content-length");
      return contentLength ? parseInt(contentLength, 10) : 0;
    } catch (error) {
      console.error("Error getting resume size:", error);
      return 0;
    }
  }

  /**
   * Format file size from bytes
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }
}

export const resumeService = new ResumeService();

// Export createResume as a standalone function for convenience
export const createResume = (payload: {
  aboutMe: string;
  resumeUrl: string;
  type: string;
  isActive: boolean;
}) => resumeService.createResume(payload);
