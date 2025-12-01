"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MessageSquare,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  getRecruiterUpcomingInterviews,
  completeInterview,
  respondToRescheduleRequest,
  cancelInterview,
  getInterviewTypeText,
  formatInterviewDateTime,
  getInterviewDateTimeStr,
  isToday,
  type InterviewScheduleResponse,
  type RescheduleRequestResponse
} from "@/lib/interview-api";

export default function RecruiterInterviewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [upcomingInterviews, setUpcomingInterviews] = useState<InterviewScheduleResponse[]>([]);
  const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequestResponse[]>([]);
  
  // Dialog states
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<InterviewScheduleResponse | null>(null);
  const [selectedRescheduleRequest, setSelectedRescheduleRequest] = useState<RescheduleRequestResponse | null>(null);
  
  // Form states
  const [completeForm, setCompleteForm] = useState({
    result: "PASS" as "PASS" | "FAIL" | "PENDING" | "NEEDS_SECOND_ROUND",
    feedback: ""
  });
  const [rescheduleResponse, setRescheduleResponse] = useState({
    approved: true,
    message: ""
  });
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);

      console.log(`📅 [INTERVIEWS PAGE] Loading interviews (ID from JWT)`);
      const data = await getRecruiterUpcomingInterviews();
      console.log(`✅ [INTERVIEWS PAGE] Received ${data.length} interviews:`, data);
      
      // Separate interviews and reschedule requests
      const interviews = data.filter(item => item.status !== "RESCHEDULED");
      const requests = data
        .filter(item => item.rescheduleRequests && item.rescheduleRequests.length > 0)
        .flatMap(item => item.rescheduleRequests!);
      
      console.log(`✅ [INTERVIEWS PAGE] Filtered: ${interviews.length} interviews, ${requests.length} reschedule requests`);
      
      setUpcomingInterviews(interviews);
      setRescheduleRequests(requests);
      
      if (interviews.length === 0 && data.length === 0) {
        console.log("⚠️ [INTERVIEWS PAGE] No interviews returned from API");
      }
    } catch (error: any) {
      console.error("Failed to load interviews:", error);
      toast.error(error.response?.data?.message || "Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteInterview = async () => {
    if (!selectedInterview) return;
    
    if (!completeForm.feedback.trim()) {
      toast.error("Please provide feedback");
      return;
    }

    try {
      await completeInterview(
        selectedInterview.id,
        completeForm.result,
        completeForm.feedback
      );
      
      toast.success("Interview completed successfully");
      setCompleteDialogOpen(false);
      setCompleteForm({ result: "PASS", feedback: "" });
      loadInterviews();
    } catch (error: any) {
      console.error("Failed to complete interview:", error);
      toast.error(error.response?.data?.message || "Failed to complete interview");
    }
  };

  const handleRespondToReschedule = async (approved: boolean) => {
    if (!selectedRescheduleRequest) return;

    try {
      await respondToRescheduleRequest(
        selectedRescheduleRequest.id,
        approved,
        rescheduleResponse.message || undefined
      );
      
      toast.success(approved ? "Reschedule approved" : "Reschedule rejected");
      setRescheduleDialogOpen(false);
      setRescheduleResponse({ approved: true, message: "" });
      loadInterviews();
    } catch (error: any) {
      console.error("Failed to respond to reschedule:", error);
      toast.error(error.response?.data?.message || "Failed to respond");
    }
  };

  const handleCancelInterview = async () => {
    if (!selectedInterview) return;

    try {
      await cancelInterview(selectedInterview.id);
      toast.success("Interview cancelled");
      setCancelDialogOpen(false);
      setCancelReason("");
      loadInterviews();
    } catch (error: any) {
      console.error("Failed to cancel interview:", error);
      toast.error(error.response?.data?.message || "Failed to cancel interview");
    }
  };

  const getInterviewStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      SCHEDULED: { variant: "outline", label: "Scheduled" },
      CONFIRMED: { variant: "default", label: "Confirmed" },
      COMPLETED: { variant: "secondary", label: "Completed" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
      NO_SHOW: { variant: "destructive", label: "No Show" }
    };
    
    const { variant, label } = config[status] || { variant: "outline" as const, label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case "PHONE": return <Phone className="h-4 w-4" />;
      case "VIDEO": return <Video className="h-4 w-4" />;
      case "IN_PERSON": return <MapPin className="h-4 w-4" />;
      case "PANEL": return <Users className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Interview Management</h1>
        <p className="text-muted-foreground">
          Manage your upcoming interviews and reschedule requests
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming Interviews ({upcomingInterviews.length})
          </TabsTrigger>
          <TabsTrigger value="reschedule">
            Reschedule Requests ({rescheduleRequests.filter(r => r.status === "PENDING").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingInterviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Interviews</h3>
                <p className="text-muted-foreground">
                  You don't have any scheduled interviews at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            upcomingInterviews.map((interview) => (
              <Card key={interview.id} className={isToday(interview) ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getInterviewTypeIcon(interview.interviewType)}
                        <CardTitle className="text-xl">
                          {getInterviewTypeText(interview.interviewType)}
                        </CardTitle>
                        {isToday(interview) && (
                          <Badge variant="destructive">Today</Badge>
                        )}
                      </div>
                      <CardDescription>
                        Candidate: {interview.candidateName}
                      </CardDescription>
                    </div>
                    {getInterviewStatusBadge(interview.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatInterviewDateTime(getInterviewDateTimeStr(interview))}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{interview.durationMinutes} minutes</span>
                    </div>
                    {interview.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{interview.location}</span>
                      </div>
                    )}
                    {interview.meetingLink && (
                      <div className="flex items-center gap-2 text-sm">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={interview.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>

                  {interview.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4 inline mr-1" />
                        {interview.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedInterview(interview);
                        setCompleteDialogOpen(true);
                      }}
                      disabled={interview.status === "COMPLETED"}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/recruiter/interviews/schedule?action=reschedule&interviewId=${interview.id}`)}
                      disabled={interview.status === "COMPLETED"}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reschedule
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedInterview(interview);
                        setCancelDialogOpen(true);
                      }}
                      disabled={interview.status === "COMPLETED"}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="reschedule" className="space-y-4">
          {rescheduleRequests.filter(r => r.status === "PENDING").length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <RotateCcw className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Reschedule Requests</h3>
                <p className="text-muted-foreground">
                  You don't have any pending reschedule requests.
                </p>
              </CardContent>
            </Card>
          ) : (
            rescheduleRequests
              .filter(r => r.status === "PENDING")
              .map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">Reschedule Request</CardTitle>
                        <CardDescription>
                          Requested by: {request.requestedBy}
                        </CardDescription>
                      </div>
                      <Badge>{request.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>New Time: {formatInterviewDateTime(request.proposedDateTime)}</span>
                      </div>
                      {request.reason && (
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium mb-1">Reason:</p>
                          <p className="text-sm text-muted-foreground">{request.reason}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedRescheduleRequest(request);
                          setRescheduleResponse({ approved: true, message: "" });
                          setRescheduleDialogOpen(true);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedRescheduleRequest(request);
                          setRescheduleResponse({ approved: false, message: "" });
                          setRescheduleDialogOpen(true);
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>

      {/* Complete Interview Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Interview</DialogTitle>
            <DialogDescription>
              Provide feedback and result for this interview
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Interview Result</Label>
              <RadioGroup
                value={completeForm.result}
                onValueChange={(value: any) =>
                  setCompleteForm({ ...completeForm, result: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PASS" id="pass" />
                  <Label htmlFor="pass" className="cursor-pointer">
                    <CheckCircle className="h-4 w-4 inline mr-1 text-green-600" />
                    Pass
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FAIL" id="fail" />
                  <Label htmlFor="fail" className="cursor-pointer">
                    <XCircle className="h-4 w-4 inline mr-1 text-red-600" />
                    Fail
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PENDING" id="pending" />
                  <Label htmlFor="pending" className="cursor-pointer">
                    <AlertTriangle className="h-4 w-4 inline mr-1 text-yellow-600" />
                    Pending Decision
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NEEDS_SECOND_ROUND" id="needs-second-round" />
                  <Label htmlFor="needs-second-round" className="cursor-pointer">
                    <RotateCcw className="h-4 w-4 inline mr-1 text-blue-600" />
                    Needs Second Round
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback *</Label>
              <Textarea
                id="feedback"
                placeholder="Provide detailed feedback about the candidate's performance..."
                value={completeForm.feedback}
                onChange={(e) =>
                  setCompleteForm({ ...completeForm, feedback: e.target.value })
                }
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCompleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCompleteInterview}>
              Complete Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Response Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {rescheduleResponse.approved ? "Approve" : "Reject"} Reschedule Request
            </DialogTitle>
            <DialogDescription>
              {rescheduleResponse.approved
                ? "The interview will be rescheduled to the requested time."
                : "Provide a reason for rejecting this request."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="response-message">
                Message {!rescheduleResponse.approved && "*"}
              </Label>
              <Textarea
                id="response-message"
                placeholder={
                  rescheduleResponse.approved
                    ? "Add an optional message..."
                    : "Explain why you're rejecting this request..."
                }
                value={rescheduleResponse.message}
                onChange={(e) =>
                  setRescheduleResponse({
                    ...rescheduleResponse,
                    message: e.target.value
                  })
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRescheduleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={rescheduleResponse.approved ? "default" : "destructive"}
              onClick={() => handleRespondToReschedule(rescheduleResponse.approved)}
            >
              {rescheduleResponse.approved ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Interview Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Interview</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this interview? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Reason (optional)</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Provide a reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Keep Interview
            </Button>
            <Button variant="destructive" onClick={handleCancelInterview}>
              Cancel Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
