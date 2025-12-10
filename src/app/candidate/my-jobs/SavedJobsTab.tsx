"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { type SavedJobFeedback, unsaveJob } from "@/lib/job-api";
import { getDaysDiff } from "@/lib/my-jobs-utils";
import { InfoIcon, CompanyLogoPlaceholder, BookmarkIcon } from "@/components/ui/icons";
import { AiFillStar } from "react-icons/ai";

interface SavedJobsTabProps {
    savedJobs: SavedJobFeedback[];
    candidateId: number | null;
    onJobUnsaved: (jobId: number) => void;
}

const SavedJobsTab = ({ savedJobs, candidateId, onJobUnsaved }: SavedJobsTabProps) => {
    const [localSavedJobs, setLocalSavedJobs] = useState(savedJobs);

    const handleUnsaveJob = async (jobId: number) => {
        if (!candidateId) {
            toast.error("Please login to unsave jobs");
            return;
        }

        try {
            await unsaveJob(candidateId, jobId);
            setLocalSavedJobs(prev => prev.filter(job => job.jobId !== jobId));
            onJobUnsaved(jobId);
            toast.success("Job removed from saved");
        } catch (error: any) {
            toast.error('Failed to remove job from saved');
        }
    };

    return (
        <div>
            {/* Header with info and sort */}
            <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <InfoIcon />
                    <span>You can save up to 20 jobs.</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>Sort by:</span>
                    <button className="font-medium text-gray-900 flex items-center gap-1">
                        Nearest expiration time
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Saved Jobs List */}
            {localSavedJobs.length > 0 && (
                <div className="space-y-4">
                    {localSavedJobs.map((job) => {
                        const postedDays = getDaysDiff(job.createdAt);

                        return (
                            <div
                                key={job.id}
                                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Company Logo */}
                                    <CompanyLogoPlaceholder />

                                    {/* Job Info */}
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/jobs-detail?id=${job.jobId}`}
                                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors block mb-2"
                                        >
                                            {job.jobTitle}
                                        </Link>

                                        <p className="text-gray-700 mb-2">{job.candidateName}</p>

                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                                            <span>{job.candidateName}</span>
                                            <span>•</span>
                                            <span>At office</span>
                                        </div>

                                        <div className="salary-badge">
                                            💰 1,500 - 4,000 USD
                                        </div>
                                    </div>

                                    {/* Right Side - Posted Info and Actions */}
                                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                        <div className="text-right text-sm">
                                            <p className="text-gray-600">Posted {postedDays} days ago</p>
                                            <p className="text-orange-500">(Expires in 19 days)</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/jobs-detail/${job.jobId}/apply`}
                                                className="px-6 py-2 bg-gradient-to-r from-[#3a4660] to-gray-400 text-white rounded-md font-medium hover:from-[#3a4660] hover:to-[#3a4660] transition-colors"
                                            >
                                                Apply Now
                                            </Link>
                                            <button
                                                onClick={() => handleUnsaveJob(job.jobId)}
                                                className="p-3 border-2 border-yellow-500 bg-yellow-50 rounded-md hover:bg-yellow-100 transition-colors"
                                                title="Remove from saved"
                                            >
                                                <AiFillStar className="w-6 h-6 text-yellow-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty state */}
            {localSavedJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="bg-gray-200 p-4 rounded-lg mb-4">
                        <BookmarkIcon className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-6">
                        You haven't saved any jobs yet.
                    </p>
                    <Link
                        href="/jobs-list"
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium"
                    >
                        Explore jobs
                    </Link>
                </div>
            )}
        </div>
    );
};

export default SavedJobsTab;
