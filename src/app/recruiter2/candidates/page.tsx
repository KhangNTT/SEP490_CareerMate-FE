"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Eye,
  Download,
  Calendar,
  Award,
} from "lucide-react";

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSkill, setFilterSkill] = useState("all");

  // Mock data
  const candidates = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0123456789",
      location: "Ho Chi Minh",
      position: "Senior Frontend Developer",
      experience: "5 years",
      skills: ["React", "TypeScript", "Next.js", "Tailwind"],
      rating: 4.8,
      availability: "Sẵn sàng",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0987654321",
      location: "Ha Noi",
      position: "Backend Developer",
      experience: "3 years",
      skills: ["Node.js", "PostgreSQL", "MongoDB", "Docker"],
      rating: 4.5,
      availability: "2 tuần nữa",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0912345678",
      location: "Da Nang",
      position: "Full Stack Developer",
      experience: "4 years",
      skills: ["React", "Node.js", "AWS", "GraphQL"],
      rating: 4.9,
      availability: "Sẵn sàng",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      phone: "0898765432",
      location: "Ho Chi Minh",
      position: "UI/UX Designer",
      experience: "2 years",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
      rating: 4.6,
      availability: "1 tháng nữa",
    },
  ];

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFilter =
      filterSkill === "all" ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(filterSkill.toLowerCase())
      );
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Database Ứng viên</h1>
        <p className="text-gray-600 mt-2">
          Tìm kiếm và kết nối với các ứng viên tiềm năng
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Tổng ứng viên</p>
          <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Sẵn sàng làm việc</p>
          <p className="text-2xl font-bold text-green-600">
            {candidates.filter((c) => c.availability === "Sẵn sàng").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Đánh giá cao</p>
          <p className="text-2xl font-bold text-yellow-600">
            {candidates.filter((c) => c.rating >= 4.5).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Kỹ năng nổi bật</p>
          <p className="text-2xl font-bold text-purple-600">React, Node.js</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, vị trí, kỹ năng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterSkill}
          onChange={(e) => setFilterSkill(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả kỹ năng</option>
          <option value="react">React</option>
          <option value="node">Node.js</option>
          <option value="typescript">TypeScript</option>
          <option value="aws">AWS</option>
        </select>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            {/* Avatar & Name */}
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {candidate.name.charAt(0)}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  {candidate.name}
                </h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{candidate.rating}</span>
                </div>
              </div>
            </div>

            {/* Position */}
            <div className="mb-3">
              <p className="text-blue-600 font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {candidate.position}
              </p>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {candidate.location}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Award className="w-4 h-4" />
                {candidate.experience}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {candidate.availability}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {candidate.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                  >
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                    +{candidate.skills.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                <Mail className="w-4 h-4" />
                Liên hệ
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Không tìm thấy ứng viên phù hợp</p>
        </div>
      )}
    </div>
  );
}
