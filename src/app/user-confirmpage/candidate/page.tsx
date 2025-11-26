"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

export default function CandidateRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    education: "",
    experience: "",
    desiredPosition: "",
    desiredSalary: "",
    skills: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6e8ea] to-[#e0e6f0]">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Chào bạn,</h2>
            <p className="text-gray-600">
              Bạn hãy dành ra vài giây để xác nhận thông tin dưới đây nhé! 👋
            </p>
          </div>

          {/* Illustration and Form Container */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="grid md:grid-cols-2">
              {/* Left side - Form */}
              <div className="p-8 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <h3 className="mb-6 text-xl font-semibold text-gray-900">
                  Thông tin ứng viên
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    {/* Họ và tên */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Họ và tên *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Nhập họ và tên"
                          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Nhập email"
                          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                          required
                        />
                      </div>
                    </div>

                    {/* Số điện thoại */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Số điện thoại *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Nhập số điện thoại"
                          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                          required
                        />
                      </div>
                    </div>

                    {/* Ngày sinh */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Ngày sinh
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                        />
                      </div>
                    </div>

                    {/* Địa chỉ */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Địa chỉ
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Chọn tỉnh/thành phố"
                          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="border-t pt-4 space-y-4">
                    <h4 className="mb-2 font-medium text-gray-900">
                      Thông tin nghề nghiệp
                    </h4>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Trình độ học vấn
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <select
                          name="education"
                          value={formData.education}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                        >
                          <option value="">Chọn trình độ học vấn</option>
                          <option value="highschool">
                            Trung học phổ thông
                          </option>
                          <option value="college">Cao đẳng</option>
                          <option value="university">Đại học</option>
                          <option value="master">Thạc sĩ</option>
                          <option value="phd">Tiến sĩ</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Kinh nghiệm làm việc
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                      >
                        <option value="">Chọn kinh nghiệm</option>
                        <option value="fresher">Chưa có kinh nghiệm</option>
                        <option value="1-2">1-2 năm</option>
                        <option value="3-5">3-5 năm</option>
                        <option value="5-10">5-10 năm</option>
                        <option value="10+">Trên 10 năm</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Vị trí mong muốn
                      </label>
                      <input
                        type="text"
                        name="desiredPosition"
                        value={formData.desiredPosition}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: Software Developer, Marketing Executive"
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Mức lương mong muốn
                      </label>
                      <select
                        name="desiredSalary"
                        value={formData.desiredSalary}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                      >
                        <option value="">Chọn mức lương</option>
                        <option value="under-10">Dưới 10 triệu</option>
                        <option value="10-15">10-15 triệu</option>
                        <option value="15-20">15-20 triệu</option>
                        <option value="20-30">20-30 triệu</option>
                        <option value="30-50">30-50 triệu</option>
                        <option value="over-50">Trên 50 triệu</option>
                        <option value="negotiate">Thỏa thuận</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Kỹ năng chuyên môn
                      </label>
                      <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: JavaScript, React, Node.js, MySQL..."
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 outline-none focus:border-[#6da9e9] focus:ring-2 focus:ring-[#6da9e9]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-[#6da9e9] py-3 px-4 font-medium text-white transition-colors hover:bg-[#6da9e9] focus:outline-none focus:ring-2 focus:ring-[#6da9e9] focus:ring-offset-2"
                    >
                      <div className="flex items-center justify-center gap-2">
                        Lưu và Tiếp tục
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right side - Illustration */}
              <img
                src="img/candidatesbg.png"
                alt="Candidates Background"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Bằng cách tiếp tục, bạn đồng ý với{" "}
            <a href="#" className="text-[#6da9e9] hover:underline">
              Điều khoản sử dụng
            </a>{" "}
            và{" "}
            <a href="#" className="text-[#6da9e9] hover:underline">
              Chính sách bảo mật
            </a>{" "}
            của CareerMate
          </div>
        </div>
      </div>
    </div>
  );
}
