"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";;
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Settings,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  getDailyCalendar,
  getWeeklyCalendar,
  getMonthlyCalendar,
  getWorkingHours,
  type DailyCalendarResponse,
  type WeeklyCalendarResponse,
  type MonthlyCalendarResponse,
  type RecruiterWorkingHoursResponse,
} from "@/lib/calendar-api";
import {
  type InterviewScheduleResponse,
} from "@/lib/interview-api";

// ==================== Helper Functions for Gray-Out ====================

interface TimeSlotConfig {
  dayOfWeek: string;
  isWorkingDay: boolean;
  workStart: number;      // Minutes since midnight
  workEnd: number;        // Minutes since midnight
  lunchStart: number | null;
  lunchEnd: number | null;
}

enum TimeSlotStatus {
  AVAILABLE = 'available',
  LUNCH_BREAK = 'lunch',
  NON_WORKING = 'non-working',
  NON_WORKING_DAY = 'off-day'
}

/**
 * Converts "HH:MM:SS" string to minutes since midnight
 */
function timeStringToMinutes(timeString: string | undefined): number {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Converts TimeObject to minutes since midnight
 */
function timeObjectToMinutes(timeObj: any): number {
  if (!timeObj) return 0;
  if (typeof timeObj === 'string') return timeStringToMinutes(timeObj);
  return (timeObj.hour || 0) * 60 + (timeObj.minute || 0);
}

/**
 * Gets day name from Date object
 */
function getDayOfWeek(date: Date): string {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[date.getDay()];
}

/**
 * Builds working hours map for quick lookups
 */
function buildWorkingHoursMap(
  workingHours: RecruiterWorkingHoursResponse[]
): Map<string, TimeSlotConfig> {
  const map = new Map<string, TimeSlotConfig>();
  
  workingHours.forEach(wh => {
    map.set(wh.dayOfWeek, {
      dayOfWeek: wh.dayOfWeek,
      isWorkingDay: wh.isWorkingDay,
      workStart: timeObjectToMinutes(wh.startTime),
      workEnd: timeObjectToMinutes(wh.endTime),
      lunchStart: wh.lunchBreakStart ? timeObjectToMinutes(wh.lunchBreakStart) : null,
      lunchEnd: wh.lunchBreakEnd ? timeObjectToMinutes(wh.lunchBreakEnd) : null,
    });
  });
  
  return map;
}

/**
 * Determines the status of a specific time slot
 */
function getTimeSlotStatus(
  date: Date,
  hour: number,
  workingHoursMap: Map<string, TimeSlotConfig>
): TimeSlotStatus {
  const dayOfWeek = getDayOfWeek(date);
  const config = workingHoursMap.get(dayOfWeek);
  const timeInMinutes = hour * 60;
  
  // No configuration or non-working day
  if (!config || !config.isWorkingDay) {
    return TimeSlotStatus.NON_WORKING_DAY;
  }
  
  // Before work hours
  if (timeInMinutes < config.workStart) {
    return TimeSlotStatus.NON_WORKING;
  }
  
  // After work hours
  if (timeInMinutes >= config.workEnd) {
    return TimeSlotStatus.NON_WORKING;
  }
  
  // During lunch break
  if (config.lunchStart !== null && config.lunchEnd !== null) {
    if (timeInMinutes >= config.lunchStart && timeInMinutes < config.lunchEnd) {
      return TimeSlotStatus.LUNCH_BREAK;
    }
  }
  
  // Available
  return TimeSlotStatus.AVAILABLE;
}

/**
 * Gets CSS classes for time slot status
 */
function getTimeSlotClasses(status: TimeSlotStatus, isPast: boolean): string {
  const baseClasses = 'border-r border-b border-gray-200 p-2 transition-colors min-h-[60px]';
  
  if (isPast) {
    return `${baseClasses} bg-gray-100 cursor-not-allowed opacity-60`;
  }
  
  switch (status) {
    case TimeSlotStatus.AVAILABLE:
      return `${baseClasses} hover:bg-blue-50 cursor-pointer`;
    case TimeSlotStatus.LUNCH_BREAK:
      return `${baseClasses} bg-orange-50 cursor-not-allowed opacity-70`;
    case TimeSlotStatus.NON_WORKING:
    case TimeSlotStatus.NON_WORKING_DAY:
      return `${baseClasses} bg-gray-100 cursor-not-allowed opacity-50`;
    default:
      return baseClasses;
  }
}

export default function RecruiterCalendarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [dailyCalendar, setDailyCalendar] = useState<DailyCalendarResponse | null>(null);
  const [weeklyCalendar, setWeeklyCalendar] = useState<WeeklyCalendarResponse | null>(null);
  const [monthlyCalendar, setMonthlyCalendar] = useState<MonthlyCalendarResponse | null>(null);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate, viewMode]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const dateStr = formatDateForAPI(currentDate);

      if (viewMode === "day") {
        // Direct daily API call
        console.log(`📅 [DAY VIEW] Loading daily calendar for: ${dateStr}`);
        const data = await getDailyCalendar(dateStr);
        console.log(`📅 [DAY VIEW] Received data:`, data);
        setDailyCalendar(data);
      } else if (viewMode === "week") {
        // Weekly calendar needs week start date (Monday)
        const weekStart = getWeekStart(currentDate);
        const weekStartStr = formatDateForAPI(weekStart);
        const data = await getWeeklyCalendar(weekStartStr);
        setWeeklyCalendar(data);
      } else {
        // Monthly calendar needs year and month separately
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // 1-indexed
        console.log(`📅 [MONTH VIEW] Loading monthly calendar for: ${year}-${month}`);
        const data = await getMonthlyCalendar(year, month);
        console.log(`📅 [MONTH VIEW] Received data:`, data);
        setMonthlyCalendar(data);
      }
    } catch (error) {
      console.error("Failed to load calendar:", error);
      // Don't show error toast - just show empty state
    } finally {
      setLoading(false);
    }
  };

  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const navigateDate = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === "day") {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
      } else if (viewMode === "week") {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      } else {
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateDisplay = (): string => {
    if (viewMode === "month") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
    if (viewMode === "week") {
      const start = getWeekStart(currentDate);
      const end = getWeekEnd(currentDate);
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    // Start from Monday (day 1), not Sunday (day 0)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getWeekEnd = (date: Date): Date => {
    const start = getWeekStart(date);
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Interview Calendar</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your interview schedule</p>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-base font-semibold ml-3">{formatDateDisplay()}</span>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" variant="outline" onClick={() => router.push("/recruiter/calendar/settings")}>
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Calendar Views */}
      {viewMode === "month" && <MonthView currentDate={currentDate} monthlyCalendar={monthlyCalendar} setCurrentDate={setCurrentDate} setViewMode={setViewMode} />}
      {viewMode === "week" && <WeekView currentDate={currentDate} weeklyCalendar={weeklyCalendar} />}
      {viewMode === "day" && <DayView currentDate={currentDate} dailyCalendar={dailyCalendar} />}
    </div>
  );
}

