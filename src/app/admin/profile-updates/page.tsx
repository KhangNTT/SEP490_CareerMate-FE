'use client';

import { useState, useEffect } from 'react';
import { 
  getProfileUpdateRequests, 
  ProfileUpdateRequest,
  approveProfileUpdateRequest,
  rejectProfileUpdateRequest
} from '@/lib/recruiter-api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  Eye, 
  RefreshCw, 
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  ArrowUpDown,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileUpdateRequestsPage() {
  const [requests, setRequests] = useState<ProfileUpdateRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ProfileUpdateRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Action states
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        status: filterStatus !== 'all' ? filterStatus : undefined,
        page: 0,
        size: 100,
        sortBy: 'createdAt',
        sortDir: 'desc' as const,
      };
      
      console.log('🔍 [Profile Update Requests] Fetching with params:', params);
      const response = await getProfileUpdateRequests(params);
      
      if (response.code === 200 && response.result?.content) {
        setRequests(response.result.content);
        setTotalElements(response.result.totalElements);
        setTotalPages(response.result.totalPages);
        console.log('✅ [Profile Update Requests] Fetched:', response.result.content.length, 'of', response.result.totalElements);
      } else {
        setError('Failed to fetch profile update requests');
      }
    } catch (error: any) {
      console.error('Error fetching profile update requests:', error);
      setError(error.message || 'Error loading profile update requests. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const handleViewDetails = (request: ProfileUpdateRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleApproveClick = (request: ProfileUpdateRequest) => {
    setSelectedRequest(request);
    setAdminNote('');
    setIsApproveDialogOpen(true);
  };

  const handleRejectClick = (request: ProfileUpdateRequest) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      setActionLoading(true);
      await approveProfileUpdateRequest(selectedRequest.requestId, adminNote || undefined);
      toast.success('Profile update request approved successfully!');
      setIsApproveDialogOpen(false);
      setIsDialogOpen(false);
      setAdminNote('');
      fetchRequests(); // Refresh list
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast.error(error.message || 'Failed to approve request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      await rejectProfileUpdateRequest(selectedRequest.requestId, rejectionReason);
      toast.success('Profile update request rejected');
      setIsRejectDialogOpen(false);
      setIsDialogOpen(false);
      setRejectionReason('');
      fetchRequests(); // Refresh list
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast.error(error.message || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="h-3 w-3 mr-1" /> };
      case 'APPROVED':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-3 w-3 mr-1" /> };
      case 'REJECTED':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="h-3 w-3 mr-1" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: null };
    }
  };

  const pendingCount = requests.filter(r => r.status?.toUpperCase() === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status?.toUpperCase() === 'APPROVED').length;
  const rejectedCount = requests.filter(r => r.status?.toUpperCase() === 'REJECTED').length;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Profile Update Requests</h1>
            <div className="text-center p-12 bg-red-50 rounded-lg border border-red-200">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <p className="text-red-600 mb-6 text-lg">{error}</p>
              <Button 
                onClick={fetchRequests}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-500 rounded-lg shadow-sm">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile Update Requests</h1>
                <p className="text-sm text-gray-600 mt-1">Review and manage recruiter profile update requests</p>
              </div>
            </div>
            
            {!isLoading && (
              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Pending</p>
                  <p className="text-xl font-semibold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="text-center px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Approved</p>
                  <p className="text-xl font-semibold text-green-600">{approvedCount}</p>
                </div>
                <div className="text-center px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Rejected</p>
                  <p className="text-xl font-semibold text-red-600">{rejectedCount}</p>
                </div>
              </div>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="mt-6 flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              className="rounded-lg"
            >
              All ({requests.length})
            </Button>
            <Button
              variant={filterStatus === 'PENDING' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('PENDING')}
              className={filterStatus === 'PENDING' ? 'rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white' : 'rounded-lg'}
            >
              <Clock className="h-4 w-4 mr-1" />
              Pending
            </Button>
            <Button
              variant={filterStatus === 'APPROVED' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('APPROVED')}
              className={filterStatus === 'APPROVED' ? 'rounded-lg bg-green-500 hover:bg-green-600 text-white' : 'rounded-lg'}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approved
            </Button>
            <Button
              variant={filterStatus === 'REJECTED' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('REJECTED')}
              className={filterStatus === 'REJECTED' ? 'rounded-lg bg-red-500 hover:bg-red-600 text-white' : 'rounded-lg'}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Rejected
            </Button>
            <Button
              variant="outline"
              onClick={fetchRequests}
              className="ml-auto rounded-lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Table Section */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-sky-500 mb-4" />
              <p className="text-gray-600">Loading profile update requests...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold">Request ID</TableHead>
                    <TableHead className="font-semibold">Recruiter</TableHead>
                    <TableHead className="font-semibold">Company</TableHead>
                    <TableHead className="font-semibold">Changes</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Building2 className="h-12 w-12 mb-3 text-gray-400" />
                          <p className="text-lg font-medium">No profile update requests found</p>
                          <p className="text-sm mt-1">There are no requests matching your current filter.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((request) => (
                      <TableRow key={request.requestId} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">#{request.requestId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{request.recruiterUsername}</p>
                            <p className="text-xs text-gray-500">{request.recruiterEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{request.currentCompanyName}</p>
                            {request.newCompanyName !== request.currentCompanyName && (
                              <p className="text-xs text-blue-600">→ {request.newCompanyName}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-1">
                            {request.newCompanyName !== request.currentCompanyName && (
                              <div className="text-blue-600">• Company Name</div>
                            )}
                            {request.newWebsite !== request.currentWebsite && (
                              <div className="text-blue-600">• Website</div>
                            )}
                            {request.newContactPerson !== request.currentContactPerson && (
                              <div className="text-blue-600">• Contact Person</div>
                            )}
                            {request.newPhoneNumber !== request.currentPhoneNumber && (
                              <div className="text-blue-600">• Phone Number</div>
                            )}
                            {request.newCompanyAddress !== request.currentCompanyAddress && (
                              <div className="text-blue-600">• Address</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadge(request.status).color} flex items-center w-fit`}>
                            {getStatusBadge(request.status).icon}
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{new Date(request.createdAt).toLocaleDateString('vi-VN')}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(request.createdAt).toLocaleTimeString('vi-VN')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(request)}
                              className="hover:bg-sky-50 hover:text-sky-600 transition-colors rounded-lg"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {request.status === 'PENDING' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApproveClick(request)}
                                  className="hover:bg-green-50 hover:text-green-600 transition-colors rounded-lg"
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRejectClick(request)}
                                  className="hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <div className="text-sm text-gray-600 text-center">
                Showing <span className="font-medium">{requests.length}</span> of <span className="font-medium">{totalElements}</span> requests
              </div>
            </div>
          </>
        )}

        {/* Request Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-5xl rounded-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Profile Update Request Details</DialogTitle>
              <DialogDescription className="text-gray-600">
                Review the changes requested by the recruiter
              </DialogDescription>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-6 mt-4">
                {/* Request Header */}
                <div className="flex items-start justify-between p-6 bg-sky-50 rounded-lg">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Request #{selectedRequest.requestId}</h3>
                    <p className="text-gray-600 mt-1">By {selectedRequest.recruiterUsername} ({selectedRequest.recruiterEmail})</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Submitted on {new Date(selectedRequest.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <Badge className={`${getStatusBadge(selectedRequest.status).color} px-3 py-1 flex items-center`}>
                    {getStatusBadge(selectedRequest.status).icon}
                    {selectedRequest.status}
                  </Badge>
                </div>

                {/* Changes Comparison */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Requested Changes</h4>
                  
                  {/* Company Name */}
                  {selectedRequest.newCompanyName !== selectedRequest.currentCompanyName && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Current Company Name</p>
                        <p className="text-gray-800 font-medium line-through">{selectedRequest.currentCompanyName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase tracking-wide mb-2">New Company Name</p>
                        <p className="text-green-700 font-medium">{selectedRequest.newCompanyName}</p>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {selectedRequest.newWebsite !== selectedRequest.currentWebsite && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Current Website</p>
                        <p className="text-gray-800 font-medium line-through break-all">{selectedRequest.currentWebsite}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase tracking-wide mb-2">New Website</p>
                        <a href={selectedRequest.newWebsite} target="_blank" rel="noopener noreferrer" className="text-green-700 font-medium hover:underline break-all">
                          {selectedRequest.newWebsite}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Logo URL */}
                  {selectedRequest.newLogoUrl !== selectedRequest.currentLogoUrl && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Current Logo</p>
                        {selectedRequest.currentLogoUrl && (
                          <img src={selectedRequest.currentLogoUrl} alt="Current logo" className="h-24 w-24 object-cover rounded-lg border-2 border-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase tracking-wide mb-2">New Logo</p>
                        {selectedRequest.newLogoUrl && (
                          <img src={selectedRequest.newLogoUrl} alt="New logo" className="h-24 w-24 object-cover rounded-lg border-2 border-green-300" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Person */}
                  {selectedRequest.newContactPerson !== selectedRequest.currentContactPerson && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Current Contact Person</p>
                        <p className="text-gray-800 font-medium line-through">{selectedRequest.currentContactPerson}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase tracking-wide mb-2">New Contact Person</p>
                        <p className="text-green-700 font-medium">{selectedRequest.newContactPerson}</p>
                      </div>
                    </div>
                  )}

                  {/* Phone Number */}
                  {selectedRequest.newPhoneNumber !== selectedRequest.currentPhoneNumber && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Current Phone Number</p>
                        <p className="text-gray-800 font-medium line-through">{selectedRequest.currentPhoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase tracking-wide mb-2">New Phone Number</p>
                        <p className="text-green-700 font-medium">{selectedRequest.newPhoneNumber}</p>
                      </div>
                    </div>
                  )}

                  {/* Company Address */}
                  {selectedRequest.newCompanyAddress !== selectedRequest.currentCompanyAddress && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Current Address</p>
                        <p className="text-gray-800 font-medium line-through">{selectedRequest.currentCompanyAddress}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase tracking-wide mb-2">New Address</p>
                        <p className="text-green-700 font-medium">{selectedRequest.newCompanyAddress}</p>
                      </div>
                    </div>
                  )}

                  {/* Company Email */}
                  {selectedRequest.newCompanyEmail !== selectedRequest.currentCompanyEmail && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Current Company Email</p>
                        <p className="text-gray-800 font-medium line-through">{selectedRequest.currentCompanyEmail || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase tracking-wide mb-2">New Company Email</p>
                        <p className="text-green-700 font-medium">{selectedRequest.newCompanyEmail || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin Notes & Rejection Reason */}
                {(selectedRequest.adminNote || selectedRequest.rejectionReason) && (
                  <div className="space-y-3">
                    {selectedRequest.adminNote && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-600 uppercase tracking-wide mb-2">Admin Note</p>
                        <p className="text-blue-800">{selectedRequest.adminNote}</p>
                      </div>
                    )}
                    {selectedRequest.rejectionReason && (
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-xs text-red-600 uppercase tracking-wide mb-2">Rejection Reason</p>
                        <p className="text-red-800">{selectedRequest.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons (if pending) */}
                {selectedRequest.status === 'PENDING' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      onClick={() => handleApproveClick(selectedRequest)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Request
                    </Button>
                    <Button 
                      onClick={() => handleRejectClick(selectedRequest)}
                      variant="destructive" 
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Request
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Approve Confirmation Dialog */}
        <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <DialogContent className="rounded-lg max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl text-green-600">
                <CheckCircle className="h-5 w-5" />
                Approve Profile Update
              </DialogTitle>
              <DialogDescription>
                This will approve the changes and update the recruiter&apos;s profile.
              </DialogDescription>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-4 py-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-medium text-gray-800">Request #{selectedRequest.requestId}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedRequest.recruiterUsername} - {selectedRequest.recruiterEmail}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.currentCompanyName}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Admin Note (Optional)
                  </label>
                  <Textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Add a note for this approval (optional)..."
                    className="min-h-[100px] resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    This note will be saved with the approval record
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsApproveDialogOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Approval
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Confirmation Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="rounded-lg max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl text-red-600">
                <XCircle className="h-5 w-5" />
                Reject Profile Update
              </DialogTitle>
              <DialogDescription>
                This will reject the changes and notify the recruiter with your reason.
              </DialogDescription>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-4 py-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-medium text-gray-800">Request #{selectedRequest.requestId}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedRequest.recruiterUsername} - {selectedRequest.recruiterEmail}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.currentCompanyName}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a clear reason for rejection..."
                    className="min-h-[100px] resize-none border-red-200 focus:border-red-400"
                    required
                  />
                  <p className="text-xs text-red-600">
                    This reason will be sent to the recruiter
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
                variant="destructive"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Confirm Rejection
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
