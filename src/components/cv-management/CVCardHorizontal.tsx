import { CV } from "@/services/cvService";
import { useState } from "react";

interface CVCardHorizontalProps {
  cv: CV;
  isDefault?: boolean;
  onSetDefault?: () => void;
  onPreview?: () => void;
  onSync?: () => void;
  onDelete?: () => void;
}

export const CVCardHorizontal = ({
  cv,
  isDefault = false,
  onSetDefault,
  onPreview,
  onSync,
  onDelete
}: CVCardHorizontalProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const getSourceBadge = () => {
    const sources = {
      upload: { label: "Uploaded", color: "bg-blue-100 text-blue-700" },
      builder: { label: "Builder", color: "bg-purple-100 text-purple-700" },
      draft: { label: "Draft", color: "bg-orange-100 text-orange-700" }
    };
    return sources[cv.source ?? "upload"];
  };

  const source = getSourceBadge();

  return (
    <div
      className={`
        w-full rounded-xl overflow-hidden bg-white transition-all duration-300
        border shadow-sm hover:shadow-md hover:border-[#3a4660]
        ${isDefault ? "ring-2 ring-[#3a4660] border-[#3a4660]" : "border-gray-200"}
      `}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4 h-auto sm:h-[140px]">
        {/* Left: Thumbnail/Icon */}
        <div
          className="flex-shrink-0 w-full sm:w-24 h-24 sm:h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center cursor-pointer group hover:from-gray-100 hover:to-gray-200 transition-colors"
          onClick={onPreview}
        >
          {cv.parsedStatus === "processing" ? (
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-[#3a4660] rounded-full animate-spin mx-auto mb-1"></div>
              <p className="text-[10px] text-gray-500">Processing...</p>
            </div>
          ) : (
            <svg
              className="w-12 h-12 text-gray-400 group-hover:text-[#3a4660] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
        </div>

        {/* Right: Info Section */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Top Row: Badges */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${source.color}`}>
              {source.label}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 flex items-center gap-1">
              {cv.privacy === "private" ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>Private</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Public</span>
                </>
              )}
            </span>
          </div>

          {/* Middle Row: CV Name & Default Badge */}
          <div className="flex items-center gap-2 mb-2">
            <h3
              className="font-semibold text-sm text-gray-900 truncate cursor-pointer hover:text-[#3a4660] transition-colors"
              title={cv.name}
              onClick={onPreview}
            >
              {cv.name}
            </h3>
            {isDefault && (
              <span className="flex-shrink-0 px-2 py-0.5 bg-[#3a4660] text-white text-xs font-semibold rounded-full">
                Default
              </span>
            )}
          </div>

          {/* Bottom Row: Date, Size & Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(cv.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
              {cv.fileSize && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>{cv.fileSize}</span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {!isDefault && onSetDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetDefault();
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Set Default
                </button>
              )}

              {onSync && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSync();
                  }}
                  disabled={cv.parsedStatus !== "ready"}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#3a4660] to-gray-400 hover:from-[#3a4660] hover:to-[#3a4660] rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title={cv.parsedStatus !== "ready" ? "CV not parsed yet" : "Sync CV to profile"}
                >
                  Sync
                </button>
              )}

              {/* More Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20">
                      {onPreview && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreview();
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Preview
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Download logic
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
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

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Rename logic
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Rename
                      </button>

                      <hr className="my-1 border-gray-200" />

                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVCardHorizontal;
