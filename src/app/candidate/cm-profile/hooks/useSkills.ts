import { useState } from 'react';
import { SkillGroup, SkillItem } from '../components/types';
import { addSkill, deleteSkill, type SkillData } from '@/lib/resume-api';
import toast from 'react-hot-toast';

// Queue item types
type QueueOperation = {
  type: 'add' | 'delete';
  skill?: { skill: string; experience?: string };
  skillId?: number;
};

export function useSkills(resumeId: number | null) {
  const [coreSkillGroups, setCoreSkillGroups] = useState<SkillGroup[]>([]);
  const [softSkillGroups, setSoftSkillGroups] = useState<SkillGroup[]>([]);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [operationQueue, setOperationQueue] = useState<QueueOperation[]>([]);

  const openSkillDialog = () => {
    setIsSkillDialogOpen(true);
  };

  // This will be called when user clicks Save in the dialog
  const saveSkills = async (
    skills: Array<{ id: string; skill: string; experience?: string }>, 
    skillType: 'core' | 'soft',
    originalSkills: Array<{ id: string; skill: string; experience?: string }> = []
  ) => {
    if (!resumeId) {
      toast.error("Resume ID not found. Please refresh the page.");
      return;
    }

    // Validate skillType
    if (skillType !== 'core' && skillType !== 'soft') {
      toast.error("Invalid skill type. Please select 'core' or 'soft'.");
      return;
    }

    console.log('📝 [useSkills.saveSkills] Input params:', {
      resumeId,
      skillType,
      skillsCount: skills.length,
      originalSkillsCount: originalSkills.length
    });

    try {
      // Determine which skills to add and which to delete
      const skillsToAdd: typeof skills = [];
      const skillsToDelete: typeof originalSkills = [];

      // Find skills to delete (in original but not in current)
      originalSkills.forEach(originalSkill => {
        const stillExists = skills.find(s => s.id === originalSkill.id);
        if (!stillExists) {
          skillsToDelete.push(originalSkill);
        }
      });

      // Find skills to add (new skills with temporary IDs)
      skills.forEach(skill => {
        // If ID is a timestamp (new skill) or doesn't exist in original
        const isNew = !originalSkills.find(s => s.id === skill.id);
        if (isNew) {
          skillsToAdd.push(skill);
        }
      });

      console.log('🔄 Processing skills:', { skillsToAdd, skillsToDelete });

      // Execute DELETE operations first
      if (skillsToDelete.length > 0) {
        const deletePromises = skillsToDelete.map(skill => {
          const skillId = parseInt(skill.id);
          if (!isNaN(skillId)) {
            console.log(`🗑️ Deleting skill: ${skill.skill} (ID: ${skillId})`);
            return deleteSkill(resumeId, skillId);
          }
          return Promise.resolve();
        });
        await Promise.all(deletePromises);
        console.log(`✅ Deleted ${skillsToDelete.length} skill(s)`);
      }

      // Execute ADD operations
      let addedSkillsData: any[] = [];
      if (skillsToAdd.length > 0) {
        const addPromises = skillsToAdd.map(skill => {
          // Validate skill name before sending
          if (!skill.skill || !skill.skill.trim()) {
            console.warn('⚠️ Skipping skill with empty name:', skill);
            return Promise.resolve(null);
          }
          
          const data: SkillData = {
            resumeId,
            skillType: skillType, // "core" or "soft"
            skillName: skill.skill.trim(),
            ...(skillType === "core" && skill.experience ? { yearOfExperience: parseInt(skill.experience) } : {})
          };
          console.log(`➕ Adding skill: ${skill.skill}`, JSON.stringify(data, null, 2));
          return addSkill(data);
        });
        const results = await Promise.all(addPromises);
        addedSkillsData = results.filter(r => r !== null);
        console.log(`✅ Added ${addedSkillsData.length} skill(s)`, addedSkillsData);
      }

      // Update local state with the final skills list
      // Merge existing skills (that weren't deleted) with newly added skills
      const finalSkills = skills.map((skill, index) => {
        const isNewSkill = skillsToAdd.find(s => s.id === skill.id);
        if (isNewSkill) {
          // This is a newly added skill, use the API response ID
          const addedIndex = skillsToAdd.findIndex(s => s.id === skill.id);
          const apiResponse = addedSkillsData[addedIndex];
          return {
            id: apiResponse?.skillId?.toString() || skill.id,
            skill: skill.skill,
            ...(skill.experience ? { experience: skill.experience } : {})
          };
        }
        // This is an existing skill that wasn't deleted
        return skill;
      });

      // Update state - handle empty case (all skills deleted)
      // IMPORTANT: When adding NEW skills (originalSkills is empty), merge with existing skills in state
      const isAddMode = originalSkills.length === 0;
      
      if (skillType === "core") {
        if (finalSkills.length === 0 && !isAddMode) {
          // Clear core skills if all deleted (only in edit mode)
          setCoreSkillGroups([]);
        } else {
          // Get existing skills from state (if in add mode, we need to preserve them)
          const existingItems = isAddMode 
            ? coreSkillGroups.flatMap(group => group.items || [])
            : [];
          
          const newItems = finalSkills.filter(s => s.experience);
          const mergedItems = [...existingItems, ...newItems];
          
          const newGroup: SkillGroup = {
            id: Date.now().toString(),
            name: 'Core Skills',
            items: mergedItems as SkillItem[]
          };
          setCoreSkillGroups([newGroup]);
        }
      } else if (skillType === "soft") {
        if (finalSkills.length === 0 && !isAddMode) {
          // Clear soft skills if all deleted (only in edit mode)
          setSoftSkillGroups([]);
        } else {
          // Get existing skills from state (if in add mode, we need to preserve them)
          const existingItems = isAddMode 
            ? softSkillGroups.flatMap(group => group.items || [])
            : [];
          
          const mergedItems = [...existingItems, ...finalSkills];
          
          const newGroup: SkillGroup = {
            id: Date.now().toString(),
            name: 'Soft Skills',
            items: mergedItems as SkillItem[]
          };
          setSoftSkillGroups([newGroup]);
        }
      }

      const totalOperations = skillsToAdd.length + skillsToDelete.length;
      if (skills.length === 0 && originalSkills.length > 0) {
        toast.success(`All ${skillType} skills deleted successfully!`);
      } else {
        toast.success(`Successfully updated skills! (${skillsToAdd.length} added, ${skillsToDelete.length} deleted)`);
      }
      setIsSkillDialogOpen(false);
    } catch (error: any) {
      console.error("❌ Error saving skills:", error);
      console.error("❌ Error response data:", error?.response?.data);
      
      // Extract meaningful error message from backend
      const backendMessage = error?.response?.data?.message;
      const backendCode = error?.response?.data?.code;
      
      // Handle specific error codes from backend
      if (backendCode === 1019) {
        toast.error("Maximum skill limit reached (10 skills). Please remove some skills first.");
      } else if (backendMessage) {
        toast.error(backendMessage);
      } else {
        toast.error("Failed to save skills. Please try again.");
      }
    }
  };

  // Delete all skills of a specific type (core or soft)
  const deleteAllSkills = async (skillType: 'core' | 'soft') => {
    if (!resumeId) {
      toast.error("Resume ID not found. Please refresh the page.");
      return;
    }

    const skillsToDelete = skillType === 'core' 
      ? coreSkillGroups.flatMap(group => group.items || [])
      : softSkillGroups.flatMap(group => group.items || []);

    if (skillsToDelete.length === 0) {
      toast.error(`No ${skillType} skills to delete`);
      return;
    }

    try {
      toast.loading(`Deleting all ${skillType} skills...`, { id: 'delete-all-skills' });
      
      const deletePromises = skillsToDelete.map(skill => {
        const skillId = parseInt(skill.id);
        if (!isNaN(skillId)) {
          console.log(`🗑️ Deleting skill: ${skill.skill} (ID: ${skillId})`);
          return deleteSkill(resumeId, skillId);
        }
        return Promise.resolve();
      });

      await Promise.all(deletePromises);

      // Clear local state
      if (skillType === 'core') {
        setCoreSkillGroups([]);
      } else {
        setSoftSkillGroups([]);
      }

      toast.success(`All ${skillType} skills deleted successfully!`, { id: 'delete-all-skills' });
    } catch (error: any) {
      console.error("❌ Error deleting all skills:", error);
      toast.error("Failed to delete skills. Please try again.", { id: 'delete-all-skills' });
    }
  };

  return {
    coreSkillGroups,
    setCoreSkillGroups,
    softSkillGroups,
    setSoftSkillGroups,
    isSkillDialogOpen,
    setIsSkillDialogOpen,
    openSkillDialog,
    saveSkills,
    deleteAllSkills
  };
}
