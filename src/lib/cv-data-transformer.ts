/**
 * CV Data Transformer Utilities
 * 
 * Helpers to transform your application's CV data format
 * into the format expected by the print templates.
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

/**
 * Print template format (what print pages expect)
 */
export interface PrintCVData {
  fullName: string;
  title?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  photoUrl?: string;
  summary?: string;
  
  experience?: Array<{
    position: string;
    company: string;
    period: string;
    description: string;
  }>;
  
  education?: Array<{
    degree: string;
    institution: string;
    period: string;
    description?: string;
  }>;
  
  skills?: Array<{
    category: string;
    items: string[];
  }>;
  
  languages?: Array<{
    name: string;
    level: string;
  }>;
  
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  
  projects?: Array<{
    name: string;
    description: string;
    period: string;
  }>;
}

/**
 * Application CV format (your current format)
 */
export interface AppCVData {
  personalInfo: {
    fullName: string;
    position: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    photoUrl?: string;
    summary: string;
    dob?: string;
    nationality?: string;
  };
  
  experience: Array<{
    position: string;
    company: string;
    period: string;
    description: string;
    achievements?: string[];
    location?: string;
    responsibilities?: string[];
  }>;
  
  education: Array<{
    degree: string;
    school: string;
    period: string;
    gpa?: string;
    description?: string;
    honors?: string[];
  }>;
  
  skills: Array<{
    category: string;
    items: string[];
  }>;
  
  languages: Array<{
    language: string;
    level: "Beginner" | "Intermediate" | "Advanced" | "Native";
  }>;
  
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    role?: string;
    period?: string;
  }>;
}

// ========================================
// TRANSFORMATION FUNCTIONS
// ========================================

/**
 * Transform application CV data to print format
 * 
 * @param cvData - Your application's CV data
 * @returns Print-ready CV data
 */
export function transformCVDataForPrint(cvData: AppCVData): PrintCVData {
  return {
    // Personal Info
    fullName: cvData.personalInfo.fullName || "",
    title: cvData.personalInfo.position || "",
    email: cvData.personalInfo.email || "",
    phone: cvData.personalInfo.phone || "",
    address: cvData.personalInfo.location || "",
    website: cvData.personalInfo.website || "",
    photoUrl: cvData.personalInfo.photoUrl || "",
    summary: cvData.personalInfo.summary || "",
    
    // Experience
    experience: cvData.experience?.map(exp => ({
      position: exp.position || "",
      company: exp.company || "",
      period: exp.period || "",
      description: formatExperienceDescription(exp),
    })) || [],
    
    // Education
    education: cvData.education?.map(edu => ({
      degree: edu.degree || "",
      institution: edu.school || "",
      period: edu.period || "",
      description: formatEducationDescription(edu),
    })) || [],
    
    // Skills (no transformation needed)
    skills: cvData.skills || [],
    
    // Languages
    languages: cvData.languages?.map(lang => ({
      name: lang.language || "",
      level: lang.level || "",
    })) || [],
    
    // Certifications (no transformation needed)
    certifications: cvData.certifications || [],
    
    // Projects
    projects: cvData.projects?.map(proj => ({
      name: proj.name || "",
      description: formatProjectDescription(proj),
      period: proj.period || "",
    })) || [],
  };
}

/**
 * Format experience description with achievements and responsibilities
 */
function formatExperienceDescription(exp: {
  position: string;
  company: string;
  period: string;
  description: string;
  achievements?: string[];
  location?: string;
  responsibilities?: string[];
}): string {
  let description = exp.description || "";
  
  // Add achievements if present
  if (exp.achievements && exp.achievements.length > 0) {
    description += "\n\nKey Achievements:";
    exp.achievements.forEach(achievement => {
      description += `\n• ${achievement}`;
    });
  }
  
  // Add responsibilities if present
  if (exp.responsibilities && exp.responsibilities.length > 0) {
    description += "\n\nResponsibilities:";
    exp.responsibilities.forEach(responsibility => {
      description += `\n• ${responsibility}`;
    });
  }
  
  return description.trim();
}

/**
 * Format education description with GPA and honors
 */
function formatEducationDescription(edu: {
  degree: string;
  school: string;
  period: string;
  gpa?: string;
  description?: string;
  honors?: string[];
}): string {
  let description = edu.description || "";
  
  // Add GPA if present
  if (edu.gpa) {
    description += `\nGPA: ${edu.gpa}`;
  }
  
  // Add honors if present
  if (edu.honors && edu.honors.length > 0) {
    description += "\n\nHonors:";
    edu.honors.forEach(honor => {
      description += `\n• ${honor}`;
    });
  }
  
  return description.trim();
}

