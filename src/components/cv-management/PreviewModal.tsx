import React from "react";
import { CV } from "@/services/cvService";

interface PreviewModalProps {
  cv: CV;
  previewUrl: string | null;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ cv, previewUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#3a4660] to-gray-400 p-4 rounded-t-lg">
          <div>
            <h3 className="text-lg font-semibold text-white">{cv.name}</h3>
            <p className="text-sm text-white/90 mt-1">
              {cv.source === "upload" ? "Uploaded" : "Created"} • {new Date(cv.updatedAt).toLocaleDateString("en-US")}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {previewUrl ? (
            <iframe src={previewUrl} className="w-full h-full border-0" title="CV Preview" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">Unable to preview file</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-between items-center bg-white rounded-b-lg">
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3a4660] to-gray-400 hover:from-[#3a4660] hover:to-[#3a4660] text-white rounded-lg font-medium shadow-md hover:shadow-xl transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
