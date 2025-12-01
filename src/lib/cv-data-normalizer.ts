/**
 * CV Data Normalizer Utility
 * 
 * This utility transforms data from cm-profile (Resume) format to CVData format
 * which is expected by CVPreview component.
 * 
 * cm-profile format -> CVData format mapping:
 * - Education: {school, degree, major, startMonth, startYear, endMonth, endYear} -> {degree, school, period, gpa?, description?}
 * - Experience: {jobTitle, company, startMonth, startYear, endMonth, endYear, description, project, working} -> {position, company, period, description, achievements?}
 * - Skills: coreSkillGroups/softSkillGroups {id, name, items: [{skill, experience}]} -> {category, items: [{id, skill, experience}]}
 * - Certifications: {name, org, month, year, url, desc} -> {name, issuer, date, url?}
 * - Awards: {id, name, organization, month, year, description} -> string[]
 * - Projects: {name, startMonth, startYear, endMonth, endYear, description, url, working} -> {name, description, technologies[], url?, period?}
 * - Languages: {language, level} -> {language, level}
 */

import type { CVData } from '@/types/cv';

// Types from cm-profile
interface ProfileEducation {
  id?: string;
  school: string;
  degree: string;
  major?: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
}

interface ProfileWorkExperience {
  id?: string;
  jobTitle: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  description?: string;
  project?: string;
  working?: boolean;
}

interface ProfileAward {
  id?: string;
  name: string;
  organization?: string;
  month?: string;
  year?: string;
  description?: string;
}

interface ProfileCertificate {
  id?: string;
  name: string;
  org: string;
  month?: string;
  year?: string;
  url?: string;
  desc?: string;
}

interface ProfileProject {
  id?: string;
  name: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  description?: string;
  url?: string;
  working?: boolean;
  technologies?: string[];
}

interface ProfileLanguage {
  id?: string;
  language: string;
  level: string;
}

interface ProfileSkillItem {
  id?: string;
  skill: string;
  experience?: string;
}

interface ProfileSkillGroup {
  id?: string;
  name: string;
  items: ProfileSkillItem[];
}

interface ProfilePersonalInfo {
  fullName?: string;
  position?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  photoUrl?: string;
  summary?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
}

interface ProfileData {
  personalInfo?: ProfilePersonalInfo;
  experience?: ProfileWorkExperience[];
  education?: ProfileEducation[];
  skills?: ProfileSkillGroup[];
  coreSkillGroups?: ProfileSkillGroup[];
  softSkillGroups?: ProfileSkillGroup[];
  languages?: ProfileLanguage[];
  certifications?: ProfileCertificate[];
  certificates?: ProfileCertificate[];
  projects?: ProfileProject[];
  awards?: ProfileAward[] | string[];
}

/**
 * Formats month/year into period string
 * @param startMonth 
 * @param startYear 
 * @param endMonth 
 * @param endYear 
 * @param working - If true, shows "Present" for end date
 * @returns Formatted period string like "01/2020 - 06/2023" or "01/2020 - Present"
 */
function formatPeriod(
  startMonth?: string,
  startYear?: string,
  endMonth?: string,
  endYear?: string,
  working?: boolean
): string {
  const start = startMonth && startYear 
    ? `${startMonth.padStart(2, '0')}/${startYear}` 
    : '';
  
  if (working) {
    return start ? `${start} - Present` : '';
  }
  
  const end = endMonth && endYear 
    ? `${endMonth.padStart(2, '0')}/${endYear}` 
    : '';
  
  if (start && end) {
    return `${start} - ${end}`;
  } else if (start) {
    return start;
  }
  return '';
}

/**
 * Normalize education data from cm-profile format to CVData format
 */
function normalizeEducation(educations?: ProfileEducation[]): CVData['education'] {
  if (!educations || !Array.isArray(educations)) return [];
  
  return educations.map((edu) => ({
    degree: edu.degree || '',
    school: edu.school || '',
    period: formatPeriod(edu.startMonth, edu.startYear, edu.endMonth, edu.endYear),
    description: edu.major ? `Major: ${edu.major}` : undefined,
  }));
}

/**
 * Normalize work experience from cm-profile format to CVData format
 */
function normalizeExperience(experiences?: ProfileWorkExperience[]): CVData['experience'] {
  if (!experiences || !Array.isArray(experiences)) return [];
  
  return experiences.map((exp) => {
    const achievements: string[] = [];
    
    // Add project as an achievement if exists
    if (exp.project) {
      achievements.push(`Project: ${exp.project}`);
    }
    
    return {
      position: exp.jobTitle || '',
      company: exp.company || '',
      period: formatPeriod(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.working),
      description: exp.description || '',
      achievements: achievements.length > 0 ? achievements : undefined,
    };
  });
}

/**
 * Normalize skills from cm-profile format (coreSkillGroups/softSkillGroups) to CVData format
 */
