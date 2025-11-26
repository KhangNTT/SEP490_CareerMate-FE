import { useState } from 'react';
import { Award } from '../components/types';
import { addAward, updateAward, deleteAward, type AwardData } from '@/lib/resume-api';
import toast from 'react-hot-toast';

export function useAwards(resumeId: number | null) {
  const [awards, setAwards] = useState<Award[]>([]);
  const [isAwardsOpen, setIsAwardsOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);

  const openAwardsDialog = (award?: Award) => {
    if (award) {
      setEditingAward(award);
    } else {
      setEditingAward({
        id: '0',
        name: '',
        organization: '',
        month: '',
        year: '',
        description: ''
      });
    }
    setIsAwardsOpen(true);
  };

  const saveAward = async () => {
    if (!resumeId) {
      toast.error("Resume ID not found. Please refresh the page.");
      return;
    }
    
    if (!editingAward || !editingAward.name || !editingAward.organization || !editingAward.month || !editingAward.year) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const awardData: AwardData = {
        resumeId,
        name: editingAward.name,
        organization: editingAward.organization,
        getDate: `${editingAward.year}-${editingAward.month}-25`,
        description: editingAward.description || undefined
      };

      if (editingAward.id && editingAward.id !== '0') {
        await updateAward(resumeId, Number(editingAward.id), awardData);
        setAwards(awards.map(award =>
          award.id === editingAward.id ? editingAward : award
        ));
        toast.success("Award updated successfully!");
      } else {
        const result = await addAward(awardData);
        const newAward: Award = {
          id: result.awardId.toString(),
          name: result.name,
          organization: result.organization,
          month: editingAward.month,
          year: editingAward.year,
          description: editingAward.description
        };
        setAwards([...awards, newAward]);
        toast.success("Award added successfully!");
      }

      setIsAwardsOpen(false);
      setEditingAward(null);
    } catch (error: any) {
      console.error("Error saving award:", error);
      toast.error("Failed to save award. Please try again.");
    }
  };

  const removeAward = async (id: string) => {
    try {
      await deleteAward(Number(id));
      setAwards(awards.filter(award => award.id !== id));
      toast.success("Award removed successfully!");
    } catch (error) {
      console.error("Error removing award:", error);
      toast.error("Failed to remove award. Please try again.");
    }
  };

  return {
    awards,
    setAwards,
    isAwardsOpen,
    setIsAwardsOpen,
    editingAward,
    setEditingAward,
    openAwardsDialog,
    saveAward,
    removeAward
  };
}
