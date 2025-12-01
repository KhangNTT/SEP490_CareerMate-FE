"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiAlertTriangle, FiSave, FiSkipForward } from "react-icons/fi";

export interface DraftConversionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmSaveAsDraft: () => Promise<void>;
  onSkipAndContinue: () => void;
  isLoading?: boolean;
}

/**
 * Dialog shown when user is editing an UNTYPED CV (type="") 
 * and wants to switch to another CV.
 * 
 * Options:
 * 1. Save as Draft - Convert current untyped CV to DRAFT type
 * 2. Skip - Don't save, just proceed to the new CV
 */
export default function DraftConversionDialog({
  open,
  onOpenChange,
  onConfirmSaveAsDraft,
  onSkipAndContinue,
  isLoading = false
}: DraftConversionDialogProps) {
  const handleSaveAsDraft = async () => {
    await onConfirmSaveAsDraft();
  };

  const handleSkip = () => {
    onSkipAndContinue();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FiAlertTriangle className="text-yellow-500 w-6 h-6" />
            Unsaved CV Detected
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            You have an unsaved CV in progress
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Bạn đang có CV chưa lưu. Bạn có muốn lưu CV này thành <strong>bản nháp (Draft)</strong> trước khi chuyển sang CV khác không?
          </p>
          <p className="text-sm text-gray-500">
            • Chọn <strong>&quot;Save as Draft&quot;</strong> để lưu CV hiện tại
            <br />
            • Chọn <strong>&quot;Skip&quot;</strong> để bỏ qua và tiếp tục
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isLoading}
            className="flex-1 text-gray-600 hover:text-gray-800"
          >
            <FiSkipForward className="mr-1.5 h-4 w-4" />
            Skip
          </Button>
          <Button
            onClick={handleSaveAsDraft}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FiSave className="mr-1.5 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save as Draft'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
