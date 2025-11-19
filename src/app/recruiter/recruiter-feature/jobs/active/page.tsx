"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  BarChart3,
  RefreshCw,
  Pencil,
  Zap,
  CalendarDays,
  AlertTriangle,
  X,
} from "lucide-react";
import { 
  getRecruiterJobPostings, 
  RecruiterJobPosting, 
  extendJobPosting,
  getJobPostingStats,
  JobPostingStats
} from "@/lib/recruiter-api";
import toast from "react-hot-toast";

export default function ActiveJobsPage() {
  const [jobs, setJobs] = useState<RecruiterJobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<RecruiterJobPosting | null>(null);
  const [modalType, setModalType] = useState<"stats" | "extend" | "edit" | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [extendDays, setExtendDays] = useState(7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobStats, setJobStats] = useState<JobPostingStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, [currentPage, pageSize]);

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
  const openModal = async (job: RecruiterJobPosting, type: "stats" | "extend" | "edit") => {
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
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white border border-gray-200 shadow-2xl rounded-lg p-6 w-[90%] sm:w-[400px] z-50"
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
                      selectedJob.jobPackage === 'PREMIUM' ? 'bg-purple-100 text-purple-800' :
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
    </div>
  );
}
