// CV ATS Analysis Types

export interface CVATSAnalyzeRequest {
  job_description: string;
  cv_file: File;
}

export interface CVATSSummary {
  overall_match: number;
  overview_comment: string;
  strengths: string[];
  improvements: string[];
}

export interface CVATSContent {
  score: number;
  measurable_results: string[];
  grammar_issues: string[];
  tips: string[];
  description: string;
}

export interface CVATSSkillsMatched {
  matched: string[];
  missing: string[];
}

export interface CVATSSkills {
  score: number;
  technical: CVATSSkillsMatched;
  soft: {
    missing: string[];
  };
  tips: string[];
  description: string;
}

export interface CVATSFormat {
  score: number;
  checks: {
    date_format: 'PASS' | 'FAIL';
    length: 'PASS' | 'FAIL';
    bullet_points: 'PASS' | 'FAIL';
  };
  tips: string[];
  description: string;
}

export interface CVATSSections {
  score: number;
  missing: string[];
  tips: string[];
  description: string;
}

export interface CVATSStyle {
  score: number;
  tone: string[];
  buzzwords: string[];
  tips: string[];
  description: string;
}

export interface CVATSRecommendations {
  items: string[];
  title: string;
  description: string;
}

export interface CVATSTokenUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  estimated: boolean;
  cache: {
    key: string;
    hit: boolean;
  };
}

export interface CVATSCache {
  hit: boolean;
  key: string;
  stored_at: number;
  age_seconds: number;
}

export interface CVATSRateLimit {
  plan: string;
  user: string;
}

export interface CVATSAnalyzeResponse {
  summary: CVATSSummary;
  content: CVATSContent;
  skills: CVATSSkills;
  format: CVATSFormat;
  sections: CVATSSections;
  style: CVATSStyle;
  recommendations: CVATSRecommendations;
  overall_score: number;
  overall_comment: string;
  token_usage: CVATSTokenUsage;
  cache: CVATSCache;
  rate_limit: CVATSRateLimit;
}
