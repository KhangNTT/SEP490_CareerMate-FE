/**
 * CV Parsed Preview Modal - Developer tool to inspect parsed CV data
 * 
 * @description A modal popup that displays parsed CV JSON data in a pretty-printed format
 * Useful for developers to quickly inspect and debug the parsed data structure
 * 
 * Features:
 * - Pretty-printed JSON with syntax highlighting
 * - Scrollable container with max height
 * - Copy to clipboard button
 * - Click outside to close
 * - ESC key to close
 * - Responsive design with Tailwind CSS
 */

import { ParsedCV } from "@/types/parsedCV";
import { useEffect, useState } from "react";

interface CVParsedPreviewModalProps {
  open: boolean;
  onClose: () => void;
  data: ParsedCV | null;
}

export const CVParsedPreviewModal = ({ 
  open, 
  onClose, 
  data 
}: CVParsedPreviewModalProps) => {
  const [copied, setCopied] = useState(false);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!data) return;

    try {
      const jsonString = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  if (!open || !data) return null;

  // Pretty print JSON
  const jsonString = JSON.stringify(data, null, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - blurred translucent background */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#3a4660] to-gray-600">
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
            <h2 className="text-xl font-bold text-white">
              Parsed CV Data
            </h2>
            <span className="px-2 py-1 text-xs font-medium bg-white/20 text-white rounded">
              Developer Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              title="Copy JSON to clipboard"
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
                  Copy JSON
                </>
              )}
            </button>

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

        {/* Content - Scrollable JSON */}
        <div className="p-6 overflow-y-auto max-h-[70vh] bg-gray-50">
          <pre className="text-xs sm:text-sm font-mono bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto shadow-sm">
            <code className="text-gray-800">
              {jsonString}
            </code>
          </pre>

          {/* Stats Footer */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Stats:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3a4660]">
                  {data.personal_info ? "✓" : "✗"}
                </div>
                <div className="text-xs text-gray-600">Personal Info</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3a4660]">
                  {data.education?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Education</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3a4660]">
                  {data.experience?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3a4660]">
                  {data.skills?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Skills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3a4660]">
                  {data.certifications?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Certifications</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            This preview is for development purposes only
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