// Month View Component
function MonthView({ currentDate, monthlyCalendar, setCurrentDate, setViewMode }: any) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells = [];

  // Previous month padding
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="bg-gray-50 border border-gray-200"></div>);
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    cellDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    const isPast = cellDate < today;
    const isToday = cellDate.toDateString() === today.toDateString();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const interviews = monthlyCalendar?.interviewCountByDate?.[dateStr] || 0;

    cells.push(
      <div
        key={day}
        className={`border border-gray-200 p-2 min-h-[100px] cursor-pointer hover:bg-blue-50 transition-colors ${
          isPast ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white"
        } ${isToday ? "ring-2 ring-inset ring-blue-500 z-10 relative" : ""}`}
        onClick={() => {
          if (!isPast) {
            // Create date string directly to avoid timezone issues
            const targetDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            console.log(`📅 [MONTH CLICK] Day ${day} clicked, target date: ${targetDateStr}`);
            // Parse as local date
            const targetDate = new Date(year, month, day, 12, 0, 0);
            console.log(`📅 [MONTH CLICK] Created date object: ${targetDate.toISOString()}, local: ${targetDate.toLocaleDateString()}`);
            setCurrentDate(targetDate);
            setViewMode("day");
          }
        }}
      >
        <div className="text-right text-sm font-semibold mb-1">{day}</div>
        {interviews > 0 && !isPast && (
          <div className="space-y-1">
            {[...Array(Math.min(interviews, 2))].map((_, i) => (
              <div key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded truncate">
                Interview
              </div>
            ))}
            {interviews > 2 && (
              <div className="text-xs text-gray-500 px-2">+{interviews - 2} more</div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Day headers */}
      <div className="grid grid-cols-7 bg-gray-50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells}
      </div>
    </div>
  );
}

// Week View Component (like image 2)
function WeekView({ currentDate, weeklyCalendar }: any) {
  const [workingHoursMap, setWorkingHoursMap] = useState<Map<string, TimeSlotConfig>>(new Map());
  const [workingHoursLoaded, setWorkingHoursLoaded] = useState(false);

  useEffect(() => {
    // Only load once
    if (!workingHoursLoaded) {
      const loadWorkingHours = async () => {
        try {
          const hours = await getWorkingHours();
          const map = buildWorkingHoursMap(hours);
          setWorkingHoursMap(map);
          setWorkingHoursLoaded(true);
        } catch (error) {
          console.error('Failed to load working hours:', error);
        }
      };
      loadWorkingHours();
    }
  }, [workingHoursLoaded]);

  const getWeekDays = () => {
    // Start from Monday to match backend API
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
    start.setDate(diff);
    start.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  // Helper to get interviews for a specific day and hour
  const getInterviewsForSlot = (date: Date, hour: number) => {
    // Check both allInterviews and dailyCalendars for interview data
    let interviews: any[] = [];
    
    // Format date string
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Try allInterviews first
    if (weeklyCalendar?.allInterviews && weeklyCalendar.allInterviews.length > 0) {
      interviews = weeklyCalendar.allInterviews.filter((interview: any) => {
        const dateTimeStr = interview.scheduledDate || interview.interviewDateTime || interview.startTime;
        if (!dateTimeStr) return false;
        const interviewDate = new Date(dateTimeStr);
        if (isNaN(interviewDate.getTime())) return false;
        const interviewDateStr = `${interviewDate.getFullYear()}-${String(interviewDate.getMonth() + 1).padStart(2, '0')}-${String(interviewDate.getDate()).padStart(2, '0')}`;
        const interviewHour = interviewDate.getHours();
        return interviewDateStr === dateStr && interviewHour === hour;
      });
    }
    
    // Also check dailyCalendars if no interviews found in allInterviews
    if (interviews.length === 0 && weeklyCalendar?.dailyCalendars?.[dateStr]?.interviews) {
      const dayData = weeklyCalendar.dailyCalendars[dateStr];
      interviews = dayData.interviews.filter((interview: any) => {
        const dateTimeStr = interview.scheduledDate || interview.interviewDateTime;
        if (!dateTimeStr) return false;
        const interviewDate = new Date(dateTimeStr);
        if (isNaN(interviewDate.getTime())) return false;
        return interviewDate.getHours() === hour;
      });
    }
    
    return interviews;
  };
  
  // Debug: Log when weekly calendar changes
  useEffect(() => {
    if (weeklyCalendar) {
      console.log('🔍 [WEEK VIEW] Calendar data received:', {
        allInterviewsCount: weeklyCalendar.allInterviews?.length || 0,
        dailyCalendarsKeys: Object.keys(weeklyCalendar.dailyCalendars || {}),
        weekStart: weeklyCalendar.weekStartDate,
        weekEnd: weeklyCalendar.weekEndDate,
      });
      
      // Check each day in dailyCalendars for interviews
      if (weeklyCalendar.dailyCalendars) {
        Object.entries(weeklyCalendar.dailyCalendars).forEach(([dateKey, dayData]: [string, any]) => {
          if (dayData.interviews?.length > 0) {
            console.log(`🔍 [WEEK VIEW] Day ${dateKey} has ${dayData.interviews.length} interviews:`, dayData.interviews);
          }
        });
      }
      
      if (weeklyCalendar.allInterviews?.length > 0) {
        console.log('🔍 [WEEK VIEW] All interviews:', weeklyCalendar.allInterviews);
      }
    }
  }, [weeklyCalendar]);

  const weekDays = getWeekDays();
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7am to 8pm
  const now = new Date();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-auto">
      <div className="grid grid-cols-[80px_repeat(7,1fr)] min-w-[900px]">
        {/* Top left corner + day headers */}
        <div className="bg-gray-50 border-b border-r border-gray-200"></div>
        {weekDays.map((date, i) => {
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <div
              key={i}
              className={`border-b border-r border-gray-200 p-3 text-center ${isPast ? "bg-gray-50" : "bg-gray-50"} ${isToday ? "bg-blue-50" : ""}`}
            >
              <div className="text-xs text-gray-600 uppercase">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
              <div className="text-lg font-semibold mt-1">{date.getDate()}</div>
            </div>
          );
        })}

        {/* Time slots */}
        {hours.map((hour) => (
          <React.Fragment key={`hour-${hour}`}>
            <div className="border-r border-b border-gray-200 p-2 text-xs text-gray-500 text-right bg-gray-50">
              {hour === 12 ? "12pm" : hour > 12 ? `${hour - 12}pm` : `${hour}am`}
            </div>
            {weekDays.map((date, i) => {
              const isPast = date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                            (date.toDateString() === now.toDateString() && hour < now.getHours());
              const status = getTimeSlotStatus(date, hour, workingHoursMap);
              const classes = getTimeSlotClasses(status, isPast);
              const slotInterviews = getInterviewsForSlot(date, hour);
              
              return (
                <div
                  key={`${hour}-${i}`}
                  className={classes}
                  title={
                    status === TimeSlotStatus.NON_WORKING_DAY ? 'Day off' :
                    status === TimeSlotStatus.NON_WORKING ? 'Outside working hours' :
                    status === TimeSlotStatus.LUNCH_BREAK ? 'Lunch break' :
                    'Available'
                  }
                >
                  {status === TimeSlotStatus.LUNCH_BREAK && (
                    <span className="text-xs text-orange-600">🍽️</span>
                  )}
                  {/* Display scheduled interviews */}
                  {slotInterviews.map((interview: any, idx: number) => (
                    <div
                      key={interview.id || idx}
                      className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 text-xs p-1 rounded mb-1 truncate cursor-pointer hover:bg-blue-200"
                      title={`${interview.candidateName || 'Interview'} - ${interview.positionTitle || ''}`}
                    >
                      <div className="font-medium truncate">{interview.candidateName || 'Interview'}</div>
                      <div className="text-blue-600 text-[10px]">
                        {new Date(interview.scheduledDate || interview.interviewDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        {interview.durationMinutes && ` (${interview.durationMinutes}m)`}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Day View Component (like image 3)
function DayView({ currentDate, dailyCalendar }: any) {
  const [workingHoursMap, setWorkingHoursMap] = useState<Map<string, TimeSlotConfig>>(new Map());
  const [workingHoursLoaded, setWorkingHoursLoaded] = useState(false);

  useEffect(() => {
    // Only load once
    if (!workingHoursLoaded) {
      const loadWorkingHours = async () => {
        try {
          const hours = await getWorkingHours();
          const map = buildWorkingHoursMap(hours);
          setWorkingHoursMap(map);
          setWorkingHoursLoaded(true);
        } catch (error) {
          console.error('Failed to load working hours:', error);
        }
      };
      loadWorkingHours();
    }
  }, [workingHoursLoaded]);
  
  // Debug: Log daily calendar data
  useEffect(() => {
    console.log('🔍 [DAY VIEW] Daily calendar received:', {
      date: dailyCalendar?.date,
      currentDateLocal: currentDate?.toLocaleDateString(),
      interviewsCount: dailyCalendar?.interviews?.length || 0,
      totalInterviews: dailyCalendar?.totalInterviews || 0,
      isWorkingDay: dailyCalendar?.isWorkingDay,
    });
    
    if (dailyCalendar?.interviews?.length > 0) {
      console.log('🔍 [DAY VIEW] Interview data:', dailyCalendar.interviews);
    }
  }, [dailyCalendar, currentDate]);

  // Helper to get interviews for a specific hour
  const getInterviewsForHour = (hour: number) => {
    if (!dailyCalendar?.interviews || dailyCalendar.interviews.length === 0) return [];
    
    return dailyCalendar.interviews.filter((interview: any) => {
      const dateTimeStr = interview.scheduledDate || interview.interviewDateTime;
      if (!dateTimeStr) return false;
      const interviewDate = new Date(dateTimeStr);
      if (isNaN(interviewDate.getTime())) return false;
      const interviewHour = interviewDate.getHours();
      return interviewHour === hour;
    });
  };

  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7am to 8pm
  const now = new Date();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-auto">
      <div className="min-w-[600px]">
        {/* Day header */}
        <div className="border-b p-3 bg-gray-50">
          <div className="text-center">
            <div className="text-sm text-gray-600">{currentDate.toLocaleDateString("en-US", { weekday: "long" })}</div>
            <div className="text-xl font-semibold mt-1">{currentDate.getDate()}</div>
          </div>
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-[80px_1fr]">
          {hours.map((hour) => {
            const isPast = currentDate < new Date(new Date().setHours(0, 0, 0, 0)) || 
                          (currentDate.toDateString() === now.toDateString() && hour < now.getHours());
            const status = getTimeSlotStatus(currentDate, hour, workingHoursMap);
            const classes = getTimeSlotClasses(status, isPast).replace('min-h-[60px]', 'min-h-[70px]');
            const hourInterviews = getInterviewsForHour(hour);
            
            return (
              <React.Fragment key={`hour-${hour}`}>
                <div className="border-r border-b border-gray-200 p-2 text-sm text-gray-500 text-right bg-gray-50">
                  {hour === 12 ? "12:00 pm" : hour > 12 ? `${hour - 12}:00 pm` : `${hour}:00 am`}
                </div>
                <div 
                  className={classes}
                  title={
                    status === TimeSlotStatus.NON_WORKING_DAY ? 'Day off' :
                    status === TimeSlotStatus.NON_WORKING ? 'Outside working hours' :
                    status === TimeSlotStatus.LUNCH_BREAK ? 'Lunch break' :
                    'Available for scheduling'
                  }
                >
                  {status === TimeSlotStatus.LUNCH_BREAK && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <span className="text-sm">🍽️</span>
                      <span className="text-xs">Lunch Break</span>
                    </div>
                  )}
                  {status === TimeSlotStatus.NON_WORKING_DAY && (
                    <div className="text-xs text-gray-400">Day off</div>
                  )}
                  {/* Display scheduled interviews */}
                  {hourInterviews.map((interview: any, idx: number) => (
                    <div
                      key={interview.id || idx}
                      className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-2 rounded mb-1 cursor-pointer hover:bg-blue-200"
                      title={`${interview.candidateName || 'Interview'} - ${interview.positionTitle || ''}`}
                    >
                      <div className="font-medium">{interview.candidateName || 'Interview'}</div>
                      <div className="text-sm text-blue-600 mt-1">
                        {new Date(interview.scheduledDate || interview.interviewDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        {interview.durationMinutes && ` - ${interview.durationMinutes} min`}
                      </div>
                      {interview.positionTitle && (
                        <div className="text-xs text-blue-500 mt-1">{interview.positionTitle}</div>
                      )}
                      {interview.interviewType && (
                        <div className="text-xs bg-blue-200 px-2 py-0.5 rounded inline-block mt-1">
                          {interview.interviewType}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
