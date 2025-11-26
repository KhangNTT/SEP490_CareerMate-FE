import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


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
  setCVs: (cvs: CV[]) => void;
  upsertCv: (cv: CV) => void;
  setDefaultCv: (cvId: string) => void;
  setActiveCv: (cvId: string | null) => void;
}

// Create the Zustand store
export const useCVStore = create<CVStoreState>()(
  devtools(
    (set) => ({
      cvs: [],
      defaultCvId: null,
      activeCvId: null,

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
    }),
    {
      name: 'cv-store',
      enabled: true,
      trace: true,
    }
    
  )
  
);

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
