"use client";

import { useEffect, useState } from "react";
import CVSidebar from "@/components/layout/CVSidebar";
import { useLayout } from "@/contexts/LayoutContext";
import { CV } from "@/services/cvService";
import { useCVUpload } from "@/hooks/useCVUpload";
import { useCVActions } from "@/hooks/useCVActions";
import { useResumeData } from "@/hooks/useResumeData";
import { resumesToCVsSync } from "@/utils/resumeConverter";
import { useAuthStore } from "@/store/use-auth-store";
import { useCVStore } from "@/stores/cvStore"; // Import CV Store for Redux DevTools
import {
  CVCard,
  CVCardHorizontal,
  CVTabs,
  CVGrid,
  EmptyState,
  PreviewModal,
  NoActiveCV,
  CVPageSkeleton
} from "@/components/cv-management";

type TabType = "built" | "uploaded" | "draft";

const CVManagementPage = () => {
  const { headerHeight } = useLayout();
  const [headerH, setHeaderH] = useState(headerHeight || 0);
  const [activeTab, setActiveTab] = useState<TabType>("built");
  
  // Initialize CV Store (for Redux DevTools visibility)
  const cvStore = useCVStore();
  const { setCVs, setDefaultCv: setDefaultCvInStore } = cvStore;
  
  // Get user info and profile fetcher
  const { candidateId, user, fetchCandidateProfile } = useAuthStore();
  const userId = candidateId || user?.id;

  // Ensure candidateId is loaded on mount
  useEffect(() => {
    if (!candidateId && user) {
      fetchCandidateProfile();
    }
  }, [candidateId, user, fetchCandidateProfile]);

  // Fetch resumes from API
  const {
    webResumes,
    uploadedResumes,
    draftResumes,
    activeResume,
    loading,
    error,
    refresh
  } = useResumeData();

  // CV States - converted from API
  const [uploadedCVs, setUploadedCVs] = useState<CV[]>([]);
  const [builtCVs, setBuiltCVs] = useState<CV[]>([]);
  const [draftCVs, setDraftCVs] = useState<CV[]>([]);
  const [defaultCV, setDefaultCV] = useState<CV | null>(null);

  // Convert API data to CV format AND sync to Zustand store
  useEffect(() => {
    if (!loading && !error) {
      const uploadedCVsConverted = resumesToCVsSync(uploadedResumes, userId);
      const builtCVsConverted = resumesToCVsSync(webResumes, userId);
      const draftCVsConverted = resumesToCVsSync(draftResumes, userId);

      setUploadedCVs(uploadedCVsConverted);
      setBuiltCVs(builtCVsConverted);
      setDraftCVs(draftCVsConverted);

      // ✅ Sync ALL CVs to Zustand store
      const allCVs = [
        ...uploadedCVsConverted,
        ...builtCVsConverted,
        ...draftCVsConverted,
      ];
      
      console.log('🔄 Syncing CVs to Zustand store:', allCVs);
      setCVs(allCVs);

      // Set default CV if there's an active resume
      if (activeResume) {
        const activeCV = allCVs.find((cv) => cv.id === activeResume.resumeId.toString());
        if (activeCV) {
          setDefaultCV(activeCV);
          // ✅ Also sync to Zustand store
          setDefaultCvInStore(activeCV.id);
          console.log('⭐ Active CV set as default:', activeCV.id);
        }
      } else {
        setDefaultCV(null);
      }
    }
  }, [webResumes, uploadedResumes, draftResumes, activeResume, loading, error, userId, setCVs, setDefaultCvInStore]);

  // Custom Hooks
  const uploadHook = useCVUpload(uploadedCVs, setUploadedCVs, defaultCV, setDefaultCV);
  const actionsHook = useCVActions(
    uploadedCVs,
    setUploadedCVs,
    builtCVs,
    setBuiltCVs,
    draftCVs,
    setDraftCVs,
    defaultCV,
    setDefaultCV
  );

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

  const currentCVs = activeTab === "uploaded" ? uploadedCVs : activeTab === "built" ? builtCVs : draftCVs;
  const hasAnyResumes = uploadedCVs.length > 0 || builtCVs.length > 0 || draftCVs.length > 0;

  // Loading state - use skeleton
  if (loading) {
    return <CVPageSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-900 font-semibold mb-2">Failed to load CVs</p>
            <p className="text-gray-600 text-sm mb-4">{error.message}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-[#3a4660] text-white rounded-lg hover:bg-[#2d3750] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div
          className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-6 items-start transition-all duration-300"
          style={{
            ["--sticky-offset" as any]: `${headerH}px`,
            ["--content-pad" as any]: "24px"
          }}
        >
          {/* Sidebar */}
          <aside className="hidden lg:block sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <CVSidebar activePage="cv-management" />
          </aside>

          {/* Main Content */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">CV Management</h1>
              <p className="text-gray-600">Upload or create CVs to use during job applications</p>
            </div>

            {/* Default CV Card or No Active CV */}
            {defaultCV ? (
            <div className="bg-gradient-to-r from-[#3a4660] to-gray-400 rounded-xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                    Active CV
                    <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                      Active
                    </span>
                    </h2>
                    <p className="text-sm text-white/90">
                      This CV will be used automatically when applying for jobs
                    </p>
                  </div>
                </div>

                <CVCardHorizontal
                  cv={defaultCV}
                  isDefault
                  onSetDefault={() => {}}
                  onPreview={() => actionsHook.handlePreview(defaultCV)}
                  onSync={() => actionsHook.handleSyncToProfile(defaultCV)}
                  onDelete={() => actionsHook.handleDelete(defaultCV.id)}
                />
              </div>
            ) : (
              <NoActiveCV
                hasResumes={hasAnyResumes}
                onUploadClick={() => {
                  // Scroll to upload tab
                  setActiveTab("uploaded");
                  document.getElementById("cv-upload-input")?.click();
                }}
                onBuildClick={() => {
                  // Navigate to CV builder or show modal
                  setActiveTab("built");
                }}
              />
            )}

            {/* Tabs */}
            <CVTabs
              activeTab={activeTab}
              builtCount={builtCVs.length}
              uploadedCount={uploadedCVs.length}
              draftCount={draftCVs.length}
              isUploading={uploadHook.isUploading}
              onTabChange={setActiveTab}
              onUploadClick={uploadHook.handleFileInput}
            />

            {/* CV Grid or Empty State */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              {currentCVs.length > 0 ? (
                <CVGrid
                  cvs={currentCVs}
                  onSetDefault={actionsHook.handleSetDefault}
                  onSync={actionsHook.handleSyncToProfile}
                  onPreview={actionsHook.handlePreview}
                  onDelete={actionsHook.handleDelete}
                />
              ) : (
                <EmptyState activeTab={activeTab} onFileInput={uploadHook.handleFileInput} />
              )}
            </div>
          </section>
        </div>

        {/* Hidden file input for upload */}
        <input
          id="cv-upload-input"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={uploadHook.handleFileInput}
        />
      </main>

      {/* Preview Modal */}
      {actionsHook.showPreview && actionsHook.selectedCV && (
        <PreviewModal
          cv={actionsHook.selectedCV}
          previewUrl={actionsHook.previewUrl}
          onClose={actionsHook.handleClosePreview}
        />
      )}
    </>
  );
};

export default CVManagementPage;
