/**
 * CV Parse Data Normalizer
 * 
 * Converts data from Python CV parse API response (ParsedCV type) to Java backend API format
 * 
 * ParsedCV Format (from Python API):
 * {
 *   name: string,
 *   email: string,
 *   phone: string,
 *   title: string,
 *   personal_info?: { name, email, phone, title },
 *   education: [{ degree, institution, field, start_date, end_date }],
 *   experience: [{ title, company, description, start_date, end_date }],
 *   projects: [{ name, tech_stack[], description, url }],
 *   skills: { soft_skills[], technical_skills[] } | Skill[] | string[],
 *   certificates/certifications: [{ name, issuer, date }],
 *   languages: [{ name, level }]
 * }
 * 
 * Java Backend API Format:
 * {
 *   certificates: [{ name, organization, getDate, certificateUrl, description }],
 *   educations: [{ school, major, degree, startDate, endDate }],
 *   highlightProjects: [{ name, startDate, endDate, description, projectUrl }],
 *   workExperiences: [{ jobTitle, company, startDate, endDate, description, project }],
 *   skills: [{ skillType, skillName, yearOfExperience }],
 *   foreignLanguages: [{ language, level }],
 *   awards: [{ name, organization, getDate, description }]
 * }
 */

import { ParsedCV, Education, Experience, Project, SkillsType, Language, CertificationsType } from "@/types/parsedCV";

// Java Backend API types (for saving to database)
export interface JavaBackendEducation {
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface JavaBackendWorkExperience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  project?: string;
}

export interface JavaBackendHighlightProject {
  name: string;
  startDate: string;
  endDate?: string;
  description: string;
  projectUrl?: string;
}

export interface JavaBackendSkill {
  skillType: 'core' | 'soft';
  skillName: string;
  yearOfExperience?: number;
}

export interface JavaBackendForeignLanguage {
  language: string;
  level: string;
}

export interface JavaBackendCertificate {
  name: string;
  organization: string;
  getDate: string;
  certificateUrl?: string;
  description?: string;
}

export interface JavaBackendAward {
  name: string;
  organization: string;
  getDate: string;
  description?: string;
}

export interface NormalizedCVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    title: string;
  };
  summary?: string; // About Me / Professional Summary
  educations: JavaBackendEducation[];
  workExperiences: JavaBackendWorkExperience[];
  highlightProjects: JavaBackendHighlightProject[];
  skills: JavaBackendSkill[];
  foreignLanguages: JavaBackendForeignLanguage[];
  certificates: JavaBackendCertificate[];
  awards: JavaBackendAward[];
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Parse date string to YYYY-MM-DD format
 * Handles various date formats from Python API
 */
function parseDate(dateStr?: string): string {
  if (!dateStr) return getCurrentDate();
  
  // Already in correct format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Try to parse and format
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch {
    // Fall through to default
  }
  
  return getCurrentDate();
}

/**
 * Normalize education data
 */
function normalizeEducations(educations?: Education[]): JavaBackendEducation[] {
  if (!educations || !Array.isArray(educations)) return [];
  
  return educations.map(edu => ({
    school: edu.institution || edu.degree || 'Unknown School',
    major: edu.field || edu.degree || 'Unknown Major',
    degree: edu.degree || 'Bachelor',
    startDate: parseDate(edu.start_date),
    endDate: parseDate(edu.end_date),
  }));
}

/**
 * Normalize work experience data
 */
function normalizeWorkExperiences(experiences?: Experience[]): JavaBackendWorkExperience[] {
  if (!experiences || !Array.isArray(experiences)) return [];
  
  return experiences.map(exp => ({
    jobTitle: exp.title || exp.position || 'Unknown Position',
    company: exp.company || 'Unknown Company',
    startDate: parseDate(exp.start_date),
    endDate: exp.end_date ? parseDate(exp.end_date) : undefined,
    description: exp.description || (exp.responsibilities ? exp.responsibilities.join('\n') : ''),
    project: undefined,
  }));
}

/**
 * Normalize highlight projects data
 */
function normalizeHighlightProjects(projects?: Project[]): JavaBackendHighlightProject[] {
  if (!projects || !Array.isArray(projects)) return [];
  
  return projects.map(proj => {
    // Build description from tech_stack if no description provided
    let description = proj.description || '';
    const techStack = proj.tech_stack || proj.technologies;
    if (!description && techStack && techStack.length > 0) {
      description = `Technologies: ${techStack.join(', ')}`;
    }
    
    return {
      name: proj.name || 'Unnamed Project',
      startDate: parseDate(proj.start_date),
      endDate: proj.end_date ? parseDate(proj.end_date) : undefined,
      description: description,
      projectUrl: proj.url,
    };
  });
}

