'use client';

import { useState } from 'react';

type ToggleProps = {
    defaultChecked?: boolean;
    ariaLabel: string;
};

export function Toggle({ defaultChecked = false, ariaLabel }: ToggleProps) {
    const [checked, setChecked] = useState<boolean>(defaultChecked);

    return (
        <button
            type="button"
            aria-label={ariaLabel}
            aria-pressed={checked}
            onClick={() => setChecked(!checked)}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${checked ? 'bg-sky-600' : 'bg-muted'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'
                    }`}
            />
        </button>
    );
}



