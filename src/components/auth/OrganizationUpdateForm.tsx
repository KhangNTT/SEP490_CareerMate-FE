"use client";

import { useState } from "react";
import { updateOrganization, UpdateOrganizationRequest } from "@/lib/recruiter-api";
import toast from "react-hot-toast";

interface OrganizationUpdateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<UpdateOrganizationRequest>;
  submitButtonText?: string;
  showCancelButton?: boolean;
}

export function OrganizationUpdateForm({
  onSuccess,
  onCancel,
  initialData,
  submitButtonText = "Gửi lại yêu cầu phê duyệt",
  showCancelButton = true,
}: OrganizationUpdateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateOrganizationRequest>({
    companyName: initialData?.companyName || "",
    website: initialData?.website || "",
    logoUrl: initialData?.logoUrl || "",
    companyEmail: initialData?.companyEmail || "",
    contactPerson: initialData?.contactPerson || "",
    phoneNumber: initialData?.phoneNumber || "",
    companyAddress: initialData?.companyAddress || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.companyName ||
      !formData.contactPerson ||
      !formData.phoneNumber ||
      !formData.companyAddress
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateOrganization(formData);
      toast.success(
        "Thông tin doanh nghiệp đã được cập nhật thành công! Vui lòng chờ phê duyệt lại."
      );
      onSuccess?.();
    } catch (error: any) {
      console.error("Error submitting organization info:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Company Name */}
        <fieldset className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Tên công ty <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
            placeholder="VD: FPT Corporation"
          />
        </fieldset>

        {/* Website */}
        <fieldset className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
            placeholder="https://yourcompany.com"
          />
        </fieldset>

        {/* Logo URL */}
        <fieldset className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Logo URL
          </label>
          <input
            type="url"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
            placeholder="https://example.com/logo.png"
          />
          {formData.logoUrl && (
            <div className="mt-2 flex justify-start">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={formData.logoUrl}
                  alt="Company Logo Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </fieldset>

        {/* Business License */}
        <fieldset className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Email công ty
          </label>
          <input
            type="email"
            name="companyEmail"
            value={formData.companyEmail}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
            placeholder="VD: contact@company.com"
          />
        </fieldset>

        {/* Contact Person */}
        <fieldset className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Người liên hệ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
            placeholder="Nguyễn Văn A"
          />
        </fieldset>

        {/* Phone Number */}
        <fieldset className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            pattern="[0-9]{10,11}"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
            placeholder="0929098765"
          />
        </fieldset>

        {/* Company Address */}
        <fieldset className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Địa chỉ công ty <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
            placeholder="VD: Ftown1, Đà Nẵng"
          />
        </fieldset>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang gửi...
            </span>
          ) : (
            submitButtonText
          )}
        </button>
        {showCancelButton && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}

export default OrganizationUpdateForm;
