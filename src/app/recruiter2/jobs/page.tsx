"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  Calendar,
  MapPin,
  DollarSign,
  Users as UsersIcon
} from "lucide-react";
import Link from "next/link";

export default function JobsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - sẽ thay bằng API call
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      location: "Ho Chi Minh",
      type: "Full-time",
      salary: "$2000-$3000",
      applications: 24,
      views: 156,
      status: "active",
      postedDate: "2024-10-10",
      deadline: "2024-11-10",
    },
    {
      id: 2,
      title: "Backend Developer",
      location: "Ha Noi",
      type: "Full-time",
      salary: "$1800-$2500",
      applications: 18,
      views: 98,
      status: "active",
      postedDate: "2024-10-12",
      deadline: "2024-11-12",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      location: "Da Nang",
      type: "Part-time",
      salary: "$1500-$2000",
      applications: 12,
      views: 67,
      status: "closed",
      postedDate: "2024-09-15",
      deadline: "2024-10-15",
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { label: "Đang tuyển", color: "bg-green-100 text-green-800" },
      closed: { label: "Đã đóng", color: "bg-gray-100 text-gray-800" },
      draft: { label: "Nháp", color: "bg-yellow-100 text-yellow-800" },
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Jobs</h1>
            <p className="text-gray-600 mt-2">
              Quản lý tất cả tin tuyển dụng của bạn
            </p>
          </div>
          <Link
            href="/recruiter/jobs/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Đăng tin mới
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang tuyển</option>
            <option value="closed">Đã đóng</option>
            <option value="draft">Nháp</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Tổng số jobs</p>
          <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Đang tuyển</p>
          <p className="text-2xl font-bold text-green-600">
            {jobs.filter((j) => j.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Tổng đơn ứng tuyển</p>
          <p className="text-2xl font-bold text-blue-600">
            {jobs.reduce((sum, j) => sum + j.applications, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Tổng lượt xem</p>
          <p className="text-2xl font-bold text-purple-600">
            {jobs.reduce((sum, j) => sum + j.views, 0)}
          </p>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lương
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn ứng tuyển
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lượt xem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.map((job) => {
                const statusBadge = getStatusBadge(job.status);
                return (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3" />
                          Đăng: {job.postedDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        {job.salary}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600 font-semibold flex items-center gap-2">
                        <UsersIcon className="w-4 h-4" />
                        {job.applications}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {job.views}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}
                      >
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy job nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
