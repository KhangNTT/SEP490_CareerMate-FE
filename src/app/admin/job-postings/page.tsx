'use client';

import { getJobPostings, JobPosting, updateJobPostingStatus } from '@/lib/admin-job-api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { 
  Briefcase, 
  Search, 
  RefreshCw, 
  Eye, 
  Building2, 
  MapPin, 
  Calendar,
  Filter,
  Tag,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function JobPostingsManagementPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  
  // Reject dialog
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [jobToReject, setJobToReject] = useState<JobPosting | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchJobPostings = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 [Job Postings] Fetching page:', page, 'Status filter:', statusFilter);
      
      // For EXPIRED filter, don't pass it to backend - we'll filter client-side
      // This allows us to get ACTIVE jobs and check expiration dates
      const apiStatusFilter = statusFilter === 'EXPIRED' ? undefined : (statusFilter || undefined);
      
      const response = await getJobPostings(page, 20, apiStatusFilter);
      
      console.log('✅ [Job Postings] Response:', response);
      
      if (response.code === 200) {
        setJobPostings(response.result.content);
        setTotalPages(response.result.totalPages);
        setTotalElements(response.result.totalElements);
        setCurrentPage(response.result.number);
        
        // Debug: Log jobs with their statuses
        console.log('📊 Jobs by status:', {
          total: response.result.content.length,
          pending: response.result.content.filter((j: JobPosting) => j.status === 'PENDING').length,
          active: response.result.content.filter((j: JobPosting) => j.status === 'ACTIVE').length,
          rejected: response.result.content.filter((j: JobPosting) => j.status === 'REJECTED').length,
          expired: response.result.content.filter((j: JobPosting) => j.status === 'EXPIRED').length,
        });
      } else {
        setError(response.message || 'Failed to fetch job postings');
      }
    } catch (error: any) {
      console.error('❌ [Job Postings] Error:', error);
      
      // Handle specific errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        setError('Request timeout. The API might be slow or unavailable. Try enabling "Mock Data Mode" below.');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Authentication required. Please login as admin and try again.');
      } else if (error.response?.status === 404) {
        setError('API endpoint not found. Please check the backend configuration or enable "Mock Data Mode".');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || 'Error loading job postings. Try enabling "Mock Data Mode" for testing.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobPostings(currentPage);
  }, [currentPage, statusFilter]);

  const handleViewDetails = (job: JobPosting) => {
    setSelectedJob(job);
    setIsDetailDialogOpen(true);
  };

  const handleApprove = async (job: JobPosting) => {
    if (!confirm(`Approve job: ${job.title}?`)) return;
    
    setIsProcessing(true);
    try {
      await updateJobPostingStatus(job.id, 'APPROVED');
      alert('Job approved and activated!');
      fetchJobPostings(currentPage);
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (job: JobPosting) => {
    setJobToReject(job);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please enter rejection reason');
      return;
    }
    
    setIsProcessing(true);
    try {
      await updateJobPostingStatus(jobToReject!.id, 'REJECTED', rejectionReason);
      alert('Job rejected!');
      setIsRejectDialogOpen(false);
      fetchJobPostings(currentPage);
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    expDate.setHours(0, 0, 0, 0);
    return expDate < today;
  };

  const getDaysExpired = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - expDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const filteredJobPostings = jobPostings.filter(job => {
    // First filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        job.title.toLowerCase().includes(query) ||
        job.recruiter.companyName.toLowerCase().includes(query) ||
        job.address.toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }
    
    // Then filter by status
    // Special handling for EXPIRED filter - only check expiration date, ignore backend status
    if (statusFilter === 'EXPIRED') {
      return isExpired(job.expirationDate);
    }
    
    // For other filters, match exact status (no additional filter needed, backend handles it)
    return true;
  });

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Postings Management</h1>
          <div className="text-center p-12 bg-red-50 rounded-lg border border-red-200">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 mb-6">{error}</p>
            <Button 
              onClick={() => fetchJobPostings(currentPage)}
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Postings Management</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor and manage all job postings</p>
        </div>
        
        {!isLoading && (
          <div className="flex items-center gap-4">
            <div className="text-center px-6 py-3 bg-sky-50 rounded-lg border border-sky-200">
              <p className="text-xs text-gray-600 mb-1">Total Postings</p>
              <p className="text-2xl font-semibold text-sky-600">{totalElements}</p>
            </div>
            
            {/* Show pending count */}
            <div className="text-center px-6 py-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-gray-600 mb-1">Pending Approval</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {jobPostings.filter(j => j.status === 'PENDING').length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <Button
            onClick={() => fetchJobPostings(0)}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600 mr-2">Filter by status:</span>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('')}
              className={statusFilter === '' ? 'bg-sky-600 hover:bg-sky-700' : ''}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'ACTIVE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('ACTIVE')}
              className={statusFilter === 'ACTIVE' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('PENDING')}
              className={statusFilter === 'PENDING' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === 'REJECTED' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('REJECTED')}
              className={statusFilter === 'REJECTED' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Rejected
            </Button>
            <Button
              variant={statusFilter === 'EXPIRED' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('EXPIRED')}
              className={statusFilter === 'EXPIRED' ? 'bg-gray-600 hover:bg-gray-700' : ''}
            >
              Expired
            </Button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-20">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent mb-4"></div>
            <p className="text-gray-500">Loading job postings...</p>
          </div>
        </div>
      ) : filteredJobPostings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-20">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">💼</div>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'No job postings found matching your search' : 'No job postings found'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Info banner if no pending jobs */}
          {jobPostings.filter(j => j.status === 'PENDING').length === 0 && statusFilter === '' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <div className="text-blue-600 text-xl">ℹ️</div>
              <div>
                <p className="text-sm font-medium text-blue-900">No pending jobs to approve</p>
                <p className="text-sm text-blue-700 mt-1">
                  Click "Pending" filter button above to see jobs waiting for approval. 
                  Approve/Reject buttons will appear only for jobs with PENDING status.
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-700 py-4 w-16">ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Job Title</TableHead>
                  <TableHead className="font-semibold text-gray-700">Company</TableHead>
                  <TableHead className="font-semibold text-gray-700">Location</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Expires</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobPostings.map((job) => (
                  <TableRow 
                    key={job.id}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <TableCell className="font-medium text-gray-600 py-4">
                      {job.id}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-sky-600" />
                        </div>
                        <div>
                          <p className="font-medium">{job.title}</p>
                          {job.skills.length > 0 && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Tag className="h-3 w-3" />
                              {job.skills.length} skills required
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        {job.recruiter.companyName}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {job.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={`${getStatusColor(isExpired(job.expirationDate) && job.status === 'ACTIVE' ? 'EXPIRED' : job.status)} border`}>
                          {isExpired(job.expirationDate) && job.status === 'ACTIVE' ? 'EXPIRED' : job.status}
                        </Badge>
                        {job.status === 'ACTIVE' && isExpired(job.expirationDate) && (
                          <span className="text-xs text-gray-500 italic">Auto-expired</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(job.expirationDate)}
                        </div>
                        {isExpired(job.expirationDate) && (
                          <span className="text-xs text-red-600 font-medium">
                            ⚠️ Expired {getDaysExpired(job.expirationDate)} day{getDaysExpired(job.expirationDate) !== 1 ? 's' : ''} ago
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(job)}
                          className="p-2 rounded-full hover:bg-sky-100 text-sky-600 transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {job.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(job)}
                              disabled={isProcessing}
                              className="p-2 rounded-full hover:bg-green-100 text-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRejectClick(job)}
                              disabled={isProcessing}
                              className="p-2 rounded-full hover:bg-red-100 text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page <span className="font-medium">{currentPage + 1}</span> of <span className="font-medium">{totalPages}</span>
              <span className="mx-2">•</span>
              Showing <span className="font-medium">{filteredJobPostings.length}</span> of <span className="font-medium">{totalElements}</span> job postings
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="rounded-md border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                ← Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="rounded-md border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Next →
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Job Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-sky-600" />
              {selectedJob?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Job Posting Details
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-4 mt-4">
              {/* Status Badge */}
              <div>
                <Badge className={`${getStatusColor(selectedJob.status)} border text-sm px-3 py-1`}>
                  {selectedJob.status}
                </Badge>
              </div>

              {/* Company Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Building2 className="h-5 w-5 text-sky-600" />
                  <span className="font-semibold">{selectedJob.recruiter.companyName}</span>
                </div>
                <p className="text-sm text-gray-600 ml-7">
                  <strong>Email:</strong> {selectedJob.recruiter.email}
                </p>
                <p className="text-sm text-gray-600 ml-7">
                  <strong>Phone:</strong> {selectedJob.recruiter.phoneNumber}
                </p>
              </div>

              {/* Location & Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {selectedJob.address}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Posted Date</p>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(selectedJob.createAt)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Expiration Date</p>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(selectedJob.expirationDate)}
                  </div>
                </div>
                {selectedJob.approvedByEmail && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Approved By</p>
                    <p className="text-sm text-gray-700">{selectedJob.approvedByEmail}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Job Description</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
                </div>
              </div>

              {/* Skills */}
              {selectedJob.skills.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill) => (
                      <Badge
                        key={skill.id}
                        className={`${
                          skill.mustToHave
                            ? 'bg-sky-100 text-sky-700 border-sky-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        } border`}
                      >
                        {skill.name}
                        {skill.mustToHave && ' *'}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">* Required skill</p>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedJob.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-700 mb-2">Rejection Reason</p>
                  <p className="text-sm text-red-600">{selectedJob.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Reject Job
            </DialogTitle>
            <DialogDescription>
              {jobToReject?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason..."
                rows={4}
                disabled={isProcessing}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessing ? 'Processing...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
