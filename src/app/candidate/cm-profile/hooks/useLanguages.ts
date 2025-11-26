import { useState } from 'react';
import { Language } from '../components/types';
import { addForeignLanguage, deleteForeignLanguage, type ForeignLanguageData } from '@/lib/resume-api';
import toast from 'react-hot-toast';

export function useLanguages(resumeId: number | null) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const openLanguageDialog = () => {
    setIsLanguageOpen(true);
  };

  const saveLanguages = () => {
    setIsLanguageOpen(false);
  };

  const addLanguage = async (language: string, level: string) => {
    if (!language || !level) return;

    if (!resumeId) {
      toast.error("Resume ID not found. Please refresh the page.");
      return;
    }

    try {
      const languageData: ForeignLanguageData = {
        resumeId: resumeId,
        language: language,
        level: level
      };

      const response = await addForeignLanguage(languageData);

      if (!response || !response.foreignLanguageId) {
        toast.error("Invalid response from server. Please try again.");
        return;
      }

      const newLanguage: Language = {
        id: response.foreignLanguageId.toString(),
        language: response.language,
        level: response.level
      };

      setLanguages([...languages, newLanguage]);
      toast.success("Language added successfully!");
    } catch (error) {
      console.error("Error adding language:", error);
      toast.error("Failed to add language. Please try again.");
    }
  };

  const removeLanguage = async (id: string) => {
    try {
      await deleteForeignLanguage(Number(id));
      setLanguages(languages.filter(lang => lang.id !== id));
      toast.success("Language removed successfully!");
    } catch (error) {
      console.error("Error removing language:", error);
      toast.error("Failed to remove language. Please try again.");
    }
  };

  return {
    languages,
    setLanguages,
    isLanguageOpen,
    setIsLanguageOpen,
    openLanguageDialog,
    saveLanguages,
    addLanguage,
    removeLanguage
  };
}
