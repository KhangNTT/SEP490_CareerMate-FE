"use client";

import { useState } from "react";
import { Building2, User, Phone, MapPin, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecruiterRegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    companyName: "",
    workLocation: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Saving recruiter data:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/recruiter-home");
    } catch (error) {
      console.error("Error saving recruiter data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6e8ea] to-[#e0e6f0]">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Hello there,</h2>
            <p className="text-gray-600">
              Please take a few seconds to confirm the information below! 👋
            </p>
          </div>

          {/* Illustration and Form Container */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="grid md:grid-cols-2">
              {/* Left side - Form */}
              <div className="p-8 h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <h3 className="mb-6 text-xl font-semibold text-gray-900">
                  Recruiter Information
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                        required
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Enter your company name"
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                        required
                      />
                    </div>
                  </div>

                  {/* Work Location */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Work Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="workLocation"
                        value={formData.workLocation}
                        onChange={handleInputChange}
                        placeholder="Enter your city or province"
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full rounded-lg py-3 px-4 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#6da9e9] focus:ring-offset-2 ${
                        isLoading
                          ? "bg-[#6da9e9]/40 cursor-not-allowed"
                          : "bg-[#6da9e9] hover:bg-[#6da9e9]/80"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            Save and Continue
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right side - Illustration */}
              <div className="max-h-[600px] ">
                <img
                  src="img/empolyersbg.png"
                  alt="Employers Background"
                  className="object-cover w-full"
                />
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#6da9e9] hover:underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#6da9e9] hover:underline">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
