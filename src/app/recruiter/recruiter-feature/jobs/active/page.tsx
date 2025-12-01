"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  BarChart3,
  RefreshCw,
  Pencil,
  Zap,
  CalendarDays,
  AlertTriangle,
  X,
  Users,
  Star,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { 
  getRecruiterJobPostings, 
  RecruiterJobPosting, 
  extendJobPosting,
  getJobPostingStats,
  JobPostingStats,
  getJobRecommendations,
  CandidateRecommendation,
  RecommendationsResult,
  checkAIMatchingEntitlement
} from "@/lib/recruiter-api";
import toast from "react-hot-toast";

export default function ActiveJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<RecruiterJobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<RecruiterJobPosting | null>(null);
  const [modalType, setModalType] = useState<"stats" | "extend" | "edit" | "recommendations" | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [extendDays, setExtendDays] = useState(7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobStats, setJobStats] = useState<JobPostingStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Recommendations state
  const [recommendations, setRecommendations] = useState<RecommendationsResult | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [maxCandidates, setMaxCandidates] = useState(5);
  const [minMatchScore, setMinMatchScore] = useState(0);
  
  // Contact modal state
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecommendation | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  // AI matching entitlement
  const [hasAIAccess, setHasAIAccess] = useState(false);
  const [isCheckingAIAccess, setIsCheckingAIAccess] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
    checkAIEntitlement();
  }, [currentPage, pageSize]);

  const checkAIEntitlement = async () => {
    try {
      setIsCheckingAIAccess(true);
      const response = await checkAIMatchingEntitlement();
      if (response.code === 200) {
        setHasAIAccess(response.result);
        console.log('✅ AI Matching Access:', response.result);
      }
    } catch (error: any) {
      console.error("Error checking AI entitlement:", error);
      setHasAIAccess(false);
    } finally {
      setIsCheckingAIAccess(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await getRecruiterJobPostings({ page: currentPage, size: pageSize });
      
      if ((response.code === 0 || response.code === 200) && response.result) {
        // Filter only ACTIVE jobs from paginated content
        const activeJobs = response.result.content.filter(job => job.status === 'ACTIVE');
        setJobs(activeJobs);
        setTotalPages(response.result.totalPages);
        setTotalElements(response.result.totalElements);
        
        if (activeJobs.length === 0) {
          toast("No active jobs found", { icon: "ℹ️" });
        }
      } else {
        toast.error(response.message || "Failed to load jobs");
      }
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast.error(error.message || "Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate days until expiration
  const getDaysUntilExpiry = (expirationDate: string): number => {
    const expiry = new Date(expirationDate);
    const today = new Date();
    expiry.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Handler mở modal
  const openModal = async (job: RecruiterJobPosting, type: "stats" | "extend" | "edit" | "recommendations") => {
    setSelectedJob(job);
    setModalType(type);
    setEditTitle(job.title);
    setExtendDays(7);
    
    // Fetch stats if opening stats modal
    if (type === "stats") {
      try {
        setIsLoadingStats(true);
        const statsResponse = await getJobPostingStats(job.id);
        if (statsResponse.code === 0 || statsResponse.code === 200) {
          setJobStats(statsResponse.result);
        }
      } catch (error: any) {
        console.error("Error fetching stats:", error);
        toast.error("Could not load statistics");
        setJobStats(null);
      } finally {
        setIsLoadingStats(false);
      }
    }
    
    // Fetch recommendations if opening recommendations modal
    if (type === "recommendations") {
      try {
        setIsLoadingRecommendations(true);
        const recsResponse = await getJobRecommendations(job.id, { 
          maxCandidates, 
          minMatchScore 
        });
        if (recsResponse.code === 0 || recsResponse.code === 200) {
          setRecommendations(recsResponse.result);
          toast.success(`Found ${recsResponse.result.totalCandidatesFound} candidates in ${recsResponse.result.processingTimeMs}ms`);
        }
      } catch (error: any) {
        console.error("Error fetching recommendations:", error);
        toast.error("Could not load candidate recommendations");
        setRecommendations(null);
      } finally {
        setIsLoadingRecommendations(false);
      }
    }
  };

  // Gia hạn job
  const handleExtend = async () => {
    if (!selectedJob) return;
    
    try {
      setIsProcessing(true);
      
      // Calculate new expiration date
      const currentExpiry = new Date(selectedJob.expirationDate);
      currentExpiry.setDate(currentExpiry.getDate() + extendDays);
      const newExpirationDate = currentExpiry.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      const response = await extendJobPosting(selectedJob.id, newExpirationDate);
      
      if (response.code === 0 || response.code === 200) {
        toast.success(`Job extended by ${extendDays} days!`);
        setModalType(null);
        // Refresh jobs list
        await fetchJobs();
      } else {
        toast.error(response.message || "Failed to extend job");
      }
    } catch (error: any) {
      console.error("Error extending job:", error);
      toast.error(error.message || "Failed to extend job");
    } finally {
      setIsProcessing(false);
    }
  };

  // Cập nhật tiêu đề job
  const handleEditSave = () => {
    // TODO: Implement edit job title API
    if (!selectedJob) return;
    toast("Edit feature will be implemented with API", { icon: "ℹ️" });
    setModalType(null);
  };

  return (
    <div className="p-4 sm:p-0 relative">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Active Job Posts</h1>
        <span className="text-sm text-gray-500">
          Manage performance and extend job postings
        </span>
      </header>

      {/* Bảng danh sách */}
      {isLoading ? (
        <div className="rounded-lg border bg-white p-6 shadow-lg text-center">
          <RefreshCw className="h-8 w-8 text-sky-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading active jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 shadow-lg text-center">
          <p className="text-gray-600">No active jobs found.</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-white shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Công việc
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                  Work Model
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Package
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Expires In
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => {
                const daysLeft = getDaysUntilExpiry(job.expirationDate);
                return (
                  <tr key={job.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <div>
                          <div>{job.title}</div>
                          <div className="text-xs text-gray-400">ID: #{job.id}</div>
                        </div>
                        {job.jobPackage === 'PREMIUM' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Zap className="h-3 w-3 mr-1" />
                            PREMIUM
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                      {job.workModel}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        job.jobPackage === 'PREMIUM' ? 'bg-purple-100 text-purple-800' :
                        job.jobPackage === 'STANDARD' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.jobPackage}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <div
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                          daysLeft <= 3
                            ? "bg-red-100 text-red-800"
                            : daysLeft <= 7
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        <CalendarDays className="h-3.5 w-3.5 mr-1" />
                        {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-3">
                        {hasAIAccess && (
                          <button
                            onClick={() => openModal(job, "recommendations")}
                            className="text-[#3c679a] hover:text-[#2a4a6f] relative group"
                            title="View AI Recommendations"
                          >
                            <Users className="h-4.5 w-4.5" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          </button>
                        )}
                        {!hasAIAccess && !isCheckingAIAccess && (
                          <button
                            onClick={() => {
                              toast.error("Upgrade your package to access AI Recommendations", {
                                duration: 4000,
                                icon: "🔒"
                              });
                            }}
                            className="text-gray-300 hover:text-gray-400 cursor-not-allowed relative"
                            title="Upgrade to access AI Recommendations"
                          >
                            <Users className="h-4.5 w-4.5" />
                            <span className="absolute -top-0.5 -right-0.5 text-xs">🔒</span>
                          </button>
                        )}
                        <button
                          onClick={() => openModal(job, "stats")}
                          className="text-gray-500 hover:text-gray-700"
                          title="View Stats"
                        >
                          <BarChart3 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => openModal(job, "extend")}
                          className="text-green-600 hover:text-green-800"
                          title="Extend"
                        >
                          <RefreshCw className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => openModal(job, "edit")}
                          className="text-sky-600 hover:text-sky-800"
                          title="Edit"
                        >
                          <Pencil className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal - KHÔNG có nền đen */}
      {modalType && selectedJob && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white border border-gray-200 shadow-2xl rounded-lg p-6 z-50 ${
            modalType === "recommendations" ? "w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto" : "w-[90%] sm:w-[400px]"
          }`}
        >
          <button
            onClick={() => setModalType(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          {/* View Stats */}
          {modalType === "stats" && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-sky-600" />
                Job Statistics
              </h2>
              {isLoadingStats ? (
                <div className="text-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin text-sky-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading statistics...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="font-medium text-gray-900">{selectedJob.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Applicants</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {jobStats?.applicants ?? 0}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Views</p>
                      <p className="text-2xl font-bold text-green-600">
                        {jobStats?.views ?? 0}
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Expires In</p>
                    <p className="font-medium text-amber-800">
                      {getDaysUntilExpiry(selectedJob.expirationDate)} days
                      <span className="text-sm text-gray-600 ml-2">
                        ({new Date(selectedJob.expirationDate).toLocaleDateString('vi-VN')})
                      </span>
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Package</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedJob.jobPackage === 'PREMIUM' ? 'bg-[#3c679a] text-[#718eb1]' :
                      selectedJob.jobPackage === 'STANDARD' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedJob.jobPackage}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Extend */}
          {modalType === "extend" && (
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center justify-center gap-2">
                <RefreshCw className="h-5 w-5 text-green-600" />
                Extend Job Post
              </h2>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-sm text-gray-600 mb-2">Job Title</p>
                <p className="font-medium text-gray-900">{selectedJob.title}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extend by how many days?
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={extendDays}
                  onChange={(e) => setExtendDays(parseInt(e.target.value) || 7)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current expiration: {new Date(selectedJob.expirationDate).toLocaleDateString('vi-VN')}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  New expiration: {new Date(new Date(selectedJob.expirationDate).getTime() + extendDays * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="mt-5 flex justify-center gap-3">
                <button
                  onClick={handleExtend}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing && <RefreshCw className="h-4 w-4 animate-spin" />}
                  {isProcessing ? 'Extending...' : 'Confirm'}
                </button>
                <button
                  onClick={() => setModalType(null)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit */}
          {modalType === "edit" && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Edit Job Title
              </h2>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-sky-500 focus:border-sky-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalType(null)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {modalType === "recommendations" && (
            <div className="max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2 sticky top-0 bg-white pb-4 border-b">
                <Users className="h-6 w-6 text-[#3c679a]" />
                AI Candidate Recommendations
              </h2>

              {isLoadingRecommendations ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-[#3c679a] mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Finding best candidates...</p>
                </div>
              ) : recommendations ? (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="bg-gradient-to-r from-[#e0e7ff] to-blue-50 p-4 rounded-lg border border-[#c3d0f7]">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Job Title</p>
                        <p className="font-bold text-gray-900">{recommendations.jobTitle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Candidates Found</p>
                        <p className="text-2xl font-bold text-[#3c679a]">{recommendations.totalCandidatesFound}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Processing Time</p>
                        <p className="font-bold text-gray-900">{recommendations.processingTimeMs}ms</p>
                      </div>
                    </div>
                  </div>

                  {/* Candidates List */}
                  <div className="space-y-3">
                    {recommendations.recommendations.map((candidate, index) => (
                      <div 
                        key={candidate.candidateId}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#ced2d7] flex items-center justify-center font-bold text-[#3c679a]">
                              #{index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {candidate.candidateName || 'Anonymous Candidate'}
                              </h3>
                              <p className="text-sm text-gray-600">{candidate.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            <span className="text-xl font-bold text-[#3c679a]">
                              {(candidate.matchScore * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-500">Experience</p>
                            <p className="font-medium">{candidate.totalYearsExperience} years</p>
                          </div>
                          <div className="bg-blue-50 p-2 rounded">
                            <p className="text-xs text-gray-500">Projects</p>
                            <p className="font-medium text-blue-600">{candidate.projectsCount}</p>
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <p className="text-xs text-gray-500">Certificates</p>
                            <p className="font-medium text-green-600">{candidate.certificatesCount}</p>
                          </div>
                          <div className="bg-amber-50 p-2 rounded">
                            <p className="text-xs text-gray-500">Awards</p>
                            <p className="font-medium text-amber-600">{candidate.awardsCount}</p>
                          </div>
                        </div>

                        {candidate.profileSummary && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-700 italic">"{candidate.profileSummary}"</p>
                          </div>
                        )}

                        <div className="flex gap-3">
                          {candidate.matchedSkills.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">Matched Skills:</p>
                              <div className="flex flex-wrap gap-1">
                                {candidate.matchedSkills.map((skill, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
                                  >
                                    ✓ {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {candidate.missingSkills.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-red-700 mb-1">Missing Skills:</p>
                              <div className="flex flex-wrap gap-1">
                                {candidate.missingSkills.map((skill, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium"
                                  >
                                    ✗ {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                          <button 
                            onClick={() => router.push(`/candidate/cm-profile?userId=${candidate.candidateId}`)}
                            className="px-4 py-2 bg-[#3c679a] text-white text-sm font-medium rounded-md hover:bg-[#2a4a6f] transition-colors flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Profile
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setContactSubject(`Job Opportunity: ${recommendations?.jobTitle || 'Position'}`);
                              setContactMessage(`Hi ${candidate.candidateName || 'there'},\n\nI found your profile and am impressed with your ${candidate.totalYearsExperience} years of experience and ${candidate.projectsCount} projects.\n\nI would like to discuss a job opportunity for ${recommendations?.jobTitle || 'this position'} with you.\n\nBest regards`);
                              setShowContactModal(true);
                              setIsCopied(false);
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                          >
                            <Mail className="h-4 w-4" />
                            Contact
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {recommendations.recommendations.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No matching candidates found</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recommendations data available</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Alert for expiring jobs */}
      {jobs.filter(job => getDaysUntilExpiry(job.expirationDate) <= 3).length > 0 && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 shadow-sm flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <strong>Attention:</strong> You have{" "}
            <strong>{jobs.filter(job => getDaysUntilExpiry(job.expirationDate) <= 3).length}</strong> job(s) expiring soon:
            <ul className="mt-2 ml-4 list-disc">
              {jobs.filter(job => getDaysUntilExpiry(job.expirationDate) <= 3).map(job => (
                <li key={job.id}>
                  <strong>{job.title}</strong> - expires in {getDaysUntilExpiry(job.expirationDate)} day(s)
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{jobs.length}</span> of{" "}
            <span className="font-semibold">{totalElements}</span> active jobs
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'bg-sky-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm text-gray-600">
              Items per page:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Mail className="h-6 w-6 text-[#3c679a]" />
                  Contact Candidate
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Compose your message to {selectedCandidate.candidateName || 'the candidate'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setSelectedCandidate(null);
                  setIsCopied(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Candidate Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{selectedCandidate.candidateName || 'Anonymous'}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-[#3c679a]">
                      {(selectedCandidate.matchScore * 100).toFixed(1)}% Match
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">{selectedCandidate.email}</span>
                </div>
              </div>

              {/* Email Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c679a] focus:border-transparent"
                  placeholder="Enter email subject"
                />
              </div>

              {/* Email Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c679a] focus:border-transparent resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-amber-800 mb-2">📧 How to send this email:</h4>
                <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                  <li>Click "Copy Email Details" button below</li>
                  <li>Open your email client (Gmail, Outlook, etc.)</li>
                  <li>Create a new email and paste the details</li>
                  <li>Send directly from your email to avoid spam filters</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    const emailContent = `To: ${selectedCandidate.email}\nSubject: ${contactSubject}\n\n${contactMessage}`;
                    navigator.clipboard.writeText(emailContent);
                    setIsCopied(true);
                    toast.success('Email details copied to clipboard!');
                    setTimeout(() => setIsCopied(false), 3000);
                  }}
                  className="flex-1 px-6 py-3 bg-[#3c679a] text-white font-medium rounded-lg hover:bg-[#2a4a6f] transition-colors flex items-center justify-center gap-2"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-5 w-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      Copy Email Details
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    window.open(`https://mail.google.com/mail/?view=cm&to=${selectedCandidate.email}&su=${encodeURIComponent(contactSubject)}&body=${encodeURIComponent(contactMessage)}`, '_blank');
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="h-5 w-5" />
                  Open Gmail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
