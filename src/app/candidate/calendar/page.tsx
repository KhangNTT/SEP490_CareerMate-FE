"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Building2,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  getCandidateUpcomingInterviews,
  getCandidatePastInterviews,
  type InterviewScheduleResponse,
} from "@/lib/interview-api";

export default function CandidateCalendarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [upcomingInterviews, setUpcomingInterviews] = useState<InterviewScheduleResponse[]>([]);
  const [pastInterviews, setPastInterviews] = useState<InterviewScheduleResponse[]>([]);
  const [viewMode, setViewMode] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      
      // Get userId from localStorage like other candidate pages
      const userIdStr = localStorage.getItem("userId");
      if (!userIdStr) {
        toast.error("User ID not found");
        return;
      }

      const [upcoming, past] = await Promise.all([
        getCandidateUpcomingInterviews(),
        getCandidatePastInterviews(),
      ]);

      setUpcomingInterviews(upcoming);
      setPastInterviews(past);
    } catch (error) {
      console.error("Failed to load interviews:", error);
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get interview datetime - handles both scheduledDate and legacy interviewDateTime
  function getInterviewDateTime(interview: InterviewScheduleResponse): string {
    return interview.scheduledDate || interview.interviewDateTime || '';
  }

  function formatDateTime(dateTimeStr: string): string {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatDate(dateTimeStr: string): string {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(dateTimeStr: string): string {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function getTimeUntil(dateTimeStr: string): string {
    const now = new Date();
    const interviewDate = new Date(dateTimeStr);
    const diff = interviewDate.getTime() - now.getTime();

    if (diff < 0) return "Past";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `In ${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `In ${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `In ${minutes} minute${minutes > 1 ? "s" : ""}`;
    return "Now";
  }

  function isWithin24Hours(dateTimeStr: string): boolean {
    const now = new Date();
    const interviewDate = new Date(dateTimeStr);
    const diff = interviewDate.getTime() - now.getTime();
    return diff > 0 && diff <= 24 * 60 * 60 * 1000;
  }

  function getInterviewTypeIcon(type: string) {
    switch (type) {
      case "VIDEO":
        return <Video className="h-4 w-4" />;
      case "PHONE":
        return <Phone className="h-4 w-4" />;
      case "IN_PERSON":
        return <MapPin className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  }

  function getInterviewTypeName(type: string): string {
    const names: Record<string, string> = {
      VIDEO: "Video Interview",
      PHONE: "Phone Interview",
      IN_PERSON: "In-Person Interview",
      TECHNICAL: "Technical Interview",
      HR: "HR Interview",
    };
    return names[type] || type;
  }

  function getStatusBadge(status: string) {
    const statusConfig: Record<string, { label: string; className: string }> = {
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

  const InterviewCard = ({
    interview,
    showActions = true,
  }: {
    interview: InterviewScheduleResponse;
    showActions?: boolean;
  }) => {
    const interviewDateTime = getInterviewDateTime(interview);
    const isUrgent = interviewDateTime ? isWithin24Hours(interviewDateTime) : false;
    const canConfirm = interview.status === "SCHEDULED" && showActions;

    // Calculate end time
    const endDateTime = interviewDateTime ? new Date(new Date(interviewDateTime).getTime() + interview.durationMinutes * 60000) : new Date();

    return (
      <Card className={`hover:shadow-lg transition-all ${isUrgent ? "ring-2 ring-primary" : ""}`}>
        <CardContent className="p-6">
          {isUrgent && (
            <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-sm text-amber-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Interview starting soon: {getTimeUntil(interviewDateTime)}</span>
            </div>
          )}

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">{interview.companyName || "Company"}</h3>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{interview.positionTitle || "Position"}</span>
              </div>
            </div>
            {getStatusBadge(interview.status)}
          </div>

          <div className="space-y-3">
            {/* Date & Time */}
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <div className="font-medium">{interviewDateTime ? formatDate(interviewDateTime) : 'TBD'}</div>
                <div className="text-sm text-muted-foreground">
                  {interviewDateTime ? formatTime(interviewDateTime) : ''} - {formatTime(endDateTime.toISOString())}
                  {showActions && interviewDateTime && (
                    <span className="ml-2 text-primary font-medium">
                      {getTimeUntil(interviewDateTime)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Interview Type */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              {getInterviewTypeIcon(interview.interviewType)}
              <div className="flex-1">
                <div className="font-medium">{getInterviewTypeName(interview.interviewType)}</div>
                <div className="text-sm text-muted-foreground">
                  Duration: {interview.durationMinutes} minutes
                </div>
              </div>
            </div>

            {/* Location / Meeting Link */}
            {interview.interviewType === "IN_PERSON" && interview.location && (
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">{interview.location}</div>
                </div>
              </div>
            )}

            {(interview.interviewType === "VIDEO_CALL" || interview.interviewType === "PHONE") &&
              interview.meetingLink && (
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Video className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium">Meeting Link</div>
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {interview.meetingLink}
                    </a>
                  </div>
                </div>
              )}

            {/* Preparation Notes */}
            {interview.preparationNotes && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-1">Preparation Notes</div>
                <div className="text-sm text-blue-700">{interview.preparationNotes}</div>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="mt-4 flex gap-2">
              {canConfirm && (
                <Button
                  variant="default"
                  onClick={() =>
                    router.push(`/candidate/interviews?action=confirm&id=${interview.jobApplyId}`)
                  }
                  className="flex-1"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm Attendance
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push(`/candidate/interviews?id=${interview.jobApplyId}`)}
                className={canConfirm ? "" : "flex-1"}
              >
                View Details
              </Button>
              {interview.status === "SCHEDULED" && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/candidate/interviews?action=reschedule&id=${interview.jobApplyId}`)
                  }
                >
                  Request Reschedule
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const groupInterviewsByMonth = (interviews: InterviewScheduleResponse[]) => {
    const groups: Record<string, InterviewScheduleResponse[]> = {};

    interviews.forEach((interview) => {
      const dateStr = getInterviewDateTime(interview);
      const date = dateStr ? new Date(dateStr) : new Date();
      const key = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(interview);
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Interview Calendar</h1>
        <p className="text-muted-foreground mt-1">View and manage your scheduled interviews</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Upcoming Interviews</div>
                <div className="text-2xl font-bold">{upcomingInterviews.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-amber-600" />
              <div>
                <div className="text-sm text-muted-foreground">Within 24 Hours</div>
                <div className="text-2xl font-bold">
                  {upcomingInterviews.filter((i) => { const dt = getInterviewDateTime(i); return dt ? isWithin24Hours(dt) : false; }).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-sm text-muted-foreground">Past Interviews</div>
                <div className="text-2xl font-bold">{pastInterviews.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingInterviews.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastInterviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingInterviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Interviews</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  You don't have any interviews scheduled at the moment. Keep applying to jobs to
                  get interview invitations!
                </p>
                <Button className="mt-4" onClick={() => router.push("/candidate/my-jobs")}>
                  View My Applications
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Urgent Interviews (within 24 hours) */}
              {upcomingInterviews.filter((i) => { const dt = getInterviewDateTime(i); return dt ? isWithin24Hours(dt) : false; }).length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Urgent - Starting Soon
                  </h2>
                  <div className="space-y-4">
                    {upcomingInterviews
                      .filter((i) => { const dt = getInterviewDateTime(i); return dt ? isWithin24Hours(dt) : false; })
                      .map((interview) => (
                        <InterviewCard key={interview.id} interview={interview} />
                      ))}
                  </div>
                </div>
              )}

              {/* Other Upcoming Interviews */}
              {upcomingInterviews.filter((i) => { const dt = getInterviewDateTime(i); return dt ? !isWithin24Hours(dt) : true; }).length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Scheduled Interviews</h2>
                  <div className="space-y-4">
                    {upcomingInterviews
                      .filter((i) => { const dt = getInterviewDateTime(i); return dt ? !isWithin24Hours(dt) : true; })
                      .map((interview) => (
                        <InterviewCard key={interview.id} interview={interview} />
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {pastInterviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Past Interviews</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Your completed interviews will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {Object.entries(groupInterviewsByMonth(pastInterviews)).map(([month, interviews]) => (
                <div key={month}>
                  <h2 className="text-xl font-semibold mb-4">{month}</h2>
                  <div className="space-y-4">
                    {interviews.map((interview) => (
                      <InterviewCard key={interview.id} interview={interview} showActions={false} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
