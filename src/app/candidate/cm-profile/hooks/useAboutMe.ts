import { useState } from 'react';
import { updateResume, type UpdateResumeData } from '@/lib/resume-api';
import toast from 'react-hot-toast';

export function useAboutMe(resumeId: number | null) {
  const [aboutMeText, setAboutMeText] = useState("");
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);

  const openAboutMeDialog = () => {
    setIsAboutMeOpen(true);
  };

  const handleAboutMeChange = (value: string) => {
    if (value.length <= 2500) {
      setAboutMeText(value);
    }
  };

  const saveAboutMe = async () => {
    if (!resumeId) {
      toast.error("Resume ID not found. Please refresh the page.");
      return;
    }

    try {
      console.log('🔍 ===== SAVING ABOUT ME =====');
      console.log('Resume ID:', resumeId);
      console.log('About Me Text:', aboutMeText);
      console.log('Text Length:', aboutMeText.length);

      const data: UpdateResumeData = {
        aboutMe: aboutMeText
      };

      console.log('Request Data:', JSON.stringify(data, null, 2));

      await updateResume(resumeId, data);
      toast.success("About Me updated successfully!");
      setIsAboutMeOpen(false);
    } catch (error: any) {
      console.error("❌ Error updating About Me:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast.error(error.response?.data?.message || "Failed to update About Me. Please try again.");
    }
  };

  return {
    aboutMeText,
    setAboutMeText,
    isAboutMeOpen,
    setIsAboutMeOpen,
    openAboutMeDialog,
    handleAboutMeChange,
    saveAboutMe
  };
}
