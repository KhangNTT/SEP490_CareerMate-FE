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

    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

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
          const data: SkillData = {
            resumeId,
            skillType: skillType,
            skillName: skill.skill,
            ...(skillType === "core" && skill.experience ? { yearOfExperience: parseInt(skill.experience) } : {})
          };
          console.log(`➕ Adding skill: ${skill.skill}`, data);
          return addSkill(data);
        });
        addedSkillsData = await Promise.all(addPromises);
        console.log(`✅ Added ${skillsToAdd.length} skill(s)`, addedSkillsData);
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

      if (skillType === "core") {
        const items = finalSkills.filter(s => s.experience);
        const newGroup: SkillGroup = {
          id: Date.now().toString(),
          name: 'Core Skills',
          items: items as SkillItem[]
        };
        setCoreSkillGroups([newGroup]);
      } else if (skillType === "soft") {
        const items = finalSkills;
        const newGroup: SkillGroup = {
          id: Date.now().toString(),
          name: 'Soft Skills',
          items: items as SkillItem[]
        };
        setSoftSkillGroups([newGroup]);
      }

      const totalOperations = skillsToAdd.length + skillsToDelete.length;
      toast.success(`Successfully updated skills! (${skillsToAdd.length} added, ${skillsToDelete.length} deleted)`);
      setIsSkillDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving skills:", error);
      toast.error(error?.response?.data?.message || "Failed to save skills. Please try again.");
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
    saveSkills
  };
}
