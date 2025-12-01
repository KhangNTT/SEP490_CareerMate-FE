"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiAlertTriangle } from "react-icons/fi";

export interface SyncConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export default function SyncConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false
}: SyncConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
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
            Existing Profile Data Detected
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600 mb-4">
            You already have data in your profile. Do you want to convert the current cm-profile data into a <strong>draft</strong>?
          </p>
          <p className="text-sm text-gray-500">
            This will preserve your existing data as a draft CV, and sync the new CV data to your profile.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            {isLoading ? 'Converting...' : 'Yes, Convert to Draft'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
