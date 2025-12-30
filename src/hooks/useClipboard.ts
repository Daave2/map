import { useState, useCallback } from 'react';
import type { Aisle } from '../types';

interface ClipboardState {
    item: Aisle | null;
    pasteCount: number;
}

const PASTE_OFFSET = 30; // Offset for each paste

export function useClipboard() {
    const [clipboard, setClipboard] = useState<ClipboardState>({
        item: null,
        pasteCount: 0,
    });

    const copy = useCallback((aisle: Aisle) => {
        setClipboard({
            item: { ...aisle },
            pasteCount: 0,
        });
    }, []);

    const paste = useCallback((): Aisle | null => {
        if (!clipboard.item) return null;

        const offset = (clipboard.pasteCount + 1) * PASTE_OFFSET;

        const newAisle: Aisle = {
            ...clipboard.item,
            id: `${clipboard.item.id}-copy-${Date.now()}`,
            label: `${clipboard.item.label} (copy)`,
            p1: [clipboard.item.p1[0] + offset, clipboard.item.p1[1] + offset],
            p2: [clipboard.item.p2[0] + offset, clipboard.item.p2[1] + offset],
            locked: false,
        };

        setClipboard((prev) => ({
            ...prev,
            pasteCount: prev.pasteCount + 1,
        }));

        return newAisle;
    }, [clipboard]);

    const clear = useCallback(() => {
        setClipboard({ item: null, pasteCount: 0 });
    }, []);

    const hasItem = clipboard.item !== null;

    return {
        copy,
        paste,
        clear,
        hasItem,
    };
}
