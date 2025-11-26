/**
 * API Response Test & Validation
 * 
 * This file verifies that our TypeScript interfaces match the actual API response
 */

import { Resume, ResumeResponse } from "@/services/resumeService";

// ===== Mock API Response (from your example) =====
const mockApiResponse: ResumeResponse = {
  code: 1073741824,
  message: "string",
  result: [
    {
      resumeId: 1073741824,
      aboutMe: "string",
      resumeUrl: "string",
      type: "WEB",
      isActive: true,
      createdAt: "2025-11-24T08:32:36.172Z",
      candidateId: 1073741824,
      certificates: [
        {
          certificateId: 1073741824,
          name: "string",
          organization: "string",
          getDate: "2025-11-24",
          certificateUrl: "string",
          description: "string"
        }
      ],
      educations: [
        {
          educationId: 1073741824,
          school: "string",
          major: "string",
          degree: "string",
          startDate: "2025-11-24",
          endDate: "2025-11-24"
        }
      ],
      highlightProjects: [
        {
          highlightProjectId: 1073741824,
          name: "string",
          startDate: "2025-11-24",
          endDate: "2025-11-24",
          description: "string",
          projectUrl: "string"
        }
      ],
      workExperiences: [
        {
          workExperienceId: 1073741824,
          jobTitle: "string",
          company: "string",
          startDate: "2025-11-24",
          endDate: "2025-11-24",
          description: "string",
          project: "string"
        }
      ],
      skills: [
        {
          skillId: 1073741824,
          skillType: "string",
          skillName: "string",
          yearOfExperience: 1073741824
        }
      ],
      foreignLanguages: [
        {
          foreignLanguageId: 1073741824,
          language: "string",
          level: "string"
        }
      ],
      awards: [
        {
          awardId: 1073741824,
          name: "string",
          organization: "string",
          getDate: "2025-11-24",
          description: "string"
        }
      ]
    }
  ]
};

// ===== Validation Function =====
export function validateApiResponse(response: any): response is ResumeResponse {
  try {
    // Check top-level structure
    if (!response || typeof response !== 'object') {
      console.error('❌ Response is not an object');
      return false;
    }

    if (!('code' in response) || !('message' in response) || !('result' in response)) {
      console.error('❌ Missing required fields: code, message, or result');
      return false;
    }

    if (!Array.isArray(response.result)) {
      console.error('❌ result is not an array');
      return false;
    }

    // Check each resume object
    for (const resume of response.result) {
      if (!resume.resumeId || !resume.type || !resume.resumeUrl) {
        console.error('❌ Resume missing required fields:', resume);
        return false;
      }

      // Validate type
      if (!['WEB', 'UPLOAD', 'DRAFT'].includes(resume.type)) {
        console.error('❌ Invalid resume type:', resume.type);
        return false;
      }

      // Validate arrays
      if (!Array.isArray(resume.certificates)) {
        console.error('❌ certificates is not an array');
        return false;
      }
      if (!Array.isArray(resume.educations)) {
        console.error('❌ educations is not an array');
        return false;
      }
      if (!Array.isArray(resume.highlightProjects)) {
        console.error('❌ highlightProjects is not an array');
        return false;
      }
      if (!Array.isArray(resume.workExperiences)) {
        console.error('❌ workExperiences is not an array');
        return false;
      }
      if (!Array.isArray(resume.skills)) {
        console.error('❌ skills is not an array');
        return false;
      }
      if (!Array.isArray(resume.foreignLanguages)) {
        console.error('❌ foreignLanguages is not an array');
        return false;
      }
      if (!Array.isArray(resume.awards)) {
        console.error('❌ awards is not an array');
        return false;
      }
    }

    console.log('✅ API Response validation passed');
    return true;
  } catch (error) {
    console.error('❌ Validation error:', error);
    return false;
  }
}

// ===== Test the mock response =====
console.log('Testing mock API response...');
const isValid = validateApiResponse(mockApiResponse);
console.log('Validation result:', isValid ? '✅ PASS' : '❌ FAIL');

// ===== Export for use in components =====
export { mockApiResponse };
