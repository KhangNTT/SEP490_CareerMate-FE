'use client';

import { useRef } from 'react';

type AvatarPickerProps = {
    label?: string;
    accept?: string;
    onFileSelected?: (file: File) => void;
};

export function AvatarPicker({ label = 'Change avatar', accept = 'image/*', onFileSelected }: AvatarPickerProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    function handleClick() {
        inputRef.current?.click();
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file && onFileSelected) onFileSelected(file);
    }

    return (
        <>
            <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={handleChange} />
            <button type="button" onClick={handleClick} className="inline-flex h-9 items-center rounded-md border border-sky-200 px-3 text-sm font-medium text-sky-800 hover:bg-sky-600 hover:text-white">
                {label}
            </button>
        </>
    );
}