/**
 * Normalize skills data
 * SkillsType can be: { soft_skills[], technical_skills[] } | Skill[] | string[]
 */
function normalizeSkills(skills?: SkillsType): JavaBackendSkill[] {
  if (!skills) return [];
  
  const result: JavaBackendSkill[] = [];
  
  // Handle object format: { soft_skills: [], technical_skills: [] }
  if (typeof skills === 'object' && !Array.isArray(skills)) {
    const skillsObj = skills as { soft_skills?: string[]; technical_skills?: string[] };
    
    // Process technical/core skills
    if (skillsObj.technical_skills && Array.isArray(skillsObj.technical_skills)) {
      skillsObj.technical_skills.forEach((skillName: string) => {
        if (skillName && skillName.trim()) {
          result.push({
            skillType: 'core',
            skillName: skillName.trim(),
            yearOfExperience: 1, // Default to 1 year
          });
        }
      });
    }
    
    // Process soft skills
    if (skillsObj.soft_skills && Array.isArray(skillsObj.soft_skills)) {
      skillsObj.soft_skills.forEach((skillName: string) => {
        if (skillName && skillName.trim()) {
          result.push({
            skillType: 'soft',
            skillName: skillName.trim(),
            yearOfExperience: undefined, // Soft skills don't have years
          });
        }
      });
    }
  }
  // Handle array format: Skill[] or string[]
  else if (Array.isArray(skills)) {
    skills.forEach((skill) => {
      if (typeof skill === 'string' && skill.trim()) {
        // Simple string skill - assume core skill
        result.push({
          skillType: 'core',
          skillName: skill.trim(),
          yearOfExperience: 1,
        });
      } else if (typeof skill === 'object' && skill.name) {
        // Skill object with name property
        const skillType = (skill.category?.toLowerCase().includes('soft') || 
                         skill.level?.toLowerCase().includes('soft')) ? 'soft' : 'core';
        result.push({
          skillType: skillType,
          skillName: skill.name.trim(),
          yearOfExperience: skillType === 'core' ? 1 : undefined,
        });
      }
    });
  }
  
  return result;
}

/**
 * Normalize foreign languages data
 */
function normalizeForeignLanguages(languages?: Language[]): JavaBackendForeignLanguage[] {
  if (!languages || !Array.isArray(languages)) return [];
  
  // Map common level names to standard levels
  const mapLevel = (level?: string): string => {
    if (!level) return 'Intermediate';
    
    const levelLower = level.toLowerCase();
    if (levelLower.includes('native') || levelLower.includes('fluent')) return 'Native';
    if (levelLower.includes('advanced') || levelLower.includes('proficient')) return 'Advanced';
    if (levelLower.includes('beginner') || levelLower.includes('basic') || levelLower.includes('elementary')) return 'Beginner';
    return 'Intermediate';
  };
  
  return languages.map(lang => ({
    language: lang.name || 'Unknown Language',
    level: mapLevel(lang.level || lang.proficiency),
  }));
}

// Define a generic award type that matches both ParsedCV awards and any format
interface GenericAward {
  name?: string;
  organization?: string;
  date?: string;
  description?: string;
  [key: string]: any;
}

/**
 * Normalize certificates data
 * CertificationsType can be: Certification[] | string[]
 */
function normalizeCertificates(certificates?: CertificationsType): JavaBackendCertificate[] {
  if (!certificates || !Array.isArray(certificates)) return [];
  
  return certificates.map(cert => {
    // Handle string format
    if (typeof cert === 'string') {
      return {
        name: cert,
        organization: 'Unknown Organization',
        getDate: getCurrentDate(),
        certificateUrl: undefined,
        description: undefined,
      };
    }
    // Handle object format
    return {
      name: cert.name || 'Unknown Certificate',
      organization: cert.issuer || 'Unknown Organization',
      getDate: parseDate(cert.date || cert.expiry_date),
      certificateUrl: undefined,
      description: cert.credential_id ? `Credential ID: ${cert.credential_id}` : undefined,
    };
  });
}

/**
 * Normalize awards data
 */
function normalizeAwards(awards?: GenericAward[]): JavaBackendAward[] {
  if (!awards || !Array.isArray(awards)) return [];
  
  return awards.map(award => ({
    name: award.name || 'Unknown Award',
    organization: award.organization || 'Unknown Organization',
    getDate: parseDate(award.date),
    description: award.description,
  }));
}

/**
 * Main function to normalize ParsedCV (from Python API) to Java backend format
 * 
 * @param parsedCV - Response from Python CV parse API (ParsedCV type)
 * @returns Normalized data ready for Java backend APIs
 */
