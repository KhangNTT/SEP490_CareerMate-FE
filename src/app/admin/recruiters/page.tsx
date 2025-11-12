'use client';

import { searchRecruiters, SearchRecruitersParams, banRecruiter } from '@/lib/recruiter-api';
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
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Eye, 
  Briefcase, 
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
  Clock,
  Ban,
  AlertTriangle
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function RecruiterManagementPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'APPROVED' | 'ACTIVE' | 'REJECTED' | 'BANNED'>('all');
  const [activeTab, setActiveTab] = useState<'info' | 'profile'>('info');

  const fetchRecruiters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params: SearchRecruitersParams = {
        keyword: searchQuery || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        page: 0,
        size: 1000, // Get all recruiters
        sortBy: 'id',
        sortDir: 'desc',
      };
      
      console.log('🔍 [Recruiter Management] Fetching with params:', params);
      const response = await searchRecruiters(params);
      
      if (response.code === 200 && response.result?.content) {
        setRecruiters(response.result.content);
        console.log('✅ [Recruiter Management] Fetched recruiters:', response.result.content.length, 'of', response.result.totalElements);
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
  }, [filterStatus]); // Re-fetch when filter changes

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        fetchRecruiters();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleViewDetails = (recruiter: Recruiter) => {
    setSelectedRecruiter(recruiter);
    setActiveTab('info'); // Reset to info tab when opening dialog
    setIsDialogOpen(true);
  };

  const handleBanClick = (recruiter: Recruiter) => {
    setSelectedRecruiter(recruiter);
    setBanReason('');
    setIsBanDialogOpen(true);
  };

  const handleBanConfirm = async () => {
    if (!selectedRecruiter || !banReason.trim()) {
      alert('Please provide a reason for banning');
      return;
    }

    try {
      setActionLoading(true);
      const response = await banRecruiter(selectedRecruiter.accountId, banReason);
      console.log('✅ [Ban] Response:', response);
      console.log(`📝 [Ban] Current status "${selectedRecruiter.accountStatus}" will be restored after unban`);
      
      alert('Recruiter banned successfully. Their current status will be restored if unbanned later.');
      setIsBanDialogOpen(false);
      fetchRecruiters();
    } catch (error: any) {
      alert(error.message || 'Failed to ban recruiter');
    } finally {
      setActionLoading(false);
    }
  };

  const getVerificationBadge = (status: string) => {
    const normalizedStatus = status?.toUpperCase() || '';
    switch (normalizedStatus) {
      case 'PENDING':
      case 'PENDING_APPROVAL':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <Clock className="h-3 w-3 mr-1" />
        };
      case 'APPROVED':
      case 'ACTIVE':
      case 'VERIFIED':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: <CheckCircle className="h-3 w-3 mr-1" />
        };
      case 'BANNED':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: <Ban className="h-3 w-3 mr-1" />
        };
      case 'REJECTED':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: <XCircle className="h-3 w-3 mr-1" />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: <Clock className="h-3 w-3 mr-1" />
        };
    }
  };

  // No need for client-side filtering since API handles it
  const filteredRecruiters = recruiters;

  const pendingCount = recruiters.filter(r => 
    r.accountStatus?.toUpperCase() === 'PENDING'
  ).length;

  const approvedCount = recruiters.filter(r => 
    r.accountStatus?.toUpperCase() === 'APPROVED' || 
    r.accountStatus?.toUpperCase() === 'ACTIVE'
  ).length;

  const rejectedCount = recruiters.filter(r => 
    r.accountStatus?.toUpperCase() === 'REJECTED'
  ).length;

  const bannedCount = recruiters.filter(r => 
    r.accountStatus?.toUpperCase() === 'BANNED'
  ).length;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Recruiter Management</h1>
            <div className="text-center p-12 bg-red-50 rounded-lg border border-red-200">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <p className="text-red-600 mb-6 text-lg">{error}</p>
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-500 rounded-lg shadow-sm">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recruiter Management</h1>
                <p className="text-sm text-gray-600 mt-1">Manage recruiter accounts and approvals</p>
              </div>
            </div>
            
            {!isLoading && (
              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Pending</p>
                  <p className="text-xl font-semibold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="text-center px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Active</p>
                  <p className="text-xl font-semibold text-green-600">{approvedCount}</p>
                </div>
                <div className="text-center px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Rejected</p>
                  <p className="text-xl font-semibold text-red-600">{rejectedCount}</p>
                </div>
                <div className="text-center px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Banned</p>
                  <p className="text-xl font-semibold text-gray-600">{bannedCount}</p>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar and Filter */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company, username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className="rounded-lg"
              >
                All
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
                variant={filterStatus === 'ACTIVE' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('ACTIVE')}
                className={filterStatus === 'ACTIVE' ? 'rounded-lg bg-green-500 hover:bg-green-600 text-white' : 'rounded-lg'}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Active
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
                variant={filterStatus === 'BANNED' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('BANNED')}
                className={filterStatus === 'BANNED' ? 'rounded-lg bg-gray-700 hover:bg-gray-800 text-white' : 'rounded-lg'}
              >
                <Ban className="h-4 w-4 mr-1" />
                Banned
              </Button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-20">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent mb-4"></div>
              <p className="text-gray-500">Loading recruiters...</p>
            </div>
          </div>
        ) : filteredRecruiters.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-20">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">💼</div>
              <p className="text-gray-600 text-lg">
                {searchQuery || filterStatus !== 'all' 
                  ? 'No recruiters found matching your criteria' 
                  : 'No recruiters found'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-4">Company</TableHead>
                    <TableHead className="font-semibold text-gray-700">Contact Person</TableHead>
                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                    <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecruiters.map((recruiter) => {
                    const verificationBadge = getVerificationBadge(recruiter.accountStatus);
                    return (
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
                              <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center text-white font-semibold shadow-sm">
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
                        <TableCell>
                          <Badge className={`${verificationBadge.color} px-3 py-1 font-medium flex items-center w-fit`}>
                            {verificationBadge.icon}
                            {recruiter.accountStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(recruiter)}
                              className="hover:bg-purple-50 hover:text-purple-600 transition-colors rounded-lg"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {recruiter.accountStatus?.toUpperCase() !== 'BANNED' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBanClick(recruiter)}
                                className="hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
                                title="Ban recruiter"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <div className="text-sm text-gray-600 text-center">
                Showing <span className="font-medium">{filteredRecruiters.length}</span> of <span className="font-medium">{recruiters.length}</span> recruiters
              </div>
            </div>
          </>
        )}

        {/* Recruiter Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl rounded-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Recruiter Details</DialogTitle>
              <DialogDescription className="text-gray-600">
                Complete information about the recruiter and company
              </DialogDescription>
            </DialogHeader>
            
            {selectedRecruiter && (
              <div className="space-y-6 mt-4">
                {/* Tabs Navigation */}
                <div className="flex gap-2 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === 'info'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    Account Information
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === 'profile'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    Organization Profile
                  </button>
                </div>

                {/* Tab Content: Account Information */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    {/* Company Header */}
                    <div className="flex items-start gap-6 p-6 bg-sky-50 rounded-lg">
                      {selectedRecruiter.logoUrl ? (
                        <img 
                          src={selectedRecruiter.logoUrl} 
                          alt={selectedRecruiter.companyName}
                          className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-sky-500 flex items-center justify-center text-white shadow-sm">
                          <Building2 className="h-12 w-12" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-gray-800">{selectedRecruiter.companyName}</h3>
                        <p className="text-gray-600 mt-1">{selectedRecruiter.contactPerson}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <Badge className={`${getVerificationBadge(selectedRecruiter.accountStatus).color} px-3 py-1 flex items-center`}>
                            {getVerificationBadge(selectedRecruiter.accountStatus).icon}
                            {selectedRecruiter.accountStatus}
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

                {/* Account Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Account Status</p>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.accountStatus}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Account Role</p>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.accountRole}</p>
                  </div>
                </div>
                  </div>
                )}

                {/* Tab Content: Organization Profile */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="rounded-lg border bg-white p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Profile Information</h3>
                      
                      {/* Company Logo */}
                      <div className="mb-6 flex justify-center">
                        <div className="relative h-32 w-32 overflow-hidden rounded-lg border-2 border-gray-200">
                          {selectedRecruiter.logoUrl ? (
                            <img
                              src={selectedRecruiter.logoUrl}
                              alt={selectedRecruiter.companyName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-blue-100">
                              <Building2 className="h-16 w-16 text-sky-600" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Profile Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Company Name</p>
                          <p className="text-gray-800 font-medium">{selectedRecruiter.companyName}</p>
                        </div>

                        {selectedRecruiter.website && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Website</p>
                            <a
                              href={selectedRecruiter.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-600 hover:underline font-medium break-all"
                            >
                              {selectedRecruiter.website}
                            </a>
                          </div>
                        )}

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Contact Person</p>
                          <p className="text-gray-800 font-medium">{selectedRecruiter.contactPerson}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Phone Number</p>
                          <p className="text-gray-800 font-medium">{selectedRecruiter.phoneNumber}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Company Address</p>
                          <p className="text-gray-800 font-medium">{selectedRecruiter.companyAddress}</p>
                        </div>

                        {selectedRecruiter.about && (
                          <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                            <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Company Introduction</p>
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedRecruiter.about}</p>
                          </div>
                        )}

                        <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Company Email</p>
                          <p className="text-gray-800 font-medium">{selectedRecruiter.companyEmail || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Ban Confirmation Dialog */}
        <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
          <DialogContent className="rounded-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl text-red-600">
                <Ban className="h-5 w-5" />
                Ban Recruiter
              </DialogTitle>
              <DialogDescription>
                This action will ban the recruiter and prevent them from accessing the system.
              </DialogDescription>
            </DialogHeader>
            
            {selectedRecruiter && (
              <div className="space-y-4 py-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-medium text-gray-800">{selectedRecruiter.companyName}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedRecruiter.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className="bg-sky-100 text-sky-700 border-sky-200 text-xs">
                      Current Status: {selectedRecruiter.accountStatus}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Reason for Banning <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Please provide a detailed reason for banning this recruiter..."
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Warning:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>The recruiter will be immediately banned from accessing their account</li>
                        <li>Current status "<span className="font-semibold">{selectedRecruiter.accountStatus}</span>" will be saved and restored after unban</li>
                        <li>All their posted jobs may be hidden until unbanned</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsBanDialogOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBanConfirm}
                disabled={actionLoading || !banReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {actionLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Banning...
                  </>
                ) : (
                  <>
                    <Ban className="mr-2 h-4 w-4" />
                    Confirm Ban
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
