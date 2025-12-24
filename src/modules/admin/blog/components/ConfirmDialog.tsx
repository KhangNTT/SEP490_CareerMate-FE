'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    variant?: 'default' | 'destructive';
}

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    cancelText,
    variant = 'default'
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-white bg-opacity-0 flex items-center justify-center z-50">
            <div className="max-w-md w-full mx-4 bg-white rounded-lg border border-gray-200 shadow-lg">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <p className="text-gray-600 mb-6">{description}</p>

                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={onClose}>
                            {cancelText}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${variant === 'destructive'
                                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-2'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-2'
                                }`}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
