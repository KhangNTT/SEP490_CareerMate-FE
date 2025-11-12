"use client";

import { useRecruiterProfile } from '@/modules/recruiter/hooks/useRecruiterProfile';
import { User, Mail, Building2, Globe, Phone, MapPin, Star, AlertCircle, RefreshCw } from 'lucide-react';
import Image from 'next/image';

export default function RecruiterProfileTestPage() {
  const { profile, loading, error, refetch } = useRecruiterProfile();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Recruiter Profile API Test</h1>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center rounded-lg border bg-white p-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
            <p className="text-sm text-gray-500">Loading profile...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error Loading Profile</h3>
              <p className="mt-1 text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && profile && (
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-start gap-6">
              {/* Company Logo */}
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 border-gray-200">
                {profile.logoUrl ? (
                  <Image
                    src={profile.logoUrl}
                    alt={profile.companyName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-blue-100">
                    <Building2 className="h-10 w-10 text-sky-600" />
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{profile.companyName}</h2>
                    <p className="mt-1 text-sm text-gray-600">@{profile.username}</p>
                  </div>
                  
                  {/* Verification Status Badge */}
                  <div className={`rounded-full px-3 py-1 text-xs font-medium ${
                    profile.verificationStatus === 'APPROVED' 
                      ? 'bg-green-100 text-green-800'
                      : profile.verificationStatus === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profile.verificationStatus}
                  </div>
                </div>

                {/* Rating */}
                {profile.rating > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{profile.rating.toFixed(1)}</span>
                  </div>
                )}

                {/* About */}
                {profile.about && (
                  <p className="mt-3 text-sm text-gray-600">{profile.about}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Contact Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{profile.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Contact Person</p>
                  <p className="text-sm font-medium text-gray-900">{profile.contactPerson}</p>
                </div>
              </div>

              {profile.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Website</p>
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-sky-600 hover:text-sky-700"
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 sm:col-span-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900">{profile.companyAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Update Request */}
          {profile.hasPendingUpdate && profile.pendingUpdateRequest && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-amber-900">
                <AlertCircle className="h-5 w-5" />
                Pending Update Request
              </h3>
              <p className="text-sm text-amber-800">
                You have a pending profile update request under review.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p><span className="font-medium">Status:</span> {profile.pendingUpdateRequest.status}</p>
                <p><span className="font-medium">Submitted:</span> {new Date(profile.pendingUpdateRequest.createdAt).toLocaleDateString()}</p>
                {profile.pendingUpdateRequest.reviewedAt && (
                  <p><span className="font-medium">Reviewed:</span> {new Date(profile.pendingUpdateRequest.reviewedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {profile.rejectionReason && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <h3 className="mb-2 text-lg font-semibold text-red-900">Rejection Reason</h3>
              <p className="text-sm text-red-800">{profile.rejectionReason}</p>
            </div>
          )}

          {/* Raw JSON */}
          <details className="rounded-lg border bg-gray-50 p-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              Raw API Response
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-gray-900 p-4 text-xs text-green-400">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
