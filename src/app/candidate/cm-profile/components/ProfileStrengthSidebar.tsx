import { Plus, ChevronDown, ChevronUp } from "lucide-react";

interface ProfileStrengthSidebarProps {
    profileCompletion: number;
    expandedSections: string[];
    onToggleSection: (section: string) => void;
}

export default function ProfileStrengthSidebar({
    profileCompletion,
    expandedSections,
    onToggleSection
}: ProfileStrengthSidebarProps) {
    return (
        <aside className="hidden xl:block space-y-6 sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-5">
                    Profile Strength
                </h3>

                {/* Progress Circle with Gradient */}
                <div className="flex justify-center mb-6">
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <defs>
                                <linearGradient
                                    id="progressGradient"
                                    x1="0%"
                                    y1="0%"
                                    x2="0%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stopColor="#163988" />
                                    <stop offset="100%" stopColor="#9ca3af" />
                                </linearGradient>
                            </defs>

                            {/* Background Circle */}
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#eeeeee"
                                strokeWidth="3"
                            />

                            {/* Progress Circle */}
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="url(#progressGradient)"
                                strokeWidth="3"
                                strokeDasharray={`${profileCompletion}, 100`}
                            />
                        </svg>

                        {/* Text Center */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="text-2xl font-bold">{profileCompletion}%</div>
                            <div className="text-xs text-gray-500">completed</div>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <span className="text-gray-800 font-bold">
                            Complete profile to 70%
                        </span>
                        <span className="text-gray-700">
                            to generate CV template for IT professionals.
                        </span>
                    </div>
                    <div className="flex justify-end">
                        <img
                            src="/images/general/ad2.png"
                            alt="CV Template"
                            className="h-12 w-auto filter grayscale contrast-125 brightness-75"
                        />
                    </div>
                </div>

                {/* Action Items */}
                <div className="space-y-4">
                    <button className="w-full text-left flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <Plus className="w-5 h-5" />
                        <span>Add About me</span>
                    </button>
                    <button className="w-full text-left flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <Plus className="w-5 h-5" />
                        <span>Add Contact Information</span>
                    </button>
                    <button className="w-full text-left flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <Plus className="w-5 h-5" />
                        <span>Add Work Experience</span>
                    </button>

                    <div className="mb-6">
                        <button
                            onClick={() => onToggleSection("more")}
                            className="w-full flex items-center gap-2 text-gray-700 font-medium"
                        >
                            <ChevronDown
                                className={`w-5 h-5 transition-transform duration-300 ${expandedSections.includes("more") ? "rotate-180" : ""
                                    }`}
                            />
                            <span>Add more information</span>
                        </button>

                        {expandedSections.includes("more") && (
                            <button className="w-full text-left flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mt-2">
                                <Plus className="w-5 h-5" />
                                <span>Add Contact Information</span>
                            </button>
                        )}
                    </div>

                    <button
                        className={`w-full py-3 ${profileCompletion >= 70
                                ? "bg-gray-700 hover:bg-red-600"
                                : "bg-gray-400 cursor-not-allowed"
                            } text-white font-medium rounded-md transition`}
                        disabled={profileCompletion < 70}
                    >
                        Preview & Download CV
                    </button>

                    {profileCompletion < 70 && (
                        <p className="text-sm text-center text-gray-500">
                            Complete your profile to 70% to enable CV preview and download.
                        </p>
                    )}
                </div>
            </div>
        </aside>
    );
}
