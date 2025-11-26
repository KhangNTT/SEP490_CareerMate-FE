"use client";

import { useState } from 'react';
import { PricingCard } from '@/components/billing/PricingCard';
import { CurrentSubscription } from '@/components/billing/CurrentSubscription';
import { PACKAGES } from '@/data/packages';
import { UserSubscription } from '@/types/billing';

// Mock data for the current subscription
const mockSubscription: UserSubscription = {
  subscription_id: 'sub_123',
  package_id: 'basic',
  start_date: '2024-01-01',
  end_date: '2024-12-01',
  status: 'active',
  auto_renew: true
};

export default function BillingPage() {
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    // In reality, this data would be fetched from an API
    const currentSubscription = mockSubscription;

    const handleSelectPackage = (packageId: string) => {
        setSelectedPackage(packageId);
        // TODO: Redirect to checkout page or open payment modal
        console.log('Selected package:', packageId);
        alert(`You have selected the package: ${PACKAGES.find(p => p.package_id === packageId)?.name}`);
        // Optionally redirect to checkout page
        // router.push(`/recruiter/checkout?package=${packageId}`);
    };

    return (
        <>
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Billing & Plans</h1>
                <p className="text-gray-600">Manage your subscription plans and payments</p>
            </header>

            {/* Current subscription */}
            <CurrentSubscription subscription={currentSubscription} />

            {/* Pricing plans */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose the right plan for you</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PACKAGES.map((pkg) => (
                        <PricingCard
                            key={pkg.package_id}
                            package={pkg}
                            onSelectPackage={handleSelectPackage}
                            currentPackageId={currentSubscription?.package_id}
                        />
                    ))}
                </div>
            </div>

            {/* Additional info */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                    <p>• All plans support payment via bank transfer or e-wallets</p>
                    <p>• VAT invoices will be sent to your email after successful payment</p>
                    <p>• You can cancel or change your plan at any time, effective from the next billing cycle</p>
                    <p>• 24/7 support via hotline: 1900-xxx-xxx or email: support@careermate.vn</p>
                </div>
            </div>
        </>
    );
}
