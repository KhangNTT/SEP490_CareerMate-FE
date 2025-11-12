'use client';

import { getRecruiters, approveRecruiter, rejectRecruiter } from '@/lib/recruiter-api';
import { Recruiter } from '@/types/recruiter';
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
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { 
  Eye, 
  Clock, 
  Search, 
  RefreshCw, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function PendingApprovalPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRejectFormOpen, setIsRejectFormOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedCommonReason, setSelectedCommonReason] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchRecruiters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRecruiters();
      if (response.code === 200 || response.result) {
        // The /pending endpoint already returns only pending recruiters
        setRecruiters(response.result);
      } else {
        setError('Failed to fetch recruiters');
      }
    } catch (error: any) {
      console.error('Error fetching recruiters:', error);
      setError(error.message || 'Error loading recruiters. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleViewDetails = (recruiter: Recruiter) => {
    setSelectedRecruiter(recruiter);
    setIsDialogOpen(true);
  };

  const handleApproveClick = (recruiter: Recruiter) => {
    // Open the details modal for review before approving
    setSelectedRecruiter(recruiter);
    setIsDialogOpen(true);
  };

  const handleRejectClick = (recruiter: Recruiter) => {
    // Open the details modal for review before rejecting
    setSelectedRecruiter(recruiter);
    setIsDialogOpen(true);
  };

  const handleApprove = async (recruiterId: number) => {
    if (!confirm('Are you sure you want to approve this recruiter?')) return;
    
    setIsProcessing(true);
    try {
      await approveRecruiter(recruiterId);
      await fetchRecruiters(); // Refresh the list
      setIsDialogOpen(false);
      alert('Recruiter approved successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to approve recruiter');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (recruiterId: number) => {
    // Open reject form modal instead of prompt
    setSelectedRecruiter(recruiters.find(r => r.recruiterId === recruiterId) || null);
    setRejectReason('');
    setSelectedCommonReason(null);
    setIsRejectFormOpen(true);
  };

  const submitReject = async () => {
    if (!selectedRecruiter) return;
    const reasonToSend = (selectedCommonReason && selectedCommonReason !== 'Other') ? selectedCommonReason : rejectReason;
    if (!reasonToSend || reasonToSend.trim() === '') {
      alert('Please provide a rejection reason.');
      return;
    }

    setIsProcessing(true);
    try {
      await rejectRecruiter(selectedRecruiter.recruiterId, reasonToSend);
      await fetchRecruiters(); // Refresh list
      setIsRejectFormOpen(false);
      setIsDialogOpen(false);
      alert('Recruiter rejected successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to reject recruiter');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredRecruiters = recruiters.filter(recruiter => 
    recruiter.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruiter.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruiter.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Pending Approvals</h1>
            <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
              <div className="text-red-500 text-4xl mb-3">⚠️</div>
              <p className="text-red-600 mb-4 text-base">{error}</p>
              <Button 
                onClick={fetchRecruiters}
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
              <p className="text-sm text-gray-600 mt-1">Review and approve recruiter registrations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isLoading && (
              <div className="text-center px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Pending</p>
                <p className="text-lg font-semibold text-sky-600">{recruiters.length}</p>
              </div>
            )}

            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company, username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </header>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-sky-500 border-t-transparent mb-4"></div>
              <p className="text-gray-500">Loading pending approvals...</p>
            </div>
          </div>
        ) : filteredRecruiters.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="text-gray-400 text-5xl mb-3">✅</div>
              <p className="text-gray-600 text-base">
                {searchQuery 
                  ? 'No pending approvals found matching your search' 
                  : 'No pending approvals at the moment'}
              </p>
              <p className="text-gray-500 text-sm mt-2">All caught up! New recruiter registrations will appear here.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-3">Company</TableHead>
                    <TableHead className="font-semibold text-gray-700">Contact Person</TableHead>
                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                    <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecruiters.map((recruiter) => (
                    <TableRow 
                      key={recruiter.recruiterId}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <TableCell className="font-medium text-gray-800 py-4">
                        <div className="flex items-center gap-3">
                          {recruiter.logoUrl ? (
                            <img 
                              src={recruiter.logoUrl} 
                              alt={recruiter.companyName}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center text-white font-semibold">
                              <Building2 className="h-5 w-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">{recruiter.companyName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{recruiter.contactPerson}</TableCell>
                      <TableCell className="text-gray-600">{recruiter.email}</TableCell>
                      <TableCell className="text-gray-600">{recruiter.phoneNumber}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(recruiter)}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproveClick(recruiter)}
                            className="hover:bg-green-50 hover:text-green-600 transition-colors rounded-lg"
                            title="Approve"
                            disabled={isProcessing}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRejectClick(recruiter)}
                            className="hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
                            title="Reject"
                            disabled={isProcessing}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4 text-sky-500" />
                <span>
                  Showing <span className="font-medium">{filteredRecruiters.length}</span> pending approval{filteredRecruiters.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </>
        )}

                {/* Recruiter Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl rounded-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Review Recruiter Application</DialogTitle>
              <DialogDescription className="text-gray-600">
                Review the complete information before approving or rejecting
              </DialogDescription>
            </DialogHeader>
            
            {selectedRecruiter && (
              <div className="space-y-6 mt-4">
                {/* Company Header */}
                <div className="flex items-start gap-6 p-4 bg-white rounded-lg border border-gray-200">
                  {selectedRecruiter.logoUrl ? (
                    <img 
                      src={selectedRecruiter.logoUrl} 
                      alt={selectedRecruiter.companyName}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                      <Building2 className="h-10 w-10" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedRecruiter.companyName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedRecruiter.contactPerson}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <Badge className="bg-sky-100 text-sky-700 border-sky-200 px-2 py-1 text-sm flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending Approval
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Email</p>
                    </div>
                    <p className="text-gray-800 font-medium break-all">{selectedRecruiter.email}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Phone Number</p>
                    </div>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.phoneNumber}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Website</p>
                    </div>
                    {selectedRecruiter.website ? (
                      <a 
                        href={selectedRecruiter.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sky-600 hover:underline font-medium"
                      >
                        {selectedRecruiter.website}
                      </a>
                    ) : (
                      <p className="text-gray-400">Not provided</p>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Address</p>
                    </div>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.companyAddress}</p>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Contact Person</p>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.contactPerson}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Company Email</p>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.companyEmail || 'N/A'}</p>
                  </div>

                  {selectedRecruiter.about && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">About Company</p>
                      <p className="text-gray-800 leading-relaxed">{selectedRecruiter.about}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleApprove(selectedRecruiter.recruiterId)}
                    disabled={isProcessing}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg py-6"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Approve Recruiter
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedRecruiter.recruiterId)}
                    disabled={isProcessing}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 rounded-lg py-6"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Reject Application
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Reason Dialog */}
        <Dialog open={isRejectFormOpen} onOpenChange={setIsRejectFormOpen}>
          <DialogContent className="max-w-2xl rounded-lg">
            <DialogHeader>
              <DialogTitle>Reject Recruiter Application</DialogTitle>
              <DialogDescription>Please select or provide a reason for rejecting this application.</DialogDescription>
            </DialogHeader>

            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Common reasons</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Incomplete company information',
                    'Invalid company information',
                    'Suspicious or fraudulent account',
                    'Does not meet platform requirements',
                    'Other'
                  ].map((r) => (
                    <button
                      key={r}
                      onClick={() => { setSelectedCommonReason(r); if (r !== 'Other') setRejectReason(r); }}
                      className={`px-3 py-1 rounded-lg border ${selectedCommonReason === r ? 'bg-red-50 border-red-300 text-red-700' : 'bg-white border-gray-200 text-gray-700'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Detailed reason</p>
                <Textarea value={rejectReason} onChange={(e) => { setRejectReason(e.target.value); setSelectedCommonReason('Other'); }} placeholder="Provide details (required if 'Other')" />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsRejectFormOpen(false)}>Cancel</Button>
                <Button onClick={submitReject} disabled={isProcessing} className="bg-red-500 hover:bg-red-600 text-white">Submit Rejection</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
