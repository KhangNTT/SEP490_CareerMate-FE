export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  description: string;
  project: string;
  working: boolean;
}

export interface Award {
  id: string;
  name: string;
  organization: string;
  month: string;
  year: string;
  description?: string;
}

export interface Certificate {
  id: string;
  name: string;
  org: string;
  month: string;
  year: string;
  url?: string;
  desc?: string;
}

export interface HighlightProject {
  id: string;
  name: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  description: string;
  url?: string;
  working: boolean;
}

export interface Language {
  id: string;
  language: string;
  level: string;
}

export interface SkillItem {
  id: string;
  skill: string;
  experience?: string;
}

export interface SkillGroup {
  id: string;
  name: string;
  items: SkillItem[];
}
