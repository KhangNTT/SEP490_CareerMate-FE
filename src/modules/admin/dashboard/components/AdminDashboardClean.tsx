"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Users, BarChart3, TrendingUp, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardClean() {
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
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">System Overview & Management</p>
        </div>
        <div className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          All Systems Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-muted-foreground text-xs mt-1">Registered accounts</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.activeUsers.toLocaleString()}</p>
                <p className="text-muted-foreground text-xs mt-1">Currently online</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.systemHealth}%</p>
                <p className="text-muted-foreground text-xs mt-1">All services running</p>
              </div>
              <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-full">
                <TrendingUp className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.uptime}</p>
                <p className="text-muted-foreground text-xs mt-1">Last 30 days</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
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

        <Card className="bg-card border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-foreground">Database</span>
              </div>
              <span className="text-xs font-medium text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">API Server</span>
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
