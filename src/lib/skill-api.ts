import api from './api';

export interface Skill {
  id: number;
  name: string;
}

export interface SkillListResponse {
  code: number;
  message: string;
  result: Skill[];
}

export interface SkillCreateResponse {
  code: number;
  message: string;
  result?: Skill;
}

// Get all skills (no pagination - returns full list)
export const getSkillList = async (): Promise<SkillListResponse> => {
  const response = await api.get('/api/jdskill');
  return response.data;
};

// Create a new skill using query parameter
export const createSkill = async (skillName: string): Promise<SkillCreateResponse> => {
  const response = await api.post(`/api/jdskill?name=${encodeURIComponent(skillName)}`);
  return response.data;
};

// Search/filter skills by name (client-side filtering)
export const searchSkills = (skills: Skill[], searchQuery: string): Skill[] => {
  if (!searchQuery.trim()) return skills;
  const query = searchQuery.toLowerCase();
  return skills.filter(skill => skill.name.toLowerCase().includes(query));
};
