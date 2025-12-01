import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

// Session storage key
const RESUME_ID_SESSION_KEY = 'cm-profile-resumeId';

// CV Type definitions
export type CVType = 'CREATED' | 'UPLOADED';

export interface CV {
  id: string;
  name: string;
  type: CVType;                  // created or uploaded
  status: 'DRAFT' | 'READY';     // draft or final
  isDefault: boolean;            // the default CV for job apply
  storagePath: string;           // CareerMatefiles/candidates/{userId}/cv/xxx.pdf
  downloadUrl?: string;          // Firebase download URL
  updatedAt: string;             // ISO string
}

// Zustand Store State
interface CVStoreState {
  cvs: CV[];
  defaultCvId: string | null;
  activeCvId: string | null;
  
  /**
   * TEMPORARY: Client-side state to track the current editing resume.
   * 
   * This is used to maintain context when navigating between cv-management and cm-profile pages.
   * When user selects a resume to sync/edit in cv-management, this ID is set so that
   * cm-profile knows which resume to display.
   * 
   * NOTE: This is a temporary solution. In the future, this will be replaced by
   * a backend-driven currentResumeId that persists across sessions.
   * 
   * Behavior:
   * - Persists to sessionStorage (survives page reloads within same tab)
   * - Persists during SPA navigation within the same session
   * - cm-profile uses this as fallback when no isActive resume is found
   */
  currentEditingResumeId: string | null;

  /**
   * Flag to indicate if the store has been hydrated from sessionStorage.
   * This is important for cm-profile to wait before fetching data.
   */
  _hasHydrated: boolean;

  /**
   * Track resume IDs that have no type (type = empty/null).
   * These resumes were created from SyncDialog and haven't been converted to DRAFT yet.
   * When user navigates away or syncs another CV, we prompt them to convert to DRAFT.
   */
  untypedResumeId: string | null;
  
  setCVs: (cvs: CV[]) => void;
  upsertCv: (cv: CV) => void;
  setDefaultCv: (cvId: string) => void;
  setActiveCv: (cvId: string | null) => void;
  
  /**
   * Set the current editing resume ID.
   * This also persists to sessionStorage automatically via Zustand persist middleware.
   * 
   * Call this when:
   * - User selects a resume to sync in cv-management
   * - User creates a new resume from UPLOAD
   * - User switches between resume types
   * 
   * @param resumeId - The resume ID to set as current, or null to clear
   */
  setCurrentEditingResume: (resumeId: string | null) => void;

  /**
   * Set the untyped resume ID (resume created from SyncDialog without type).
   * @param resumeId - The resume ID or null to clear
   */
  setUntypedResumeId: (resumeId: string | null) => void;

  /**
   * Clear the untyped resume ID (called after conversion to DRAFT).
   */
  clearUntypedResumeId: () => void;

  /**
   * Set the hydration flag (called by persist middleware).
   */
  setHasHydrated: (state: boolean) => void;
}

// Create the Zustand store with persist middleware for sessionStorage
export const useCVStore = create<CVStoreState>()(
  devtools(
    persist(
      (set) => ({
        cvs: [],
        defaultCvId: null,
        activeCvId: null,
        currentEditingResumeId: null,
        untypedResumeId: null,
        _hasHydrated: false,

        /**
         * Replace the entire CV list and detect the default CV
         */
        setCVs: (cvs: CV[]) => {
          console.log('🔄 setCVs called with:', cvs);
          const defaultCv = cvs.find((c) => c.isDefault);
          set(
            {
              cvs,
              defaultCvId: defaultCv?.id ?? null,
            },
            false,
            'setCVs'
          );
        },

      /**
       * Upsert a CV:
       * - If CV exists → replace it
       * - If not → prepend it to the list
       * - If cv.isDefault === true → make it the only default
       */
      upsertCv: (cv: CV) => {
        console.log('➕ upsertCv called with:', cv);
        set((state) => {
          const existingIndex = state.cvs.findIndex((c) => c.id === cv.id);
          let updatedCvs: CV[];

          if (existingIndex !== -1) {
            // Replace existing CV
            updatedCvs = [...state.cvs];
            updatedCvs[existingIndex] = cv;
          } else {
            // Prepend new CV
            updatedCvs = [cv, ...state.cvs];
          }

          // If this CV is marked as default, unset all others
          if (cv.isDefault) {
            updatedCvs = updatedCvs.map((c) => ({
              ...c,
              isDefault: c.id === cv.id,
            }));

            return {
              cvs: updatedCvs,
              defaultCvId: cv.id,
            };
          }

          return {
            cvs: updatedCvs,
            defaultCvId: state.defaultCvId,
          };
        }, false, 'upsertCv');
      },

      /**
       * Set a CV as the default (local state only):
       * - Update Zustand state: only the selected CV becomes isDefault = true
       * - All other CVs become isDefault = false
       * - Update defaultCvId
       */
      setDefaultCv: (cvId: string) => {
        console.log('⭐ setDefaultCv called with:', cvId);
        set((state) => ({
          cvs: state.cvs.map((cv) => ({
            ...cv,
            isDefault: cv.id === cvId,
          })),
          defaultCvId: cvId,
        }), false, 'setDefaultCv');
      },

      /**
       * Set the active CV ID (for UI selection/highlighting)
       */
      setActiveCv: (cvId: string | null) => {
        console.log('👆 setActiveCv called with:', cvId);
        set({ activeCvId: cvId }, false, 'setActiveCv');
      },

      /**
       * TEMPORARY: Set the current editing resume ID.
       * 
       * This maintains context when navigating from cv-management to cm-profile.
       * Will be replaced by backend-driven state in the future.
       */
      setCurrentEditingResume: (resumeId: string | null) => {
        console.log('📝 setCurrentEditingResume called with:', resumeId);
        set({ currentEditingResumeId: resumeId }, false, 'setCurrentEditingResume');
      },

      /**
       * Set the untyped resume ID (resume created from SyncDialog without type).
       */
      setUntypedResumeId: (resumeId: string | null) => {
        console.log('📝 setUntypedResumeId called with:', resumeId);
        set({ untypedResumeId: resumeId }, false, 'setUntypedResumeId');
      },

      /**
       * Clear the untyped resume ID (called after conversion to DRAFT).
       */
      clearUntypedResumeId: () => {
        console.log('🧹 clearUntypedResumeId called');
        set({ untypedResumeId: null }, false, 'clearUntypedResumeId');
      },

      /**
       * Set the hydration flag (called by persist middleware).
       */
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state }, false, 'setHasHydrated');
      },
    }),
    {
      name: RESUME_ID_SESSION_KEY,
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the currentEditingResumeId to sessionStorage
      partialize: (state) => ({
        currentEditingResumeId: state.currentEditingResumeId,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('💾 CV Store rehydrated from sessionStorage');
        if (state) {
          state.setHasHydrated(true);
          console.log('📋 Restored currentEditingResumeId:', state.currentEditingResumeId);
        }
      },
    }
  ),
  {
    name: 'cv-store',
    enabled: true,
    trace: true,
  }
));

// Debug: expose store to window and initialize immediately
if (typeof window !== "undefined") {
  (window as any).cvStore = useCVStore;
  
  // Force initialization by calling getState once
  const initialState = useCVStore.getState();
  
  console.log('✅ CV Store initialized and exposed to window.cvStore');
  console.log('📊 Initial state:', initialState);
  console.log('📍 Store available at: window.cvStore');
  console.log('💡 Try: cvStore.getState()');
}
