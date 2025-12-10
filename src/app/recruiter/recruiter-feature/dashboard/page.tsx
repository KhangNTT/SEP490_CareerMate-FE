"use client";

import { Users, Briefcase, Eye, TrendingUp, Calendar, FileText, Search, BarChart3, User, Building, CreditCard, CheckCircle, Package, Info, X, Sparkles, Star, Award, Zap, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecruiterInvoice, formatRelativeTime, formatInvoicePrice, type RecruiterInvoice } from "@/lib/recruiter-invoice-api";
import { getRecruiterStats, getRecruiterApplications, getRecruiterJobPostings, type JobPostingStats, type JobApplication, type RecruiterJobPosting } from "@/lib/recruiter-api";

export default function RecruiterDashboardPage() {
    const router = useRouter();
    const [invoice, setInvoice] = useState<RecruiterInvoice | null>(null);
    const [loadingInvoice, setLoadingInvoice] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [stats, setStats] = useState<JobPostingStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [recentCandidates, setRecentCandidates] = useState<JobApplication[]>([]);
    const [loadingCandidates, setLoadingCandidates] = useState(true);
    const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
    const [quickJobs, setQuickJobs] = useState<RecruiterJobPosting[]>([]);
    const [loadingQuickJobs, setLoadingQuickJobs] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch invoice
            try {
                const data = await getRecruiterInvoice();
                setInvoice(data);
            } catch (error: any) {
                // No invoice is ok, user might not have purchased anything yet
                if (error.message !== 'NO_INVOICE_FOUND') {
                    console.error('Failed to fetch invoice:', error);
                }
            } finally {
                setLoadingInvoice(false);
            }

            // Fetch stats
            try {
                const response = await getRecruiterStats();
                if (response.code === 200) {
                    setStats(response.result);
                }
            } catch (error: any) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoadingStats(false);
            }

            // Fetch recent candidates (applications)
            try {
                const response = await getRecruiterApplications();
                if (response.code === 200) {
                    // Sort by createAt descending and take first 5
                    const sorted = [...response.result]
                        .sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())
                        .slice(0, 5);
                    setRecentCandidates(sorted);
                }
            } catch (error: any) {
                console.error('Failed to fetch recent candidates:', error);
            } finally {
                setLoadingCandidates(false);
            }

            // Fetch quick jobs (3 most recent)
            try {
                const response = await getRecruiterJobPostings({ page: 0, size: 3 });
                if ((response.code === 0 || response.code === 200) && response.result) {
                    setQuickJobs(response.result.content);
                }
            } catch (error: any) {
                console.error('Failed to fetch quick jobs:', error);
            } finally {
                setLoadingQuickJobs(false);
            }
        };

        fetchData();
    }, []);

    // Auto-scroll effect for candidates
    useEffect(() => {
        if (recentCandidates.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentCandidateIndex((prev) => 
                prev >= recentCandidates.length - 1 ? 0 : prev + 1
            );
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [recentCandidates.length]);

    const handleClick = () => {
        router.push("/recruiter/jobs/create");
    };

    return (
        <>
            {/* Header with greeting and summary */}
            <div className="mb-6 bg-gradient-to-r from-[#e8f1fe] to-[#ccdff9] rounded-lg p-6">
                {/* Top section with greeting and stats */}
                <div className="flex items-start justify-between mb-6">
                    {/* Left: Greeting and intro */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-[#313131] mb-3">
                            Hello, <span className="text-[#ff2f2f]">Ronaldo</span> welcome to CareerMate! 🎉
                        </h1>
                    </div>
                </div>

                {/* Bottom section with welcome message and illustration */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    {/* Welcome content */}
                    <div className="lg:col-span-2">
                        <p className="text-[#313131] mb-4">
                            You have successfully registered! Start hiring the best talent for your company.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleClick}
                                className="rounded-lg bg-[#24497b] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#436a9d]"
                            >
                                Post your job
                            </button>
                            <button className="rounded-lg border border-[#96add0] px-6 py-2.5 text-sm font-medium text-[#436a9d] transition-colors hover:bg-[#fff]">
                                Learn more
                            </button>
                        </div>
                    </div>

                    {/* Illustration */}
                    <div className="lg:col-span-1">
                        <div className=" flex items-center justify-center">
                            <div className="text-center">
                                <img src="/img/dashboard1.png" alt="Dashboard 1"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <div className="flex items-center">
                        <div className="rounded-full bg-blue-100 p-3">
                            <Briefcase className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Jobs Posted</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loadingStats ? (
                                    <span className="inline-block animate-pulse bg-gray-200 rounded w-12 h-8"></span>
                                ) : (
                                    stats?.totalJobPostings || 0
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <div className="flex items-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Candidates</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loadingStats ? (
                                    <span className="inline-block animate-pulse bg-gray-200 rounded w-12 h-8"></span>
                                ) : (
                                    stats?.totalApplications || 0
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <div className="flex items-center">
                        <div className="rounded-full bg-yellow-100 p-3">
                            <Eye className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Views</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <div className="flex items-center">
                        <div className="rounded-full bg-purple-100 p-3">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Match Rate</p>
                            <p className="text-2xl font-bold text-gray-900">0%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout for Job Overview and Quick Job Post Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Left Column - Job Overview */}
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-600" />
                            Job Overview
                        </h3>
                        <button 
                            onClick={() => router.push('/recruiter/recruiter-feature/jobs/active')}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Manage →
                        </button>
                    </div>

                    {loadingStats ? (
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="p-3 rounded-lg bg-gray-50 animate-pulse">
                                    <div className="h-8 bg-gray-200 rounded w-10 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {/* Active Jobs */}
                                <div className="group p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all cursor-pointer"
                                     onClick={() => router.push('/recruiter/recruiter-feature/jobs/active')}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle className="h-4 w-4 text-green-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-medium text-gray-600">Active</span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-700">{stats?.activeJobPostings || 0}</div>
                                </div>

                                {/* Pending Jobs */}
                                <div className="group p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 transition-all cursor-pointer"
                                     onClick={() => router.push('/recruiter/recruiter-feature/jobs/create')}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="h-4 w-4 text-yellow-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-medium text-gray-600">Pending</span>
                                    </div>
                                    <div className="text-2xl font-bold text-yellow-700">{stats?.pendingJobPostings || 0}</div>
                                </div>

                                {/* Expired Jobs */}
                                <div className="group p-3 rounded-lg bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all cursor-pointer"
                                     onClick={() => router.push('/recruiter/recruiter-feature/jobs/drafts')}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <X className="h-4 w-4 text-red-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-medium text-gray-600">Expired</span>
                                    </div>
                                    <div className="text-2xl font-bold text-red-700">{stats?.expiredJobPostings || 0}</div>
                                </div>

                                {/* Rejected Jobs */}
                                <div className="group p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all cursor-pointer"
                                     onClick={() => router.push('/recruiter/recruiter-feature/jobs/drafts')}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FileText className="h-4 w-4 text-gray-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-medium text-gray-600">Rejected</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-700">{stats?.rejectedJobPostings || 0}</div>
                                </div>
                            </div>

                            {/* Total Summary with Animation */}
                            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-600 rounded-lg">
                                            <Briefcase className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Total Jobs Posted</p>
                                            <p className="text-lg font-bold text-blue-900">{stats?.totalJobPostings || 0}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        <Award className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Column - Quick Job Post Management */}
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-sky-600" />
                            Quick Actions
                        </h3>
                    </div>

                    {loadingQuickJobs ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-3 rounded-lg bg-gray-50 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Create New Job */}
                            <button 
                                onClick={() => router.push('/recruiter/recruiter-feature/jobs/create')}
                                className="w-full group p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all text-left border-2 border-transparent hover:border-blue-300"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <Briefcase className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-blue-900">Post New Job</p>
                                        <p className="text-xs text-blue-700 mt-0.5">Create and publish job posting</p>
                                    </div>
                                    <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                                        →
                                    </div>
                                </div>
                            </button>

                            {/* View All Jobs */}
                            <button 
                                onClick={() => router.push('/recruiter/recruiter-feature/jobs/active')}
                                className="w-full group p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all text-left border-2 border-transparent hover:border-green-300"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <FileText className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-green-900">Manage Jobs</p>
                                        <p className="text-xs text-green-700 mt-0.5">
                                            {quickJobs.length > 0 ? `${quickJobs.length} recent jobs` : 'View all job postings'}
                                        </p>
                                    </div>
                                    <div className="text-green-600 group-hover:translate-x-1 transition-transform">
                                        →
                                    </div>
                                </div>
                            </button>

                            {/* View Candidates */}
                            <button 
                                onClick={() => router.push('/recruiter/recruiter-feature/candidates/applications')}
                                className="w-full group p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all text-left border-2 border-transparent hover:border-purple-300"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-purple-900">View Applications</p>
                                        <p className="text-xs text-purple-700 mt-0.5">
                                            {stats?.totalApplications || 0} total applications
                                        </p>
                                    </div>
                                    <div className="text-purple-600 group-hover:translate-x-1 transition-transform">
                                        →
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Recent Jobs Preview */}
                    {!loadingQuickJobs && quickJobs.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-500 mb-2">Recent Jobs</p>
                            <div className="space-y-2">
                                {quickJobs.slice(0, 2).map((job) => (
                                    <div 
                                        key={job.id}
                                        onClick={() => router.push('/recruiter/recruiter-feature/jobs/active')}
                                        className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                job.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                job.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {job.status}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatRelativeTime(job.createAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recently Updated Candidates - Full Width */}
            <div className="mb-8">
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recently Updated Candidates</h3>
                        {recentCandidates.length > 0 && (
                            <div className="text-sm text-gray-500">
                                {currentCandidateIndex + 1}/{recentCandidates.length}
                            </div>
                        )}
                    </div>

                    {loadingCandidates ? (
                        <div className="border rounded-lg p-4 animate-pulse">
                            <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        </div>
                    ) : recentCandidates.length > 0 ? (
                        <>
                            <div className="border rounded-lg p-4 transition-all duration-500">
                                <div className="flex items-start space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 truncate">{recentCandidates[currentCandidateIndex].fullName}</h4>
                                        <p className="text-sm text-gray-600 truncate">Job: {recentCandidates[currentCandidateIndex].jobTitle}</p>
                                        <p className="text-sm text-gray-600">Phone: {recentCandidates[currentCandidateIndex].phoneNumber}</p>
                                        <p className="text-sm text-gray-600 truncate">Location: {recentCandidates[currentCandidateIndex].preferredWorkLocation}</p>
                                        <div className="mt-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                recentCandidates[currentCandidateIndex].status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                                                recentCandidates[currentCandidateIndex].status === 'REVIEWING' ? 'bg-yellow-100 text-yellow-800' :
                                                recentCandidates[currentCandidateIndex].status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                recentCandidates[currentCandidateIndex].status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {recentCandidates[currentCandidateIndex].status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        Applied {formatRelativeTime(recentCandidates[currentCandidateIndex].createAt)}
                                    </span>
                                    <button 
                                        onClick={() => router.push('/recruiter/recruiter-feature/candidates/applications')}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View Details →
                                    </button>
                                </div>
                            </div>

                            {/* Navigation dots */}
                            {recentCandidates.length > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    {recentCandidates.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentCandidateIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                index === currentCandidateIndex 
                                                    ? 'bg-blue-600 w-6' 
                                                    : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="border rounded-lg p-8 text-center">
                            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No recent candidates yet</p>
                            <p className="text-sm text-gray-400 mt-1">Applications will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Package Management & Billing */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Package className="h-5 w-5 text-sky-600" />
                        Package Management
                    </h3>
                    <div className="space-y-3">
                        <button 
                            onClick={() => router.push('/recruiter/recruiter-feature/profile/billing')}
                            className="w-full rounded-lg border border-sky-200 p-3 text-left transition-colors hover:bg-sky-50"
                        >
                            <p className="font-medium text-sky-800">View Current Package</p>
                            <p className="text-sm text-sky-600">Check your active subscription and benefits</p>
                        </button>
                        <button 
                            onClick={() => router.push('/recruiter/recruiter-feature/profile/billing')}
                            className="w-full rounded-lg border border-sky-200 p-3 text-left transition-colors hover:bg-sky-50"
                        >
                            <p className="font-medium text-sky-800">Upgrade Package</p>
                            <p className="text-sm text-sky-600">Get more features with premium plans</p>
                        </button>
                        <button 
                            onClick={() => router.push('/recruiter/recruiter-feature/profile')}
                            className="w-full rounded-lg border border-sky-200 p-3 text-left transition-colors hover:bg-sky-50"
                        >
                            <p className="font-medium text-sky-800">Complete company profile</p>
                            <p className="text-sm text-sky-600">Update detailed company information</p>
                        </button>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
                    
                    {loadingInvoice ? (
                        <div className="text-center py-8">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-3">Loading activities...</p>
                        </div>
                    ) : invoice ? (
                        <div className="space-y-3">
                            {/* Package Purchase Activity */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Package Upgraded
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Successfully upgraded to <span className="font-semibold text-blue-600">{invoice.packageName}</span> package
                                                </p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-sm text-gray-500">
                                                        Amount: <span className="font-medium text-gray-700">{formatInvoicePrice(invoice.amount)}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                                <button
                                                    onClick={() => setShowDetails(true)}
                                                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                                    title="View details"
                                                >
                                                    <Eye className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {formatRelativeTime(invoice.startDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Popup */}
                            {showDetails && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetails(false)}>
                                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all" onClick={(e) => e.stopPropagation()}>
                                        {/* Header */}
                                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">Package Details</h3>
                                                    <p className="text-xs text-gray-500">Current subscription information</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowDetails(false)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <X className="h-5 w-5 text-gray-500" />
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                                <span className="text-sm text-gray-600 font-medium">Package Name</span>
                                                <span className="text-sm font-bold text-gray-900 bg-blue-50 px-3 py-1 rounded-full">{invoice.packageName}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                                <span className="text-sm text-gray-600 font-medium">Amount Paid</span>
                                                <span className="text-sm font-bold text-green-600">{formatInvoicePrice(invoice.amount)}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                                <span className="text-sm text-gray-600 font-medium">Start Date</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {new Date(invoice.startDate).toLocaleDateString('vi-VN', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                                <span className="text-sm text-gray-600 font-medium">Valid Until</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {new Date(invoice.endDate).toLocaleDateString('vi-VN', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between py-3">
                                                <span className="text-sm text-gray-600 font-medium">Status</span>
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                                    Active & Valid
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                                            <button
                                                onClick={() => {
                                                    setShowDetails(false);
                                                    router.push('/recruiter/recruiter-feature/profile/billing');
                                                }}
                                                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                                            >
                                                Manage Billing
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center">
                                <Package className="h-16 w-16 text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">No recent activity</p>
                            <p className="text-sm text-gray-400 mt-1">Your activities will be displayed here</p>
                            <button
                                onClick={() => router.push('/recruiter/recruiter-feature/profile/billing')}
                                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Upgrade your package →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}