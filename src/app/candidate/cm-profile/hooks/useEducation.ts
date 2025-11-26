import { useState } from 'react';
import { Education } from '../components/types';
import { addEducation, updateEducation, deleteEducation, type EducationData } from '@/lib/resume-api';
import toast from 'react-hot-toast';

export function useEducation(resumeId: number | null) {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const openEducationDialog = (education?: Education) => {
    if (education) {
      setEditingEducation(education);
    } else {
      setEditingEducation({
        id: '0',
        school: '',
        degree: '',
        major: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: ''
      });
    }
    setIsEducationOpen(true);
  };

  const saveEducation = async () => {
    if (!editingEducation || !editingEducation.school || !editingEducation.degree || !editingEducation.major || !editingEducation.startMonth || !editingEducation.startYear) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!resumeId) {
      toast.error("Resume ID not found. Please refresh the page.");
      return;
    }

    try {
      const educationData: EducationData = {
        resumeId: resumeId,
        school: editingEducation.school,
        major: editingEducation.major,
        degree: editingEducation.degree,
        startDate: `${editingEducation.startYear}-${editingEducation.startMonth}-01`,
        endDate: (!editingEducation.endMonth || !editingEducation.endYear) 
          ? `${editingEducation.startYear}-${editingEducation.startMonth}-01` 
          : `${editingEducation.endYear}-${editingEducation.endMonth}-01`
      };

      if (editingEducation.id && editingEducation.id !== '0') {
        await updateEducation(resumeId, Number(editingEducation.id), educationData);
        setEducations(educations.map(edu =>
          edu.id === editingEducation.id ? editingEducation : edu
        ));
        toast.success("Education updated successfully!");
      } else {
        const response = await addEducation(educationData);
        if (!response || !response.educationId) {
          toast.error("Invalid response from server. Please try again.");
          return;
        }

        const newEducation: Education = {
          id: response.educationId.toString(),
          school: response.school,
          degree: response.degree,
          major: response.major,
          startMonth: editingEducation.startMonth,
          startYear: editingEducation.startYear,
          endMonth: editingEducation.endMonth || '',
          endYear: editingEducation.endYear || ''
        };

        setEducations([...educations, newEducation]);
        toast.success("Education added successfully!");
      }

      setIsEducationOpen(false);
      setEditingEducation(null);
    } catch (error) {
      console.error("Error saving education:", error);
      toast.error(`Failed to ${editingEducation.id && editingEducation.id !== '0' ? "update" : "add"} education. Please try again.`);
    }
  };

  const removeEducation = async (id: string) => {
    try {
      await deleteEducation(Number(id));
      setEducations(educations.filter(edu => edu.id !== id));
      toast.success("Education removed successfully!");
    } catch (error) {
      console.error("Error removing education:", error);
      toast.error("Failed to remove education. Please try again.");
    }
  };

  return {
    educations,
    setEducations,
    isEducationOpen,
    setIsEducationOpen,
    editingEducation,
    setEditingEducation,
    openEducationDialog,
    saveEducation,
    removeEducation
  };
}
