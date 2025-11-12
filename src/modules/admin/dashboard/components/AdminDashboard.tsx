"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Users, BarChart3, TrendingUp, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    systemHealth: 98.5,
    uptime: "99.9%",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">System Overview & Management</p>
        </div>
        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          All Systems Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-1">Registered accounts</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeUsers.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-1">Currently online</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.systemHealth}%</p>
                <p className="text-gray-500 text-xs mt-1">All services running</p>
              </div>
              <div className="p-3 bg-sky-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.uptime}</p>
                <p className="text-gray-500 text-xs mt-1">Last 30 days</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/user-management">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/recruiters">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Recruiters
              </Button>
            </Link>
            <Link href="/admin/pending-approval">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Pending Approvals
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Database</span>
              </div>
              <span className="text-xs font-medium text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">API Server</span>
              </div>
              <span className="text-xs font-medium text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Authentication</span>
              </div>
              <span className="text-xs font-medium text-green-600">Online</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
                <p className="text-gray-500 text-xs mt-1">Last 30 days</p>  return (  return (

              </div>

              <div className="p-3 bg-green-100 rounded-full">    <div className="space-y-6">    <div className="space-y-6">

                <Activity className="h-6 w-6 text-green-600" />

              </div>      {/* Header */}      {/* Header */}

            </div>

          </CardContent>      <div className="flex items-center justify-between">      <div className="flex items-center justify-between">

        </Card>

        <div>        <div>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

          <CardContent className="p-6">          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

            <div className="flex items-center justify-between">

              <div>          <p className="text-sm text-gray-600 mt-1">System Overview & Management</p>          <p className="text-sm text-gray-600 mt-1">System Overview & Management</p>

                <p className="text-sm font-medium text-gray-600">System Health</p>

                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.systemHealth}%</p>        </div>        </div>

                <p className="text-gray-500 text-xs mt-1">Performance score</p>

              </div>        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">

              <div className="p-3 bg-purple-100 rounded-full">

                <TrendingUp className="h-6 w-6 text-purple-600" />          <CheckCircle className="w-4 h-4" />          <CheckCircle className="w-4 h-4" />

              </div>

            </div>          All Systems Operational          All Systems Operational

          </CardContent>

        </Card>        </div>        </div>



        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">      </div>      </div>

          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-600">Uptime</p>      {/* System Stats */}      {/* System Stats */}

                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.uptime}</p>

                <p className="text-gray-500 text-xs mt-1">Last 30 days</p>      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              </div>

              <div className="p-3 bg-orange-100 rounded-full">        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

                <Clock className="h-6 w-6 text-orange-600" />

              </div>          <CardContent className="p-6">          <CardContent className="p-6">

            </div>

          </CardContent>            <div className="flex items-center justify-between">            <div className="flex items-center justify-between">

        </Card>

      </div>              <div>              <div>



      {/* Quick Actions & System Status */}                <p className="text-sm font-medium text-gray-600">Total Users</p>                <p className="text-sm font-medium text-gray-600">Total Users</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* System Status */}                <p className="text-3xl font-bold text-gray-900 mt-2">                <p className="text-3xl font-bold text-gray-900 mt-2">

        <Card className="bg-white border border-gray-200 shadow-sm">

          <CardHeader className="border-b border-gray-200">                  {stats.totalUsers.toLocaleString()}                  {stats.totalUsers.toLocaleString()}

            <CardTitle className="text-gray-900 flex items-center gap-2 text-lg">

              <Database className="w-5 h-5" />                </p>                </p>

              System Status

            </CardTitle>                <p className="text-gray-500 text-xs mt-1">Registered accounts</p>                <p className="text-gray-500 text-xs mt-1">Registered accounts</p>

          </CardHeader>

          <CardContent className="p-6">              </div>              </div>

            <div className="space-y-4">

              <div className="flex items-center justify-between">              <div className="p-3 bg-blue-100 rounded-full">              <div className="p-3 bg-blue-100 rounded-full">

                <div className="flex items-center gap-3">

                  <Database className="w-5 h-5 text-gray-600" />                <Users className="h-6 w-6 text-blue-600" />                <Users className="h-6 w-6 text-blue-600" />

                  <span className="text-gray-700">Database</span>

                </div>              </div>              </div>

                <div className="flex items-center gap-2">

                  <CheckCircle className="w-4 h-4 text-green-600" />            </div>            </div>

                  <span className="text-green-600 text-sm font-medium">Healthy</span>

                </div>          </CardContent>          </CardContent>

              </div>

              <div className="flex items-center justify-between">        </Card>        </Card>

                <div className="flex items-center gap-3">

                  <Server className="w-5 h-5 text-gray-600" />

                  <span className="text-gray-700">API Server</span>

                </div>        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

                <div className="flex items-center gap-2">

                  <CheckCircle className="w-4 h-4 text-green-600" />          <CardContent className="p-6">          <CardContent className="p-6">

                  <span className="text-green-600 text-sm font-medium">Healthy</span>

                </div>            <div className="flex items-center justify-between">            <div className="flex items-center justify-between">

              </div>

              <div className="flex items-center justify-between">              <div>              <div>

                <div className="flex items-center gap-3">

                  <Database className="w-5 h-5 text-gray-600" />                <p className="text-sm font-medium text-gray-600">Active Users</p>                <p className="text-sm font-medium text-gray-600">Active Users</p>

                  <span className="text-gray-700">Storage</span>

                </div>                <p className="text-3xl font-bold text-gray-900 mt-2">                <p className="text-3xl font-bold text-gray-900 mt-2">

                <div className="flex items-center gap-2">

                  <CheckCircle className="w-4 h-4 text-green-600" />                  {stats.activeUsers.toLocaleString()}                  {stats.activeUsers.toLocaleString()}

                  <span className="text-green-600 text-sm font-medium">Healthy</span>

                </div>                </p>                </p>

              </div>

              <div className="flex items-center justify-between">                <p className="text-gray-500 text-xs mt-1">Last 30 days</p>                <p className="text-gray-500 text-xs mt-1">Last 30 days</p>

                <div className="flex items-center gap-3">

                  <BarChart3 className="w-5 h-5 text-gray-600" />              </div>              </div>

                  <span className="text-gray-700">Cache</span>

                </div>              <div className="p-3 bg-green-100 rounded-full">              <div className="p-3 bg-green-100 rounded-full">

                <div className="flex items-center gap-2">

                  <AlertTriangle className="w-4 h-4 text-yellow-600" />                <Activity className="h-6 w-6 text-green-600" />                <Activity className="h-6 w-6 text-green-600" />

                  <span className="text-yellow-600 text-sm font-medium">Warning</span>

                </div>              </div>              </div>

              </div>

            </div>            </div>            </div>

          </CardContent>

        </Card>          </CardContent>          </CardContent>



        {/* Quick Actions */}        </Card>        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">

          <CardHeader className="border-b border-gray-200">

            <CardTitle className="text-gray-900 flex items-center gap-2 text-lg">

              <Activity className="w-5 h-5" />        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

              Quick Actions

            </CardTitle>          <CardContent className="p-6">          <CardContent className="p-6">

          </CardHeader>

          <CardContent className="p-6">            <div className="flex items-center justify-between">            <div className="flex items-center justify-between">

            <div className="space-y-3">

              <Link href="/admin/blog">              <div>              <div>

                <Button variant="outline" className="w-full justify-start hover:bg-gray-50">

                  <BarChart3 className="w-4 h-4 mr-3 text-gray-700" />                <p className="text-sm font-medium text-gray-600">System Health</p>                <p className="text-sm font-medium text-gray-600">System Health</p>

                  Manage Blogs

                </Button>                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.systemHealth}%</p>                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.systemHealth}%</p>

              </Link>

              <Link href="/admin/user-management">                <p className="text-gray-500 text-xs mt-1">Performance score</p>                <p className="text-gray-500 text-xs mt-1">Performance score</p>

                <Button variant="outline" className="w-full justify-start hover:bg-gray-50">

                  <Users className="w-4 h-4 mr-3 text-gray-700" />              </div>              </div>

                  Manage Users

                </Button>              <div className="p-3 bg-purple-100 rounded-full">              <div className="p-3 bg-purple-100 rounded-full">

              </Link>

              <Link href="/admin/recruiters">                <TrendingUp className="h-6 w-6 text-purple-600" />                <TrendingUp className="h-6 w-6 text-purple-600" />

                <Button variant="outline" className="w-full justify-start hover:bg-gray-50">

                  <Activity className="w-4 h-4 mr-3 text-gray-700" />              </div>              </div>

                  Manage Recruiters

                </Button>            </div>            </div>

              </Link>

            </div>          </CardContent>          </CardContent>

          </CardContent>

        </Card>        </Card>        </Card>

      </div>



      {/* Recent Activity */}

      <Card className="bg-white border border-gray-200 shadow-sm">        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

        <CardHeader className="border-b border-gray-200">

          <CardTitle className="text-gray-900 flex items-center gap-2 text-lg">          <CardContent className="p-6">          <CardContent className="p-6">

            <Activity className="w-5 h-5" />

            Recent System Activity            <div className="flex items-center justify-between">            <div className="flex items-center justify-between">

          </CardTitle>

        </CardHeader>              <div>              <div>

        <CardContent className="p-6">

          <div className="space-y-4">                <p className="text-sm font-medium text-gray-600">Uptime</p>                <p className="text-sm font-medium text-gray-600">Uptime</p>

            <div className="flex items-center gap-3 text-sm">

              <div className="w-2 h-2 bg-green-500 rounded-full"></div>                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.uptime}</p>                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.uptime}</p>

              <span className="text-gray-600">System backup completed successfully</span>

              <span className="text-gray-400 ml-auto">2 hours ago</span>                <p className="text-gray-500 text-xs mt-1">Last 30 days</p>                <p className="text-gray-500 text-xs mt-1">Last 30 days</p>

            </div>

            <div className="flex items-center gap-3 text-sm">              </div>              </div>

              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>

              <span className="text-gray-600">New user registration: john.doe@example.com</span>              <div className="p-3 bg-orange-100 rounded-full">              <div className="p-3 bg-orange-100 rounded-full">

              <span className="text-gray-400 ml-auto">4 hours ago</span>

            </div>                <Clock className="h-6 w-6 text-orange-600" />                <Clock className="h-6 w-6 text-orange-600" />

            <div className="flex items-center gap-3 text-sm">

              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>              </div>              </div>

              <span className="text-gray-600">Cache performance warning detected</span>

              <span className="text-gray-400 ml-auto">6 hours ago</span>            </div>            </div>

            </div>

            <div className="flex items-center gap-3 text-sm">          </CardContent>          </CardContent>

              <div className="w-2 h-2 bg-green-500 rounded-full"></div>

              <span className="text-gray-600">Database optimization completed</span>        </Card>        </Card>

              <span className="text-gray-400 ml-auto">1 day ago</span>

            </div>      </div>      </div>

          </div>

        </CardContent>

      </Card>

    </div>      {/* Quick Actions & System Status */}      {/* Quick Actions & System Status */}

  );

}      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* System Status */}        {/* System Status */}

        <Card className="bg-white border border-gray-200 shadow-sm">        <Card className="bg-white border border-gray-200 shadow-sm">

          <CardHeader className="border-b border-gray-200">          <CardHeader className="border-b border-gray-200">

            <CardTitle className="text-gray-900 flex items-center gap-2 text-lg">            <CardTitle className="text-gray-900 flex items-center gap-2 text-lg">

              <Database className="w-5 h-5" />              <Database className="w-5 h-5" />

              System Status              System Status

            </CardTitle>            </CardTitle>

          </CardHeader>          </CardHeader>

          <CardContent className="p-6">          <CardContent className="p-6">

            <div className="space-y-4">            <div className="space-y-4">

              <div className="flex items-center justify-between">              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">                <div className="flex items-center gap-3">

                  <Database className="w-5 h-5 text-gray-600" />                  <Database className="w-5 h-5 text-gray-600" />

                  <span className="text-gray-700">Database</span>                  <span className="text-gray-700">Database</span>

                </div>                </div>

                <div className="flex items-center gap-2">                <div className="flex items-center gap-2">

                  <CheckCircle className="w-4 h-4 text-green-600" />                  <CheckCircle className="w-4 h-4 text-green-600" />

                  <span className="text-green-600 text-sm font-medium">Healthy</span>                  <span className="text-green-600 text-sm font-medium">Healthy</span>

                </div>                </div>

              </div>              </div>

              <div className="flex items-center justify-between">              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">                <div className="flex items-center gap-3">

                  <Server className="w-5 h-5 text-gray-600" />                  <Server className="w-5 h-5 text-gray-600" />

                  <span className="text-gray-700">API Server</span>                  <span className="text-gray-700">API Server</span>

                </div>                </div>

                <div className="flex items-center gap-2">                <div className="flex items-center gap-2">

                  <CheckCircle className="w-4 h-4 text-green-600" />                  <CheckCircle className="w-4 h-4 text-green-600" />

                  <span className="text-green-600 text-sm font-medium">Healthy</span>                  <span className="text-green-600 text-sm font-medium">Healthy</span>

                </div>                </div>

              </div>              </div>

              <div className="flex items-center justify-between">              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">                <div className="flex items-center gap-3">

                  <Database className="w-5 h-5 text-gray-600" />                  <Database className="w-5 h-5 text-gray-600" />

                  <span className="text-gray-700">Storage</span>                  <span className="text-gray-700">Storage</span>

                </div>                </div>

                <div className="flex items-center gap-2">                <div className="flex items-center gap-2">

                  <CheckCircle className="w-4 h-4 text-green-600" />                  <CheckCircle className="w-4 h-4 text-green-600" />

                  <span className="text-green-600 text-sm font-medium">Healthy</span>                  <span className="text-green-600 text-sm font-medium">Healthy</span>

                </div>                </div>

              </div>              </div>

              <div className="flex items-center justify-between">              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">                <div className="flex items-center gap-3">

                  <BarChart3 className="w-5 h-5 text-gray-600" />                  <BarChart3 className="w-5 h-5 text-gray-600" />

                  <span className="text-gray-700">Cache</span>                  <span className="text-gray-700">Cache</span>

                </div>                </div>

                <div className="flex items-center gap-2">                <div className="flex items-center gap-2">

                  <AlertTriangle className="w-4 h-4 text-yellow-600" />                  <AlertTriangle className="w-4 h-4 text-yellow-600" />

                  <span className="text-yellow-600 text-sm font-medium">Warning</span>                  <span className="text-yellow-600 text-sm font-medium">Warning</span>

                </div>                </div>

              </div>              </div>

            </div>            </div>

          </CardContent>          </CardContent>

        </Card>        </Card>



        {/* Quick Actions */}        {/* Quick Actions */}

        <Card className="bg-white border border-gray-200 shadow-sm">        <Card className="bg-white border border-gray-200 shadow-sm">

          <CardHeader className="border-b border-gray-200">          <CardHeader className="border-b border-gray-200">

            <CardTitle className="text-gray-900 flex items-center gap-2 text-lg">            <CardTitle className="text-gray-900 flex items-center gap-2 text-lg">

              <Activity className="w-5 h-5" />              <Activity className="w-5 h-5" />

              Quick Actions              Quick Actions

            </CardTitle>            </CardTitle>

          </CardHeader>          </CardHeader>

          <CardContent className="p-6">          <CardContent className="p-6">

            <div className="space-y-3">            <div className="space-y-3">

              <Link href="/admin/blog">              <Link href="/admin/blog">

                <Button variant="outline" className="w-full justify-start hover:bg-gray-50">                <Button variant="outline" className="w-full justify-start hover:bg-gray-50">

                  <BarChart3 className="w-4 h-4 mr-3 text-gray-700" />                  <BarChart3 className="w-4 h-4 mr-3 text-gray-700" />

                  Manage Blogs                  Manage Blogs

                </Button>                </Button>

              </Link>              </Link>

              <Link href="/admin/user-management">              <Link href="/admin/user-management">

                <Button variant="outline" className="w-full justify-start hover:bg-gray-50">                <Button variant="outline" className="w-full justify-start hover:bg-gray-50">

                  <Users className="w-4 h-4 mr-3 text-gray-700" />                  <Users className="w-4 h-4 mr-3 text-gray-700" />

                  Manage Users                  Manage Users

                </Button>                </Button>

              </Link>              </Link>

              <Link href="/admin/recruiters">              <Link href="/admin/recruiters">

                <Button variant="outline" className="w-full justify-start hover:bg-gray-50">                <Button variant="outline" className="w-full justify-start hover:bg-gray-50">

                  <Activity className="w-4 h-4 mr-3 text-gray-700" />                  <Activity className="w-4 h-4 mr-3 text-gray-700" />

                  Manage Recruiters                  Manage Recruiters

                </Button>                </Button>

              </Link>              </Link>

            </div>            </div>

          </CardContent>          </CardContent>

        </Card>        </Card>

      </div>      </div>



      {/* Recent Activity */}      {/* Recent Activity */}

      <Card className="bg-white border border-gray-200 shadow-sm">      <Card className="bg-white border border-gray-200 shadow-sm">

        <CardHeader className="border-b border-gray-200">        <CardHeader className="border-b border-gray-200">

          <CardTitle className="text-gray-900 flex items-center gap-2 text-lg">          <CardTitle className="text-gray-900 flex items-center gap-2 text-lg">

            <Activity className="w-5 h-5" />            <Activity className="w-5 h-5" />

            Recent System Activity            Recent System Activity

          </CardTitle>          </CardTitle>

        </CardHeader>        </CardHeader>

        <CardContent className="p-6">        <CardContent className="p-6">

          <div className="space-y-4">          <div className="space-y-4">

            <div className="flex items-center gap-3 text-sm">            <div className="flex items-center gap-3 text-sm">

              <div className="w-2 h-2 bg-green-500 rounded-full"></div>              <div className="w-2 h-2 bg-green-500 rounded-full"></div>

              <span className="text-gray-600">System backup completed successfully</span>              <span className="text-gray-600">System backup completed successfully</span>

              <span className="text-gray-400 ml-auto">2 hours ago</span>              <span className="text-gray-400 ml-auto">2 hours ago</span>

            </div>            </div>

            <div className="flex items-center gap-3 text-sm">            <div className="flex items-center gap-3 text-sm">

              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>

              <span className="text-gray-600">New user registration: john.doe@example.com</span>              <span className="text-gray-600">New user registration: john.doe@example.com</span>

              <span className="text-gray-400 ml-auto">4 hours ago</span>              <span className="text-gray-400 ml-auto">4 hours ago</span>

            </div>            </div>

            <div className="flex items-center gap-3 text-sm">            <div className="flex items-center gap-3 text-sm">

              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>

              <span className="text-gray-600">Cache performance warning detected</span>              <span className="text-gray-600">Cache performance warning detected</span>

              <span className="text-gray-400 ml-auto">6 hours ago</span>              <span className="text-gray-400 ml-auto">6 hours ago</span>

            </div>            </div>

            <div className="flex items-center gap-3 text-sm">            <div className="flex items-center gap-3 text-sm">

              <div className="w-2 h-2 bg-green-500 rounded-full"></div>              <div className="w-2 h-2 bg-green-500 rounded-full"></div>

              <span className="text-gray-600">Database optimization completed</span>              <span className="text-gray-600">Database optimization completed</span>

              <span className="text-gray-400 ml-auto">1 day ago</span>              <span className="text-gray-400 ml-auto">1 day ago</span>

            </div>            </div>

          </div>          </div>

        </CardContent>        </CardContent>

      </Card>      </Card>

    </div>    </div>

  );  );

}}

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Registered accounts
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.activeUsers.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Last 30 days</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    System Health
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.systemHealth}%
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Performance score
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uptime</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.uptime}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Last 30 days</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* System Status */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 text-sm font-medium">
                      Healthy
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">API Server</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 text-sm font-medium">
                      Healthy
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 text-sm font-medium">
                      Healthy
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Cache</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-600 text-sm font-medium">
                      Warning
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Link href="/admin/blog" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-3 text-gray-700" />
                    Manage Blogs
                  </Button>
                </Link>
                <Link href="/admin/users" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-3 text-gray-700" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/settings" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-3 text-gray-700" />
                    System Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent System Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">
                  System backup completed successfully
                </span>
                <span className="text-gray-400 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  New user registration: john.doe@example.com
                </span>
                <span className="text-gray-400 ml-auto">4 hours ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">
                  Cache performance warning detected
                </span>
                <span className="text-gray-400 ml-auto">6 hours ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">
                  Database optimization completed
                </span>
                <span className="text-gray-400 ml-auto">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
