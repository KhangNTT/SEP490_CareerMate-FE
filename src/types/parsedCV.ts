/**
 * TypeScript interfaces for parsed CV data from Python API
 */

export interface PersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  title?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  [key: string]: any; // Allow additional fields
}

export interface Education {
  degree?: string;
  field?: string;
  institution?: string;
  year?: string;
  start_date?: string;
  end_date?: string;
  gpa?: string;
  description?: string;
  [key: string]: any;
}

export interface Experience {
  title?: string;
  company?: string;
  duration?: string;
  description?: string;
  position?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  responsibilities?: string[];
  [key: string]: any;
}

export interface Skill {
  name?: string;
  category?: string;
  level?: string;
  [key: string]: any;
}

// Skills can be object with soft_skills and technical_skills, or array
export interface SkillsObject {
  soft_skills?: string[];
  technical_skills?: string[];
  [key: string]: any;
}

export type SkillsType = Skill[] | string[] | SkillsObject;

export interface Certification {
  name?: string;
  issuer?: string;
  date?: string;
  expiry_date?: string;
  credential_id?: string;
  [key: string]: any;
}

// Certifications can also be a simple string array
export type CertificationsType = Certification[] | string[];

export interface Project {
  name?: string;
  description?: string;
  tech_stack?: string[];
  technologies?: string[];
  url?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: any;
}

export interface Language {
  name?: string;
  level?: string;
  proficiency?: string;
  [key: string]: any;
}

export interface Feedback {
  strengths?: string[];
  improvements?: string[];
  overall_score?: number;
  comments?: string;
  [key: string]: any;
}

export interface ParsedCV {
  // Top-level fields (flat structure)
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  aboutMe?: string;      // About me / Professional summary from Python API
  about_me?: string;     // Alternative naming (snake_case)
  summary?: string;      // Alternative naming
  
  // Nested structure
  personal_info?: PersonalInfo;
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  skills?: SkillsType;
  certifications?: CertificationsType;
  certificates?: CertificationsType; // Alternative naming
  languages?: Language[];
  feedback?: Feedback;
  raw_text?: string;
  metadata?: {
    parsed_at?: string;
    parser_version?: string;
    [key: string]: any;
  };
  [key: string]: any; // Allow additional top-level fields
}

export interface TaskResponse {
  task_id: string;
  status: "processing" | "completed" | "failed";
  message?: string;
}

export interface TaskStatusResponse {
  status: "processing" | "completed" | "failed";
  data?: {
    result?: ParsedCV; // Nested: data.result
    [key: string]: any;
  } | ParsedCV; // Or flat: data directly
  result?: ParsedCV; // Legacy support
  error?: string;
  message?: string;
  task_id?: string;
}

export interface SyncCVResult {
  taskId: string;
  status: "processing" | "completed" | "failed";
  data?: ParsedCV;
  rawResponse?: TaskStatusResponse;
}
