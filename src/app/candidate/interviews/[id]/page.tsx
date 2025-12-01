"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Users,
  User,
  Mail,
  Building2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  RotateCcw,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ClientHeader, ClientFooter } from "@/modules/client/components";
import {
  getInterviewById,
  confirmInterview,
  requestReschedule,
  getInterviewTypeText,
  formatInterviewDateTime,
  getInterviewDateTimeStr,
  isToday,
  isUpcoming,
  type InterviewScheduleResponse
} from "@/lib/interview-api";

export default function InterviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<InterviewScheduleResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);

  // Form state
  const [rescheduleForm, setRescheduleForm] = useState({
    newDateTime: "",
    reason: ""
  });

  useEffect(() => {
    loadInterview();
  }, [interviewId]);

  const loadInterview = async () => {
    try {
      setLoading(true);
      const data = await getInterviewById(interviewId);
      setInterview(data);
    } catch (error: any) {
      console.error("Failed to load interview:", error);
      toast.error(error.message || "Failed to load interview details");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmInterview = async () => {
    if (!interview) return;

    try {
      await confirmInterview(interview.id);
      toast.success("Interview confirmed successfully");
      setConfirmDialogOpen(false);
      loadInterview();
    } catch (error: any) {
      console.error("Failed to confirm interview:", error);
      toast.error(error.response?.data?.message || "Failed to confirm interview");
    }
  };

  const handleRequestReschedule = async () => {
    if (!interview) return;
    
    if (!rescheduleForm.newDateTime) {
      toast.error("Please select a new date and time");
      return;
    }

    if (!rescheduleForm.reason.trim()) {
      toast.error("Please provide a reason for rescheduling");
      return;
    }

    try {
      await requestReschedule(interview.id, {
        newRequestedDate: rescheduleForm.newDateTime,
        reason: rescheduleForm.reason,
        requestedBy: 'CANDIDATE'
      });
      
      toast.success("Reschedule request submitted");
      setRescheduleDialogOpen(false);
      setRescheduleForm({ newDateTime: "", reason: "" });
      loadInterview();
    } catch (error: any) {
      console.error("Failed to request reschedule:", error);
      toast.error(error.response?.data?.message || "Failed to submit request");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const getInterviewStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      SCHEDULED: { variant: "outline", label: "Awaiting Confirmation" },
      CONFIRMED: { variant: "default", label: "Confirmed" },
      COMPLETED: { variant: "secondary", label: "Completed" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
      NO_SHOW: { variant: "destructive", label: "Missed" }
    };
    
    const { variant, label } = config[status] || { variant: "outline" as const, label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case "PHONE": return <Phone className="h-5 w-5" />;
      case "VIDEO_CALL": return <Video className="h-5 w-5" />;
      case "IN_PERSON": return <MapPin className="h-5 w-5" />;
      case "ONLINE_ASSESSMENT": return <Calendar className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const getResultBadge = (result?: string) => {
    if (!result) return null;
    
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      PASS: { variant: "default", label: "Passed" },
      FAIL: { variant: "destructive", label: "Not Selected" },
      PENDING: { variant: "secondary", label: "Under Review" },
      NEEDS_SECOND_ROUND: { variant: "outline", label: "Second Round Required" },
    };
    
    const { variant, label } = config[result] || { variant: "secondary" as const, label: result };
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (loading) {
    return (
      <>
        <ClientHeader />
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <ClientFooter />
      </>
    );
  }

  if (!interview) {
    return (
      <>
        <ClientHeader />
        <main className="container mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-xl font-semibold mb-2">Interview Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The interview you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/candidate/interviews')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Interviews
            </Button>
          </div>
        </main>
        <ClientFooter />
      </>
    );
  }

  const interviewDateTime = getInterviewDateTimeStr(interview);

  return (
    <>
      <ClientHeader />
      <main className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/candidate/interviews')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Interviews
          </Button>
        </div>

        {/* Header Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {getInterviewTypeIcon(interview.interviewType)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {getInterviewTypeText(interview.interviewType)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4" />
                      {interview.companyName || "Company"}
                    </CardDescription>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getInterviewStatusBadge(interview.status)}
                {interview.result && getResultBadge(interview.result)}
                {isToday(interview) && (
                  <Badge variant="destructive">Today!</Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Confirmation Required Alert */}
        {interview.status === "SCHEDULED" && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">Confirmation Required</p>
                    <p className="text-sm text-yellow-700">
                      Please confirm your attendance for this interview
                    </p>
                  </div>
                </div>
                <Button onClick={() => setConfirmDialogOpen(true)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date & Time Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled Date & Time</p>
                <p className="text-lg font-medium">
                  {formatInterviewDateTime(interviewDateTime)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {interview.durationMinutes} minutes
                </p>
              </div>
              {interview.interviewRound && (
                <div>
                  <p className="text-sm text-muted-foreground">Round</p>
                  <p className="font-medium">Round {interview.interviewRound}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location / Meeting Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {interview.interviewType === "VIDEO_CALL" ? (
                  <Video className="h-5 w-5 text-primary" />
                ) : interview.interviewType === "PHONE" ? (
                  <Phone className="h-5 w-5 text-primary" />
                ) : (
                  <MapPin className="h-5 w-5 text-primary" />
                )}
                {interview.interviewType === "VIDEO_CALL" ? "Meeting Details" : 
                 interview.interviewType === "PHONE" ? "Call Details" : "Location"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {interview.meetingLink && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Meeting Link</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-primary hover:underline truncate"
                    >
                      {interview.meetingLink}
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(interview.meetingLink!)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    className="mt-3 w-full"
                    onClick={() => window.open(interview.meetingLink, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Join Meeting
                  </Button>
                </div>
              )}
              {interview.location && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Address</p>
                  <p className="font-medium">{interview.location}</p>
                  <Button
                    variant="outline"
                    className="mt-3"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(interview.location!)}`, '_blank')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Open in Maps
                  </Button>
                </div>
              )}
              {!interview.meetingLink && !interview.location && (
                <p className="text-muted-foreground">
                  Location/meeting details will be provided by the recruiter
                </p>
              )}
            </CardContent>
          </Card>

          {/* Interviewer Card */}
          {(interview.interviewerName || interview.interviewerEmail) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Interviewer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {interview.interviewerName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{interview.interviewerName}</span>
                  </div>
                )}
                {interview.interviewerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${interview.interviewerEmail}`} className="text-primary hover:underline">
                      {interview.interviewerEmail}
                    </a>
                  </div>
                )}
                {interview.interviewerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${interview.interviewerPhone}`} className="text-primary hover:underline">
                      {interview.interviewerPhone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Preparation Notes Card */}
          {interview.preparationNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Preparation Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{interview.preparationNotes}</p>
              </CardContent>
            </Card>
          )}

          {/* Feedback Card (for completed interviews) */}
          {interview.feedback && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Interview Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{interview.feedback}</p>
              </CardContent>
            </Card>
          )}

          {/* Reschedule Requests */}
          {interview.rescheduleRequests && interview.rescheduleRequests.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  Reschedule Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {interview.rescheduleRequests.map((request) => (
                  <div key={request.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{request.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Requested by: {request.requestedBy}
                      </span>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">Proposed time:</span>{" "}
                      {formatInterviewDateTime(request.proposedDateTime)}
                    </p>
                    {request.reason && (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Reason:</span> {request.reason}
                      </p>
                    )}
                    {request.responseMessage && (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Response:</span> {request.responseMessage}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 justify-end">
          {interview.status === "SCHEDULED" && (
            <Button onClick={() => setConfirmDialogOpen(true)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Attendance
            </Button>
          )}
          {interview.status !== "COMPLETED" && interview.status !== "CANCELLED" && (
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(true)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Request Reschedule
            </Button>
          )}
        </div>
      </main>
      <ClientFooter />

      {/* Confirm Interview Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Interview Attendance</DialogTitle>
            <DialogDescription>
              Please confirm that you will attend this interview
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {formatInterviewDateTime(interviewDateTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{interview.durationMinutes} minutes</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              By confirming, you're committing to attend this interview. If you need to reschedule,
              please use the "Request Reschedule" option instead.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmInterview}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirm Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Reschedule</DialogTitle>
            <DialogDescription>
              Request a new date and time for your interview
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-datetime">New Date & Time *</Label>
              <input
                id="new-datetime"
                type="datetime-local"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={rescheduleForm.newDateTime}
                onChange={(e) =>
                  setRescheduleForm({ ...rescheduleForm, newDateTime: e.target.value })
                }
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reschedule-reason">Reason *</Label>
              <Textarea
                id="reschedule-reason"
                placeholder="Please explain why you need to reschedule..."
                value={rescheduleForm.reason}
                onChange={(e) =>
                  setRescheduleForm({ ...rescheduleForm, reason: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRescheduleDialogOpen(false);
                setRescheduleForm({ newDateTime: "", reason: "" });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRequestReschedule}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
