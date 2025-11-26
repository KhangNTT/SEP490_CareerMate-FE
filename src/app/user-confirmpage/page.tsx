"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";

export default function UserTypeSelectionPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("");

  const handleSelect = (type: string) => {
    setSelectedType(type);
    if (type === "recruiter") {
      router.push("/sign-up-recruiter");
    } else {
      router.push("/sign-up-candidate");
    }
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="relative mx-auto max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
        >
          <X className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
        </button>

        {/* Content */}
        <div className="p-14 text-center max-h-[90vh] overflow-y-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Hello there,</h2>
          <p className="text-lg text-gray-600 mb-12">
            Please take a few seconds to confirm your information below! 👋
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            To optimize your experience with CareerMate,
          </h3>
          <p className="text-lg text-gray-600 mb-14">
            please choose the group that best matches you.
          </p>

          {/* 2 options */}
          <div className="grid gap-12 md:grid-cols-2">
            {/* Recruiter */}
            <div
              onClick={() => handleSelect("recruiter")}
              className="cursor-pointer group"
            >
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 rounded-full overflow-hidden mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <img
                    src="/img/employers.png"
                    alt="Recruiter"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="rounded-full bg-[#6da9e9] px-8 py-3 text-base font-semibold text-white hover:bg-[#5a9bd4] transition-colors">
                  I’m a recruiter
                </button>
              </div>
            </div>

            {/* Candidate */}
            <div
              onClick={() => handleSelect("candidate")}
              className="cursor-pointer group"
            >
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 rounded-full overflow-hidden mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <img
                    src="/img/candidates.png"
                    alt="Candidate"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="rounded-full bg-[#6da9e9] px-8 py-3 text-base font-semibold text-white hover:bg-[#5a9bd4] transition-colors">
                  I’m a job seeker
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
