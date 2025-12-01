import { useState } from 'react';
import { WorkExperience } from '../components/types';
import { addWorkExperience, updateWorkExperience, deleteWorkExperience, type WorkExperienceData } from '@/lib/resume-api';
import toast from 'react-hot-toast';

export function useWorkExperience(resumeId: number | null) {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [isWorkExpOpen, setIsWorkExpOpen] = useState(false);
  const [editingWorkExp, setEditingWorkExp] = useState<WorkExperience | null>(null);

  const openWorkExpDialog = (workExp?: WorkExperience) => {
    if (workExp) {
      setEditingWorkExp(workExp);
    } else {
      setEditingWorkExp({
        id: '0',
        jobTitle: '',
        company: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        description: '',
        project: '',
        working: false
      });
    }
    setIsWorkExpOpen(true);
  };

  const saveWorkExp = async () => {
    if (!editingWorkExp || !editingWorkExp.jobTitle || !editingWorkExp.company || !editingWorkExp.startMonth || !editingWorkExp.startYear) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!editingWorkExp.working && (!editingWorkExp.endMonth || !editingWorkExp.endYear)) {
      toast.error("Please fill in end date or check 'Currently working here'");
      return;
    }

    if (!resumeId) {
      toast.error("Resume ID not found. Please refresh the page.");
      return;
    }

    try {
      console.log('📝 [useWorkExperience] Building work experience data...');
      console.log('📝 editingWorkExp:', editingWorkExp);
      console.log('📝 startMonth:', editingWorkExp.startMonth, 'startYear:', editingWorkExp.startYear);
      
      const startDate = `${editingWorkExp.startYear}-${editingWorkExp.startMonth.padStart(2, '0')}-01`;
      console.log('📝 Built startDate:', startDate);
      
      // Backend requires endDate (NotNull), so we need to provide a value
      // When currently working, use current date as placeholder
      let endDate: string;

      if (!editingWorkExp.working && editingWorkExp.endMonth && editingWorkExp.endYear) {
        endDate = `${editingWorkExp.endYear}-${editingWorkExp.endMonth.padStart(2, '0')}-01`;
        console.log('📝 Built endDate (from user input):', endDate);
      } else {
        // Currently working - use today's date as placeholder since backend requires it
        const today = new Date();
        endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        console.log('📝 Built endDate (current date for working):', endDate);
      }

      const data: WorkExperienceData = {
        resumeId,
        jobTitle: editingWorkExp.jobTitle,
        company: editingWorkExp.company,
        startDate,
        endDate,
        description: editingWorkExp.description || "",
        ...(editingWorkExp.project && { project: editingWorkExp.project })
      };

      console.log('📝 Final WorkExperienceData to send:', JSON.stringify(data, null, 2));

      if (editingWorkExp.id && editingWorkExp.id !== '0') {
        await updateWorkExperience(resumeId, Number(editingWorkExp.id), data);
        setWorkExperiences(workExperiences.map(exp =>
          exp.id === editingWorkExp.id ? editingWorkExp : exp
        ));
        toast.success("Work experience updated successfully!");
      } else {
        const result = await addWorkExperience(data);
        console.log('📝 API Response:', result);
        
        // Backend may not return result with workExperienceId, use temporary ID
        const newWorkExp: WorkExperience = {
          id: result?.workExperienceId?.toString() || `temp-${Date.now()}`,
          jobTitle: result?.jobTitle || editingWorkExp.jobTitle,
          company: result?.company || editingWorkExp.company,
          startMonth: editingWorkExp.startMonth,
          startYear: editingWorkExp.startYear,
          endMonth: editingWorkExp.working ? "" : editingWorkExp.endMonth,
          endYear: editingWorkExp.working ? "" : editingWorkExp.endYear,
          working: editingWorkExp.working,
          description: editingWorkExp.description,
          project: editingWorkExp.project
        };
        setWorkExperiences([...workExperiences, newWorkExp]);
        toast.success("Work experience added successfully!");
      }

      setIsWorkExpOpen(false);
      setEditingWorkExp(null);
    } catch (error) {
      console.error("Error saving work experience:", error);
      toast.error("Failed to save work experience. Please try again.");
    }
  };

  const removeWorkExp = async (id: string) => {
    try {
      await deleteWorkExperience(Number(id));
      setWorkExperiences(workExperiences.filter(exp => exp.id !== id));
      toast.success("Work experience removed successfully!");
    } catch (error) {
      console.error("Error removing work experience:", error);
      toast.error("Failed to remove work experience. Please try again.");
    }
  };

  return {
    workExperiences,
    setWorkExperiences,
    isWorkExpOpen,
    setIsWorkExpOpen,
    editingWorkExp,
    setEditingWorkExp,
    openWorkExpDialog,
    saveWorkExp,
    removeWorkExp
  };
}
