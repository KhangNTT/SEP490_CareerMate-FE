import { CV } from "@/services/cvService";
import { CVCard } from "./CVCard";

interface CVGridProps {
  cvs: CV[];
  onSetDefault: (cv: CV) => void;
  onSync: (cv: CV) => void;
  onPreview: (cv: CV) => void;
  onDelete: (cvId: string) => void;
}

export const CVGrid = ({ cvs, onSetDefault, onSync, onPreview, onDelete }: CVGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {cvs.map((cv) => (
        <CVCard
          key={cv.id}
          cv={cv}
          isDefault={cv.isDefault}
          onSetDefault={() => onSetDefault(cv)}
          onSync={() => onSync(cv)}
          onPreview={() => onPreview(cv)}
          onDelete={() => onDelete(cv.id)}
        />
      ))}
    </div>
  );
};