function normalizeSkills(
  skills?: ProfileSkillGroup[],
  coreSkillGroups?: ProfileSkillGroup[],
  softSkillGroups?: ProfileSkillGroup[]
): CVData['skills'] {
  const result: CVData['skills'] = [];
  
  // If skills array is provided directly
  if (skills && Array.isArray(skills)) {
    // Check if it's already in correct format
    const isCorrectFormat = skills.every(group => 
      typeof group === 'object' && 
      ('category' in group || 'name' in group) && 
      Array.isArray(group.items)
    );
    
    if (isCorrectFormat) {
      return skills.map(group => ({
        category: (group as any).category || group.name || 'Skills',
        items: (group.items || []).map((item, idx) => ({
          id: item.id || String(idx + 1),
          skill: item.skill || '',
          experience: item.experience,
        })),
      }));
    }
  }
  
  // Process coreSkillGroups
  if (coreSkillGroups && Array.isArray(coreSkillGroups)) {
    coreSkillGroups.forEach((group) => {
      if (group.items && group.items.length > 0) {
        result.push({
          category: group.name || 'Technical Skills',
          items: group.items.map((item, idx) => ({
            id: item.id || String(idx + 1),
            skill: item.skill || '',
            experience: item.experience,
          })),
        });
      }
    });
  }
  
  // Process softSkillGroups - convert to softSkills string array in CVData
  // For now, add as a separate category
  if (softSkillGroups && Array.isArray(softSkillGroups)) {
    const softSkillItems: Array<{ id: string; skill: string; experience?: string }> = [];
    softSkillGroups.forEach((group) => {
      if (group.items && group.items.length > 0) {
        group.items.forEach((item, idx) => {
          softSkillItems.push({
            id: item.id || String(softSkillItems.length + 1),
            skill: item.skill || '',
            experience: item.experience,
          });
        });
      }
    });
    
    if (softSkillItems.length > 0) {
      result.push({
        category: 'Soft Skills',
        items: softSkillItems,
      });
    }
  }
  
  return result;
}

/**
 * Normalize certifications from cm-profile format to CVData format
 */
function normalizeCertifications(certs?: ProfileCertificate[]): CVData['certifications'] {
  if (!certs || !Array.isArray(certs)) return [];
  
  return certs.map((cert) => ({
    name: cert.name || '',
    issuer: cert.org || '',
    date: cert.month && cert.year 
      ? `${cert.month.padStart(2, '0')}/${cert.year}` 
      : cert.year || '',
    url: cert.url,
  }));
}

/**
 * Normalize awards from cm-profile format (objects) to CVData format (objects like certifications)
 */
function normalizeAwards(awards?: ProfileAward[] | string[]): CVData['awards'] {
  if (!awards || !Array.isArray(awards)) return [];
  
  return awards.map((award) => {
    if (typeof award === 'string') {
      // Parse string format: "Name - Organization - Year"
      const parts = award.split(' - ');
      return {
        name: parts[0] || award,
        organization: parts[1] || '',
        date: parts[2] || ''
      };
    }
    
    if (typeof award === 'object' && award !== null) {
      // Format date from month and year fields
      let dateStr = '';
      if (award.month && award.year) {
        dateStr = `${award.month.padStart(2, '0')}/${award.year}`;
      } else if (award.year) {
        dateStr = award.year;
      }
      
      return {
        name: award.name || '',
        organization: award.organization || '',
        date: dateStr
      };
    }
    
    return { name: String(award), organization: '', date: '' };
  });
}

/**
 * Normalize projects from cm-profile format to CVData format
 * Note: cm-profile HighlightProject doesn't have technologies array,
 * so we extract tech keywords from description if possible
 */
function normalizeProjects(projects?: ProfileProject[]): CVData['projects'] {
  if (!projects || !Array.isArray(projects)) return [];
  
  return projects.map((proj) => {
    // If technologies already provided, use them
    // Otherwise, try to extract tech keywords from description
    let technologies = proj.technologies || [];
    
    // If no technologies but has description, we could potentially extract
    // common tech keywords (optional enhancement)
    
    return {
      name: proj.name || '',
      description: proj.description || '',
      technologies: technologies,
      url: proj.url,
      period: formatPeriod(proj.startMonth, proj.startYear, proj.endMonth, proj.endYear, proj.working),
    };
  });
}

/**
 * Normalize languages from cm-profile format to CVData format
 * Preserves the original level value to support all proficiency levels
 */
function normalizeLanguages(languages?: ProfileLanguage[]): CVData['languages'] {
  if (!languages || !Array.isArray(languages)) return [];
  
  return languages.map((lang) => {
    // Preserve the original level value instead of forcing it into a limited set
    // This allows levels like "Elementary", "Upper Intermediate" to pass through
    // The CVData type expects Beginner|Intermediate|Advanced|Native but CVPreview
    // just displays the string, so we cast it for type safety
    return {
      language: lang.language || '',
      level: (lang.level || 'Intermediate') as CVData['languages'][0]['level'],
    };
  });
}

/**
 * Normalize personal info from cm-profile format to CVData format
 */
