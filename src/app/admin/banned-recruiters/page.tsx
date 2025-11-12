'use client';

import { searchRecruiters, banRecruiter, unbanRecruiter } from '@/lib/recruiter-api';
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
  Ban, 
  Search, 
  RefreshCw, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Shield,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function BannedRecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBannedRecruiters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await searchRecruiters({
        keyword: searchQuery || undefined,
        status: 'BANNED',
        page: 0,
        size: 1000,
        sortBy: 'id',
        sortDir: 'desc',
      });
      
      if (response.code === 200 && response.result?.content) {
        setRecruiters(response.result.content);
        console.log('✅ [Banned Recruiters] Fetched:', response.result.content.length);
      } else {
        setError('Failed to fetch banned recruiters');
      }
    } catch (error: any) {
      console.error('Error fetching banned recruiters:', error);
      setError(error.message || 'Error loading banned recruiters. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBannedRecruiters();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        fetchBannedRecruiters();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleViewDetails = (recruiter: Recruiter) => {
    setSelectedRecruiter(recruiter);
    setIsDialogOpen(true);
  };

  const handleBanClick = (recruiter: Recruiter) => {
    setSelectedRecruiter(recruiter);
    setBanReason('');
    setIsBanDialogOpen(true);
  };

  const handleUnbanClick = (recruiter: Recruiter) => {
    setSelectedRecruiter(recruiter);
    setIsUnbanDialogOpen(true);
  };

  const handleBanConfirm = async () => {
    if (!selectedRecruiter || !banReason.trim()) {
      alert('Please provide a reason for banning');
      return;
    }

    try {
      setActionLoading(true);
      await banRecruiter(selectedRecruiter.accountId, banReason);
      alert('Recruiter banned successfully');
      setIsBanDialogOpen(false);
      fetchBannedRecruiters();
    } catch (error: any) {
      alert(error.message || 'Failed to ban recruiter');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnbanConfirm = async () => {
    if (!selectedRecruiter) return;

    try {
      setActionLoading(true);
      const response = await unbanRecruiter(selectedRecruiter.accountId);
      console.log('✅ [Unban] Response:', response);
      
      // Show success message with the restored status if available
      const restoredStatus = response?.result?.accountStatus || 'their previous status';
      alert(`Recruiter unbanned successfully. Status restored to: ${restoredStatus}`);
      
      setIsUnbanDialogOpen(false);
      fetchBannedRecruiters();
    } catch (error: any) {
      alert(error.message || 'Failed to unban recruiter');
    } finally {
      setActionLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Banned Recruiters</h1>
            <div className="text-center p-12 bg-red-50 rounded-lg border border-red-200">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <p className="text-red-600 mb-6 text-lg">{error}</p>
              <Button 
                onClick={fetchBannedRecruiters}
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
              <div className="p-3 bg-red-500 rounded-lg shadow-sm">
                <Ban className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Banned Recruiters</h1>
                <p className="text-sm text-gray-600 mt-1">Manage banned recruiter accounts</p>
              </div>
            </div>
            
            {!isLoading && (
              <div className="text-center px-6 py-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Total Banned</p>
                <p className="text-3xl font-semibold text-red-600">{recruiters.length}</p>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company, username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-20">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mb-4"></div>
              <p className="text-gray-500">Loading banned recruiters...</p>
            </div>
          </div>
        ) : recruiters.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-20">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🎉</div>
              <p className="text-gray-600 text-lg">
                {searchQuery 
                  ? 'No banned recruiters found matching your search' 
                  : 'No banned recruiters at this time'}
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
                  {recruiters.map((recruiter) => (
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
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200 opacity-60"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white font-semibold shadow-sm opacity-60">
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
                        <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1 font-medium flex items-center w-fit">
                          <Ban className="h-3 w-3 mr-1" />
                          BANNED
                        </Badge>
                      </TableCell>
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
                            onClick={() => handleUnbanClick(recruiter)}
                            className="hover:bg-green-50 hover:text-green-600 transition-colors rounded-lg"
                            title="Unban recruiter"
                          >
                            <ShieldCheck className="h-4 w-4" />
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
              <div className="text-sm text-gray-600 text-center">
                Showing <span className="font-medium">{recruiters.length}</span> banned recruiters
              </div>
            </div>
          </>
        )}

        {/* Recruiter Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl rounded-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Banned Recruiter Details</DialogTitle>
              <DialogDescription className="text-gray-600">
                Complete information about the banned recruiter
              </DialogDescription>
            </DialogHeader>
            
            {selectedRecruiter && (
              <div className="space-y-6 mt-4">
                {/* Company Header */}
                <div className="flex items-start gap-6 p-6 bg-red-50 rounded-lg border border-red-200">
                  {selectedRecruiter.logoUrl ? (
                    <img 
                      src={selectedRecruiter.logoUrl} 
                      alt={selectedRecruiter.companyName}
                      className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-sm opacity-60"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-red-500 flex items-center justify-center text-white shadow-sm opacity-60">
                      <Building2 className="h-12 w-12" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-800">{selectedRecruiter.companyName}</h3>
                    <p className="text-gray-600 mt-1">{selectedRecruiter.contactPerson}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1 flex items-center">
                        <Ban className="h-3 w-3 mr-1" />
                        BANNED
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
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Phone Number</p>
                    </div>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.phoneNumber}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Website</p>
                    </div>
                    {selectedRecruiter.website ? (
                      <a 
                        href={selectedRecruiter.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {selectedRecruiter.website}
                      </a>
                    ) : (
                      <p className="text-gray-400">Not provided</p>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                    </div>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.companyAddress}</p>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Company Email</p>
                    <p className="text-gray-800 font-medium">{selectedRecruiter.companyEmail || 'N/A'}</p>
                  </div>

                  {selectedRecruiter.about && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">About Company</p>
                      <p className="text-gray-800 leading-relaxed">{selectedRecruiter.about}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Unban Confirmation Dialog */}
        <Dialog open={isUnbanDialogOpen} onOpenChange={setIsUnbanDialogOpen}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                Unban Recruiter
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to unban this recruiter?
              </DialogDescription>
            </DialogHeader>
            
            {selectedRecruiter && (
              <div className="space-y-4 py-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="font-medium text-gray-800">{selectedRecruiter.companyName}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedRecruiter.email}</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">After unbanning:</p>
                      <p>The recruiter's account will be restored to their previous status before being banned. They will need to meet all requirements for that status to access full features.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUnbanDialogOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUnbanConfirm}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {actionLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Unbanning...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Confirm Unban
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
