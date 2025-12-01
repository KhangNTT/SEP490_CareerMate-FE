"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  fetchPackages, 
  formatPackageFeatures, 
  formatDuration,
  type PackageName, 
  type Package 
} from "@/lib/payment-api";
import { getMyInvoice, type Invoice } from "@/lib/invoice-api";
import { Button } from "@/components/ui/button";
// Tôi thêm FiStar và FiPackage để phù hợp với thiết kế mới, nhưng vẫn dùng thư viện gốc của bạn
import { FiCheck, FiCheckCircle, FiStar, FiPackage } from "react-icons/fi";
import { Crown } from "lucide-react";
import toast from "react-hot-toast";

export default function PricingPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageName>('FREE');
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giữ nguyên logic fetch data gốc của bạn
    const fetchData = async () => {
      try {
        const packagesData = await fetchPackages();
        setPackages(packagesData);
        
        // getMyInvoice now returns null if no invoice (404)
        const invoiceData = await getMyInvoice();
        setInvoice(invoiceData);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load packages. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectPackage = (packageName: PackageName) => {
    setSelectedPackage(packageName);
  };

  const handleContinue = () => {
    // If FREE is selected, don't allow continue or auto-select PLUS
    let packageToUse = selectedPackage;
    if (selectedPackage === 'FREE') {
      toast.error('Please select a paid package to upgrade.');
      return;
    }
    
    // Giữ nguyên logic kiểm tra và chuyển trang gốc
    if (invoice?.packageName === packageToUse) {
      toast.error('The package is already activated and cannot be purchased.');
      return;
    }

    router.push(`/candidate/pricing/confirm?package=${packageToUse}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Active Package Alert*/}
          {invoice && (
            <div className="mt-8 mx-auto max-w-xl bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm flex items-start gap-4 text-left">
              <div className="p-3 bg-emerald-50 rounded-full flex-shrink-0">
                <FiCheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Current Plan: <span className="text-emerald-600">{invoice.packageName}</span>
                </h3>
                <p className="text-gray-500 text-sm">
                  Your subscription is active until <span className="font-medium text-gray-700">{invoice.endDate ? new Date(invoice.endDate).toLocaleDateString('vi-VN') : 'N/A'}</span>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Packages Grid - Render từ state packages thật */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {packages
            .sort((a, b) => {
              const order = { 'FREE': 1, 'PLUS': 2, 'PREMIUM': 3 };
              return (order[a.name as keyof typeof order] || 0) - (order[b.name as keyof typeof order] || 0);
            })
            .map((pkg) => {
            const isCurrentPackage = invoice?.packageName === pkg.name;
            const isFreePackage = pkg.name === 'FREE';
            // FREE package should never show as selected, even if it's the selectedPackage state
            const isSelected = !isFreePackage && selectedPackage === pkg.name;
            const features = formatPackageFeatures(pkg.entitlements);
            
            return (
              <div
                key={pkg.name}
                onClick={() => !isCurrentPackage && !isFreePackage && handleSelectPackage(pkg.name)}
                className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 border ${
                  isCurrentPackage
                    ? 'bg-emerald-50/50 border-emerald-200 ring-1 ring-emerald-200 cursor-default'
                    : isFreePackage
                    ? 'bg-gray-50/50 border-gray-200 cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'bg-white border-gray-900 ring-1 ring-gray-900 shadow-xl scale-[1.02] z-10 cursor-pointer'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg cursor-pointer'
                }`}
              >
                {/* Badges */}
                <div className="flex justify-between items-start mb-6">
                  {pkg.recommended && !isCurrentPackage && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-[#005181] to-[#041e57] text-white shadow-lg">
                      <FiStar className="w-3 h-3 mr-1 fill-yellow-300 text-yellow-300" /> Recommended
                    </span>
                  )}
                  
                  {isCurrentPackage && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                      <FiCheckCircle className="w-3 h-3 mr-1" /> Active
                    </span>
                  )}
                  
                  {isFreePackage && !isCurrentPackage && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gray-200 text-gray-700">
                      Standard
                    </span>
                  )}
                  
                  {/* Spacer */}
                  {!pkg.recommended && !isCurrentPackage && !isFreePackage && <div></div>}

                  {/* Checkbox Circle */}
                  {!isCurrentPackage && !isFreePackage && (
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                    }`}>
                      {isSelected && <FiCheck className="w-4 h-4 text-white" />}
                    </div>
                  )}
                </div>

                {/* Title & Price */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    {pkg.name === 'PREMIUM' ? (
                      <Crown className={`w-5 h-5 ${isSelected ? 'text-yellow-500 fill-yellow-400' : 'text-yellow-500 fill-yellow-400'}`} />
                    ) : (
                      <FiPackage className={`w-5 h-5 ${isSelected ? 'text-gray-900' : 'text-gray-400'}`} />
                    )}
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
                    {pkg.price === 0 ? 'Basic access to get started' : 'Unlock full potential'}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 w-full mb-8"></div>

                {/* Features List */}
                <ul className="space-y-4 mb-8 flex-1">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <div className={`mt-0.5 mr-3 flex-shrink-0 rounded-full p-0.5 ${
                        isCurrentPackage ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <FiCheck className="w-3 h-3" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Area */}
                <div className="mt-auto pt-4">
                   {isCurrentPackage ? (
                     <div className="w-full py-3 text-center text-sm font-medium text-emerald-700 bg-emerald-100 rounded-xl">
                       Current Plan
                     </div>
                   ) : isFreePackage ? (
                     <div className="w-full py-3 text-center text-sm font-medium text-gray-500 bg-gray-100 rounded-xl">
                       Standard Plan
                     </div>
                   ) : (
                     <div className={`w-full py-3 text-center text-sm font-medium rounded-xl transition-colors ${
                       isSelected ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-400'
                     }`}>
                       {isSelected ? 'Selected' : 'Click to Select'}
                     </div>
                   )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Bar */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={selectedPackage === 'FREE' || invoice?.packageName === selectedPackage}
            className="h-auto px-12 py-4 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {selectedPackage === 'FREE'
              ? 'Please Select a Plan to Upgrade'
              : invoice?.packageName === selectedPackage
              ? 'Plan Already Active'
              : `Continue with ${selectedPackage}`}
          </Button>
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-6">
          Secure payment processing. Cancel anytime.
        </p>
      </div>
    </div>
  );
}