export function normalizeParsedCVData(parsedCV: ParsedCV): NormalizedCVData {
  // Extract personal info from either top-level or nested structure
  const personalInfo = parsedCV.personal_info || {};
  
  // Extract summary/aboutMe from various possible fields
  const summary = parsedCV.summary || parsedCV.aboutMe || parsedCV.about_me || 
                  personalInfo.summary || personalInfo.aboutMe || personalInfo.about_me || '';
  
  return {
    personalInfo: {
      fullName: parsedCV.name || personalInfo.name || '',
      email: parsedCV.email || personalInfo.email || '',
      phone: parsedCV.phone || personalInfo.phone || '',
      title: parsedCV.title || personalInfo.title || '',
    },
    summary,
    educations: normalizeEducations(parsedCV.education),
    workExperiences: normalizeWorkExperiences(parsedCV.experience),
    highlightProjects: normalizeHighlightProjects(parsedCV.projects),
    skills: normalizeSkills(parsedCV.skills),
    foreignLanguages: normalizeForeignLanguages(parsedCV.languages),
    certificates: normalizeCertificates(parsedCV.certificates || parsedCV.certifications),
    awards: normalizeAwards(parsedCV.awards as GenericAward[]),
  };
}

/**
 * Check if normalized data has any meaningful content to sync
 */
export function hasDataToSync(data: NormalizedCVData): boolean {
  return (
    data.educations.length > 0 ||
    data.workExperiences.length > 0 ||
    data.highlightProjects.length > 0 ||
    data.skills.length > 0 ||
    data.foreignLanguages.length > 0 ||
    data.certificates.length > 0 ||
    data.awards.length > 0 ||
    !!data.personalInfo.fullName ||
    !!data.personalInfo.title ||
    !!data.summary
  );
}

/**
 * Get summary of data to sync for display
 */
export function getSyncSummary(data: NormalizedCVData): {
  category: string;
  count: number;
  items: string[];
}[] {
  const summaryList: { category: string; count: number; items: string[] }[] = [];
  
  if (data.personalInfo.fullName || data.personalInfo.title) {
    summaryList.push({
      category: 'Personal Info',
      count: 1,
      items: [
        data.personalInfo.fullName && `Name: ${data.personalInfo.fullName}`,
        data.personalInfo.title && `Title: ${data.personalInfo.title}`,
        data.personalInfo.email && `Email: ${data.personalInfo.email}`,
        data.personalInfo.phone && `Phone: ${data.personalInfo.phone}`,
      ].filter(Boolean) as string[],
    });
  }
  
  if (data.summary) {
    summaryList.push({
      category: 'About Me',
      count: 1,
      items: [data.summary.length > 100 ? data.summary.slice(0, 100) + '...' : data.summary],
    });
  }
  
  if (data.educations.length > 0) {
    summaryList.push({
      category: 'Education',
      count: data.educations.length,
      items: data.educations.map(e => `${e.degree} - ${e.school}`),
    });
  }
  
  if (data.workExperiences.length > 0) {
    summaryList.push({
      category: 'Work Experience',
      count: data.workExperiences.length,
      items: data.workExperiences.map(w => `${w.jobTitle} at ${w.company}`),
    });
  }
  
  if (data.highlightProjects.length > 0) {
    summaryList.push({
      category: 'Projects',
      count: data.highlightProjects.length,
      items: data.highlightProjects.map(p => p.name),
    });
  }
  
  if (data.skills.length > 0) {
    const coreSkills = data.skills.filter(s => s.skillType === 'core');
    const softSkills = data.skills.filter(s => s.skillType === 'soft');
    
    if (coreSkills.length > 0) {
      summaryList.push({
        category: 'Technical Skills',
        count: coreSkills.length,
        items: coreSkills.slice(0, 5).map(s => s.skillName),
      });
    }
    
    if (softSkills.length > 0) {
      summaryList.push({
        category: 'Soft Skills',
        count: softSkills.length,
        items: softSkills.slice(0, 5).map(s => s.skillName),
      });
    }
  }
  
  if (data.foreignLanguages.length > 0) {
    summaryList.push({
      category: 'Languages',
      count: data.foreignLanguages.length,
      items: data.foreignLanguages.map(l => `${l.language} (${l.level})`),
    });
  }
  
  if (data.certificates.length > 0) {
    summaryList.push({
      category: 'Certificates',
      count: data.certificates.length,
      items: data.certificates.map(c => c.name),
    });
  }
  
  if (data.awards.length > 0) {
    summaryList.push({
      category: 'Awards',
      count: data.awards.length,
      items: data.awards.map(a => a.name),
    });
  }
  
  return summaryList;
}