/**
 * Format project description with technologies and links
 */
function formatProjectDescription(proj: {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  role?: string;
  period?: string;
}): string {
  let description = proj.description || "";
  
  // Add role if present
  if (proj.role) {
    description = `Role: ${proj.role}\n\n${description}`;
  }
  
  // Add technologies
  if (proj.technologies && proj.technologies.length > 0) {
    description += `\n\nTechnologies: ${proj.technologies.join(", ")}`;
  }
  
  // Add links
  if (proj.url) {
    description += `\nProject URL: ${proj.url}`;
  }
  if (proj.github) {
    description += `\nGitHub: ${proj.github}`;
  }
  
  return description.trim();
}

// ========================================
// AVATAR CONVERSION UTILITIES
// ========================================

/**
 * Convert image URL to base64 string
 * Useful for ensuring avatars work in PDF
 * 
 * @param imageUrl - Image URL (http:// or https://)
 * @returns Base64 data URL
 */
export async function convertImageToBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return ""; // Return empty string on error
  }
}

/**
 * Prepare CV data with base64 avatar
 * 
 * @param cvData - CV data with photoUrl
 * @returns CV data with base64 photoUrl
 */
export async function prepareCVDataWithBase64Avatar(
  cvData: PrintCVData
): Promise<PrintCVData> {
  if (!cvData.photoUrl || cvData.photoUrl.startsWith('data:')) {
    // Already base64 or no photo
    return cvData;
  }
  
  try {
    const base64Avatar = await convertImageToBase64(cvData.photoUrl);
    return {
      ...cvData,
      photoUrl: base64Avatar,
    };
  } catch (error) {
    console.warn('Failed to convert avatar to base64, using original URL');
    return cvData;
  }
}

// ========================================
// VALIDATION UTILITIES
// ========================================

/**
 * Validate CV data before export
 * 
 * @param cvData - CV data to validate
 * @returns Validation result with errors if any
 */
export function validateCVData(cvData: Partial<PrintCVData>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check required fields
  if (!cvData.fullName || cvData.fullName.trim() === "") {
    errors.push("Full name is required");
  }
  
  // Warn about missing sections (not errors)
  const warnings: string[] = [];
  if (!cvData.experience || cvData.experience.length === 0) {
    warnings.push("No experience data");
  }
  if (!cvData.education || cvData.education.length === 0) {
    warnings.push("No education data");
  }
  if (!cvData.skills || cvData.skills.length === 0) {
    warnings.push("No skills data");
  }
  
  if (warnings.length > 0) {
    console.warn("CV data warnings:", warnings);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize CV data to prevent XSS in PDF
 * 
 * @param cvData - Raw CV data
 * @returns Sanitized CV data
 */
export function sanitizeCVData(cvData: PrintCVData): PrintCVData {
  // Simple HTML escape function
  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  // Recursively sanitize all string values
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      return escapeHtml(value);
    } else if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    } else if (typeof value === 'object' && value !== null) {
      const sanitized: any = {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };
  
  return sanitizeValue(cvData);
}

// ========================================
// EXAMPLE USAGE
// ========================================

/**
 * Complete export workflow with all utilities
 */
export async function exportCVWithTransformation(
  appCVData: AppCVData,
  templateId: string,
  options?: {
    useBase64Avatar?: boolean;
    sanitize?: boolean;
    validate?: boolean;
  }
): Promise<void> {
  const {
    useBase64Avatar = false,
    sanitize = true,
    validate = true,
  } = options || {};
  
  // Step 1: Transform data
  let printData = transformCVDataForPrint(appCVData);
  
  // Step 2: Validate (optional)
  if (validate) {
    const validation = validateCVData(printData);
    if (!validation.valid) {
      throw new Error(`Invalid CV data: ${validation.errors.join(', ')}`);
    }
  }
  
  // Step 3: Convert avatar to base64 (optional)
  if (useBase64Avatar && printData.photoUrl) {
    printData = await prepareCVDataWithBase64Avatar(printData);
  }
  
  // Step 4: Sanitize (optional)
  if (sanitize) {
    printData = sanitizeCVData(printData);
  }
  
  // Step 5: Export
  const response = await fetch('/api/export-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      templateId,
      cvData: printData,
      fileName: `CV_${printData.fullName.replace(/[^a-zA-Z0-9]/g, '_')}`,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Export failed');
  }
  
  // Step 6: Download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CV_${printData.fullName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}
