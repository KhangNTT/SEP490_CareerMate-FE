"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { ClientHeader, ClientFooter } from "@/modules/client/components";
import CVSidebar from "@/components/layout/CVSidebar";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";
import { useAuthStore } from "@/store/use-auth-store";
import {
  fetchMyJobApplications,
  getStatusColor,
  getStatusText,
  formatApplicationDate,
  type JobApplication
} from "@/lib/my-jobs-api";
import {
  fetchSavedJobs,
  fetchViewedJobs,
  type SavedJobFeedback
} from "@/lib/job-api";
import { getDaysDiff } from "@/lib/my-jobs-utils";
import { ClockIcon, BriefcaseIcon, ChevronDownIcon } from "@/components/ui/icons";
import toast from "react-hot-toast";

// Lazy load tab components for better code splitting
const SavedJobsTab = lazy(() => import("./SavedJobsTab"));
const RecentJobsTab = lazy(() => import("./RecentJobsTab"));

type TabType = "applied" | "saved" | "recent";

// Skeleton loading component for job cards
const JobCardSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white animate-pulse">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MyJobsPage = () => {
  // Get candidateId from global auth store
  const { candidateId, fetchCandidateProfile } = useAuthStore();
  const { headerHeight } = useLayout();

  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState<TabType>("applied");

  // State for job applications
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJobFeedback[]>([]);
  const [viewedJobs, setViewedJobs] = useState<SavedJobFeedback[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Loaded flags to prevent re-fetching on tab switch
  const [savedLoaded, setSavedLoaded] = useState(false);
  const [viewedLoaded, setViewedLoaded] = useState(false);

  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

  // Check and fetch candidateId if needed - run once on mount
  useEffect(() => {
    const initAuth = async () => {
      if (!candidateId) {
        try {
          await fetchCandidateProfile();
        } catch (error) {
          console.error("Failed to fetch candidate profile:", error);
        }
      }
      // Always set auth loading to false after checking
      setTimeout(() => setIsAuthLoading(false), 0);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Fetch all data when candidateId becomes available
  useEffect(() => {
    if (!candidateId || isAuthLoading) {
      return;
    }

    const loadAllData = async () => {
      // Load applied jobs (main data - controls loading state)
      setIsLoading(true);
      try {
        const applications = await fetchMyJobApplications(candidateId);
        setJobApplications(applications);
      } catch (error: any) {
        toast.error('Failed to load job applications');
      } finally {
        setIsLoading(false);
      }

      // Load saved jobs in background (don't block UI)
      fetchSavedJobs(candidateId)
        .then(jobs => {
          setSavedJobs(jobs);
          setSavedLoaded(true);
        })
        .catch(error => {
          console.error('Failed to load saved jobs:', error);
          setSavedLoaded(true);
        });

      // Load viewed jobs in background (don't block UI)
      fetchViewedJobs(candidateId)
        .then(jobs => {
          setViewedJobs(jobs);
          setViewedLoaded(true);
        })
        .catch(error => {
          console.error('Failed to load viewed jobs:', error);
          setViewedLoaded(true);
        });
    };

    loadAllData();
  }, [candidateId, isAuthLoading]);

  const handleJobUnsaved = (jobId: number) => {
    setSavedJobs(prev => prev.filter(job => job.jobId !== jobId));
  };

  const toggleJobDetails = (jobId: number) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  // Show loading state if still checking auth
  if (isAuthLoading) {
    return (
      <>
        <ClientHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
          </div>
        </main>
      </>
    );
  }

  // Show error if no candidateId after auth check
  if (!candidateId) {
    return (
      <>
        <ClientHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-red-500 mb-4">Failed to load candidate profile</p>
            <Link href="/candidate/cm-profile" className="text-blue-600 hover:underline">
              Go to Profile
            </Link>
          </div>
        </main>
        <ClientFooter />
      </>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {/* GRID 2 cột: sidebar | content */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-6 items-start transition-all duration-300"
          style={{
            ["--sticky-offset" as any]: `${headerHeight || 0}px`,
            ["--content-pad" as any]: "24px",
          }}
        >
          {/* Sidebar trái: sticky + ẩn mobile */}
          <aside className="hidden lg:block sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <CVSidebar activePage="jobs" />
          </aside>

          {/* Main Content */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                My Jobs
              </h1>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("applied")}
                  className={`pb-3 px-1 mr-8 relative ${activeTab === "applied"
                    ? "text-gray-500 font-medium border-b-2 border-gray-500"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Applied Jobs
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-500 text-white rounded-full">
                    {jobApplications.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("saved")}
                  className={`pb-3 px-1 mr-8 relative ${activeTab === "saved"
                    ? "text-gray-500 font-medium border-b-2 border-gray-500"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Saved Jobs
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-500 text-white rounded-full">
                    {savedJobs.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("recent")}
                  className={`pb-3 px-1 mr-8 relative ${activeTab === "recent"
                    ? "text-gray-500 font-medium border-b-2 border-gray-500"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Recent Viewed Jobs
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-500 text-white rounded-full">
                    {viewedJobs.length}
                  </span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-4">
                {activeTab === "applied" && (
                  <div>
                    <div className="flex items-center mb-8 text-gray-500 text-sm">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      Your applied jobs are stored for the last 12 months.
                    </div>

                    {/* Loading State - Skeleton */}
                    {isLoading && <JobCardSkeleton />}

                    {/* Job Applications List */}
                    {!isLoading && jobApplications.length > 0 && (
                      <div className="space-y-4">
                        {jobApplications.map((application) => (
                          <div
                            key={application.id}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                          >
                            {/* Job Header */}
                            <div className="p-4 bg-white">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-600 font-semibold">
                                      {application.jobTitle.charAt(0)}
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                        {application.jobTitle}
                                      </h3>
                                      <p className="text-sm text-gray-600">
                                        Applied on {formatApplicationDate(application.createAt)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                                      {getStatusText(application.status)}
                                    </span>
                                    {new Date(application.expirationDate) < new Date() && (
                                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                                        Expired
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Expand Button */}
                                <button
                                  onClick={() => toggleJobDetails(application.id)}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <ChevronDownIcon
                                    className={`text-gray-600 transition-transform ${expandedJobId === application.id ? 'rotate-180' : ''
                                      }`}
                                  />
                                </button>
                              </div>
                            </div>

                            {/* Expandable Details */}
                            {expandedJobId === application.id && (
                              <div className="border-t border-gray-200 bg-gray-50 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Application Details</h4>
                                    <div className="space-y-1 text-gray-600">
                                      <p><span className="font-medium">Full Name:</span> {application.fullName}</p>
                                      <p><span className="font-medium">Phone:</span> {application.phoneNumber}</p>
                                      <p><span className="font-medium">Preferred Location:</span> {application.preferredWorkLocation}</p>
                                      <p><span className="font-medium">CV:</span> {application.cvFilePath.split('/').pop()}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                                    <p className="text-gray-600 whitespace-pre-wrap">
                                      {application.coverLetter || 'No cover letter provided'}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                                  <Link
                                    href={`/jobs-detail?id=${application.jobPostingId}`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                  >
                                    View Job Details
                                  </Link>
                                  <a
                                    href={`/${application.cvFilePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                                  >
                                    View CV
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && jobApplications.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="bg-gray-200 p-4 rounded-lg mb-4">
                          <BriefcaseIcon className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-6">
                          You haven't applied to any jobs in the last 12 months.
                        </p>
                        <Link
                          href="/jobs-list"
                          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium"
                        >
                          Explore jobs
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "saved" && (
                  <Suspense fallback={<JobCardSkeleton />}>
                    {!savedLoaded ? (
                      <JobCardSkeleton />
                    ) : (
                      <SavedJobsTab
                        savedJobs={savedJobs}
                        candidateId={candidateId}
                        onJobUnsaved={handleJobUnsaved}
                      />
                    )}
                  </Suspense>
                )}

                {activeTab === "recent" && (
                  <Suspense fallback={<JobCardSkeleton />}>
                    {!viewedLoaded ? (
                      <JobCardSkeleton />
                    ) : (
                      <RecentJobsTab viewedJobs={viewedJobs} />
                    )}
                  </Suspense>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

    </>
  );
};

export default MyJobsPage;
