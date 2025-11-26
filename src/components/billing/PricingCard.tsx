"use client";

import { Check, Star } from 'lucide-react';
import { Package } from '@/types/billing';
import { formatCurrency } from '@/data/packages';

interface PricingCardProps {
  package: Package;
  onSelectPackage: (packageId: string) => void;
  currentPackageId?: string;
}

export function PricingCard({ package: pkg, onSelectPackage, currentPackageId }: PricingCardProps) {
  const isCurrentPackage = currentPackageId === pkg.package_id;
  
  return (
    // Added 'flex flex-col h-full' to make the card a column-based flex container 
    // that fills the height provided by the grid cell.
    <div className={`relative rounded-lg border-2 p-6 flex flex-col h-full ${
      pkg.popular 
        ? 'border-sky-500 bg-sky-50' 
        : isCurrentPackage
        ? 'border-green-500 bg-green-50'
        : 'border-gray-200 bg-white'
    }`}>
      {/* Popular badge */}
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Most Popular
          </div>
        </div>
      )}

      {/* Current package badge */}
      {isCurrentPackage && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Check className="h-3 w-3" />
            Current Plan
          </div>
        </div>
      )}

      {/* Package header - Stays at the top */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">
            {formatCurrency(pkg.price, pkg.currency)}
          </span>
          <span className="text-gray-600">/{pkg.duration === 'monthly' ? 'month' : 'year'}</span>
        </div>
        <p className="text-sm text-gray-600">{pkg.description}</p>
      </div>

      {/* Privileges list - Added 'flex-grow' to push the content down */}
      <div className="space-y-3 mb-8 flex-grow">
        {pkg.privileges.map((privilege, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{privilege}</span>
          </div>
        ))}
      </div>

      {/* Action button - Will now be consistently at the bottom */}
      <button
        onClick={() => onSelectPackage(pkg.package_id)}
        disabled={isCurrentPackage}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isCurrentPackage
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : pkg.popular
            ? 'bg-sky-600 text-white hover:bg-sky-700'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {isCurrentPackage ? 'Current Plan' : 'Choose This Plan'}
      </button>
    </div>
  );
}