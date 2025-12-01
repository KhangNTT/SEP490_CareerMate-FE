"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheck, FiCheckCircle, FiStar, FiBriefcase } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
    fetchRecruiterPackages,
    formatRecruiterPackageFeatures,
    formatDuration,
    formatPrice,
    type RecruiterPackage,
    type RecruiterPackageName
} from "@/lib/recruiter-payment-api";
import { getRecruiterInvoice, type RecruiterInvoice } from "@/lib/recruiter-invoice-api";

export default function BillingPage() {
    const router = useRouter();
    const [packages, setPackages] = useState<RecruiterPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState<RecruiterPackageName | null>(null);
    const [invoice, setInvoice] = useState<RecruiterInvoice | null>(null);

    // Fetch packages and invoice from API
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                
                // Fetch packages
                const packagesData = await fetchRecruiterPackages();
                setPackages(packagesData);

                // Try to fetch invoice
                try {
                    const invoiceData = await getRecruiterInvoice();
                    setInvoice(invoiceData);
                } catch (error: any) {
                    // No invoice is ok
                    if (error.message !== 'NO_INVOICE_FOUND') {
                        console.error('Failed to fetch invoice:', error);
                    }
                }
            } catch (error) {
                console.error('Failed to load packages:', error);
                toast.error('Failed to load packages. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSelectPackage = (packageName: RecruiterPackageName) => {
        // Block all selections if user has any active package
        if (invoice?.packageName) {
            toast.error(`You already have an active ${invoice.packageName} package`);
            return;
        }
        setSelectedPackage(packageName);
    };

    const handleContinue = () => {
        if (!selectedPackage) {
            toast.error('Please select a package');
            return;
        }

        if (selectedPackage === 'BASIC') {
            toast.error('Please select a paid package to upgrade');
            return;
        }

        if (invoice?.packageName === selectedPackage) {
            toast.error('This package is already active');
            return;
        }

        // Navigate to confirmation page
        router.push(`/recruiter/recruiter-feature/profile/billing/confirm?package=${selectedPackage}`);
    };

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Plans</h1>
                <p className="text-gray-600">Choose the perfect plan for your recruitment needs</p>
            </header>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading packages...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Pricing Plans */}
                    <div className="mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {packages
                                .sort((a, b) => {
                                    const order = { 'BASIC': 1, 'PROFESSIONAL': 2, 'ENTERPRISE': 3 };
                                    return (order[a.name as keyof typeof order] || 0) - (order[b.name as keyof typeof order] || 0);
                                })
                                .map((pkg) => {
                                    const isBasic = pkg.name === 'BASIC';
                                    const isActivePackage = invoice?.packageName === pkg.name;
                                    const isSelected = selectedPackage === pkg.name;
                                    const features = formatRecruiterPackageFeatures(pkg.entitlements);

                                    return (
                                        <div
                                            key={pkg.name}
                                            onClick={() => !isBasic && !invoice?.packageName && handleSelectPackage(pkg.name)}
                                            className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 border ${
                                                isActivePackage
                                                    ? 'bg-emerald-50/50 border-emerald-200 ring-1 ring-emerald-200 cursor-default'
                                                    : isBasic
                                                    ? 'bg-gray-50/50 border-gray-200 cursor-not-allowed opacity-60'
                                                    : invoice?.packageName
                                                    ? 'bg-gray-50/50 border-gray-200 cursor-not-allowed opacity-60'
                                                    : isSelected
                                                    ? 'bg-white border-gray-900 ring-1 ring-gray-900 shadow-xl scale-[1.02] z-10 cursor-pointer'
                                                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg cursor-pointer'
                                                }`}
                                        >
                                            {/* Badges */}
                                            <div className="flex justify-between items-start mb-6">
                                                {isActivePackage && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                                                        <FiCheckCircle className="w-3 h-3 mr-1" /> Active
                                                    </span>
                                                )}

                                                {pkg.recommended && !isActivePackage && !isBasic && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-[#005181] to-[#041e57] text-white shadow-lg">
                                                        <FiStar className="w-3 h-3 mr-1 fill-yellow-300 text-yellow-300" /> Recommended
                                                    </span>
                                                )}

                                                {isBasic && !isActivePackage && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gray-200 text-gray-700">
                                                        Standard
                                                    </span>
                                                )}

                                                {/* Spacer */}
                                                {!pkg.recommended && !isBasic && !isActivePackage && <div></div>}

                                                {/* Checkbox Circle */}
                                                {!isBasic && !isActivePackage && (
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                                                        }`}>
                                                        {isSelected && <FiCheck className="w-4 h-4 text-white" />}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Title & Price */}
                                            <div className="mb-8">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <FiBriefcase className={`w-5 h-5 ${isSelected ? 'text-gray-900' : 'text-gray-400'}`} />
                                                    {pkg.name}
                                                </h3>
                                                <div className="flex items-baseline">
                                                    <span className="text-4xl font-bold text-gray-900">
                                                        {pkg.price === 0 ? 'Free' : `${pkg.price.toLocaleString('vi-VN')}₫`}
                                                    </span>
                                                    {pkg.price > 0 && (
                                                        <span className="text-gray-500 ml-2 text-sm font-medium">/ {formatDuration(pkg.durationDays)}</span>
                                                    )}
                                                </div>
                                                <p className="text-gray-500 text-sm mt-2">
                                                    {pkg.price === 0 ? 'Basic features to get started' : 'Advanced recruitment features'}
                                                </p>
                                            </div>

                                            {/* Features */}
                                            <div className="flex-grow mb-8">
                                                <ul className="space-y-4">
                                                    {features.map((feature, idx) => (
                                                        <li key={idx} className="flex items-start gap-3">
                                                            <FiCheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSelected ? 'text-gray-900' : 'text-gray-400'
                                                                }`} />
                                                            <span className="text-sm text-gray-700">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Continue Button */}
                    <div className="flex justify-center mb-12">
                        <Button
                            onClick={handleContinue}
                            disabled={!selectedPackage || selectedPackage === 'BASIC' || invoice?.packageName === selectedPackage}
                            size="lg"
                            className={`px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                                !selectedPackage || selectedPackage === 'BASIC' || invoice?.packageName === selectedPackage
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {invoice?.packageName && !selectedPackage
                                ? `Your current package is ${invoice.packageName}`
                                : invoice?.packageName === selectedPackage
                                ? `Your current package is ${invoice.packageName}`
                                : !selectedPackage || selectedPackage === 'BASIC'
                                ? 'Please Select a Plan to Upgrade'
                                : `Continue with ${selectedPackage}`}
                        </Button>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                            <FiBriefcase className="w-5 h-5" />
                            Payment Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                                <FiCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>All plans support payment via VNPay</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <FiCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Invoices sent to your email after payment</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <FiCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Cancel or change plan anytime</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <FiCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>24/7 support available</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
