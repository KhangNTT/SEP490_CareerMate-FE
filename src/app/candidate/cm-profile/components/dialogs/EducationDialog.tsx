import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MonthYearPicker from "../MonthYearPicker";
import { Education } from "../types";

interface EducationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingEducation: Education | null;
    onEditingEducationChange: (edu: Education | null) => void;
    onSave: () => void;
}

export default function EducationDialog({
    open,
    onOpenChange,
    editingEducation,
    onEditingEducationChange,
    onSave
}: EducationDialogProps) {
    const handleFieldChange = (field: keyof Education, value: any) => {
        if (editingEducation) {
            onEditingEducationChange({
                ...editingEducation,
                [field]: value
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-white">
                <DialogHeader>
                    <DialogTitle>
                        {!editingEducation?.id || editingEducation.id === '0' ? 'Add Education' : 'Edit Education'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            School/University <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={editingEducation?.school || ''}
                            onChange={(e) => handleFieldChange('school', e.target.value)}
                            placeholder="Enter school or university name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Degree <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={editingEducation?.degree || ''}
                            onChange={(e) => handleFieldChange('degree', e.target.value)}
                            placeholder="e.g., Bachelor of Science"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Major <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={editingEducation?.major || ''}
                            onChange={(e) => handleFieldChange('major', e.target.value)}
                            placeholder="e.g., Computer Science"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Month/Year <span className="text-red-500">*</span>
                            </label>
                            <MonthYearPicker
                                monthValue={editingEducation?.startMonth || ''}
                                yearValue={editingEducation?.startYear || ''}
                                onMonthChange={(value: string) => handleFieldChange('startMonth', value)}
                                onYearChange={(value: string) => handleFieldChange('startYear', value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Month/Year
                            </label>
                            <MonthYearPicker
                                monthValue={editingEducation?.endMonth || ''}
                                yearValue={editingEducation?.endYear || ''}
                                onMonthChange={(value: string) => handleFieldChange('endMonth', value)}
                                onYearChange={(value: string) => handleFieldChange('endYear', value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
