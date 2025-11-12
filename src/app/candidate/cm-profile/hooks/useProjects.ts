import { useState } from 'react';
import { HighlightProject } from '../components/types';
import { addHighlightProject, updateHighlightProject, deleteHighlightProject, type HighlightProjectData } from '@/lib/resume-api';
import toast from 'react-hot-toast';

export function useProjects(resumeId: number | null) {
  const [projects, setProjects] = useState<HighlightProject[]>([]);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<HighlightProject | null>(null);

  const openProjectDialog = (project?: HighlightProject) => {
    if (project) {
      setEditingProject(project);
    } else {
      setEditingProject({
        id: '0',
        name: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        description: '',
        url: '',
        working: false
      });
    }
    setIsProjectOpen(true);
  };

  const saveProject = async () => {
    if (!editingProject || !editingProject.name || !editingProject.startYear || !editingProject.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!editingProject.startMonth) {
      toast.error("Please select a start month.");
      return;
    }

    if (!editingProject.working && (!editingProject.endMonth || !editingProject.endYear)) {
      toast.error("Please select end month and year, or check 'Currently working'.");
      return;
    }

    if (!resumeId) {
      toast.error("Resume ID not found. Please refresh the page.");
      return;
    }

    try {
      const startDate = `${editingProject.startYear}-${editingProject.startMonth.padStart(2, '0')}-01`;
      let endDate: string;

      if (!editingProject.working && editingProject.endMonth && editingProject.endYear) {
        endDate = `${editingProject.endYear}-${editingProject.endMonth.padStart(2, '0')}-01`;
      } else {
        endDate = startDate;
      }

      const data: HighlightProjectData = {
        resumeId,
        name: editingProject.name,
        startDate,
        endDate,
        description: editingProject.description,
        ...(editingProject.url && { projectUrl: editingProject.url })
      };

      if (editingProject.id && editingProject.id !== '0') {
        await updateHighlightProject(resumeId, Number(editingProject.id), data);
        setProjects(projects.map(proj =>
          proj.id === editingProject.id ? editingProject : proj
        ));
        toast.success("Project updated successfully!");
      } else {
        const result = await addHighlightProject(data);
        const newProject: HighlightProject = {
          id: result.highlightProjectId.toString(),
          name: result.name,
          startMonth: editingProject.startMonth,
          startYear: editingProject.startYear,
          endMonth: editingProject.working ? '' : editingProject.endMonth,
          endYear: editingProject.working ? '' : editingProject.endYear,
          working: editingProject.working,
          description: editingProject.description,
          url: editingProject.url
        };
        setProjects([...projects, newProject]);
        toast.success("Project added successfully!");
      }

      setIsProjectOpen(false);
      setEditingProject(null);
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project. Please try again.");
    }
  };

  const removeProject = async (id: string) => {
    try {
      await deleteHighlightProject(Number(id));
      setProjects(projects.filter(project => project.id !== id));
      toast.success("Project removed successfully!");
    } catch (error) {
      console.error("Error removing project:", error);
      toast.error("Failed to remove project. Please try again.");
    }
  };

  return {
    projects,
    setProjects,
    isProjectOpen,
    setIsProjectOpen,
    editingProject,
    setEditingProject,
    openProjectDialog,
    saveProject,
    removeProject
  };
}
