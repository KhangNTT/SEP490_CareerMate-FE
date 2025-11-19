'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CVTemplateSelector from '@/components/cv/CVTemplateSelector';
import CVPreview from '@/components/cv/CVPreview';
// import CVEditForm from '@/components/cv/CVEditForm';
import { SAMPLE_CV_DATA, CV_TEMPLATES, type CVData } from '@/types/cv';
import { decodeCVTemplateData } from '@/lib/cv-template-navigation';

export default function CVTemplatesPage() {
  const searchParams = useSearchParams();
  const [selectedTemplate, setSelectedTemplate] = useState('minimalist');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [cvData, setCVData] = useState<CVData>(SAMPLE_CV_DATA);
  const [profileData, setProfileData] = useState<any>(null);

  // Handle incoming data from query parameter (from cm-profile page)
  useEffect(() => {
    const dataParam = searchParams.get('data');
    
    if (dataParam) {
      // Decode the data parameter
      const decoded = decodeCVTemplateData(dataParam);
      
      if (decoded) {
        const { template, cvData: incomingCVData, profile } = decoded;
        
        console.log('Received data from cm-profile:', { template, cvData: incomingCVData, profile });
        
        // Set the template
        if (template) {
          setSelectedTemplate(template);
          try {
            localStorage.setItem('selectedTemplate', template);
          } catch (err) {
            // ignore
          }
        }
        
        // Set CV data
        if (incomingCVData) {
          setCVData(incomingCVData);
          try {
            localStorage.setItem('cvData', JSON.stringify(incomingCVData));
          } catch (err) {
            // ignore
          }
        }
        
        // Store profile data
        if (profile) {
          setProfileData(profile);
        }
        
        return; // Skip other initialization if we have data param
      }
    }
    
    // If no data param, restore from localStorage
    try {
      const t = localStorage.getItem('selectedTemplate');
      if (t) setSelectedTemplate(t);
    } catch (err) {
      // ignore
    }
  }, [searchParams]);

  // Load saved CV from localStorage on mount (fallback to SAMPLE_CV_DATA)
  // Only run if we don't have data from query parameter
  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) return; // Skip if we have query param data
    
    try {
      const raw = localStorage.getItem('cvData');
      if (raw) {
        // Parse the stored data
        const parsedData = JSON.parse(raw);
        
        // Check if parsedData is valid and contains essential CV properties
        if (parsedData && typeof parsedData === 'object' && parsedData.personalInfo) {
          // Create a properly structured CV data object
          const loadedCVData: CVData = {
            // Start with our sample data as a base
            ...SAMPLE_CV_DATA,
            // Merge with stored data, ensuring deep merge of nested objects
            ...parsedData,
            // Ensure nested objects are properly merged
            personalInfo: {
              ...SAMPLE_CV_DATA.personalInfo,
              ...parsedData.personalInfo
            },
            // For arrays, we replace them entirely as they should be complete
            education: parsedData.education || SAMPLE_CV_DATA.education,
            experience: parsedData.experience || SAMPLE_CV_DATA.experience,
            skills: parsedData.skills || SAMPLE_CV_DATA.skills,
            languages: parsedData.languages || SAMPLE_CV_DATA.languages,
            certifications: parsedData.certifications || SAMPLE_CV_DATA.certifications,
            projects: parsedData.projects || SAMPLE_CV_DATA.projects,
            softSkills: parsedData.softSkills || SAMPLE_CV_DATA.softSkills,
            hobbies: parsedData.hobbies || SAMPLE_CV_DATA.hobbies,
            references: parsedData.references || SAMPLE_CV_DATA.references,
            awards: parsedData.awards || SAMPLE_CV_DATA.awards,
          };
          
          console.log("Loaded and structured CV data from localStorage:", loadedCVData);
          setCVData(loadedCVData);
        } else {
          console.warn("Invalid CV data structure in localStorage, using sample data");
        }
      } else {
        console.log("No saved CV data found, using sample data");
        // Optionally: fetch from API here and setCVData(fetchedData)
      }
    } catch (err) {
      console.error("Error loading CV data:", err);
      // ignore parse errors and keep SAMPLE_CV_DATA
    }
  }, [searchParams]);

  // Persist cvData to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cvData', JSON.stringify(cvData));
    } catch (err) {
      // ignore storage errors
    }
  }, [cvData]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Get the saved CV data from localStorage
    let savedCVData: CVData | null = null;
    try {
      const raw = localStorage.getItem('cvData');
      if (raw) {
        savedCVData = JSON.parse(raw) as CVData;
      }
    } catch (err) {
      console.error("Error reading saved CV data:", err);
    }
    
    // Load the template's default data (use SAMPLE_CV_DATA)
    const template = CV_TEMPLATES.find((t) => t.id === templateId);
    const templateDefaultData = SAMPLE_CV_DATA;
    
    // If we have saved CV data, use it but keep the template format
    if (savedCVData && savedCVData.personalInfo) {
      // Keep user's personal data but use template's formatting and structure
      setCVData({
        ...templateDefaultData,
        // Override with user's personal data
        personalInfo: {
          ...templateDefaultData.personalInfo, // Keep template-specific formatting
          fullName: savedCVData.personalInfo.fullName,
          position: savedCVData.personalInfo.position,
          email: savedCVData.personalInfo.email,
          phone: savedCVData.personalInfo.phone,
          location: savedCVData.personalInfo.location,
          summary: savedCVData.personalInfo.summary,
          website: savedCVData.personalInfo.website,
          linkedin: savedCVData.personalInfo.linkedin,
          dob: savedCVData.personalInfo.dob,
          nationality: savedCVData.personalInfo.nationality,
          photoUrl: savedCVData.personalInfo.photoUrl,
        },
        education: savedCVData.education || templateDefaultData.education,
        experience: savedCVData.experience || templateDefaultData.experience,
        skills: savedCVData.skills || templateDefaultData.skills,
        languages: savedCVData.languages || templateDefaultData.languages,
        certifications: savedCVData.certifications || templateDefaultData.certifications,
        projects: savedCVData.projects || templateDefaultData.projects,
        softSkills: savedCVData.softSkills || templateDefaultData.softSkills,
        hobbies: savedCVData.hobbies || templateDefaultData.hobbies,
        references: savedCVData.references || templateDefaultData.references,
        awards: savedCVData.awards || templateDefaultData.awards,
      });
    } else {
      // No saved data, use template default data
      setCVData(templateDefaultData);
    }
    
    try {
      localStorage.setItem('selectedTemplate', templateId);
    } catch (err) {
      // ignore
    }
  };

  const handleEditClick = () => {
    setIsEditFormOpen(true);
  };

  const handleDataChange = (newData: CVData) => {
    setCVData(newData);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
  };

  // Check if we have custom data from update-cvprofile
  const hasCustomData = Object.keys(cvData).length > 0 && 
    (cvData.personalInfo?.fullName !== SAMPLE_CV_DATA.personalInfo.fullName ||
     cvData.personalInfo?.email !== SAMPLE_CV_DATA.personalInfo.email ||
     cvData.personalInfo?.position !== SAMPLE_CV_DATA.personalInfo.position ||
     cvData.personalInfo?.summary !== SAMPLE_CV_DATA.personalInfo.summary);
     
  // Update the state if custom data is detected (useful for refresh button visibility)
  useEffect(() => {
    if (hasCustomData) {
      // Don't need to do anything specific here, just ensure the effect runs when hasCustomData changes
      console.log("Custom CV data detected");
    }
  }, [hasCustomData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Full width without container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
        {/* Template Selector - Full height */}
        <div className="lg:col-span-1 h-full overflow-y-auto bg-white">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-col sm:flex-row gap-2">
            <h2 className="text-xl font-bold text-gray-800">Select Template</h2>
          </div>
          
          {/* Thông báo dữ liệu cá nhân */}
          {hasCustomData && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 my-2 mx-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <div>
                  <p className="font-medium">Dữ liệu cá nhân của bạn đã được tải!</p>
                  <p className="text-sm">CV đang hiển thị thông tin cá nhân thực của bạn.</p>
                </div>
              </div>
            </div>
          )}
          
          <CVTemplateSelector onTemplateSelect={handleTemplateSelect} />
        </div>

        {/* CV Preview - Full height */}
        <div className="lg:col-span-2 h-full overflow-y-auto bg-gray-100">
          <CVPreview 
            templateId={selectedTemplate} 
            cvData={cvData}
            onEditClick={handleEditClick}
          />
        </div>
      </div>
    </div>
  );
}