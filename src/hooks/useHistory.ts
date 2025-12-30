import { useState, useCallback, useRef } from 'react';
import type { MapLayout } from '../types';

interface HistoryState {
    past: MapLayout[];
    present: MapLayout;
    future: MapLayout[];
}

const MAX_HISTORY = 50;

export function useHistory(initialLayout: MapLayout) {
    const [history, setHistory] = useState<HistoryState>({
        past: [],
        present: initialLayout,
        future: [],
    });

    // Track if we should record next change
    const skipNextRef = useRef(false);

    const set = useCallback((newLayout: MapLayout | ((prev: MapLayout) => MapLayout)) => {
        setHistory((prev) => {
            const nextLayout = typeof newLayout === 'function'
                ? newLayout(prev.present)
                : newLayout;

            // Skip recording if flagged (e.g., during undo/redo)
            if (skipNextRef.current) {
                skipNextRef.current = false;
                return { ...prev, present: nextLayout };
            }

            // Deep compare to avoid duplicate entries
            if (JSON.stringify(prev.present) === JSON.stringify(nextLayout)) {
                return prev;
            }

            return {
                past: [...prev.past.slice(-MAX_HISTORY + 1), prev.present],
                present: nextLayout,
                future: [],
            };
        });
    }, []);

    const undo = useCallback(() => {
        setHistory((prev) => {
            if (prev.past.length === 0) return prev;

            const previous = prev.past[prev.past.length - 1];
            const newPast = prev.past.slice(0, -1);

            return {
                past: newPast,
                present: previous,
                future: [prev.present, ...prev.future],
            };
        });
    }, []);

    const redo = useCallback(() => {
        setHistory((prev) => {
            if (prev.future.length === 0) return prev;

            const next = prev.future[0];
            const newFuture = prev.future.slice(1);

            return {
                past: [...prev.past, prev.present],
                present: next,
                future: newFuture,
            };
        });
    }, []);

    const reset = useCallback((layout: MapLayout) => {
        skipNextRef.current = true;
        setHistory({
            past: [],
            present: layout,
            future: [],
        });
    }, []);

    const canUndo = history.past.length > 0;
    const canRedo = history.future.length > 0;

    return {
        layout: history.present,
        set,
        undo,
        redo,
        reset,
        canUndo,
        canRedo,
    };
}
