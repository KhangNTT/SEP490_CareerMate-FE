"use client";

import { Calendar, CreditCard } from 'lucide-react';
import { UserSubscription } from '@/types/billing';
import { PACKAGES, formatCurrency } from '@/data/packages';

interface CurrentSubscriptionProps {
  subscription: UserSubscription | null;
}

export function CurrentSubscription({ subscription }: CurrentSubscriptionProps) {
  if (!subscription) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Service Plan</h2>
        <p className="text-gray-600">You don't have an active plan. Choose a plan below to get started.</p>
      </div>
    );
  }

  const currentPackage = PACKAGES.find(pkg => pkg.package_id === subscription.package_id);
  
  // Status mapping
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          text: 'Active', 
          className: 'bg-green-100 text-green-800 border-[#6697d8]' 
        };
      case 'expired':
        return { 
          text: 'Expired', 
          className: 'bg-red-100 text-red-800 border-red-200' 
        };
      case 'cancelled':
        return { 
          text: 'Cancelled', 
          className: 'bg-gray-100 text-gray-800 border-gray-200' 
        };
      default:
        return { 
          text: 'Unknown', 
          className: 'bg-gray-100 text-gray-800 border-gray-200' 
        };
    }
  };

  const statusInfo = getStatusInfo(subscription.status);
  
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-100">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Current Service Plan</h2>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.className}`}>
          {statusInfo.text}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Info */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {currentPackage?.name || 'Unknown Plan'}
          </h3>
          <p className="text-3xl font-bold text-blue-600 mb-4">
            {currentPackage ? formatCurrency(currentPackage.price, currentPackage.currency) : 'N/A'}
            <span className="text-lg font-normal text-gray-600">/month</span>
          </p>
          <p className="text-gray-600">
            {subscription.status === 'expired' 
              ? 'Your service plan has expired. Please renew to continue using features.'
              : 'Your service plan is active and you can use all features.'
            }
          </p>
          
          {subscription.status === 'expired' && (
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Renew Now
            </button>
          )}
        </div>

        {/* Plan Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>Start: {formatDate(subscription.start_date)}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>End: {formatDate(subscription.end_date)}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <CreditCard className="h-5 w-5" />
            <span>Auto-renewal: {subscription.auto_renew ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
