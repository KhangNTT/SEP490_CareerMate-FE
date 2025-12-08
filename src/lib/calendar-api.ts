/**
 * Calendar Management API
 * Handles working hours, time-off, availability, and calendar views
 */

import api from '@/lib/api';

// ==================== Types & Interfaces ====================

export interface TimeObject {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface RecruiterWorkingHoursRequest {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  isWorkingDay: boolean;
  startTime?: string;  // "HH:mm:ss" format
  endTime?: string;    // "HH:mm:ss" format
  lunchBreakStart?: string;  // "HH:mm:ss" format
  lunchBreakEnd?: string;    // "HH:mm:ss" format
  bufferMinutesBetweenInterviews?: number;
  maxInterviewsPerDay?: number;
}

export interface RecruiterWorkingHoursResponse {
  id: number;
  recruiterId: number;
  dayOfWeek: string;
  isWorkingDay: boolean;
  startTime?: TimeObject;
  endTime?: TimeObject;
  lunchBreakStart?: TimeObject;
  lunchBreakEnd?: TimeObject;
  bufferMinutesBetweenInterviews: number;
  maxInterviewsPerDay: number;
  totalWorkingMinutes: number;
}

export interface RecruiterTimeOffRequest {
  startDate: string; // "YYYY-MM-DD" format
  endDate: string;
  timeOffType: 'VACATION' | 'SICK_LEAVE' | 'PUBLIC_HOLIDAY' | 'PERSONAL_DAY' | 'COMPANY_EVENT' | 'TRAINING';
  reason?: string;
}

export interface RecruiterTimeOffResponse {
  id: number;
  recruiterId: number;
  startDate: string;
  endDate: string;
  timeOffType: string;
  reason?: string;
  isApproved: boolean;
  approvedByAdminId?: number;
  approvedAt?: string;
  createdAt: string;
}

export interface ConflictCheckRequest {
  recruiterId?: number; // Optional - backend can extract from JWT
  candidateId?: number;
  proposedStartTime: string; // ISO 8601 format
  durationMinutes: number;
}

export interface ConflictDetail {
  conflictType: 'INTERVIEW_OVERLAP' | 'TIME_OFF' | 'OUTSIDE_WORKING_HOURS' | 
                'DURING_LUNCH_BREAK' | 'MAX_INTERVIEWS_REACHED' | 'INSUFFICIENT_BUFFER';
  conflictStart?: string;
  conflictEnd?: string;
  conflictingInterviewId?: number;
  description: string;
}

export interface ConflictCheckResponse {
  hasConflict: boolean;
  conflictReason?: string;
  conflicts: ConflictDetail[];
}

export interface AvailableSlot {
  startTime: string;
  endTime: string;
}

export interface DailyCalendarResponse {
  recruiterId: number;
  date: string;
  dayOfWeek: string;
  isWorkingDay: boolean;
  workStartTime?: string | TimeObject;
  workEndTime?: string | TimeObject;
  lunchBreakStart?: string | TimeObject;
  lunchBreakEnd?: string | TimeObject;
  hasTimeOff: boolean;
  timeOffReason?: string;
  totalInterviews: number;
  availableSlots: number;
  interviews: any[];
  availableTimeSlots: string[];
}

export interface WeeklyCalendarResponse {
  recruiterId: number;
  weekStartDate: string;
  weekEndDate: string;
  totalInterviews: number;
  dailyCalendars: Record<string, DailyCalendarResponse>;
  allInterviews: any[];
}

export interface MonthlyCalendarResponse {
  recruiterId: number;
  year: number;
  month: number;
  yearMonth: string;
  totalInterviews: number;
  interviewCountByDate: Record<string, number>;
  workingDays: Record<string, boolean>;
  timeOffDays: Record<string, boolean>;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// ==================== Helper Functions ====================

/**
 * Convert "HH:mm" string to "HH:mm:ss" format for backend
 */
export const stringToTimeObject = (timeStr: string): string => {
  if (!timeStr) return '';
  // If already has seconds, return as-is
  if (timeStr.includes(':') && timeStr.split(':').length === 3) {
    return timeStr;
  }
  // Add :00 seconds if only HH:mm
  return `${timeStr}:00`;
};

/**
 * Convert TimeObject or "HH:mm:ss" string to "HH:mm" format for UI
 */
export const timeObjectToString = (time?: TimeObject | string): string => {
  if (!time) return '';
  
  // If it's already a string, convert to HH:mm
  if (typeof time === 'string') {
    const parts = time.split(':');
    return `${parts[0]}:${parts[1]}`;
  }
  
  // If it's a TimeObject, convert to HH:mm
  const hour = String(time.hour).padStart(2, '0');
  const minute = String(time.minute).padStart(2, '0');
  return `${hour}:${minute}`;
};

// ==================== Working Hours Management ====================

/**
 * Set working hours for a specific day
 * POST /api/calendar/recruiters/working-hours
 * Backend extracts recruiter ID from JWT token automatically
 */
export const setWorkingHours = async (
  request: RecruiterWorkingHoursRequest
): Promise<RecruiterWorkingHoursResponse> => {
  try {
    console.log(`⏰ [SET WORKING HOURS] Request:`, request);
    const response = await api.post<RecruiterWorkingHoursResponse>(
      `/api/calendar/recruiters/working-hours`,
      request
    );
    console.log('✅ [SET WORKING HOURS] Response (direct object):', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [SET WORKING HOURS] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to set working hours');
  }
};

/**
 * Set working hours for multiple days at once
 * POST /api/calendar/recruiters/working-hours/batch
 * NO recruiterId required - Backend gets it from JWT token automatically
 */
export const setWorkingHoursBatch = async (
  requests: RecruiterWorkingHoursRequest[],
  replaceAll: boolean = true
): Promise<RecruiterWorkingHoursResponse[]> => {
  try {
    console.log(`⏰ [SET WORKING HOURS BATCH] Configurations:`, requests);
    
    // Backend gets recruiterId from JWT - NO manual ID needed!
    // Field name is "workingHoursConfigurations" per BATCH_WORKING_HOURS_INTEGRATION.md
    const payload = { 
      workingHoursConfigurations: requests,
      replaceAll: replaceAll
    };
    console.log('📦 [SET WORKING HOURS BATCH] Payload being sent:', JSON.stringify(payload, null, 2));
    
    const response = await api.post<ApiResponse<RecruiterWorkingHoursResponse[]>>(
      `/api/calendar/recruiters/working-hours/batch`,
      payload
    );
    console.log('✅ [SET WORKING HOURS BATCH] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [SET WORKING HOURS BATCH] Error:', error.response?.data || error);
    console.error('❌ [SET WORKING HOURS BATCH] Full error details:', JSON.stringify(error.response?.data, null, 2));
    throw new Error(error.response?.data?.message || 'Failed to set working hours');
  }
};

/**
 * Get working hours configuration
 * GET /api/calendar/recruiters/working-hours
 * Backend extracts recruiter ID from JWT token automatically
 */
export const getWorkingHours = async (): Promise<RecruiterWorkingHoursResponse[]> => {
  try {
    console.log(`⏰ [GET WORKING HOURS] Fetching for authenticated recruiter`);
    const response = await api.get<RecruiterWorkingHoursResponse[]>(
      `/api/calendar/recruiters/working-hours`
    );
    console.log('✅ [GET WORKING HOURS] Response (direct array):', response.data);
    // Response is direct array, not wrapped in {result: []}
    return response.data;
  } catch (error: any) {
    console.error('❌ [GET WORKING HOURS] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch working hours');
  }
};

// ==================== Time-Off Management ====================

// ❌ TIME-OFF FEATURE REMOVED - Recruiters work according to company schedule
// Use working hours configuration instead

// ❌ TIME-OFF FEATURE REMOVED

/**
 * Approve time-off request (admin only)
 * POST /api/calendar/admin/time-off/{timeOffId}/approve
 */
export const approveTimeOff = async (
  timeOffId: number
): Promise<RecruiterTimeOffResponse> => {
  try {
    console.log(`✅ [APPROVE TIME-OFF] Time-off ID: ${timeOffId}`);
    const response = await api.post<ApiResponse<RecruiterTimeOffResponse>>(
      `/api/calendar/admin/time-off/${timeOffId}/approve`
    );
    console.log('✅ [APPROVE TIME-OFF] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [APPROVE TIME-OFF] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to approve time-off');
  }
};

/**
 * Cancel time-off request
 * DELETE /api/calendar/time-off/{timeOffId}
 */
export const cancelTimeOff = async (timeOffId: number): Promise<void> => {
  try {
    console.log(`❌ [CANCEL TIME-OFF] Time-off ID: ${timeOffId}`);
    await api.delete(`/api/calendar/time-off/${timeOffId}`);
    console.log('✅ [CANCEL TIME-OFF] Success');
  } catch (error: any) {
    console.error('❌ [CANCEL TIME-OFF] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to cancel time-off');
  }
};

// ==================== Conflict Detection ====================

/**
 * Check for scheduling conflicts
 * POST /api/calendar/check-conflict
 */
export const checkConflict = async (
  request: ConflictCheckRequest
): Promise<ConflictCheckResponse> => {
  try {
    console.log('🔍 [CHECK CONFLICT]', request);
    const response = await api.post<ApiResponse<ConflictCheckResponse>>(
      '/api/calendar/check-conflict',
      request
    );
    console.log('✅ [CHECK CONFLICT] Response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('❌ [CHECK CONFLICT] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to check conflict');
  }
};

// ==================== Availability ====================

/**
 * Get available time slots for a specific date
 * GET /api/calendar/recruiter/available-slots?date={date}&durationMinutes={minutes}
 * Backend extracts recruiterId from JWT token automatically
 */
export const getAvailableSlots = async (
  date: string, // "YYYY-MM-DD" format
  durationMinutes: number
): Promise<string[]> => {
  try {
    console.log(
      `📅 [GET AVAILABLE SLOTS] Date: ${date}, Duration: ${durationMinutes}min (ID from JWT)`
    );
    const response = await api.get<ApiResponse<{ date: string; availableSlots: string[] }>>(
      `/api/calendar/recruiter/available-slots`,
      { params: { date, durationMinutes } }
    );
    console.log('✅ [GET AVAILABLE SLOTS] Response:', response.data);
    // Handle both wrapped and direct response formats
    const data = response.data.result || response.data;
    return (data as any)?.availableSlots || [];
  } catch (error: any) {
    console.error('❌ [GET AVAILABLE SLOTS] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch available slots');
  }
};

/**
 * Get available dates within a range
 * GET /api/calendar/recruiter/available-dates?startDate={date}&endDate={date}&durationMinutes={minutes}
 * Backend extracts recruiterId from JWT token automatically
 */
export const getAvailableDates = async (
  startDate: string,
  endDate: string,
  durationMinutes: number
): Promise<string[]> => {
  try {
    console.log(
      `📅 [GET AVAILABLE DATES] ${startDate} to ${endDate} (ID from JWT)`
    );
    const response = await api.get<ApiResponse<string[]>>(
      `/api/calendar/recruiter/available-dates`,
      { params: { startDate, endDate, durationMinutes } }
    );
    console.log('✅ [GET AVAILABLE DATES] Response:', response.data);
    // Handle both wrapped and direct response formats
    const data = response.data.result || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('❌ [GET AVAILABLE DATES] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch available dates');
  }
};

// ==================== Calendar Views ====================

/**
 * Get daily calendar view
 * GET /api/calendar/recruiter/daily?date={date}
 * Backend extracts recruiterId from JWT token automatically
 */
export const getDailyCalendar = async (
  date: string
): Promise<DailyCalendarResponse> => {
  try {
    console.log(`📅 [GET DAILY CALENDAR] Date: ${date} (ID from JWT)`);
    const response = await api.get<ApiResponse<DailyCalendarResponse>>(
      `/api/calendar/recruiter/daily`,
      { params: { date } }
    );
    console.log('✅ [GET DAILY CALENDAR] Raw Response:', JSON.stringify(response.data, null, 2));
    
    // Handle both wrapped (result) and direct response formats
    const data = response.data.result || response.data;
    console.log('✅ [GET DAILY CALENDAR] Parsed Data:', {
      date: (data as any).date,
      interviewsCount: (data as any).interviews?.length || 0,
      totalInterviews: (data as any).totalInterviews,
      isWorkingDay: (data as any).isWorkingDay,
    });
    
    return data as DailyCalendarResponse;
  } catch (error: any) {
    console.error('❌ [GET DAILY CALENDAR] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch daily calendar');
  }
};

/**
 * Get weekly calendar view
 * GET /api/calendar/recruiter/weekly?weekStartDate={date}
 * Backend extracts recruiterId from JWT token automatically
 */
export const getWeeklyCalendar = async (
  weekStartDate: string
): Promise<WeeklyCalendarResponse> => {
  try {
    console.log(`📅 [GET WEEKLY CALENDAR] Start: ${weekStartDate} (ID from JWT)`);
    const response = await api.get<ApiResponse<WeeklyCalendarResponse>>(
      `/api/calendar/recruiter/weekly`,
      { params: { weekStartDate } }
    );
    console.log('✅ [GET WEEKLY CALENDAR] Response:', response.data);
    // Handle both wrapped and direct responses
    const data = response.data.result || response.data;
    return data as WeeklyCalendarResponse;
  } catch (error: any) {
    console.error('❌ [GET WEEKLY CALENDAR] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch weekly calendar');
  }
};

/**
 * Get monthly calendar view
 * GET /api/calendar/recruiter/monthly?year={year}&month={month}
 * Backend extracts recruiterId from JWT token automatically
 */
export const getMonthlyCalendar = async (
  year: number,
  month: number
): Promise<MonthlyCalendarResponse> => {
  try {
    console.log(`📅 [GET MONTHLY CALENDAR] ${year}-${month} (ID from JWT)`);
    const response = await api.get<ApiResponse<MonthlyCalendarResponse>>(
      `/api/calendar/recruiter/monthly`,
      { params: { year, month } }
    );
    console.log('✅ [GET MONTHLY CALENDAR] Raw Response:', JSON.stringify(response.data, null, 2));
    
    // Handle both wrapped (result) and direct response formats
    const data = response.data.result || response.data;
    console.log('✅ [GET MONTHLY CALENDAR] Parsed Data:', {
      totalInterviews: (data as any).totalInterviews,
      interviewCountByDate: (data as any).interviewCountByDate,
    });
    
    return data as MonthlyCalendarResponse;
  } catch (error: any) {
    console.error('❌ [GET MONTHLY CALENDAR] Error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch monthly calendar');
  }
};

// ==================== Utility Functions ====================

/**
 * Get time-off type display text
 */
export const getTimeOffTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    VACATION: 'Vacation',
    SICK_LEAVE: 'Sick Leave',
    PUBLIC_HOLIDAY: 'Public Holiday',
    PERSONAL_DAY: 'Personal Day',
    COMPANY_EVENT: 'Company Event',
    TRAINING: 'Training',
  };
  return typeMap[type] || type;
};

/**
 * Format working hours time
 */
export const formatWorkingTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
};

/**
 * Calculate working hours duration
 */
export const calculateWorkingDuration = (
  startTime: string,
  endTime: string,
  lunchBreakStart?: string,
  lunchBreakEnd?: string
): number => {
  try {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    
    if (lunchBreakStart && lunchBreakEnd) {
      const [lunchStartHour, lunchStartMin] = lunchBreakStart.split(':').map(Number);
      const [lunchEndHour, lunchEndMin] = lunchBreakEnd.split(':').map(Number);
      const lunchDuration = (lunchEndHour * 60 + lunchEndMin) - (lunchStartHour * 60 + lunchStartMin);
      totalMinutes -= lunchDuration;
    }
    
    return totalMinutes;
  } catch {
    return 0;
  }
};

/**
 * Check if time falls within working hours
 */
export const isWithinWorkingHours = (
  time: string, // "HH:mm" format
  workStart: string,
  workEnd: string
): boolean => {
  try {
    const [hour, min] = time.split(':').map(Number);
    const [startHour, startMin] = workStart.split(':').map(Number);
    const [endHour, endMin] = workEnd.split(':').map(Number);
    
    const timeMinutes = hour * 60 + min;
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  } catch {
    return false;
  }
};

/**
 * Get default working hours template (9 AM - 5 PM, Mon-Fri)
 */
export const getDefaultWorkingHours = (): RecruiterWorkingHoursRequest[] => {
  const weekdays: Array<RecruiterWorkingHoursRequest['dayOfWeek']> = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'
  ];
  
  return weekdays.map(day => ({
    dayOfWeek: day,
    isWorkingDay: true,
    startTime: '09:00',
    endTime: '17:00',
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
    bufferMinutesBetweenInterviews: 15,
    maxInterviewsPerDay: 8,
  }));
};