function normalizePersonalInfo(personalInfo?: ProfilePersonalInfo): CVData['personalInfo'] {
  if (!personalInfo) {
    return {
      fullName: '',
      position: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    };
  }
  
  return {
    fullName: personalInfo.fullName || '',
    position: personalInfo.position || '',
    email: personalInfo.email || '',
    phone: personalInfo.phone || '',
    location: personalInfo.location || '',
    website: personalInfo.website,
    linkedin: personalInfo.linkedin,
    summary: personalInfo.summary || '',
    photoUrl: personalInfo.photoUrl,
    dob: personalInfo.dob,
    gender: personalInfo.gender,
    nationality: personalInfo.nationality,
  };
}

/**
 * Extract soft skills as string array from softSkillGroups
 */
function extractSoftSkills(softSkillGroups?: ProfileSkillGroup[]): string[] | undefined {
  if (!softSkillGroups || !Array.isArray(softSkillGroups)) return undefined;
  
  const softSkills: string[] = [];
  softSkillGroups.forEach((group) => {
    if (group.items && Array.isArray(group.items)) {
      group.items.forEach((item) => {
        if (item.skill) {
          softSkills.push(item.skill);
        }
      });
    }
  });
  
  // Return undefined if no soft skills found, so templates can show defaults
  return softSkills.length > 0 ? softSkills : undefined;
}

/**
 * Main function to normalize cv-profile data to CVData format
 * 
 * @param profileData - Data from cm-profile page
 * @returns Normalized CVData object for CVPreview component
 */
export function normalizeCVData(profileData: ProfileData): CVData {
  // Handle both 'certifications' and 'certificates' field names
  const certs = profileData.certifications || (profileData as any).certificates;
  
  // Handle skills - could be in skills array or in separate groups
  const normalizedSkills = normalizeSkills(
    profileData.skills,
    profileData.coreSkillGroups || (profileData as any).skills,
    profileData.softSkillGroups
  );
  
  // Handle projects - fallback to highlightProjects if projects is empty
  const projects = profileData.projects && profileData.projects.length > 0
    ? profileData.projects
    : (profileData as any).highlightProjects;
  
  // Check if softSkillGroups is already included in skills (as "Soft Skills" category)
  const hasSoftSkillsInSkills = normalizedSkills.some(
    (group) => group.category === 'Soft Skills'
  );
  
  return {
    personalInfo: normalizePersonalInfo(profileData.personalInfo),
    experience: normalizeExperience(profileData.experience),
    education: normalizeEducation(profileData.education),
    skills: normalizedSkills,
    languages: normalizeLanguages(profileData.languages),
    certifications: normalizeCertifications(certs),
    awards: normalizeAwards(profileData.awards as any),
    projects: normalizeProjects(projects),
    // Only set softSkills if softSkillGroups is NOT already included in skills
    // This prevents duplicate rendering in CVPreview
    softSkills: hasSoftSkillsInSkills ? undefined : extractSoftSkills(profileData.softSkillGroups),
  };
}

/**
 * Check if data is already in CVData format or needs normalization
 * 
 * @param data - Input data to check
 * @returns true if data appears to already be in CVData format
 */
export function isCVDataFormat(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  
  // Check for CVData-specific format markers
  // CVData education has 'period' field, profile format has startMonth/startYear
  if (data.education && Array.isArray(data.education) && data.education.length > 0) {
    const firstEdu = data.education[0];
    // If it has 'period' string, it's CVData format
    // If it has 'startMonth/startYear', it's profile format
    if (typeof firstEdu.period === 'string') {
      return true;
    }
    if (firstEdu.startMonth !== undefined || firstEdu.startYear !== undefined) {
      return false;
    }
  }
  
  // Check experience - CVData has 'position', profile has 'jobTitle'
  if (data.experience && Array.isArray(data.experience) && data.experience.length > 0) {
    const firstExp = data.experience[0];
    if (typeof firstExp.position === 'string' && typeof firstExp.period === 'string') {
      return true;
    }
    if (firstExp.jobTitle !== undefined) {
      return false;
    }
  }
  
  // Check skills - CVData has 'category', profile has 'name'
  if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
    const firstSkillGroup = data.skills[0];
    if (typeof firstSkillGroup.category === 'string') {
      return true;
    }
    if (firstSkillGroup.name !== undefined && firstSkillGroup.category === undefined) {
      return false;
    }
  }
  
  // Default: assume it might be CVData format
  return true;
}

/**
 * Auto-normalize data - checks format and normalizes if needed
 * 
 * @param data - Input data (either CVData or profile format)
 * @returns Normalized CVData
 */
export function autoNormalizeCVData(data: any): CVData {
  if (!data) {
    return normalizeCVData({});
  }
  
  // If already in CVData format, return as-is (with some safety normalization for awards)
  if (isCVDataFormat(data)) {
    // Still normalize awards in case they're objects
    if (data.awards && Array.isArray(data.awards)) {
      data.awards = normalizeAwards(data.awards);
    }
    return data as CVData;
  }
  
  // Normalize from profile format
  return normalizeCVData(data);
}
