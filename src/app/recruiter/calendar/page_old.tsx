"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Users,
  CheckCircle2,
  XCircle,
  UserX,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuthStore } from "@/store/use-auth-store";
import {
  getDailyCalendar,
  getWeeklyCalendar,
  getMonthlyCalendar,
  type DailyCalendarResponse,
  type WeeklyCalendarResponse,
  type MonthlyCalendarResponse,
} from "@/lib/calendar-api";
import {
  type InterviewScheduleResponse,
} from "@/lib/interview-api";

export default function RecruiterCalendarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");

  // Date navigation
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Calendar data
  const [dailyCalendar, setDailyCalendar] = useState<DailyCalendarResponse | null>(null);
  const [weeklyCalendar, setWeeklyCalendar] = useState<WeeklyCalendarResponse | null>(null);
  const [monthlyCalendar, setMonthlyCalendar] = useState<MonthlyCalendarResponse | null>(null);

  // Load calendar data when view changes (simple like other pages)
  useEffect(() => {
    loadCalendarData();
  }, [currentDate, viewMode]);

  const loadCalendarData = async () => {
    // Get userId from localStorage like other recruiter pages
    const userIdStr = localStorage.getItem("userId");
    if (!userIdStr) {
      toast.error("User ID not found");
      return;
    }

    const recruiterId = parseInt(userIdStr);
    if (isNaN(recruiterId)) {
      toast.error("Invalid user ID");
      return;
    }

    try {
      setLoading(true);
      const dateStr = formatDateForAPI(currentDate);
      console.log("🔵 [CALENDAR] Loading calendar:", { recruiterId, viewMode, dateStr });

      if (viewMode === "day") {
        console.log("🔵 [CALENDAR] Fetching daily calendar...");
        const data = await getDailyCalendar(recruiterId, dateStr);
        console.log("🔵 [CALENDAR] Daily data received:", data);
        setDailyCalendar(data);
      } else if (viewMode === "week") {
        const weekStart = getWeekStartDate(currentDate);
        const weekStartStr = formatDateForAPI(weekStart);
        console.log("🔵 [CALENDAR] Fetching weekly calendar:", { weekStartStr });
        const data = await getWeeklyCalendar(recruiterId, weekStartStr);
        console.log("🔵 [CALENDAR] Weekly data received:", data);
        setWeeklyCalendar(data);
      } else if (viewMode === "month") {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        console.log("🔵 [CALENDAR] Fetching monthly calendar:", { year, month });
        const data = await getMonthlyCalendar(recruiterId, year, month);
        console.log("🔵 [CALENDAR] Monthly data received:", data);
        setMonthlyCalendar(data);
      }
    } catch (error: any) {
      console.error("🔴 [CALENDAR] Failed to load calendar data:", error);
      console.error("🔴 [CALENDAR] Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      toast.error("Failed to load calendar. Backend API may not be available.");
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);

    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }

    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  function formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getWeekStartDate(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function formatTime(time: string): string {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  function formatDateDisplay(): string {
    if (viewMode === "day") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } else if (viewMode === "week") {
      const weekStart = getWeekStartDate(currentDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      return `${weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${weekEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    } else {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
  }

  function getStatusBadge(status: string) {
    const statusConfig: Record<
      string,
      { label: string; className: string }
    > = {
      SCHEDULED: { label: "Scheduled", className: "bg-blue-100 text-blue-800" },
      CONFIRMED: { label: "Confirmed", className: "bg-green-100 text-green-800" },
      COMPLETED: { label: "Completed", className: "bg-gray-100 text-gray-800" },
      CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800" },
      NO_SHOW: { label: "No Show", className: "bg-orange-100 text-orange-800" },
    };

    const config = statusConfig[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  }

  const renderInterviewCard = (interview: any) => {
    const startTime = new Date(interview.interviewDateTime);
    const endTime = new Date(startTime.getTime() + interview.durationMinutes * 60000);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="font-medium">{interview.candidateName || "Candidate"}</div>
              <div className="text-sm text-muted-foreground">{interview.positionTitle || "Position"}</div>
            </div>
            {getStatusBadge(interview.status)}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(startTime.toTimeString().slice(0, 5))} -{" "}
              {formatTime(endTime.toTimeString().slice(0, 5))}
            </div>
            <Badge variant="outline">{interview.interviewType}</Badge>
          </div>

          {interview.notes && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{interview.notes}</p>
          )}

          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/recruiter/interviews?id=${interview.id}`)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading && !dailyCalendar && !weeklyCalendar && !monthlyCalendar) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Interview Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage your interview schedule</p>
        </div>
        <Button onClick={() => router.push("/recruiter/calendar/settings")}>
          <Settings className="h-4 w-4 mr-2" />
          Calendar Settings
        </Button>
      </div>

      {/* Navigation and View Toggle */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
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
              <div className="ml-4 text-lg font-semibold">{formatDateDisplay()}</div>
            </div>

            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Content */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading calendar data...</p>
          </div>
        </div>
      )}

      {!loading && viewMode === "day" && !dailyCalendar && (
        <Card>
          <CardContent className="p-12 text-center">
            <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Calendar Data</h3>
            <p className="text-muted-foreground">
              Unable to load calendar data. Please check if the backend API is running.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && viewMode === "day" && dailyCalendar && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Day Info */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Day Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Working Hours</div>
                  <div className="font-medium">
                    {dailyCalendar.isWorkingDay
                      ? `${formatTime(dailyCalendar.workStartTime || "")} - ${formatTime(
                          dailyCalendar.workEndTime || ""
                        )}`
                      : "Not a working day"}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Interviews</div>
                  <div className="text-2xl font-bold">{dailyCalendar.totalInterviews}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Available Slots</div>
                  <div className="text-2xl font-bold text-green-600">
                    {dailyCalendar.availableSlots}
                  </div>
                </div>

                {dailyCalendar.hasTimeOff && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="font-medium text-amber-900">Time-Off</div>
                    <div className="text-sm text-amber-700">{dailyCalendar.timeOffReason}</div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => router.push("/recruiter/interviews/schedule")}
                >
                  Schedule Interview
                </Button>
              </CardContent>
            </Card>

            {dailyCalendar.availableTimeSlots.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Slots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dailyCalendar.availableTimeSlots.slice(0, 12).map((slot) => (
                      <Badge key={slot} variant="outline" className="text-xs">
                        {formatTime(slot)}
                      </Badge>
                    ))}
                    {dailyCalendar.availableTimeSlots.length > 12 && (
                      <Badge variant="outline" className="text-xs">
                        +{dailyCalendar.availableTimeSlots.length - 12} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Interviews List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Interviews</CardTitle>
                <CardDescription>All interviews for this day</CardDescription>
              </CardHeader>
              <CardContent>
                {dailyCalendar.interviews.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                    <p className="text-muted-foreground">No interviews scheduled for this day</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dailyCalendar.interviews.map((interview) => renderInterviewCard(interview))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!loading && viewMode === "week" && !weeklyCalendar && (
        <Card>
          <CardContent className="p-12 text-center">
            <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Calendar Data</h3>
            <p className="text-muted-foreground">
              Unable to load calendar data. Please check if the backend API is running.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && viewMode === "week" && weeklyCalendar && (
        <div>
          {/* Week Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Total Interviews</div>
                    <div className="text-2xl font-bold">{weeklyCalendar.totalInterviews}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                    <div className="text-2xl font-bold">
                      {
                        weeklyCalendar.allInterviews.filter((i) => i.status === "COMPLETED")
                          .length
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">Scheduled</div>
                    <div className="text-2xl font-bold">
                      {
                        weeklyCalendar.allInterviews.filter(
                          (i) => i.status === "SCHEDULED" || i.status === "CONFIRMED"
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">Cancelled</div>
                    <div className="text-2xl font-bold">
                      {
                        weeklyCalendar.allInterviews.filter(
                          (i) => i.status === "CANCELLED" || i.status === "NO_SHOW"
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Week Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(weeklyCalendar.dailyCalendars).map(([date, dayData]) => (
                  <div key={date} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold">{dayData.dayOfWeek}</div>
                        <div className="text-sm text-muted-foreground">{date}</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          {dayData.totalInterviews} interviews
                        </span>
                        <Badge variant="outline">{dayData.availableSlots} slots</Badge>
                      </div>
                    </div>

                    {dayData.interviews.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {dayData.interviews.map((interview) => (
                          <div
                            key={interview.id}
                            className="p-3 border rounded-lg hover:bg-accent cursor-pointer"
                            onClick={() =>
                              router.push(`/recruiter/interviews?id=${interview.id}`)
                            }
                          >
                            <div className="font-medium text-sm">{interview.candidateName}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(
                                new Date(interview.scheduledTime).toTimeString().slice(0, 5)
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No interviews scheduled</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && viewMode === "month" && !monthlyCalendar && (
        <Card>
          <CardContent className="p-12 text-center">
            <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Calendar Data</h3>
            <p className="text-muted-foreground">
              Unable to load calendar data. Please check if the backend API is running.
            </p>
          </CardContent>
        </Card>
      )}

      {viewMode === "month" && (
        <div>
          {/* Month Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Total Interviews</div>
                    <div className="text-2xl font-bold">{monthlyCalendar?.totalInterviews || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">Working Days</div>
                    <div className="text-2xl font-bold">
                      {monthlyCalendar ? Object.values(monthlyCalendar.workingDays || {}).filter((v) => v).length : 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <UserX className="h-8 w-8 text-amber-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">Time-Off Days</div>
                    <div className="text-2xl font-bold">
                      {monthlyCalendar ? Object.values(monthlyCalendar.timeOffDays || {}).filter((v) => v).length : 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Month Calendar Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>Interview count per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    // Generate calendar grid with proper day positions
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth();
                    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const daysInPrevMonth = new Date(year, month, 0).getDate();
                    
                    const cells = [];
                    
                    // Previous month days
                    for (let i = firstDay - 1; i >= 0; i--) {
                      const day = daysInPrevMonth - i;
                      cells.push(
                        <div key={`prev-${day}`} className="aspect-square border rounded-lg bg-muted/20 flex items-center justify-center">
                          <span className="text-sm text-muted-foreground/50">{day}</span>
                        </div>
                      );
                    }
                    
                    // Current month days
                    for (let day = 1; day <= daysInMonth; day++) {
                      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const count = monthlyCalendar?.interviewCountByDate?.[dateStr] || 0;
                      const isWorkingDay = monthlyCalendar?.workingDays?.[dateStr];
                      const isTimeOff = monthlyCalendar?.timeOffDays?.[dateStr];
                      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                      
                      let bgColor = "bg-background hover:bg-accent";
                      let textColor = "text-foreground";
                      
                      if (isToday) {
                        bgColor = "bg-primary/10 hover:bg-primary/20 ring-2 ring-primary";
                      } else if (count > 0) {
                        if (count <= 2) bgColor = "bg-green-100 hover:bg-green-200";
                        else if (count <= 4) bgColor = "bg-green-300 hover:bg-green-400";
                        else if (count <= 6) bgColor = "bg-amber-300 hover:bg-amber-400";
                        else bgColor = "bg-red-300 hover:bg-red-400";
                      } else if (isTimeOff) {
                        bgColor = "bg-amber-50 hover:bg-amber-100";
                        textColor = "text-muted-foreground";
                      } else if (!isWorkingDay) {
                        bgColor = "bg-muted/30 hover:bg-muted/50";
                        textColor = "text-muted-foreground";
                      }
                      
                      cells.push(
                        <div
                          key={dateStr}
                          className={`aspect-square border rounded-lg ${bgColor} flex flex-col items-center justify-center cursor-pointer transition-colors`}
                          title={`${dateStr}: ${count} interviews`}
                          onClick={() => {
                            setCurrentDate(new Date(year, month, day));
                            setViewMode("day");
                          }}
                        >
                          <span className={`text-sm font-medium ${textColor}`}>{day}</span>
                          {count > 0 && (
                            <span className="text-xs text-muted-foreground mt-0.5">{count}</span>
                          )}
                        </div>
                      );
                    }
                    
                    // Next month days to fill the grid
                    const remainingCells = 42 - cells.length; // 6 rows × 7 days
                    for (let day = 1; day <= remainingCells; day++) {
                      cells.push(
                        <div key={`next-${day}`} className="aspect-square border rounded-lg bg-muted/20 flex items-center justify-center">
                          <span className="text-sm text-muted-foreground/50">{day}</span>
                        </div>
                      );
                    }
                    
                    return cells;
                  })()}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-background border rounded"></div>
                  <span className="text-muted-foreground">No Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border rounded"></div>
                  <span className="text-muted-foreground">1-2</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-300 border rounded"></div>
                  <span className="text-muted-foreground">3-4</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-300 border rounded"></div>
                  <span className="text-muted-foreground">5-6</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-300 border rounded"></div>
                  <span className="text-muted-foreground">7+</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
