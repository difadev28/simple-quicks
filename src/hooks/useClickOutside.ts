import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export const useClickOutside = <T extends HTMLElement>(
    handler: (event: MouseEvent) => void,
    isActive: boolean
): RefObject<T | null> => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler(event);
            }
        };

        if (isActive) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isActive, handler]);

    return ref;
};
