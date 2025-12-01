/**
 * CV Template Navigation Utility
 * 
 * This utility handles navigation to the CV template page with encoded data.
 * All data (template, cvData, profile) is passed through a single 'data' query parameter.
 */

import { autoNormalizeCVData } from './cv-data-normalizer';

/**
 * Opens the CV template page with encoded data
 * 
 * @param cvData - The CV data object (will be auto-normalized to CVData format)
 * @param profile - The user profile object
 * @param templateId - The template ID to use
 */
export function openCVTemplate(
  cvData: any,
  profile: any,
  templateId: string
): void {
  // Auto-normalize cvData to ensure it matches CVData interface
  // This handles both cm-profile format and already-normalized data
  const normalizedCVData = autoNormalizeCVData(cvData);

  // Wrap all data into a single object
  const payload = {
    template: templateId,
    cvData: normalizedCVData,
    profile: profile,
  };

  // Convert to JSON
  const json = JSON.stringify(payload);

  // Encode the JSON string
  const encoded = encodeURIComponent(json);

  // Redirect to /cv-template with single data parameter
  window.location.href = `/cv-templates?data=${encoded}`;
}

/**
 * Decodes the data parameter from the CV template page
 * 
 * @param dataParam - The encoded data parameter from searchParams
 * @returns Decoded object with template, cvData (normalized), and profile
 */
export function decodeCVTemplateData(dataParam: string | null): {
  template: string;
  cvData: any;
  profile: any;
} | null {
  if (!dataParam) {
    return null;
  }

  try {
    // Decode the parameter
    const decoded = decodeURIComponent(dataParam);

    // Parse the JSON
    const parsed = JSON.parse(decoded);

    // Extract and return the values
    const { template, cvData, profile } = parsed;

    // Auto-normalize cvData to ensure it matches CVData interface
    // This handles edge cases where data might not have been normalized before encoding
    const normalizedCVData = autoNormalizeCVData(cvData);

    return { template, cvData: normalizedCVData, profile };
  } catch (error) {
    console.error('Failed to decode CV template data:', error);
    return null;
  }
}
