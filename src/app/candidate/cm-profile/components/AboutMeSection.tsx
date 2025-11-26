import { FiEdit } from "react-icons/fi";
import { Plus } from "lucide-react";

interface AboutMeSectionProps {
    aboutMeText: string;
    onEdit: () => void;
}

export default function AboutMeSection({ aboutMeText, onEdit }: AboutMeSectionProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    About Me
                </h2>
                {aboutMeText ? (
                    <button
                        onClick={onEdit}
                        className="text-gray-600 hover:text-gray-700 p-2"
                        title="Edit About Me"
                    >
                        <FiEdit className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={onEdit}
                        className="text-gray-600 hover:text-gray-700 p-2"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                )}
            </div>
            {aboutMeText ? (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{aboutMeText}</p>
                </div>
            ) : (
                <p className="text-gray-400 text-sm italic">
                    Introduce your strengths and years of experience
                </p>
            )}
        </div>
    );
}
