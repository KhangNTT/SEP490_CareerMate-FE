"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  fetchPackages, 
  getPackage, 
  createPaymentUrl, 
  formatPrice, 
  formatPackageFeatures,
  formatDuration,
  type PackageName,
  type Package 
} from "@/lib/payment-api";
import { getMyInvoice, type Invoice } from "@/lib/invoice-api";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, AlertCircle, Loader2, ShieldCheck, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

export default function ConfirmPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageName = searchParams.get('package') as PackageName;
  
  const [isLoading, setIsLoading] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    // Fetch packages and invoice
    const fetchData = async () => {
      try {
        const packagesData = await fetchPackages();
        setPackages(packagesData);
        
        let currentInvoice: Invoice | null = null;
        
        // Try to fetch current invoice
        try {
          const invoiceData = await getMyInvoice();
          setInvoice(invoiceData);
          currentInvoice = invoiceData;
        } catch (error: any) {
          // No invoice is ok
          if (error.message !== 'NO_INVOICE_FOUND') {
            console.error('Failed to fetch invoice:', error);
          }
        }
        
        // Find selected package
        const pkg = getPackage(packagesData, packageName);
        
        if (!pkg) {
          toast.error('Please select a package first');
          router.push('/candidate/pricing');
          return;
        }
        
        setSelectedPackage(pkg);
        
        // If user is trying to purchase active package, show warning
        if (currentInvoice && currentInvoice.packageName === packageName) {
          toast.error('The package is already activated and cannot be purchased.');
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load package information');
        router.push('/candidate/pricing');
      } finally {
        setIsCheckingStatus(false);
      }
    };

    fetchData();
  }, [packageName, router]);

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;

    // Check if user is trying to purchase the same active package
    if (invoice?.packageName === selectedPackage.name) {
      toast.error('The package is already activated and cannot be purchased.');
      return;
    }

    // If FREE package, no payment needed
    if (selectedPackage.name === 'FREE') {
      toast.success('FREE package activated!');
      router.push('/payment/success?package=FREE');
      return;
    }

    setIsLoading(true);
    try {
      // Create payment URL
      const paymentUrl = await createPaymentUrl(selectedPackage.name);
      
      // Redirect to VNPay
      window.location.href = paymentUrl;
    } catch (error: any) {
      console.error('Payment error:', error);
      
      // Check if error is due to active package
      if (error.message === 'ACTIVE_PACKAGE_EXISTS' || error.response?.data?.code === 2004) {
        toast.error('You already have an active package. The package cannot be purchased again.');
        // Redirect back to pricing page
        setTimeout(() => {
          router.push('/candidate/pricing');
        }, 2000);
      } else {
        toast.error('Failed to create payment. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/candidate/pricing');
  };

  if (!selectedPackage && !isCheckingStatus) {
    return null;
  }

  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-gray-900 mx-auto mb-4" />
          <p className="text-gray-500">Verifying package details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="group flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Plans
        </button>

        {/* Active Package Warning */}
        {invoice && invoice.packageName === selectedPackage?.name && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-1">
                Active Package Detected
              </h3>
              <p className="text-amber-800 text-sm mb-2">
                You currently have an active <strong>{invoice.packageName}</strong> package.
              </p>
              {invoice.endDate && (
                <p className="text-amber-700 text-xs font-medium">
                  Expires on: {new Date(invoice.endDate).toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main Layout: Details & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Package Details (2/3 width) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Confirm Subscription
              </h1>
              <p className="text-gray-500 mb-8 text-sm">
                You are about to upgrade your account. Please review the details below.
              </p>

              {/* Package Info Block */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Selected Plan</p>
                    <h2 className="text-xl font-bold text-gray-900">{selectedPackage?.name}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Duration</p>
                    <p className="text-gray-900 font-medium">{selectedPackage ? formatDuration(selectedPackage.durationDays) : ''}</p>
                  </div>
                </div>
                
                <div className="h-px bg-gray-200 w-full my-4"></div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Includes</p>
                  <ul className="grid gap-3">
                    {selectedPackage && formatPackageFeatures(selectedPackage.entitlements).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <Check className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Payment Method Info */}
              {selectedPackage && selectedPackage.price > 0 && (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Secure Payment via VNPay</p>
                    <p className="text-xs text-gray-500">Supports Credit Card, ATM, QR Code</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary (1/3 width) */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{selectedPackage ? formatPrice(selectedPackage.price) : '0₫'}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (VAT)</span>
                  <span>Included</span>
                </div>
                <div className="h-px bg-gray-100 w-full my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {selectedPackage ? formatPrice(selectedPackage.price) : '0₫'}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleConfirmPurchase}
                className="w-full py-6 text-base rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all bg-gray-900 text-white"
                disabled={isLoading || (invoice?.packageName === selectedPackage?.name)}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Processing...
                  </span>
                ) : invoice?.packageName === selectedPackage?.name ? (
                  'Already Active'
                ) : (
                  `Pay & Upgrade`
                )}
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                <span>SSL Secure Payment</span>
              </div>
              
              <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
                By confirming, you agree to our <a href="#" className="underline hover:text-gray-600">Terms</a> and <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}