"use client";

import { useState, useEffect } from 'react';
import { getMyUpdateRequestsHistory, ProfileUpdateRequest } from '@/lib/recruiter-api';
import { Badge } from '@/components/ui/badge';
import { AccountTabs } from '@/modules/recruiter';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronDown,
  Loader2,
  FileText,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function UpdateRequestHistoryPage() {
  const [requests, setRequests] = useState<ProfileUpdateRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await getMyUpdateRequestsHistory();
      setRequests(response.result);
    } catch (error: any) {
      console.error('Error fetching update requests:', error);
      toast.error(error.message || 'Failed to load update request history');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-3 w-3" />
      },
      APPROVED: { 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-3 w-3" />
      },
      REJECTED: { 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-3 w-3" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    
    return (
      <Badge className={`${config.color} border flex items-center gap-1 px-2 py-1`}>
        {config.icon}
        <span className="text-xs font-semibold">{status}</span>
      </Badge>
    );
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const hasChanges = (request: ProfileUpdateRequest) => {
    return (
      request.newCompanyName !== request.currentCompanyName ||
      request.newWebsite !== request.currentWebsite ||
      request.newLogoUrl !== request.currentLogoUrl ||
      request.newCompanyEmail !== request.currentCompanyEmail ||
      request.newContactPerson !== request.currentContactPerson ||
      request.newPhoneNumber !== request.currentPhoneNumber ||
      request.newCompanyAddress !== request.currentCompanyAddress
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-gray-600">Manage your profile update request history</p>
        </div>
        
        <AccountTabs />
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-sky-600" />
            <p className="mt-4 text-sm text-gray-500">Loading update request history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-2 text-gray-600">View your organization profile update request history</p>
      </div>

      <AccountTabs />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'APPROVED').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {requests.filter(r => r.status === 'REJECTED').length}
                </p>
              </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No Update Requests</h3>
          <p className="mt-2 text-sm text-gray-500">You haven't submitted any organization profile update requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.requestId}
              className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Request Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Request #{request.requestId}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted: {new Date(request.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                        {request.reviewedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Reviewed: {new Date(request.reviewedAt).toLocaleString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {request.status === 'REJECTED' && request.rejectionReason && (
                    <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-4">
                      <h4 className="text-sm font-semibold text-red-900 mb-1 flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Rejection Reason
                      </h4>
                      <p className="text-sm text-red-800">{request.rejectionReason}</p>
                    </div>
                  )}

                  {/* Admin Note */}
                  {request.status === 'APPROVED' && request.adminNote && (
                    <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-4">
                      <h4 className="text-sm font-semibold text-green-900 mb-1 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Admin Note
                      </h4>
                      <p className="text-sm text-green-800">{request.adminNote}</p>
                    </div>
                  )}

                  {/* Changes Summary */}
                  <div>
                    <button
                      onClick={() => setExpandedRequest(expandedRequest === request.requestId ? null : request.requestId)}
                      className="flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedRequest === request.requestId ? 'rotate-180' : ''}`} />
                      {expandedRequest === request.requestId ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRequest === request.requestId && (
                  <div className="border-t bg-gray-50 p-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Requested Changes</h4>
                    <div className="space-y-4">
                      {/* Company Name */}
                      {request.newCompanyName !== request.currentCompanyName && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company Name (Current)</p>
                            <p className="text-sm text-gray-600 line-through">{request.currentCompanyName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company Name (New)</p>
                            <p className="text-sm text-sky-700 font-medium">{request.newCompanyName}</p>
                          </div>
                        </div>
                      )}

                      {/* Logo URL */}
                      {request.newLogoUrl !== request.currentLogoUrl && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Logo (Current)</p>
                            <div className="relative h-20 w-20 rounded-lg border overflow-hidden">
                              {request.currentLogoUrl && (
                                <Image
                                  src={request.currentLogoUrl}
                                  alt="Current Logo"
                                  fill
                                  className="object-cover opacity-50"
                                />
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1 break-all">{truncateText(request.currentLogoUrl, 40)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Logo (New)</p>
                            <div className="relative h-20 w-20 rounded-lg border overflow-hidden">
                              {request.newLogoUrl && (
                                <Image
                                  src={request.newLogoUrl}
                                  alt="New Logo"
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <p className="text-xs text-sky-600 mt-1 break-all">{truncateText(request.newLogoUrl, 40)}</p>
                          </div>
                        </div>
                      )}

                      {/* Website */}
                      {request.newWebsite !== request.currentWebsite && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Website (Current)</p>
                            <p className="text-sm text-gray-600 line-through break-all">{request.currentWebsite || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Website (New)</p>
                            <p className="text-sm text-sky-700 font-medium break-all">{request.newWebsite}</p>
                          </div>
                        </div>
                      )}

                      {/* Company Email */}
                      {request.newCompanyEmail !== request.currentCompanyEmail && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company Email (Current)</p>
                            <p className="text-sm text-gray-600 line-through">{request.currentCompanyEmail || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company Email (New)</p>
                            <p className="text-sm text-sky-700 font-medium">{request.newCompanyEmail}</p>
                          </div>
                        </div>
                      )}

                      {/* Contact Person */}
                      {request.newContactPerson !== request.currentContactPerson && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contact Person (Current)</p>
                            <p className="text-sm text-gray-600 line-through">{request.currentContactPerson}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contact Person (New)</p>
                            <p className="text-sm text-sky-700 font-medium">{request.newContactPerson}</p>
                          </div>
                        </div>
                      )}

                      {/* Phone Number */}
                      {request.newPhoneNumber !== request.currentPhoneNumber && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone Number (Current)</p>
                            <p className="text-sm text-gray-600 line-through">{request.currentPhoneNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone Number (New)</p>
                            <p className="text-sm text-sky-700 font-medium">{request.newPhoneNumber}</p>
                          </div>
                        </div>
                      )}

                      {/* Company Address */}
                      {request.newCompanyAddress !== request.currentCompanyAddress && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company Address (Current)</p>
                            <p className="text-sm text-gray-600 line-through">{request.currentCompanyAddress}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company Address (New)</p>
                            <p className="text-sm text-sky-700 font-medium">{request.newCompanyAddress}</p>
                          </div>
                        </div>
                      )}

                      {/* No Changes */}
                      {!hasChanges(request) && (
                        <p className="text-sm text-gray-500 italic">No changes detected in this request.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
