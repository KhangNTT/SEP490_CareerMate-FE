"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  Shield,
  Activity,
  FileText,
  Briefcase,
  ClipboardList,
  AlertTriangle,
  MessageSquare,
  Star,
  Database,
  RefreshCw,
  CheckCircle,
  XCircle,
  Mail,
  Network,
  Server,
} from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getDashboardStats, type DashboardStats } from "@/lib/admin-dashboard-api";
import toast from "react-hot-toast";

const ROLE_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];
const STATUS_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      else setRefreshing(true);
      
      setError(null);
      console.log("🔍 Fetching dashboard stats from API...");
      const data = await getDashboardStats();
      console.log("✅ Dashboard stats received:", data);
      console.log("📊 User counts:", {
        totalUsers: data.totalUsers,
        candidates: data.totalCandidates,
        recruiters: data.totalRecruiters,
        admins: data.totalAdmins
      });
      console.log("📈 Account status:", {
        active: data.activeAccounts,
        pending: data.pendingAccounts,
        banned: data.bannedAccounts,
        rejected: data.rejectedAccounts
      });
      console.log("🏥 System health:", {
        database: data.databaseStatus,
        kafka: data.kafkaStatus,
        weaviate: data.weaviateStatus,
        email: data.emailStatus,
        system: data.systemStatus
      });
      setStats(data);
      
      if (isRefresh) {
        toast.success("Dashboard refreshed");
      }
    } catch (err) {
      console.error("❌ Error fetching dashboard stats:", err);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      }
      const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchStats(true), 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error || "Unknown error occurred"}</p>
          <Button onClick={() => fetchStats()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const userRoleData = [
    { name: 'Candidates', value: stats.totalCandidates },
    { name: 'Recruiters', value: stats.totalRecruiters },
    { name: 'Admins', value: stats.totalAdmins },
  ].filter(item => item.value > 0);
  
  console.log("📊 Rendering charts with data:", {
    userRoleData,
    totalFromStats: {
      candidates: stats.totalCandidates,
      recruiters: stats.totalRecruiters,
      admins: stats.totalAdmins
    }
  });

  const accountStatusData = [
    { name: 'Active', value: stats.activeAccounts },
    { name: 'Pending', value: stats.pendingAccounts },
    { name: 'Banned', value: stats.bannedAccounts },
    { name: 'Rejected', value: stats.rejectedAccounts },
  ].filter(item => item.value > 0);
  
  const systemComponents = [
    { name: 'Database', status: stats.databaseStatus, icon: Database },
    { name: 'Kafka', status: stats.kafkaStatus, icon: Server },
    { name: 'Weaviate', status: stats.weaviateStatus, icon: Network },
    { name: 'Email Service', status: stats.emailStatus, icon: Mail },
  ];

  const isSystemHealthy = stats.systemStatus === 'UP';
  const totalPendingItems = stats.pendingRecruiterApprovals + stats.flaggedComments + stats.flaggedRatings;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time system overview and statistics</p>
        </div>
        <Button 
          onClick={() => fetchStats(true)} 
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* System Health Banner */}
      <div 
        className={`p-4 rounded-lg border ${
          isSystemHealthy 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {isSystemHealthy ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {isSystemHealthy ? 'System Online' : 'System Issue Detected'}
            </h3>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Database className="w-4 h-4" />
                Database: <span className={`font-medium ${stats.databaseStatus === 'UP' ? 'text-green-600' : 'text-red-600'}`}>{stats.databaseStatus}</span>
              </span>
              <span className="flex items-center gap-1">
                <Server className="w-4 h-4" />
                Kafka: <span className={`font-medium ${stats.kafkaStatus === 'UP' ? 'text-green-600' : 'text-red-600'}`}>{stats.kafkaStatus}</span>
              </span>
              <span className="flex items-center gap-1">
                <Network className="w-4 h-4" />
                Weaviate: <span className={`font-medium ${stats.weaviateStatus === 'UP' ? 'text-green-600' : stats.weaviateStatus === 'UNKNOWN' ? 'text-gray-600' : 'text-red-600'}`}>{stats.weaviateStatus}</span>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Email: <span className={`font-medium ${stats.emailStatus === 'UP' ? 'text-green-600' : stats.emailStatus === 'UNKNOWN' ? 'text-gray-600' : 'text-red-600'}`}>{stats.emailStatus}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              All registered accounts
            </p>
          </CardContent>
        </Card>

        {/* Active Accounts */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Accounts
            </CardTitle>
            <UserCheck className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.activeAccounts.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((stats.activeAccounts / stats.totalUsers) * 100)}% of total users
            </p>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Link href="/admin/approvals">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Approvals
              </CardTitle>
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {totalPendingItems}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* System Status */}
        <Card className={`hover:shadow-lg transition-shadow ${
          isSystemHealthy ? 'border-green-200' : 'border-red-200'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              System Status
            </CardTitle>
            <Database className={`w-5 h-5 ${isSystemHealthy ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              isSystemHealthy ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.systemStatus}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isSystemHealthy ? 'All systems operational' : 'Check system components'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution by Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              User Distribution by Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={90}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: string) => [value, name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value: string, entry: any) => `${value}: ${entry.payload.value}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Candidates
                </span>
                <span className="font-semibold">{stats.totalCandidates.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Recruiters
                </span>
                <span className="font-semibold">{stats.totalRecruiters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  Admins
                </span>
                <span className="font-semibold">{stats.totalAdmins.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Account Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={accountStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={90}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {accountStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: string) => [value, name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value: string, entry: any) => `${value}: ${entry.payload.value}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Active
                </span>
                <span className="font-semibold">{stats.activeAccounts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  Pending
                </span>
                <span className="font-semibold">{stats.pendingAccounts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  Banned
                </span>
                <span className="font-semibold">{stats.bannedAccounts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  Rejected
                </span>
                <span className="font-semibold">{stats.rejectedAccounts.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Content Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/blogs">
              <div className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Blog Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/admin/jobs">
              <div className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Job Postings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalJobPostings.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/admin/applications">
              <div className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalApplications.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* System Components Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            System Components
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemComponents.map((component) => {
              const Icon = component.icon;
              const isUp = component.status === 'UP';
              const isUnknown = component.status === 'UNKNOWN';
              
              return (
                <div 
                  key={component.name}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isUp 
                      ? 'bg-green-50 border-green-200' 
                      : isUnknown
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${
                      isUp 
                        ? 'text-green-600' 
                        : isUnknown
                        ? 'text-gray-600'
                        : 'text-red-600'
                    }`} />
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      isUp 
                        ? 'bg-green-100 text-green-700' 
                        : isUnknown
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {component.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{component.name}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Moderation Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Moderation Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link href="/admin/approvals/recruiters">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Recruiter Approvals</span>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {stats.pendingRecruiterApprovals}
                </span>
              </div>
            </Link>
            <Link href="/admin/moderation/comments">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">Flagged Comments</span>
                </div>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {stats.flaggedComments}
                </span>
              </div>
            </Link>
            <Link href="/admin/moderation/ratings">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-red-600" />
                  <span className="font-medium">Flagged Ratings</span>
                </div>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {stats.flaggedRatings}
                </span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
