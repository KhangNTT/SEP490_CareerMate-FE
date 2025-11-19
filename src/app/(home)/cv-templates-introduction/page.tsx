"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./template-styles.css";
import "./fix-size.css";
import {
  ArrowRight,
  FileText,
  Users,
  CheckCircle,
  Star,
  Download,
  Eye,
  Heart,
} from "lucide-react";

export default function CVTemplatesIntroductionPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const templates = [
    {
      id: 1,
      name: "Classic",
      image: "/images/cvtemp/classic.png",
      description: "Classic and elegant template",
    },
    {
      id: 2,
      name: "Vintage",
      image: "/images/cvtemp/vintage.png",
      description: "Classic and unique template",
    },
    {
      id: 3,
      name: "Minimal",
      image: "/images/cvtemp/minimal.png",
      description: "Clean and modern template",
    },
    {
      id: 4,
      name: "Modern",
      image: "/images/cvtemp/modern.png",
      description: "Modern and dynamic template",
    },
    {
      id: 5,
      name: "Polished",
      image: "/images/cvtemp/polished.png",
      description: "Polished and clean template",
    },
    {
      id: 6,
      name: "Professional",
      image: "/images/cvtemp/professional.png",
      description: "Professional and refined template",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedTemplate((prev) =>
        prev === templates.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change slide every 5 seconds for smoother experience

    return () => clearInterval(interval);
  }, [templates.length]);
  const features = [
    {
      image: "/images/general/ad2.png",
      title: "Complete Standard IT CV STRUCTURES",
      description: "IT CV Application & Information",
      content:
        "What makes a CV? 3 most standard CV structures for IT candidates",
      detail:
        "What should a CV include to pass screening and make a strong impression on recruiters? This article will help you compile...",
    },
    {
      image: "/images/general/ad4.png",
      title: "20+ ChatGPT prompts to WRITE better IT CVs",
      description: "IT CV Application & Information",
      content: "How to write CVs with top 20+ best ChatGPT prompts",
      detail:
        "According to a Resume Builder survey, 78% of candidates got interviews after submitting CVs and cover letters written by ChatGPT. The article below...",
    },
    {
      image: "/images/general/ad3.png",
      title: "Complete guide to WRITING professional IT CVs",
      description: "IT CV Application & Information",
      content:
        "Guide to writing professional CVs that impress in 60 seconds...",
      detail:
        "According to a survey published by Zippia in 2023, most recruiters when reading CVs can usually only make decisions within...",
    },
  ];

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-white-900 to-indigo-900">
        <div className="pt-16">
          {/* Hero Section */}

          {/* CV Templates Spotlight Section */}
          <div className="py-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-[#163988] to-gray-400 bg-clip-text text-transparent mb-6">
                  Professional CV Templates for IT
                </h2>
                <p className="text-xl text-gray-300">
                  Choose from dozens of CV templates designed specifically for
                  the IT industry
                </p>
              </div>

              <div className="text-center mt-12">
                <div className="flex justify-center gap-4 mb-16">
                  <button className="bg-gradient-to-r from-[#3a4660] to-gray-400 text-white px-8 py-3 rounded-lg hover:from-[#3a4660] hover:to-[#3a4660] transition-all duration-200 font-medium">
                    <Link href="/candidate/cm-profile">Create CV Now</Link>
                  </button>
                  <Link
                    href="/cv-templates"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200 font-medium"
                  >
                    View All CV Templates
                  </Link>
                </div>
              </div>

              {/* CV Templates Spotlight */}
              <div className="relative flex items-center justify-center">
                {/* Background glow layer centered on main template */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-50"
                  style={{
                    width: "800px",
                    height: "800px",
                    background:
                      "radial-gradient(circle at center, rgba(58, 70, 96, 0.4) 0%, rgba(59, 130, 246, 0.2) 30%, rgba(147, 51, 234, 0.1) 60%, transparent 100%)",
                    filter: "blur(60px)",
                  }}
                ></div>
                {/* Side Templates (Smaller) */}
                <div className="absolute left-1/6 z-10 opacity-50 transform scale-[0.65] -translate-x-8 transition-all duration-700 ease-in-out template-left">
                  <div
                    className="relative overflow-hidden rounded-xl bg-white shadow-xl cursor-pointer hover:opacity-80 transition-all duration-500 ease-out hover:scale-105 cv-template-container"
                    onClick={() =>
                      setSelectedTemplate(
                        selectedTemplate === 0
                          ? templates.length - 1
                          : selectedTemplate - 1
                      )
                    }
                  >
                    <img
                      src={
                        templates[
                          selectedTemplate === 0
                            ? templates.length - 1
                            : selectedTemplate - 1
                        ].image
                      }
                      alt="Previous Template"
                      className="cv-template-image"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-white bg-opacity-90 rounded-lg px-3 py-1 shadow-lg transition-all duration-300 ease-out">
                        <span className="font-medium text-gray-900 text-sm">
                          {
                            templates[
                              selectedTemplate === 0
                                ? templates.length - 1
                                : selectedTemplate - 1
                            ].name
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute right-1/6 z-10 opacity-50 transform scale-[0.65] translate-x-8 transition-all duration-700 ease-in-out template-right">
                  <div
                    className="relative overflow-hidden rounded-xl bg-white shadow-xl cursor-pointer hover:opacity-80 transition-all duration-500 ease-out hover:scale-105 cv-template-container"
                    onClick={() =>
                      setSelectedTemplate(
                        selectedTemplate === templates.length - 1
                          ? 0
                          : selectedTemplate + 1
                      )
                    }
                  >
                    <img
                      src={
                        templates[
                          selectedTemplate === templates.length - 1
                            ? 0
                            : selectedTemplate + 1
                        ].image
                      }
                      alt="Next Template"
                      className="cv-template-image"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-white bg-opacity-90 rounded-lg px-3 py-1 shadow-lg transition-all duration-300 ease-out">
                        <span className="font-medium text-gray-900 text-sm">
                          {
                            templates[
                              selectedTemplate === templates.length - 1
                                ? 0
                                : selectedTemplate + 1
                            ].name
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Template (Center - Larger) */}
                <div className="relative z-20 mx-auto template-center">
                  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-2xl transform transition-all duration-700 ease-in-out hover:scale-110 cv-template-container">
                    <img
                      src={templates[selectedTemplate].image}
                      alt={`${templates[selectedTemplate].name} CV Template`}
                      className="cv-template-image main-template-image"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain"
                      }}
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center justify-center">
                      <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                        <h3 className="text-2xl font-bold mb-3 transition-all duration-300 ease-out">
                          {templates[selectedTemplate].name}
                        </h3>
                        <p className="text-gray-300 mb-4 transition-all duration-400 ease-out">
                          {templates[selectedTemplate].description}
                        </p>
                        <Link
                          href="/cv-templates"
                          className="bg-gradient-to-r from-[#3a4660] to-gray-400 text-white px-8 py-3 rounded-lg hover:from-[#3a4660] hover:to-[#3a4660] transition-all duration-300 ease-out inline-block font-medium transform hover:scale-105"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    {/* Enhanced Glow effect for center template */}
                    <div className="absolute inset-0 -z-10 bg-gradient-radial from-[#3a4660]/50 via-[#3a4660]/20 to-transparent rounded-2xl blur-3xl scale-125 transition-all duration-700 ease-in-out animate-pulse"></div>
                    <div className="absolute inset-0 -z-20 bg-gradient-radial from-blue-400/30 via-purple-500/15 to-transparent rounded-2xl blur-4xl scale-150"></div>
                    <div className="absolute inset-0 -z-30 bg-gradient-radial from-[#3a4660]/20 via-[#3a4660]/5 to-transparent rounded-2xl blur-5xl scale-200"></div>
                  </div>

                  {/* Halo Circle Glow Under CV */}
                  <div
                    className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full -z-10 animate-pulse"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(58,70,96,0.5) 0%, rgba(59,130,246,0.3) 40%, rgba(147,51,234,0.15) 70%, transparent 100%)",
                      filter: "blur(80px)",
                    }}
                  ></div>
                </div>
                {/* Navigation Arrows */}
                <button
                  onClick={() =>
                    setSelectedTemplate(
                      selectedTemplate === 0
                        ? templates.length - 1
                        : selectedTemplate - 1
                    )
                  }
                  className="absolute left-32 top-1/2 transform -translate-y-1/2 z-30 
                          bg-white/10 hover:bg-white/20 
                          backdrop-blur-xl backdrop-saturate-150 
                          border border-white/20 hover:border-white/30
                          rounded-full p-6 
                          transition-all duration-500 ease-out 
                          group hover:scale-110 
                          shadow-lg hover:shadow-xl
                          before:absolute before:inset-0 before:rounded-full 
                          before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent 
                          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                >
                  <svg
                    className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300 ease-out relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {/* Next button */}
                <button
                  onClick={() =>
                    setSelectedTemplate(
                      selectedTemplate === templates.length - 1
                        ? 0
                        : selectedTemplate + 1
                    )
                  }
                  className="absolute right-32 top-1/2 transform -translate-y-1/2 z-30 
                          bg-white/10 hover:bg-white/20 
                          backdrop-blur-xl backdrop-saturate-150 
                          border border-white/20 hover:border-white/30
                          rounded-full p-6 
                          transition-all duration-500 ease-out 
                          group hover:scale-110 
                          shadow-lg hover:shadow-xl
                          before:absolute before:inset-0 before:rounded-full 
                          before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent 
                          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                >
                  <svg
                    className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300 ease-out relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="text-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-12 bg-gradient-to-b from-[#163988] to-gray-400 bg-clip-text text-transparent">
                Why should IT professionals use CareerMate CV?
              </h1>
            </div>
          </div>

          {/* Features Section */}
          <div className="pb-10">
            <div className="max-w-5xl mx-auto px-4">
              {/* Feature 1 - IT Focused */}
              <div className="flex flex-col lg:flex-row items-center gap-24 mb-20">
                <div className="mr-10 lg:w-1/2 flex justify-center lg:justify-end lg:pr-4">
                  <div className="relative">
                    <img
                      src="/images/general/forit.png"
                      alt="IT CV Structure"
                      className="w-80 h-80 object-contain relative z-10 drop-shadow-2xl animate-pulse"
                      style={{
                        filter:
                          "brightness(3) drop-shadow(0 0 50px rgba(58, 70, 96, 1)) drop-shadow(0 0 40px rgba(58, 70, 96, 0.8)) drop-shadow(0 0 80px rgba(58, 70, 96, 0.6)) drop-shadow(0 0 120px rgba(58, 70, 96, 0.4))",
                      }}
                    />
                    {/* Multiple glow layers */}
                    <div className="absolute inset-0 bg-gradient-radial from-[#3a4660]/60 via-[#3a4660]/30 to-transparent rounded-full blur-2xl scale-110 -z-10 animate-ping"></div>
                    <div className="absolute inset-0 bg-gradient-radial from-[#3a4660]/40 via-[#3a4660]/20 to-transparent rounded-full blur-3xl scale-150 -z-20"></div>
                    <div className="absolute inset-0 bg-gradient-radial from-blue-400/20 via-purple-500/10 to-transparent rounded-full blur-3xl scale-200 -z-30"></div>
                  </div>
                </div>
                <div className="lg:w-1/2 text-white lg:pl-4">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Designed specifically for IT professionals
                  </h2>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Create Vietnamese & English CVs in just a few steps, IT CV
                    templates suitable for all IT positions and levels, from
                    fresher to expert.
                  </p>
                </div>
              </div>

              {/* Feature 2 - HR Approved */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-24 mb-20">
                <div className="ml-10 lg:w-1/2 flex justify-center lg:justify-start lg:pl-4">
                  <div className="relative">
                    <img
                      src="/images/general/jobguild.png"
                      alt="HR Approved Design"
                      className="w-80 h-80 object-contain relative z-10 drop-shadow-2xl animate-pulse"
                      style={{
                        filter:
                          "brightness(3) drop-shadow(0 0 50px rgba(156, 163, 175, 1)) drop-shadow(0 0 40px rgba(156, 163, 175, 0.8)) drop-shadow(0 0 80px rgba(156, 163, 175, 0.6)) drop-shadow(0 0 120px rgba(156, 163, 175, 0.4))",
                      }}
                    />
                    {/* Multiple glow layers */}
                    <div className="absolute inset-0 bg-gradient-radial from-gray-400/60 via-gray-400/30 to-transparent rounded-full blur-2xl scale-110 -z-10 animate-ping"></div>
                    <div className="absolute inset-0 bg-gradient-radial from-gray-400/40 via-gray-400/20 to-transparent rounded-full blur-3xl scale-150 -z-20"></div>
                    <div className="absolute inset-0 bg-gradient-radial from-yellow-400/20 via-orange-500/10 to-transparent rounded-full blur-3xl scale-200 -z-30"></div>
                  </div>
                </div>
                <div className="lg:w-1/2 text-white lg:pr-4">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Designed to match recruiter preferences
                  </h2>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    CareerMate CVs are designed based on in-depth interviews
                    with IT recruiters, ensuring clear layout and content that
                    aligns with what recruiters want to see.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="pb-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-[#163988] to-gray-400 bg-clip-text text-transparent">
                  Effective IT CV writing tips that few people know
                </h2>
                <Link
                  href="/blog"
                  className="flex items-center gap-2 text-[#a0a9bd] hover:text-gray-400 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 hover:bg-[#292525] hover:bg-opacity-80 transition-colors border border-gray-700 border-opacity-50"
                  >
                    <div className="mb-6">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>

                    <div className="mb-4">
                      <span className="px-4 py-2 bg-white/20 rounded-full text-sm text-white/90 hover:bg-white/30 transition-colors cursor-pointer">
                        {feature.description}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                      {feature.content}
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed">
                      {feature.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
