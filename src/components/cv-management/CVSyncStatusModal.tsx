/**
 * Enhanced CV Sync Status Modal - Shows real-time parsing status and results
 * 
 * @description A modal that displays:
 * - Task status (processing/completed/failed)
 * - Raw API response
 * - Parsed CV data in formatted JSON
 * - Real-time polling updates
 */

import { ParsedCV, TaskStatusResponse } from "@/types/parsedCV";
import { useEffect, useState } from "react";

interface CVSyncStatusModalProps {
  open: boolean;
  onClose: () => void;
  taskId?: string;
  status?: "processing" | "completed" | "failed";
  data?: ParsedCV | null;
  rawResponse?: TaskStatusResponse | null;
}

export const CVSyncStatusModal = ({ 
  open, 
  onClose, 
  taskId,
  status,
  data,
  rawResponse
}: CVSyncStatusModalProps) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"parsed" | "raw">("parsed");

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!data && !rawResponse) return;

    try {
      const contentToCopy = activeTab === "parsed" ? data : rawResponse;
      const jsonString = JSON.stringify(contentToCopy, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  if (!open) return null;

  // Get status color and icon
  const getStatusDisplay = () => {
    switch (status) {
      case "processing":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-300",
          icon: (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          ),
          text: "Processing..."
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-700 border-green-300",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          text: "Completed"
        };
      case "failed":
        return {
          color: "bg-red-100 text-red-700 border-red-300",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          text: "Failed"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-300",
          icon: null,
          text: "Unknown"
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#3a4660] via-gray-600 to-[#3a4660]">
          <div className="flex items-center gap-3">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <div>
              <h2 className="text-xl font-bold text-white">
                CV Sync Status
              </h2>
              {taskId && (
                <p className="text-xs text-white/70 font-mono">Task ID: {taskId}</p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${statusDisplay.color}`}>
              {statusDisplay.icon}
              <span className="font-semibold text-sm">{statusDisplay.text}</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Close (ESC)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab("parsed")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === "parsed"
                ? "bg-white text-[#3a4660] border-t-2 border-x border-[#3a4660]"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            📄 Parsed Data
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === "raw"
                ? "bg-white text-[#3a4660] border-t-2 border-x border-[#3a4660]"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            🔧 Raw Response
          </button>
          
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="ml-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors flex items-center gap-2"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>

        {/* Content - Scrollable JSON */}
        <div className="p-6 overflow-y-auto max-h-[65vh] bg-gray-50">
          {activeTab === "parsed" && data ? (
            <>
              <pre className="text-xs sm:text-sm font-mono bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto shadow-sm">
                <code className="text-gray-800">
                  {JSON.stringify(data, null, 2)}
                </code>
              </pre>

              {/* Quick Stats */}
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {data.personal_info ? "✓" : "✗"}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Personal Info</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">
                      {data.education?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Education</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {data.experience?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Experience</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <div className="text-2xl font-bold text-orange-700">
                      {data.skills?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Skills</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                    <div className="text-2xl font-bold text-pink-700">
                      {data.certifications?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Certifications</div>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === "raw" && rawResponse ? (
            <pre className="text-xs sm:text-sm font-mono bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto shadow-sm">
              <code className="text-gray-800">
                {JSON.stringify(rawResponse, null, 2)}
              </code>
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm mt-1">
                {status === "processing" ? "Still processing... Please wait" : "Data not yet received"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Developer preview - Real-time data from Python API
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-[#3a4660] hover:bg-[#2d3850] rounded-lg transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
