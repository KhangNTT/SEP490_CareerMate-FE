"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Search, Sparkles } from "lucide-react";
import { analyzeCVATS } from "@/lib/cv-ats-api";
import toast from "react-hot-toast";
import CVSidebar from "@/components/layout/CVSidebar";

export default function AICVChecker() {
  const router = useRouter();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".doc")
      ) {
        if (file.size <= 5 * 1024 * 1024) {
          setCvFile(file);
        } else {
          toast.error("File is too large. Please select a file under 5MB.");
        }
      } else {
        toast.error("Only PDF or DOCX files are supported.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 5 * 1024 * 1024) {
        setCvFile(file);
      } else {
        toast.error("File is too large. Please select a file under 5MB.");
      }
    }
  };

  const handleAnalyze = async () => {
    if (!cvFile) {
      toast.error("Please upload your CV file.");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please enter the job description.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeCVATS(jobDescription, cvFile);

      sessionStorage.setItem("cv_ats_result", JSON.stringify(result));

      toast.success("CV analysis completed successfully!");
      router.push("/candidate/ai-cv-result");
    } catch (error: any) {
      console.error("Error analyzing CV:", error);
      toast.error(error.message || "An error occurred while analyzing your CV.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <CVSidebar activePage="cm-profile" />
          </aside>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3a4660] to-gray-400 rounded-2xl p-8 mb-8 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Optimize Your CV to Increase Interview Chances</h1>
              </div>
              <p className="text-green-50 text-lg">
                Boost your interview chances with CV improvement suggestions, ATS scoring, and auto-generated cover letters — tailored for each job role.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Step 1: Upload CV */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3a4660] to-gray-400 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Upload Your CV<span className="text-red-500">*</span>
                  </h2>
                </div>

                {/* Upload Options */}
                <div className="flex gap-3 mb-4">
                  <label className="cursor-pointer">
                    <input
                      id="cv-file-input"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="px-4 py-2 border-2 border-[#3a4660] text-[#3a4660] rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium">
                      <Upload className="w-4 h-4" />
                      Upload File
                    </div>
                  </label>

                  <button
                    type="button"
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                    onClick={() => toast.info("This feature is under development")}
                  >
                    <FileText className="w-4 h-4" />
                    Use CV Created by Cake
                  </button>

                  <button
                    type="button"
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                    onClick={() => toast.info("This feature is under development")}
                  >
                    <FileText className="w-4 h-4" />
                    Paste Text
                  </button>
                </div>

                {/* Upload Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive
                      ? "border-[#3a4660] bg-green-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  {cvFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-[#3a4660]" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{cvFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setCvFile(null)}
                        className="ml-4 text-red-500 hover:text-red-600 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="cv-file-input" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-[#3a4660] font-semibold text-lg mb-2 hover:text-[#1e2126] transition-colors">
                        Upload new files
                      </p>
                      <p className="text-gray-600 mb-1">
                        Drop files here or click to upload.
                      </p>
                    </label>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <span className="text-gray-400">ℹ️</span>
                    Supported formats: .pdf, .doc, .docx. Maximum size: 5 MB.
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <span className="text-gray-400">ℹ️</span>
                    Only English CVs are supported.
                  </p>
                </div>
              </div>

              {/* Step 2: Job Description */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3a4660] to-gray-400 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Add Job Description<span className="text-red-500">*</span>
                  </h2>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    className="px-4 py-2 border-2 border-[#3a4660] text-[#3a4660] rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    Paste Text
                  </button>

                  <button
                    type="button"
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                    onClick={() => toast.info("This feature is under development")}
                  >
                    <Search className="w-4 h-4" />
                    Search Jobs on Cake
                  </button>

                  <button
                    type="button"
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                    onClick={() => toast.info("This feature is under development")}
                  >
                    <Upload className="w-4 h-4" />
                    Upload File
                  </button>
                </div>

                {/* Text Area */}
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="The more detailed the job description, the better Cake AI can analyze your CV."
                  className="w-full h-40 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#3a4660] focus:outline-none resize-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !cvFile || !jobDescription.trim()}
                  className="px-8 py-3 bg-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Analyzing...
                    </span>
                  ) : (
                    "Start Scanning"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
