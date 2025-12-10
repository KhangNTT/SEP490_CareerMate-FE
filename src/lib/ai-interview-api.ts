/**
 * AI Interview Practice API
 * Handles AI-powered interview practice sessions for candidates
 */

import api from './api';

// ==================== Types ====================

/**
 * Request to start a new AI interview practice session
 */
export interface StartInterviewRequest {
  jobDescription: string;
}

/**
 * Request to answer a question
 */
export interface AnswerQuestionRequest {
  answer: string;
}

/**
 * Individual interview question with score and feedback
 */
export interface InterviewQuestionResponse {
  questionId: number;
  questionNumber: number;
  question: string;
  candidateAnswer?: string;
  score?: number;  // 0-10
  feedback?: string;
  askedAt: string;
  answeredAt?: string;
}

/**
 * Interview session response
 */
export interface InterviewSessionResponse {
  sessionId: number;
  candidateId: number;
  jobDescription: string;
  status: 'ONGOING' | 'COMPLETED';
  createdAt: string;
  completedAt?: string;
  finalReport?: string;
  averageScore?: number;
  questions: InterviewQuestionResponse[];
}

/**
 * Next question response
 */
export interface NextQuestionResponse {
  questionId: number;
  questionNumber: number;
  question: string;
  isLastQuestion: boolean;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// ==================== API Functions ====================

/**
 * Start a new AI interview practice session
 * POST /api/interviews/start
 * Generates 10 questions based on job description using AI
 */
export const startAIInterview = async (
  request: StartInterviewRequest
): Promise<InterviewSessionResponse> => {
  try {
    console.log('🤖 [START AI INTERVIEW]', request);
    const response = await api.post<ApiResponse<InterviewSessionResponse>>(
      '/api/interviews/start',
      request
    );
    console.log('✅ [START AI INTERVIEW] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [START AI INTERVIEW] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to start interview session');
  }
};

/**
 * Answer a question in an ongoing interview session
 * POST /api/interviews/sessions/{sessionId}/questions/{questionId}/answer
 * AI scores the answer (0-10) and provides feedback
 */
export const answerQuestion = async (
  sessionId: number,
  questionId: number,
  request: AnswerQuestionRequest
): Promise<NextQuestionResponse> => {
  try {
    console.log(`🤖 [ANSWER QUESTION] Session: ${sessionId}, Question: ${questionId}`, request);
    const response = await api.post<ApiResponse<NextQuestionResponse>>(
      `/api/interviews/sessions/${sessionId}/questions/${questionId}/answer`,
      request
    );
    console.log('✅ [ANSWER QUESTION] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [ANSWER QUESTION] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to submit answer');
  }
};

/**
 * Get the next unanswered question in a session
 * GET /api/interviews/sessions/{sessionId}/next-question
 */
export const getNextQuestion = async (
  sessionId: number
): Promise<NextQuestionResponse> => {
  try {
    console.log(`🤖 [GET NEXT QUESTION] Session: ${sessionId}`);
    const response = await api.get<ApiResponse<NextQuestionResponse>>(
      `/api/interviews/sessions/${sessionId}/next-question`
    );
    console.log('✅ [GET NEXT QUESTION] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [GET NEXT QUESTION] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to get next question');
  }
};

/**
 * Complete the interview session
 * POST /api/interviews/sessions/{sessionId}/complete
 * Generates final report with overall summary, strengths, areas for improvement
 */
export const completeAIInterview = async (
  sessionId: number
): Promise<InterviewSessionResponse> => {
  try {
    console.log(`🤖 [COMPLETE AI INTERVIEW] Session: ${sessionId}`);
    const response = await api.post<ApiResponse<InterviewSessionResponse>>(
      `/api/interviews/sessions/${sessionId}/complete`
    );
    console.log('✅ [COMPLETE AI INTERVIEW] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [COMPLETE AI INTERVIEW] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to complete interview');
  }
};

/**
 * Get a specific interview session
 * GET /api/interviews/sessions/{sessionId}
 */
export const getAIInterviewSession = async (
  sessionId: number
): Promise<InterviewSessionResponse> => {
  try {
    console.log(`🤖 [GET AI INTERVIEW SESSION] Session: ${sessionId}`);
    const response = await api.get<ApiResponse<InterviewSessionResponse>>(
      `/api/interviews/sessions/${sessionId}`
    );
    console.log('✅ [GET AI INTERVIEW SESSION] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [GET AI INTERVIEW SESSION] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to get interview session');
  }
};

/**
 * Get all interview practice sessions for the current candidate
 * GET /api/interviews/sessions
 */
export const getAllAIInterviewSessions = async (): Promise<InterviewSessionResponse[]> => {
  try {
    console.log('🤖 [GET ALL AI INTERVIEW SESSIONS]');
    const response = await api.get<ApiResponse<InterviewSessionResponse[]>>(
      '/api/interviews/sessions'
    );
    console.log('✅ [GET ALL AI INTERVIEW SESSIONS] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [GET ALL AI INTERVIEW SESSIONS] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to get interview sessions');
  }
};

// ==================== Utility Functions ====================

/**
 * Get score color class based on score value
 */
export const getScoreColor = (score: number): string => {
  if (score >= 8) return 'text-green-600 bg-green-100';
  if (score >= 6) return 'text-blue-600 bg-blue-100';
  if (score >= 4) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

/**
 * Get score label based on score value
 */
export const getScoreLabel = (score: number): string => {
  if (score >= 9) return 'Excellent';
  if (score >= 8) return 'Very Good';
  if (score >= 7) return 'Good';
  if (score >= 6) return 'Above Average';
  if (score >= 5) return 'Average';
  if (score >= 4) return 'Below Average';
  if (score >= 3) return 'Needs Improvement';
  return 'Poor';
};

/**
 * Format session duration
 */
export const formatSessionDuration = (createdAt: string, completedAt?: string): string => {
  const start = new Date(createdAt);
  const end = completedAt ? new Date(completedAt) : new Date();
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) {
    return `${diffMins} minutes`;
  }
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}m`;
};
