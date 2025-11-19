"use client";

import { useEffect, useState } from "react";
import { ClientHeader } from "@/modules/client/components";
import CVSidebar from "@/components/layout/CVSidebar";
import { useLayout } from "@/contexts/LayoutContext";
import toast from "react-hot-toast";

// Types
interface CV {
  id: string;
  name: string;
  source: "upload" | "builder" | "topcv";
  fileUrl: string;
  parsedStatus: "processing" | "ready" | "failed";
  isDefault: boolean;
  privacy: "private" | "public";
  updatedAt: string;
  fileSize?: string;
  thumbnail?: string;
}

const CVManagementPage = () => {
  const { headerHeight } = useLayout();
  const [headerH, setHeaderH] = useState(headerHeight || 0);
  const [activeTab, setActiveTab] = useState<"uploaded" | "built">("uploaded");

  // CV States
  const [uploadedCVs, setUploadedCVs] = useState<CV[]>([]);
  const [builtCVs, setBuiltCVs] = useState<CV[]>([]);
  const [defaultCV, setDefaultCV] = useState<CV | null>(null);

  // Upload States
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHeight = localStorage.getItem("headerHeight");
      if (savedHeight && !headerHeight) {
        setHeaderH(parseInt(savedHeight));
      } else if (headerHeight) {
        setHeaderH(headerHeight);
      }
    }
  }, [headerHeight]);

  // Mock data - replace with API calls
  useEffect(() => {
    // Simulate fetching CVs
    const mockUploaded: CV[] = [
      {
        id: "1",
        name: "CV_Nguyen_Van_A_2025.pdf",
        source: "upload",
        fileUrl: "/mock-cv.pdf",
        parsedStatus: "ready",
        isDefault: true,
        privacy: "private",
        updatedAt: "2025-11-08",
        fileSize: "1.2 MB"
      }
    ];

    const mockBuilt: CV[] = [
      {
        id: "2",
        name: "CV Nhân viên kinh doanh",
        source: "builder",
        fileUrl: "/mock-cv-2.pdf",
        parsedStatus: "ready",
        isDefault: false,
        privacy: "public",
        updatedAt: "2025-11-01"
      }
    ];

    setUploadedCVs(mockUploaded);
    setBuiltCVs(mockBuilt);
    setDefaultCV(mockUploaded[0]);
  }, []);

  // File Upload Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validation
    const maxSize = 3 * 1024 * 1024; // 3MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ hỗ trợ file .pdf, .doc, .docx");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Kích thước file không được vượt quá 3MB");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload + parsing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newCV: CV = {
        id: Date.now().toString(),
        name: file.name,
        source: "upload",
        fileUrl: URL.createObjectURL(file),
        parsedStatus: "processing",
        isDefault: uploadedCVs.length === 0 && !defaultCV, // Auto set default if first CV
        privacy: "private",
        updatedAt: new Date().toISOString().split('T')[0],
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      };

      setUploadedCVs(prev => [newCV, ...prev]);

      if (newCV.isDefault) {
        setDefaultCV(newCV);
      }

      toast.success("CV đã được tải lên và đang xử lý");

      // Simulate parsing completion
      setTimeout(() => {
        setUploadedCVs(prev =>
          prev.map(cv =>
            cv.id === newCV.id
              ? { ...cv, parsedStatus: "ready" }
              : cv
          )
        );
        toast.success("CV đã được phân tích thành công");
      }, 3000);

    } catch (error) {
      toast.error("Tải CV thất bại. Vui lòng thử lại");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetDefault = (cv: CV) => {
    // Update all CVs
    setUploadedCVs(prev => prev.map(c => ({ ...c, isDefault: c.id === cv.id })));
    setBuiltCVs(prev => prev.map(c => ({ ...c, isDefault: c.id === cv.id })));
    setDefaultCV(cv);
    toast.success(`"${cv.name}" đã được đặt làm CV mặc định`);
  };

  const handleSyncToProfile = async (cv: CV) => {
    if (cv.parsedStatus !== "ready") {
      toast.error("CV chưa được phân tích xong");
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Đã đồng bộ dữ liệu CV vào hồ sơ");
    } catch (error) {
      toast.error("Đồng bộ thất bại. Vui lòng thử lại");
    }
  };

  const handlePreview = (cv: CV) => {
    setSelectedCV(cv);
    setPreviewUrl(cv.fileUrl);
    setShowPreview(true);
  };

  const handleDelete = (cvId: string) => {
    if (window.confirm("Bạn có chắc muốn xóa CV này?")) {
      setUploadedCVs(prev => prev.filter(cv => cv.id !== cvId));
      setBuiltCVs(prev => prev.filter(cv => cv.id !== cvId));

      // Update default if deleted CV was default
      if (defaultCV?.id === cvId) {
        const remaining = [...uploadedCVs, ...builtCVs].filter(cv => cv.id !== cvId);
        setDefaultCV(remaining[0] || null);
      }

      toast.success("Đã xóa CV");
    }
  };

  const allCVs = [...uploadedCVs, ...builtCVs];
  const currentCVs = activeTab === "uploaded" ? uploadedCVs : builtCVs;

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div
          className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-6 items-start transition-all duration-300"
          style={{
            ["--sticky-offset" as any]: `${headerH}px`,
            ["--content-pad" as any]: "24px",
          }}
        >
          {/* Sidebar */}
          <aside className="hidden lg:block sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <CVSidebar activePage="cv-management" />
          </aside>

          {/* Main Content */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300 max-w-5xl mx-auto w-full">

            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý CV</h1>
              <p className="text-gray-600">
                Tải lên hoặc tạo CV để sử dụng trong quá trình ứng tuyển
              </p>
            </div>

            {/* Default CV Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    CV Mặc định
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                      Mặc định
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600">
                    CV này sẽ được sử dụng tự động khi ứng tuyển
                  </p>
                </div>
              </div>

              {defaultCV ? (
                <div className="bg-white rounded-lg p-4 flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{defaultCV.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="capitalize">{defaultCV.source === "upload" ? "Đã tải lên" : "Đã tạo"}</span>
                      <span>•</span>
                      <span>{defaultCV.privacy === "private" ? "Riêng tư" : "Công khai"}</span>
                      <span>•</span>
                      <span>{new Date(defaultCV.updatedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(defaultCV)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Xem trước
                    </button>
                    <button
                      onClick={() => {/* Open change modal */ }}
                      className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      Thay đổi
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 bg-white hover:border-green-300"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>

                  <p className="text-gray-900 font-medium mb-2">
                    {isDragging ? "Thả file tại đây" : "Kéo thả CV hoặc tải lên"}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    .pdf .doc .docx • Tối đa 3MB • Không bảo vệ mật khẩu
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInput}
                        disabled={isUploading}
                      />
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {isUploading ? "Đang tải lên..." : "Tải CV lên"}
                      </span>
                    </label>

                    <span className="text-gray-400">hoặc</span>

                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Tạo CV mới
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex gap-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("uploaded")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "uploaded"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    CV đã tải lên ({uploadedCVs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("built")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "built"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    CV đã tạo ({builtCVs.length})
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {currentCVs.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {currentCVs.map((cv) => (
                      <CVCard
                        key={cv.id}
                        cv={cv}
                        onSetDefault={handleSetDefault}
                        onSync={handleSyncToProfile}
                        onPreview={handlePreview}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState activeTab={activeTab} />
                )}
              </div>
            </div>

          </section>
        </div>
      </main>

      {/* Preview Modal */}
      {showPreview && selectedCV && (
        <PreviewModal
          cv={selectedCV}
          previewUrl={previewUrl}
          onClose={() => {
            setShowPreview(false);
            setSelectedCV(null);
            setPreviewUrl(null);
          }}
        />
      )}
    </>
  );
};

// CV Card Component
const CVCard = ({
  cv,
  onSetDefault,
  onSync,
  onPreview,
  onDelete
}: {
  cv: CV;
  onSetDefault: (cv: CV) => void;
  onSync: (cv: CV) => void;
  onPreview: (cv: CV) => void;
  onDelete: (cvId: string) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getSourceBadge = () => {
    const sources = {
      upload: { label: "Đã tải lên", color: "bg-blue-100 text-blue-700" },
      builder: { label: "Builder", color: "bg-purple-100 text-purple-700" },
      topcv: { label: "TopCV", color: "bg-orange-100 text-orange-700" }
    };
    return sources[cv.source];
  };

  const source = getSourceBadge();

  return (
    <div className={`border rounded-lg overflow-hidden hover:shadow-md transition-all ${cv.isDefault ? "ring-2 ring-green-500" : "border-gray-200"
      }`}>
      {/* Preview Thumbnail */}
      <div className="aspect-[210/297] bg-gray-100 relative group cursor-pointer" onClick={() => onPreview(cv)}>
        <div className="absolute inset-0 flex items-center justify-center">
          {cv.parsedStatus === "processing" ? (
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-1"></div>
              <p className="text-[10px] text-gray-500">Đang xử lý...</p>
            </div>
          ) : (
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-gray-900 px-2 py-1 rounded text-[10px] font-medium">
            Xem trước
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
          {cv.isDefault && (
            <span className="px-1.5 py-0.5 bg-green-600 text-white text-[9px] font-medium rounded-full">
              Mặc định
            </span>
          )}
          <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded-full ${source.color}`}>
            {source.label}
          </span>
        </div>

        {/* Privacy Badge */}
        <div className="absolute top-1.5 right-1.5">
          <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            {cv.privacy === "private" ? (
              <>
                <svg className="w-2.5 h-2.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[9px] text-gray-600">Riêng tư</span>
              </>
            ) : (
              <>
                <svg className="w-2.5 h-2.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[9px] text-gray-600">Công khai</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CV Info */}
      <div className="p-3 bg-white">
        <h3 className="font-medium text-xs text-gray-900 mb-1 truncate leading-tight" title={cv.name}>
          {cv.name}
        </h3>

        <div className="flex items-center text-[10px] text-gray-500 mb-2">
          <span>{new Date(cv.updatedAt).toLocaleDateString('vi-VN')}</span>
          {cv.fileSize && (
            <>
              <span className="mx-1">•</span>
              <span>{cv.fileSize}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          {!cv.isDefault && (
            <button
              onClick={() => onSetDefault(cv)}
              className="flex-1 px-2 py-1 text-[10px] font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              Mặc định
            </button>
          )}

          <button
            onClick={() => onSync(cv)}
            disabled={cv.parsedStatus !== "ready"}
            className="flex-1 px-2 py-1 text-[10px] font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={cv.parsedStatus !== "ready" ? "CV chưa được phân tích" : "Đồng bộ CV vào hồ sơ"}
          >
            Đồng bộ
          </button>

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={() => {
                      onPreview(cv);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Xem trước
                  </button>

                  <button
                    onClick={() => {
                      // Download logic
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Tải xuống
                  </button>

                  <button
                    onClick={() => {
                      // Rename logic
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Đổi tên
                  </button>

                  <hr className="my-0.5" />

                  <button
                    onClick={() => {
                      onDelete(cv.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Xóa
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ activeTab }: { activeTab: "uploaded" | "built" }) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {activeTab === "uploaded" ? "Chưa có CV tải lên" : "Chưa có CV đã tạo"}
      </h3>

      <p className="text-gray-600 mb-4">
        {activeTab === "uploaded"
          ? "Tải CV của bạn lên để bắt đầu ứng tuyển"
          : "Tạo CV chuyên nghiệp bằng công cụ của chúng tôi"
        }
      </p>

      {activeTab === "uploaded" ? (
        <label className="cursor-pointer">
          <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Tải CV lên
          </span>
        </label>
      ) : (
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo CV mới
        </button>
      )}
    </div>
  );
};

// Preview Modal Component
const PreviewModal = ({ cv, previewUrl, onClose }: { cv: CV; previewUrl: string | null; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{cv.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {cv.source === "upload" ? "Đã tải lên" : "Đã tạo"} • {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="CV Preview"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">Không thể xem trước file</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-between items-center bg-white">
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Tải xuống
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVManagementPage;
