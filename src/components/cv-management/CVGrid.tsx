import { CV } from "@/services/cvService";
import { CVCard } from "./CVCard";

interface CVGridProps {
  cvs: CV[];
  onSetDefault: (cv: CV) => void;
  onSync: (cv: CV) => void;
  onEdit?: (cv: CV) => void;
  onPreview: (cv: CV) => void;
  onDelete: (cvId: string) => void;
  // Syncing state
  isSyncing?: boolean;
  syncingCVId?: string;
}

export const CVGrid = ({ 
  cvs, 
  onSetDefault, 
  onSync, 
  onEdit, 
  onPreview, 
  onDelete,
  isSyncing = false,
  syncingCVId
}: CVGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cvs.map((cv) => (
        <CVCard
          key={cv.id}
          cv={cv}
          isDefault={cv.isDefault}
          onSetDefault={() => onSetDefault(cv)}
          onSync={() => onSync(cv)}
          onEdit={onEdit ? () => onEdit(cv) : undefined}
          onPreview={() => onPreview(cv)}
          onDelete={() => onDelete(cv.id)}
          isSyncing={isSyncing && syncingCVId === cv.id}
          isDisabled={isSyncing}
        />
      ))}
    </div>
  );
};
