"use client";

import { Search, Filter, Download, FileText, Calendar, MapPin, Clock, CheckCircle, XCircle, Eye, RefreshCw, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getJobApplications, approveJobApplication, rejectJobApplication, setReviewingJobApplication, JobApplication } from "@/lib/recruiter-api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [jobPostingId, setJobPostingId] = useState<number>(43);

  // Dialog states
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isReviewingDialogOpen, setIsReviewingDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch applications
  const fetchApplications = async () => {
    if (!jobPostingId) return;

    try {
      setIsLoading(true);
      const response = await getJobApplications(jobPostingId);

      if (response.code === 0 && response.result) {
        setApplications(response.result);
        setFilteredApplications(response.result);
      } else {
        toast.error(response.message || "Failed to fetch applications");
      }
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      toast.error(error.message || "Failed to fetch applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobPostingId]);

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.phoneNumber.includes(searchQuery) ||
        app.preferredWorkLocation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== "ALL") {
      filtered = filtered.filter(app => app.status === selectedStatus);
    }

    setFilteredApplications(filtered);
  }, [searchQuery, selectedStatus, applications]);

  // Approve
  const handleApprove = async () => {
    if (!selectedApplication) return;
    try {
      setActionLoading(true);
      await approveJobApplication(selectedApplication.id);
      toast.success("Application approved successfully!");
      setIsApproveDialogOpen(false);
      fetchApplications();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve application");
    } finally {
      setActionLoading(false);
    }
  };

  // Reject
  const handleReject = async () => {
    if (!selectedApplication) return;
    try {
      setActionLoading(true);
      await rejectJobApplication(selectedApplication.id, rejectReason);
      toast.success("Application rejected successfully!");
      setIsRejectDialogOpen(false);
      setRejectReason("");
      fetchApplications();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject application");
    } finally {
      setActionLoading(false);
    }
  };

  // Set Reviewing
  const handleSetReviewing = async () => {
    if (!selectedApplication) return;
    try {
      setActionLoading(true);
      await setReviewingJobApplication(selectedApplication.id);
      toast.success("Application set to reviewing successfully!");
      setIsReviewingDialogOpen(false);
      fetchApplications();
    } catch (error: any) {
      toast.error(error.message || "Failed to set application to reviewing");
    } finally {
      setActionLoading(false);
    }
  };

  // Badge
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      SUBMITTED: { bg: "bg-blue-100", text: "text-blue-700", label: "Submitted" },
      APPROVED: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
      REJECTED: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
      REVIEWING: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Reviewing" },
    };
    const badge = badges[status] || badges.SUBMITTED;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getStatusCount = (status: string) => {
    if (status === "ALL") return applications.length;
    return applications.filter(app => app.status === status).length;
  };

  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-sky-800">Job applications</h1>
          <p className="text-sm text-gray-600 mt-1">Manage candidate applications for your job postings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Job Posting ID:</label>
            <input
              type="number"
              value={jobPostingId}
              onChange={(e) => setJobPostingId(Number(e.target.value))}
              className="w-24 rounded-md border px-3 py-2 text-sm"
              placeholder="ID"
            />
          </div>
          <button
            onClick={fetchApplications}
            disabled={isLoading}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm shadow-sky-100">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b">
          {["ALL", "SUBMITTED", "REVIEWING", "APPROVED", "REJECTED"].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 text-sm font-medium ${
                selectedStatus === status
                  ? "border-b-2 border-sky-600 text-sky-700"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {status === "ALL" ? "All candidates" : status.charAt(0) + status.slice(1).toLowerCase()}{" "}
              <span className="ml-1 text-xs">{getStatusCount(status)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-sm shadow-sky-100">
        <div className="border-b p-4">
          <h3 className="text-sm font-medium text-sky-900">
            Total Applications: {filteredApplications.length}
          </h3>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <RefreshCw className="h-8 w-8 text-sky-600 animate-spin mb-4" />
            <p className="text-sm text-slate-600">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-slate-900">No applications found</h3>
            <p className="text-sm text-slate-600">
              {searchQuery || selectedStatus !== "ALL"
                ? "Try adjusting your filters"
                : "Applications will appear here when candidates apply to your job postings."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Candidate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Job Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Applied Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{application.fullName}</p>
                        <p className="text-sm text-gray-600">{application.phoneNumber}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">{application.jobTitle}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {application.preferredWorkLocation}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        {new Date(application.createAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(application.status)}</td>

                    {/* ✅ ACTION ICONS ONLY */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setIsDetailDialogOpen(true);
                          }}
                          className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {application.status === "SUBMITTED" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedApplication(application);
                                setIsReviewingDialogOpen(true);
                              }}
                              className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600 transition"
                              title="Set to Reviewing"
                            >
                              <AlertCircle className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => {
                                setSelectedApplication(application);
                                setIsApproveDialogOpen(true);
                              }}
                              className="p-2 rounded-full hover:bg-green-100 text-green-600 transition"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedApplication(application);
                                setIsRejectDialogOpen(true);
                              }}
                              className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {application.status === "REVIEWING" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedApplication(application);
                                setIsApproveDialogOpen(true);
                              }}
                              className="p-2 rounded-full hover:bg-green-100 text-green-600 transition"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedApplication(application);
                                setIsRejectDialogOpen(true);
                              }}
                              className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail / Approve / Reject Dialogs giữ nguyên */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>View complete application information</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Full Name</p>
                  <p className="text-sm text-gray-900">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone Number</p>
                  <p className="text-sm text-gray-900">{selectedApplication.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Job Title</p>
                  <p className="text-sm text-gray-900">{selectedApplication.jobTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Preferred Location</p>
                  <p className="text-sm text-gray-900">{selectedApplication.preferredWorkLocation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  {getStatusBadge(selectedApplication.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Applied Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedApplication.createAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">CV File</p>
                  <a
                    href={selectedApplication.cvFilePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View CV
                  </a>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Job Description</p>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
                  {selectedApplication.jobDescription}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter</p>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
                  {selectedApplication.coverLetter}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>Are you sure you want to approve this application?</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <p className="font-medium text-gray-900">{selectedApplication.fullName}</p>
              <p className="text-sm text-gray-600">{selectedApplication.jobTitle}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={actionLoading} className="bg-green-600 hover:bg-green-700">
              {actionLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Confirm Approve
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this application</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
              <p className="font-medium text-gray-900">{selectedApplication.fullName}</p>
              <p className="text-sm text-gray-600">{selectedApplication.jobTitle}</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Please explain why you are rejecting this application..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={actionLoading || !rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" /> Confirm Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reviewing Dialog */}
      <Dialog open={isReviewingDialogOpen} onOpenChange={setIsReviewingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Application to Reviewing</DialogTitle>
            <DialogDescription>
              Mark this application as under review. You can approve or reject it later.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <p className="font-medium text-gray-900">{selectedApplication.fullName}</p>
              <p className="text-sm text-gray-600">{selectedApplication.jobTitle}</p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewingDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSetReviewing}
              disabled={actionLoading}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Setting...
                </>
              ) : (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Set to Reviewing
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
