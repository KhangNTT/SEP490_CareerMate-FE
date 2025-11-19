import { FiEdit } from "react-icons/fi";
import { FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaLink, FaGenderless } from "react-icons/fa";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { Link2 } from "lucide-react";

interface ProfileHeaderCardProps {
    profileName: string;
    profileTitle: string;
    profileImage: string;
    profilePhone: string;
    profileDob: string;
    profileGender: string;
    profileAddress: string;
    profileLink: string;
    email: string;
    onEditPersonalDetails: () => void;
}

export default function ProfileHeaderCard({
    profileName,
    profileTitle,
    profileImage,
    profilePhone,
    profileDob,
    profileGender,
    profileAddress,
    profileLink,
    email,
    onEditPersonalDetails
}: ProfileHeaderCardProps) {
    // Determine gender icon based on profileGender value
    const getGenderIcon = () => {
        const gender = profileGender?.toLowerCase();
        if (gender === 'male') {
            return <BsGenderMale className="text-gray-400 text-base" />;
        } else if (gender === 'female') {
            return <BsGenderFemale className="text-gray-400 text-base" />;
        } else {
            // For 'other' or empty/undefined
            return <FaGenderless className="text-gray-400 text-base" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-semibold text-gray-600">
                                {profileName ? profileName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'LA'}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            {profileName || 'Your full name'}
                        </h1>
                        <p className="text-base font-semibold text-gray-900">
                            {profileTitle || 'Your title'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onEditPersonalDetails}
                    className="text-gray-600 hover:text-gray-700 p-2"
                    title="Edit Personal Details"
                >
                    <FiEdit className="w-5 h-5" />
                </button>
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2.5">
                    <FaEnvelope className="text-gray-400 text-base" />
                    <span className={email ? "text-gray-900 font-medium" : "text-gray-400"}>
                        {email || "example@gmail.com"}
                    </span>
                </div>
                <div className="flex items-center space-x-2.5">
                    <FaPhone className="text-gray-400 text-base" />
                    <span className={profilePhone ? "text-gray-900 font-medium" : "text-gray-400"}>
                        {profilePhone || "Your phone number"}
                    </span>
                </div>
                <div className="flex items-center space-x-2.5">
                    <FaCalendar className="text-gray-400 text-base" />
                    <span className={profileDob ? "text-gray-900 font-medium" : "text-gray-400"}>
                        {profileDob || "Your date of birth"}
                    </span>
                </div>
                <div className="flex items-center space-x-2.5">
                    {getGenderIcon()}
                    <span className={profileGender ? "text-gray-900 font-medium" : "text-gray-400"}>
                        {profileGender || "Your gender"}
                    </span>
                </div>
                <div className="flex items-center space-x-2.5">
                    <FaMapMarkerAlt className="text-gray-400 text-base" />
                    <span className={profileAddress ? "text-gray-900 font-medium" : "text-gray-400"}>
                        {profileAddress || "Your current address"}
                    </span>
                </div>
                <div className="flex items-center space-x-2.5">
                    <Link2 className="text-gray-400 text-base" />
                    {profileLink ? (
                        <a
                            href={profileLink.startsWith('http') ? profileLink : `https://${profileLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 font-medium underline hover:underline-offset-2 transition-colors"
                        >
                            {profileLink}
                        </a>
                    ) : (
                        <span className="text-gray-400">Your personal link</span>
                    )}
                </div>
            </div>
        </div>
    );
}
