import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { Aisle, ViewState, Point, EditorSettings, RangeActivity } from '../types';
import { getGridLines } from '../utils/grid';
import { matchesRangeCategory } from '../utils/categoryMatching';
import { getPromoEndGroupColor, PROMO_END_GROUPS } from '../constants/promoEndGroups';




// Helper: Get workload color based on capacity hours
function getWorkloadColor(hours: number): string {
    if (hours < 1) return 'rgba(34, 197, 94, 0.7)'; // green
    if (hours < 2) return 'rgba(234, 179, 8, 0.7)'; // yellow
    if (hours < 3) return 'rgba(249, 115, 22, 0.7)'; // orange
    return 'rgba(239, 68, 68, 0.7)'; // red
}

interface MapCanvasProps {
    aisles: Aisle[];
    selectedAisleIds: string[];
    onSelectAisle: (id: string | null, multi?: boolean) => void;
    onUpdateAisle: (id: string, updates: Partial<Aisle>) => void;
    viewState: ViewState;
    onViewChange: (state: ViewState) => void;
    editorSettings?: EditorSettings;
    searchTerm?: string;
    // Range highlighting
    rangeData?: RangeActivity[];
    activeTab?: 'range' | 'edit' | 'promo';
    // Print mode for B&W friendly output
    printMode?: boolean;
    // Theme for canvas rendering
    theme?: 'dark' | 'light';
    // User defined mappings
    customMappings?: Record<string, string>;
    // Callback for drag-and-drop mapping
    onAssignMapping?: (rangeCategory: string, storeSectionCategory: string) => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
    aisles,
    selectedAisleIds,
    onSelectAisle,
    onUpdateAisle,
    viewState,
    onViewChange,
    editorSettings,
    searchTerm = '',
    rangeData = [],
    activeTab = 'edit',
    printMode = false,
    theme = 'dark',
    customMappings = {},
    onAssignMapping,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // ... (rest of component)

    // ATTACH HANDLERS TO CANVAS
    // Since we are inside the component body, we need to find the return statement
    // But replace_file_content works on the file content.
    // I need to find where the <canvas> is rendered and add the props.

    // WAITING: I will do this in a separate step or just target the return block if I can find it.
    // Let me target the props definition first.


    // Memoize matching function to avoid recreating it
    // Updated helper to check custom mappings first (supports multiple sections via pipe separator)
    const isCategoryMatch = useCallback((sectionCat: string, rangeCat: string) => {
        // 1. Check custom mappings
        const rangeNorm = rangeCat.toLowerCase().trim();
        const sectionNorm = sectionCat.toLowerCase().trim();

        if (customMappings[rangeCat] || customMappings[rangeNorm]) {
            const mappedTarget = customMappings[rangeCat] || customMappings[rangeNorm];
            if (mappedTarget === 'IGNORE_ITEM') return { matched: false };

            // Split by pipe to support multiple linked sections
            const linkedSections = mappedTarget.split('|');
            for (const linked of linkedSections) {
                const linkedNorm = linked.toLowerCase().trim();
                if (sectionNorm.includes(linkedNorm) || linkedNorm.includes(sectionNorm)) {
                    return { matched: true, reason: `Custom mapping to "${linked}"` };
                }
            }
            // If custom mappings exist but none matched, don't fall back
            return { matched: false };
        }

        // 2. Fallback to standard logic (only if no custom mapping exists)
        return matchesRangeCategory(sectionCat, rangeCat);
    }, [customMappings]);

    // Helper to find range activity using the context-aware matcher
    const findRangeActivity = useCallback((sectionCategory: string) => {
        for (const r of rangeData) {
            const result = isCategoryMatch(sectionCategory, r.category);
            if (result.matched) {
                return { activity: r, reason: result.reason };
            }
        }
        return null;
    }, [rangeData, isCategoryMatch]);

    const [isPanning, setIsPanning] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    // dragStart stores the SCREEN COORDINATES of the mouse at start of drag
    const [dragStart, setDragStart] = useState<Point | null>(null);
    // dragOffset stores the VIEW OFFSET at start of drag (for panning)
    const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });

    // Drag mode: 'move' | 'resize' | 'rotate' | null
    type DragMode = 'move' | 'resize' | 'rotate' | null;
    const [dragMode, setDragMode] = useState<DragMode>(null);
    // Which handle is being dragged: 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r' | 'rotate'
    const [activeHandle, setActiveHandle] = useState<string | null>(null);
    // For multi-item drag: Store original positions map: { id: { p1, p2, labelPosition? } }
    const [dragOrigins, setDragOrigins] = useState<Record<string, { p1: [number, number], p2: [number, number], labelPosition?: { x: number, y: number } }>>({});
    const [dragHoverTarget, setDragHoverTarget] = useState<{ aisleId: string; sectionIndex: number } | null>(null);

    // Promo end popup state (for clicking promo ends in Promo tab)
    const [promoEndPopup, setPromoEndPopup] = useState<{
        aisleId: string;
        endKey: string;
        screenX: number;
        screenY: number;
    } | null>(null);

    // Track promo end positions for click detection
    type PromoEndBound = { aisleId: string; endKey: string; minX: number; maxX: number; minY: number; maxY: number };
    const promoEndBoundsRef = useRef<PromoEndBound[]>([]);

    // Convert screen coordinates to world coordinates
    const screenToWorld = useCallback((screenX: number, screenY: number): Point => {
        return {
            x: (screenX - viewState.offsetX) / viewState.scale,
            y: (screenY - viewState.offsetY) / viewState.scale,
        };
    }, [viewState]);

    // Calculate aisle bounding box (Box logic: No padding on length axis)
    const getAisleBounds = useCallback((aisle: Aisle) => {
        const isVertical = Math.abs(aisle.p1[1] - aisle.p2[1]) > Math.abs(aisle.p1[0] - aisle.p2[0]);

        let paddingX = aisle.aisleWidth / 2;
        let paddingY = aisle.aisleWidth / 2;

        // Remove padding from major axis to match 3D "Box" geometry
        if (isVertical) {
            paddingY = 0;
        } else {
            paddingX = 0;
        }

        const minX = Math.min(aisle.p1[0], aisle.p2[0]) - paddingX;
        const maxX = Math.max(aisle.p1[0], aisle.p2[0]) + paddingX;
        const minY = Math.min(aisle.p1[1], aisle.p2[1]) - paddingY;
        const maxY = Math.max(aisle.p1[1], aisle.p2[1]) + paddingY;
        return { minX, maxX, minY, maxY };
    }, []);

    // Helper to rotate a point around a center
    const rotatePoint = (point: Point, center: Point, angleDegrees: number): Point => {
        if (!angleDegrees) return point;
        const radians = (angleDegrees * Math.PI) / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        return {
            x: center.x + dx * cos - dy * sin,
            y: center.y + dx * sin + dy * cos
        };
    };

    // Check if point is inside aisle or its promo ends
    const isPointInAisle = useCallback((point: Point, aisle: Aisle): boolean => {
        const bounds = getAisleBounds(aisle);
        const center = { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };

        // Transform point to local unrotated space
        const localPoint = rotatePoint(point, center, -(aisle.rotation || 0));

        // Check main body
        if (aisle.type === 'aisle') {
            // For aisle markers, only hit test the label bubble (small radius)
            // Use labelPosition if available, otherwise center
            const labelX = aisle.labelPosition?.x ?? center.x;
            const labelY = aisle.labelPosition?.y ?? center.y;

            // Transform the click point relative to the LABEL's effective rotation center?
            // Actually, aisle markers rotate around their center. The localPoint is already unrotated relative to the aisle center.
            // If labelPosition is absolute world coord, we need to be careful. 
            // BUT, usually labelPosition is treated as absolute in drawing.
            // Let's use the raw 'point' (world coords) vs the label position for the distance check, 
            // because the label is drawn at labelPosition.
            // However, verify if rotation affects labelPosition. In drawing:
            // "ctx.translate(labelX, labelY); ctx.rotate(-Math.PI / 2);"
            // So the label is AT labelX, labelY. 
            // So we should check distance from world point to labelX, labelY.

            const dist = Math.sqrt(Math.pow(point.x - labelX, 2) + Math.pow(point.y - labelY, 2));
            return dist <= 20; // 20px radius
        }

        if (
            localPoint.x >= bounds.minX &&
            localPoint.x <= bounds.maxX &&
            localPoint.y >= bounds.minY &&
            localPoint.y <= bounds.maxY
        ) {
            return true;
        }

        // Check promo ends if present
        if (aisle.promoEnds) {
            const isVertical = Math.abs(aisle.p1[0] - aisle.p2[0]) < Math.abs(aisle.p1[1] - aisle.p2[1]);
            const centerX = center.x; // local center matches bounds center
            const centerY = center.y;
            const promoDepth = 20;
            const promoWidth = 22;
            const gap = 2;

            // Front
            if (aisle.promoEnds.front) {
                let rect = { x: 0, y: 0, w: 0, h: 0 };
                if (isVertical) {
                    rect = { x: centerX - promoWidth / 2, y: bounds.maxY + gap, w: promoWidth, h: promoDepth };
                } else {
                    rect = { x: bounds.maxX + gap, y: centerY - promoWidth / 2, w: promoDepth, h: promoWidth };
                }
                if (localPoint.x >= rect.x && localPoint.x <= rect.x + rect.w && localPoint.y >= rect.y && localPoint.y <= rect.y + rect.h) return true;

                // Check Front Side Units
                const sideWidth = 10;
                // Front Left
                if (aisle.promoEnds.frontLeft) {
                    let sideRect = { x: 0, y: 0, w: 0, h: 0 };
                    if (isVertical) {
                        sideRect = { x: rect.x - sideWidth - 1, y: rect.y, w: sideWidth, h: promoDepth };
                    } else {
                        // Horizontal Front (Right/East side). Left side is Top/MinY.
                        sideRect = { x: rect.x, y: rect.y - sideWidth - 1, w: promoDepth, h: sideWidth };
                    }
                    if (localPoint.x >= sideRect.x && localPoint.x <= sideRect.x + sideRect.w && localPoint.y >= sideRect.y && localPoint.y <= sideRect.y + sideRect.h) return true;
                }
                // Front Right
                if (aisle.promoEnds.frontRight) {
                    let sideRect = { x: 0, y: 0, w: 0, h: 0 };
                    if (isVertical) {
                        sideRect = { x: rect.x + promoWidth + 1, y: rect.y, w: sideWidth, h: promoDepth };
                    } else {
                        // Horizontal Front (Right/East side). Right side is Bottom/MaxY.
                        sideRect = { x: rect.x, y: rect.y + promoWidth + 1, w: promoDepth, h: sideWidth };
                    }
                    if (localPoint.x >= sideRect.x && localPoint.x <= sideRect.x + sideRect.w && localPoint.y >= sideRect.y && localPoint.y <= sideRect.y + sideRect.h) return true;
                }

            }


            // Back
            if (aisle.promoEnds.back) {
                let rect = { x: 0, y: 0, w: 0, h: 0 };
                if (isVertical) {
                    rect = { x: centerX - promoWidth / 2, y: bounds.minY - gap - promoDepth, w: promoWidth, h: promoDepth };
                } else {
                    rect = { x: bounds.minX - gap - promoDepth, y: centerY - promoWidth / 2, w: promoDepth, h: promoWidth };
                }
                if (localPoint.x >= rect.x && localPoint.x <= rect.x + rect.w && localPoint.y >= rect.y && localPoint.y <= rect.y + rect.h) return true;

                // Check Back Side Units
                const sideWidth = 10;
                // Back Left
                if (aisle.promoEnds.backLeft) {
                    let sideRect = { x: 0, y: 0, w: 0, h: 0 };
                    if (isVertical) {
                        sideRect = { x: rect.x - sideWidth - 1, y: rect.y, w: sideWidth, h: promoDepth };
                    } else {
                        // Horizontal Back (Left/West side). Left side is Bottom/MaxY.
                        sideRect = { x: rect.x, y: rect.y + promoWidth + 1, w: promoDepth, h: sideWidth };
                    }
                    if (localPoint.x >= sideRect.x && localPoint.x <= sideRect.x + sideRect.w && localPoint.y >= sideRect.y && localPoint.y <= sideRect.y + sideRect.h) return true;
                }
                // Back Right
                if (aisle.promoEnds.backRight) {
                    let sideRect = { x: 0, y: 0, w: 0, h: 0 };
                    if (isVertical) {
                        sideRect = { x: rect.x + promoWidth + 1, y: rect.y, w: sideWidth, h: promoDepth };
                    } else {
                        // Horizontal Back (Left/West side). Right side is Top/MinY.
                        sideRect = { x: rect.x, y: rect.y - sideWidth - 1, w: promoDepth, h: sideWidth };
                    }
                    if (localPoint.x >= sideRect.x && localPoint.x <= sideRect.x + sideRect.w && localPoint.y >= sideRect.y && localPoint.y <= sideRect.y + sideRect.h) return true;
                }
            }
        }

        return false;
    }, [getAisleBounds]);

    // Find aisle at point (skip aisle voids so they don't block clicks)
    const findAisleAtPoint = useCallback((point: Point): Aisle | null => {
        for (let i = aisles.length - 1; i >= 0; i--) {
            const aisle = aisles[i];
            // Skip aisle voids check removed to allow selection
            // if (aisle.type === 'aisle') continue;
            if (isPointInAisle(point, aisle)) {
                return aisle;
            }
        }
        return null;
    }, [aisles, isPointInAisle]);

    // Find promo end at point (for clicking promo ends directly)
    const findPromoEndAtPoint = useCallback((point: Point): { aisleId: string; endKey: string } | null => {
        for (const bound of promoEndBoundsRef.current) {
            if (point.x >= bound.minX && point.x <= bound.maxX &&
                point.y >= bound.minY && point.y <= bound.maxY) {
                return { aisleId: bound.aisleId, endKey: bound.endKey };
            }
        }
        return null;
    }, []);

    // Find which resize handle the point is over (only for selected aisle)
    const findHandleAtPoint = useCallback((point: Point): string | null => {
        if (selectedAisleIds.length !== 1) return null;
        const selectedAisleId = selectedAisleIds[0];

        const aisle = aisles.find(a => a.id === selectedAisleId);
        if (!aisle || aisle.locked) return null;

        const bounds = getAisleBounds(aisle);
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;
        const center = { x: centerX, y: centerY };
        const handleSize = 12; // Hit area slightly larger than visual handle

        // Transform point to local unrotated space
        const localPoint = rotatePoint(point, center, -(aisle.rotation || 0));

        // Check corners (for resize)
        const corners: { name: string; x: number; y: number }[] = [
            { name: 'tl', x: bounds.minX, y: bounds.minY },
            { name: 'tr', x: bounds.maxX, y: bounds.minY },
            { name: 'bl', x: bounds.minX, y: bounds.maxY },
            { name: 'br', x: bounds.maxX, y: bounds.maxY },
        ];

        for (const corner of corners) {
            if (Math.abs(localPoint.x - corner.x) < handleSize && Math.abs(localPoint.y - corner.y) < handleSize) {
                return corner.name;
            }
        }

        // Check sides (for width/height resize)
        const sides: { name: string; x: number; y: number }[] = [
            { name: 't', x: centerX, y: bounds.minY },
            { name: 'b', x: centerX, y: bounds.maxY },
            { name: 'l', x: bounds.minX, y: centerY },
            { name: 'r', x: bounds.maxX, y: centerY },
        ];

        for (const side of sides) {
            if (Math.abs(localPoint.x - side.x) < handleSize && Math.abs(localPoint.y - side.y) < handleSize) {
                return side.name;
            }
        }

        // Check rotation handle (positioned above the top center)
        const rotateHandleY = bounds.minY - 25;
        if (Math.abs(localPoint.x - centerX) < handleSize && Math.abs(localPoint.y - rotateHandleY) < handleSize) {
            return 'rotate';
        }

        return null;
    }, [selectedAisleIds, aisles, getAisleBounds]);

    // Draw the canvas
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Clear canvas with theme-aware background (pure white for print mode)
        let bgColor = theme === 'light' ? '#f8fafc' : '#1a1a2e';
        if (printMode) bgColor = '#ffffff';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply view transform
        ctx.save();
        ctx.translate(viewState.offsetX, viewState.offsetY);
        ctx.scale(viewState.scale, viewState.scale);

        // Draw grid (conditional based on editorSettings, disabled in print mode)
        const gridEnabled = (editorSettings?.gridEnabled ?? false) && !printMode;
        const gridSize = editorSettings?.gridSize ?? 20;

        if (gridEnabled) {
            const { horizontal, vertical } = getGridLines(viewState, canvas.width, canvas.height, gridSize);

            // Minor grid lines - theme aware
            ctx.strokeStyle = theme === 'light' ? 'rgba(100, 100, 140, 0.15)' : 'rgba(100, 100, 140, 0.3)';
            ctx.lineWidth = 0.5;

            vertical.forEach((x) => {
                ctx.beginPath();
                ctx.moveTo(x, horizontal[0] || 0);
                ctx.lineTo(x, horizontal[horizontal.length - 1] || canvas.height);
                ctx.stroke();
            });

            horizontal.forEach((y) => {
                ctx.beginPath();
                ctx.moveTo(vertical[0] || 0, y);
                ctx.lineTo(vertical[vertical.length - 1] || canvas.width, y);
                ctx.stroke();
            });

            // Major grid lines (every 5 grid units)
            ctx.strokeStyle = 'rgba(150, 150, 180, 0.5)';
            ctx.lineWidth = 1;
            const majorStep = gridSize * 5;

            vertical.filter(x => x % majorStep === 0).forEach((x) => {
                ctx.beginPath();
                ctx.moveTo(x, horizontal[0] || 0);
                ctx.lineTo(x, horizontal[horizontal.length - 1] || canvas.height);
                ctx.stroke();
            });

            horizontal.filter(y => y % majorStep === 0).forEach((y) => {
                ctx.beginPath();
                ctx.moveTo(vertical[0] || 0, y);
                ctx.lineTo(vertical[vertical.length - 1] || canvas.width, y);
                ctx.stroke();
            });
        } else if (!printMode) {
            // Draw subtle background grid when grid is disabled (but NOT in print mode)
            ctx.strokeStyle = '#2a2a4a';
            ctx.lineWidth = 0.5;
            const bgGridSize = 100;
            const startX = Math.floor(-viewState.offsetX / viewState.scale / bgGridSize) * bgGridSize - bgGridSize;
            const startY = Math.floor(-viewState.offsetY / viewState.scale / bgGridSize) * bgGridSize - bgGridSize;
            const endX = startX + (canvas.width / viewState.scale) + bgGridSize * 2;
            const endY = startY + (canvas.height / viewState.scale) + bgGridSize * 2;

            for (let x = startX; x < endX; x += bgGridSize) {
                ctx.beginPath();
                ctx.moveTo(x, startY);
                ctx.lineTo(x, endY);
                ctx.stroke();
            }
            for (let y = startY; y < endY; y += bgGridSize) {
                ctx.beginPath();
                ctx.moveTo(startX, y);
                ctx.lineTo(endX, y);
                ctx.stroke();
            }
        }

        // Collect labels for print mode (draw them all at the end, on top)
        interface PrintLabel {
            x: number;
            y: number;
            text: string;
            isRangeAffected: boolean;
        }
        const printLabels: PrintLabel[] = [];

        // Clear promo end bounds before drawing
        promoEndBoundsRef.current = [];

        // Draw aisles
        aisles.forEach((aisle) => {
            const isSelected = selectedAisleIds.includes(aisle.id);
            const bounds = getAisleBounds(aisle);
            const width = bounds.maxX - bounds.minX;
            const height = bounds.maxY - bounds.minY;
            const centerX = (bounds.minX + bounds.maxX) / 2;
            const centerY = (bounds.minY + bounds.maxY) / 2;

            // Apply rotation if set
            const hasRotation = aisle.rotation && aisle.rotation !== 0;
            if (hasRotation) {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate((aisle.rotation! * Math.PI) / 180);
                ctx.translate(-centerX, -centerY);
            }

            // For aisle voids (type="aisle"), only render the number label, no rectangle
            if (aisle.type === 'aisle') {
                // Draw just the aisle number as a floating label
                ctx.fillStyle = isSelected ? '#fff' : 'rgba(255, 255, 255, 0.5)';
                const fontSize = Math.max(14, 16 / viewState.scale);
                ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Extract just the number from "Aisle 11" -> "11"
                const aisleNum = aisle.label.replace('Aisle ', '');

                // Draw rotated for vertical aisles
                const labelX = aisle.labelPosition?.x ?? centerX;
                const labelY = aisle.labelPosition?.y ?? centerY;

                // Draw rotated for vertical aisles
                if (height > width * 1.5) {
                    ctx.save();
                    ctx.translate(labelX, labelY);
                    ctx.rotate(-Math.PI / 2);
                    ctx.fillText(aisleNum, 0, 0);
                    ctx.restore();
                } else {
                    ctx.fillText(aisleNum, labelX, labelY);
                }
                return; // Skip the rest for aisle voids
            }

            // Check if gondola has sections to draw stacked
            const sections = aisle.sections || [];
            const hasSections = sections.length > 0;
            const isVertical = height > width * 1.5;

            if (hasSections && sections.length > 1) {
                // Group sections by side (L or R)
                const leftSections = sections.filter(s => s.side === 'L');
                const rightSections = sections.filter(s => s.side === 'R');
                const hasLeftRight = leftSections.length > 0 && rightSections.length > 0;

                if (hasLeftRight) {
                    // DUAL-SIDED GONDOLA: Render as two parallel columns
                    const halfWidth = width / 2;
                    const halfHeight = height / 2;

                    // Helper function to draw section stack
                    const drawSectionStack = (sectionList: typeof sections, offsetX: number, columnWidth: number) => {
                        const stackCount = sectionList.length;
                        sectionList.forEach((section, index) => {
                            let sectionMinX, sectionMaxX, sectionMinY, sectionMaxY;

                            if (isVertical) {
                                // Vertical gondola: L on left half, R on right half
                                // Sections stack along Y axis within their half
                                const sectionHeight = height / stackCount;
                                sectionMinX = bounds.minX + offsetX;
                                sectionMaxX = sectionMinX + columnWidth;
                                sectionMinY = bounds.minY + (index * sectionHeight);
                                sectionMaxY = sectionMinY + sectionHeight;
                            } else {
                                // Horizontal gondola: L on top half, R on bottom half
                                // Sections stack along X axis within their half
                                const sectionWidth = width / stackCount;
                                sectionMinX = bounds.minX + (index * sectionWidth);
                                sectionMaxX = sectionMinX + sectionWidth;
                                sectionMinY = bounds.minY + offsetX;
                                sectionMaxY = sectionMinY + columnWidth;
                            }

                            const secWidth = sectionMaxX - sectionMinX;
                            const secHeight = sectionMaxY - sectionMinY;
                            const secCenterX = (sectionMinX + sectionMaxX) / 2;
                            const secCenterY = (sectionMinY + sectionMaxY) / 2;

                            // Simple type-based colors (subtle, lighter)
                            let catColor = 'rgba(100, 116, 139, 0.25)'; // Default neutral gray
                            const aisleType = aisle.type?.toLowerCase() || 'gondola';
                            if (aisleType === 'chilled' || aisleType === 'frozen') {
                                catColor = 'rgba(59, 130, 246, 0.25)'; // Light blue for chilled/frozen
                            } else if (aisleType === 'bakery') {
                                catColor = 'rgba(234, 179, 8, 0.25)'; // Light warm/amber for bakery
                            } else if (aisleType === 'counter') {
                                catColor = 'rgba(239, 68, 68, 0.2)'; // Light red for fresh counters
                            }
                            // gondola/fixture/promo all stay neutral gray

                            // Draw section rectangle
                            ctx.fillStyle = isSelected ? 'rgba(99, 102, 241, 0.6)' : catColor;
                            ctx.strokeStyle = isSelected ? '#818cf8' : (theme === 'light' ? '#94a3b8' : '#64748b');
                            ctx.lineWidth = isSelected ? 2 : 0.5;

                            // Search Highlight Logic
                            const isSearchMatch = searchTerm && (
                                section.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                section.bay.toLowerCase().includes(searchTerm.toLowerCase())
                            );

                            const isDragHover = dragHoverTarget?.aisleId === aisle.id && dragHoverTarget?.sectionIndex === index;

                            if (isDragHover) {
                                ctx.fillStyle = 'rgba(34, 197, 94, 0.4)'; // Green drag highlight
                                ctx.strokeStyle = '#22c55e';
                                ctx.lineWidth = 4;
                            } else if (isSearchMatch) {
                                ctx.fillStyle = 'rgba(250, 204, 21, 0.8)'; // Yellow highlight
                                ctx.strokeStyle = '#eab308';
                                ctx.lineWidth = 3;
                            } else if (searchTerm && !isSelected) {
                                // Dim non-matching items if search is active
                                ctx.fillStyle = catColor.replace(/[\d.]+\)$/, '0.1)');
                                ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
                            }

                            // PRINT MODE: B&W friendly rendering
                            if (printMode && activeTab === 'range' && !isDragHover) {
                                const matchResult = rangeData.length > 0
                                    ? findRangeActivity(section.category)
                                    : null;
                                const rangeMatch = matchResult?.activity;

                                if (rangeMatch) {
                                    ctx.fillStyle = 'rgba(200, 200, 200, 0.4)'; // Light gray shade
                                    ctx.strokeStyle = '#000'; // Bold black outline
                                    ctx.lineWidth = 2.5;
                                } else {
                                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // White/transparent
                                    ctx.strokeStyle = '#333'; // Gray outline (darker for B&W)
                                    ctx.lineWidth = 0.75;
                                }
                            }
                            // 4. Fallback / Search Dimming
                            else if (searchTerm && !isSelected) {
                                ctx.fillStyle = catColor.replace(/[\d.]+\)$/, '0.1)');
                                ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
                            }

                            // 3. Range Activity Highlighting (lowest priority override)
                            else if (
                                activeTab === 'range' &&
                                rangeData.length > 0 &&
                                !searchTerm &&
                                !isDragHover // CRITICAL: Skip if we are hovering!
                            ) {
                                const matchResult = findRangeActivity(section.category);
                                const rangeMatch = matchResult?.activity;
                                if (rangeMatch) {
                                    ctx.fillStyle = getWorkloadColor(rangeMatch.capacityHours);
                                    ctx.strokeStyle = '#fff';
                                    ctx.lineWidth = 2;
                                } else {
                                    ctx.fillStyle = catColor.replace(/[\d.]+\)$/, '0.15)');
                                    ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
                                    ctx.lineWidth = 0.5;
                                }
                            }

                            // 4. Promo End Group coloring
                            else if (activeTab === 'promo' && !isDragHover && !isSelected) {
                                const promoColor = getPromoEndGroupColor(aisle.promoEndGroup);
                                if (promoColor) {
                                    ctx.fillStyle = promoColor + 'aa'; // Add transparency
                                    ctx.strokeStyle = promoColor;
                                    ctx.lineWidth = 2;
                                } else {
                                    // No group assigned - show dimmed
                                    ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
                                    ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
                                    ctx.lineWidth = 0.5;
                                }
                            }

                            ctx.beginPath();
                            ctx.rect(sectionMinX, sectionMinY, secWidth, secHeight);
                            ctx.fill();
                            ctx.stroke();

                            // Check if this is a range-affected section
                            const matchResultForLabel = activeTab === 'range' && rangeData.length > 0
                                ? findRangeActivity(section.category)
                                : null;
                            const rangeMatchForLabel = matchResultForLabel?.activity;

                            // Determine Label
                            let labelText = "";

                            // Use the mapped range category name if available in Range Mode
                            const displayCategory = (activeTab === 'range' && rangeMatchForLabel)
                                ? rangeMatchForLabel.category
                                : section.category;

                            if (printMode && rangeMatchForLabel) {
                                // PRINT MODE: Always show category for range-affected sections
                                labelText = displayCategory;
                            } else if (isSearchMatch || viewState.scale >= 1.5) {
                                labelText = `${section.bay} ${displayCategory}`;
                            } else if (viewState.scale >= 0.7) {
                                labelText = displayCategory;
                                if (labelText.length > 15) labelText = labelText.substring(0, 13) + '..'; // Slightly longer limit
                            }

                            // Always show label for search matches
                            if (isSearchMatch) {
                                ctx.fillStyle = '#000';
                                ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
                                ctx.shadowBlur = 4;
                            } else {
                                ctx.shadowBlur = 0;
                            }

                            if (labelText) {
                                if (printMode) {
                                    // Print mode: black text
                                    ctx.fillStyle = '#000';
                                } else if (!isSearchMatch) {
                                    // Theme-aware label colors
                                    const labelColor = theme === 'light'
                                        ? (isSelected ? '#1e293b' : 'rgba(15, 23, 42, 0.85)')
                                        : (isSelected ? '#fff' : 'rgba(255,255,255,0.9)');
                                    ctx.fillStyle = labelColor;
                                }
                                const fontSize = Math.max(6, 12 / viewState.scale); // Slightly larger base for readability
                                ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';

                                const textWidth = ctx.measureText(labelText).width;
                                const availableWidth = isVertical ? secHeight : secWidth;

                                // In print mode, collect labels for later rendering on top
                                if (printMode && activeTab === 'range') {
                                    // Only add range-affected sections to print labels
                                    if (rangeMatchForLabel) {
                                        printLabels.push({
                                            x: secCenterX,
                                            y: secCenterY,
                                            text: labelText,
                                            isRangeAffected: true
                                        });
                                    }
                                } else {
                                    // Normal mode drawing
                                    const textFits = textWidth < availableWidth * 1.2;
                                    if (textFits) {
                                        if (isVertical) {
                                            ctx.save();
                                            ctx.translate(secCenterX, secCenterY);
                                            ctx.rotate(-Math.PI / 2);
                                            ctx.fillText(labelText, 0, 0);
                                            ctx.restore();
                                        } else {
                                            ctx.fillText(labelText, secCenterX, secCenterY);
                                        }
                                    }
                                }
                            }
                        });
                    };

                    // Draw left sections (first half of gondola width)
                    if (isVertical) {
                        drawSectionStack(leftSections, 0, halfWidth);
                        drawSectionStack(rightSections, halfWidth, halfWidth);
                    } else {
                        drawSectionStack(leftSections, 0, halfHeight);
                        drawSectionStack(rightSections, halfHeight, halfHeight);
                    }

                    // Draw center divider line
                    ctx.strokeStyle = '#334155';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    if (isVertical) {
                        ctx.moveTo(bounds.minX + halfWidth, bounds.minY);
                        ctx.lineTo(bounds.minX + halfWidth, bounds.maxY);
                    } else {
                        ctx.moveTo(bounds.minX, bounds.minY + halfHeight);
                        ctx.lineTo(bounds.maxX, bounds.minY + halfHeight);
                    }
                    ctx.stroke();

                } else {
                    // SINGLE-SIDED: Stack all sections sequentially (original behavior)
                    const sectionCount = sections.length;
                    sections.forEach((section, index) => {
                        let sectionMinX, sectionMaxX, sectionMinY, sectionMaxY;

                        if (isVertical) {
                            const sectionHeight = height / sectionCount;
                            sectionMinX = bounds.minX;
                            sectionMaxX = bounds.maxX;
                            sectionMinY = bounds.minY + (index * sectionHeight);
                            sectionMaxY = sectionMinY + sectionHeight;
                        } else {
                            const sectionWidth = width / sectionCount;
                            sectionMinX = bounds.minX + (index * sectionWidth);
                            sectionMaxX = sectionMinX + sectionWidth;
                            sectionMinY = bounds.minY;
                            sectionMaxY = bounds.maxY;
                        }

                        const secWidth = sectionMaxX - sectionMinX;
                        const secHeight = sectionMaxY - sectionMinY;
                        const secCenterX = (sectionMinX + sectionMaxX) / 2;
                        const secCenterY = (sectionMinY + sectionMaxY) / 2;

                        // Simple type-based colors (subtle, lighter)
                        let catColor = 'rgba(100, 116, 139, 0.25)'; // Default neutral gray
                        const aisleType = aisle.type?.toLowerCase() || 'gondola';
                        if (aisleType === 'chilled' || aisleType === 'frozen') {
                            catColor = 'rgba(59, 130, 246, 0.25)'; // Light blue for chilled/frozen
                        } else if (aisleType === 'bakery') {
                            catColor = 'rgba(234, 179, 8, 0.25)'; // Light warm/amber for bakery
                        } else if (aisleType === 'counter') {
                            catColor = 'rgba(239, 68, 68, 0.2)'; // Light red for fresh counters
                        }
                        // gondola/fixture/promo all stay neutral gray


                        ctx.fillStyle = isSelected ? 'rgba(99, 102, 241, 0.6)' : catColor;
                        ctx.strokeStyle = isSelected ? '#818cf8' : (theme === 'light' ? '#94a3b8' : '#64748b');
                        ctx.lineWidth = isSelected ? 2 : 0.5;

                        const isDragHover = dragHoverTarget?.aisleId === aisle.id && dragHoverTarget?.sectionIndex === index;

                        // Search Highlight Logic
                        const isSearchMatch = searchTerm && (
                            section.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            section.bay.toLowerCase().includes(searchTerm.toLowerCase())
                        );

                        if (isDragHover) {
                            ctx.fillStyle = 'rgba(34, 197, 94, 0.4)'; // Green drag highlight
                            ctx.strokeStyle = '#22c55e';
                            ctx.lineWidth = 4;
                        } else if (isSearchMatch) {
                            ctx.fillStyle = 'rgba(250, 204, 21, 0.8)'; // Yellow highlight
                            ctx.strokeStyle = '#eab308';
                            ctx.lineWidth = 3;
                        } else if (searchTerm && !isSelected) {
                            // Dim non-matching items if search is active
                            ctx.fillStyle = catColor.replace(/[\d.]+\)$/, '0.1)');
                            ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
                        }

                        // PRINT MODE: B&W skeleton for single-sided sections too
                        if (printMode && activeTab === 'range' && !isDragHover) {
                            const matchResult = rangeData.length > 0
                                ? findRangeActivity(section.category)
                                : null;
                            const rangeMatch = matchResult?.activity;

                            if (rangeMatch) {
                                ctx.fillStyle = 'rgba(200, 200, 200, 0.4)';
                                ctx.strokeStyle = '#000';
                                ctx.lineWidth = 2.5;
                            } else {
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                                ctx.strokeStyle = '#333';
                                ctx.lineWidth = 0.75;
                            }
                        }

                        ctx.beginPath();
                        ctx.rect(sectionMinX, sectionMinY, secWidth, secHeight);
                        ctx.fill();
                        ctx.stroke();

                        let labelText = "";

                        // Check if range affected for label purposes
                        const matchResultForLabel = activeTab === 'range' && rangeData.length > 0
                            ? findRangeActivity(section.category)
                            : null;
                        const rangeMatchForLabel = matchResultForLabel?.activity;

                        // Check if range affected for print mode forcing
                        let isRangeAffected = !!rangeMatchForLabel;

                        // Use the mapped range category name if available in Range Mode
                        const displayCategory = (activeTab === 'range' && rangeMatchForLabel)
                            ? rangeMatchForLabel.category
                            : section.category;

                        if (isSearchMatch || viewState.scale >= 1.5 || (printMode && isRangeAffected)) {
                            labelText = displayCategory;
                        } else if (viewState.scale >= 0.7) {
                            labelText = displayCategory;
                            if (labelText.length > 15) labelText = labelText.substring(0, 13) + '..';
                        }

                        // Always show label for search matches
                        if (isSearchMatch) {
                            ctx.fillStyle = '#000';
                            ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
                            ctx.shadowBlur = 4;
                        } else {
                            ctx.shadowBlur = 0;
                        }

                        if (labelText) {
                            // In print mode, collect labels for range-affected sections only
                            if (printMode && activeTab === 'range') {
                                if (rangeMatchForLabel) {
                                    printLabels.push({
                                        x: secCenterX,
                                        y: secCenterY,
                                        text: labelText,
                                        isRangeAffected: true
                                    });
                                }
                            } else {
                                // Normal mode drawing
                                if (!isSearchMatch) {
                                    // Theme-aware label colors (same as dual-sided)
                                    const labelColor = theme === 'light'
                                        ? (isSelected ? '#1e293b' : 'rgba(15, 23, 42, 0.85)')
                                        : (isSelected ? '#fff' : 'rgba(255,255,255,0.9)');
                                    ctx.fillStyle = labelColor;
                                }
                                const fontSize = Math.max(6, 12 / viewState.scale);
                                ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';

                                const textWidth = ctx.measureText(labelText).width;
                                const availableWidth = isVertical ? secHeight : secWidth;

                                if (textWidth < availableWidth * 1.2) {
                                    if (isVertical) {
                                        ctx.save();
                                        ctx.translate(secCenterX, secCenterY);
                                        ctx.rotate(-Math.PI / 2);
                                        ctx.fillText(labelText, 0, 0);
                                        ctx.restore();
                                    } else {
                                        ctx.fillText(labelText, secCenterX, secCenterY);
                                    }
                                }
                            }
                        }
                    });
                }

                // Draw outer border for the whole gondola
                if (printMode && activeTab === 'range') {
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 0.75;
                } else {
                    ctx.strokeStyle = isSelected ? '#818cf8' : '#60a5fa';
                    ctx.lineWidth = isSelected ? 3 : 1.5;
                }
                ctx.beginPath();
                ctx.roundRect(bounds.minX, bounds.minY, width, height, 2);
                ctx.stroke();

            } else {
                // Draw as single rectangle (no sections or just one)
                // Use the same type-based coloring as multi-section units
                let catColor = 'rgba(100, 116, 139, 0.25)'; // Default neutral gray
                const aisleType = aisle.type?.toLowerCase() || 'gondola';
                if (aisleType === 'chilled' || aisleType === 'frozen') {
                    catColor = 'rgba(59, 130, 246, 0.25)'; // Light blue for chilled/frozen
                } else if (aisleType === 'bakery') {
                    catColor = 'rgba(234, 179, 8, 0.25)'; // Light warm/amber for bakery
                } else if (aisleType === 'counter') {
                    catColor = 'rgba(239, 68, 68, 0.2)'; // Light red for fresh counters
                }

                if (printMode && activeTab === 'range') {
                    // Print mode: B&W skeleton
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 0.75;
                } else {
                    ctx.fillStyle = isSelected ? 'rgba(99, 102, 241, 0.6)' : catColor;
                    ctx.strokeStyle = isSelected ? '#818cf8' : (theme === 'light' ? '#94a3b8' : '#64748b');
                    ctx.lineWidth = isSelected ? 2 : 0.5;
                }

                ctx.beginPath();
                ctx.roundRect(bounds.minX, bounds.minY, width, height, 2);
                ctx.fill();
                ctx.stroke();

                // Draw section label (same rules as multi-section)
                const sections = aisle.sections || [];
                const section = sections[0];
                const displayCategory = section?.category || aisle.label;

                // Only show label at certain zoom levels (same as multi-section)
                let labelText = "";
                if (viewState.scale >= 1.5) {
                    labelText = section ? `${section.bay} ${displayCategory}` : displayCategory;
                } else if (viewState.scale >= 0.7) {
                    labelText = displayCategory;
                    if (labelText.length > 15) labelText = labelText.substring(0, 13) + '..';
                }

                // In print mode, check if this unit should show a label (range-affected check)
                if (printMode && activeTab === 'range') {
                    let rangeMatch = null;
                    if (section) {
                        const matchResult = findRangeActivity(section.category);
                        rangeMatch = matchResult?.activity;
                    }

                    // Only add to printLabels if range-affected
                    if (rangeMatch) {
                        printLabels.push({
                            x: centerX,
                            y: centerY,
                            text: displayCategory,
                            isRangeAffected: true
                        });
                    }
                } else if (labelText) {
                    // Normal mode: draw label with zoom-dependent visibility and theme-aware colors
                    const labelColor = theme === 'light'
                        ? (isSelected ? '#1e293b' : 'rgba(15, 23, 42, 0.85)')
                        : (isSelected ? '#fff' : 'rgba(255,255,255,0.9)');
                    ctx.fillStyle = labelColor;

                    const fontSize = Math.max(6, 12 / viewState.scale);
                    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    const textWidth = ctx.measureText(labelText).width;
                    const availableWidth = isVertical ? height : width;

                    if (textWidth < availableWidth * 1.2) {
                        const labelX = aisle.labelPosition?.x ?? centerX;
                        const labelY = aisle.labelPosition?.y ?? centerY;

                        if (isVertical) {
                            ctx.save();
                            ctx.translate(labelX, labelY);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText(labelText, 0, 0);
                            ctx.restore();
                        } else {
                            ctx.fillText(labelText, labelX, labelY);
                        }
                    }
                }
            }

            // Draw embedded promo ends if present (Front/Back)
            if (aisle.promoEnds) {
                const promoDepth = 20;
                const promoWidth = 22; // Slightly narrower than gondola (30)
                const gap = 2;

                // Helper to draw promo box
                const drawPromoBox = (x: number, y: number, w: number, h: number, label: string, promoInfo?: { group?: string }, endKey?: string) => {
                    // Register bounds for click detection
                    if (endKey) {
                        promoEndBoundsRef.current.push({
                            aisleId: aisle.id,
                            endKey,
                            minX: x,
                            maxX: x + w,
                            minY: y,
                            maxY: y + h,
                        });
                    }

                    let fillStyle = isSelected ? '#a855f7' : '#9333ea';
                    let strokeStyle = '#e9d5ff';
                    let lineWidth = 1;

                    if (printMode) {
                        fillStyle = 'rgba(220, 220, 220, 0.5)';
                        strokeStyle = '#333';
                        lineWidth = 1.5;
                    } else if (activeTab === 'promo') {
                        // Color by promo end group
                        const promoColor = promoInfo?.group ? getPromoEndGroupColor(promoInfo.group as any) : null;
                        if (promoColor) {
                            fillStyle = promoColor;
                            strokeStyle = '#fff';
                            lineWidth = 2;
                        } else {
                            // No group assigned - show dimmed gray
                            fillStyle = 'rgba(100, 100, 100, 0.4)';
                            strokeStyle = 'rgba(100, 116, 139, 0.5)';
                            lineWidth = 1;
                        }
                    } else if (activeTab === 'range') {
                        // Check Range Status
                        const matchResult = findRangeActivity(label);
                        const rangeMatch = matchResult?.activity;

                        if (rangeMatch) {
                            fillStyle = getWorkloadColor(rangeMatch.capacityHours);
                            strokeStyle = '#fff';
                            lineWidth = 2;
                        } else if (rangeData.length > 0 && !searchTerm) {
                            // Dim if we have range data but this doesn't match
                            fillStyle = 'rgba(147, 51, 234, 0.15)'; // Dimmed Purple
                            strokeStyle = 'rgba(100, 116, 139, 0.2)';
                            lineWidth = 0.5;
                        }
                    }

                    ctx.fillStyle = fillStyle;
                    ctx.strokeStyle = strokeStyle;
                    ctx.lineWidth = lineWidth;

                    ctx.beginPath();
                    ctx.roundRect(x, y, w, h, 2);
                    ctx.fill();
                    ctx.stroke();

                    // Draw label (skip in print mode - promo ends not part of range data)
                    if (!(printMode && activeTab === 'range')) {
                        const fontSize = Math.max(7, 9 / viewState.scale);
                        ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
                        ctx.fillStyle = '#fff';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';

                        const textWidth = ctx.measureText(label).width;
                        const availableWidth = isVertical ? h : w;

                        if (textWidth < availableWidth * 1.3) { // Allow slight overflow for small promo codes
                            if (isVertical) {
                                ctx.save();
                                ctx.translate(x + w / 2, y + h / 2);
                                ctx.rotate(-Math.PI / 2);
                                ctx.fillText(label, 0, 0);
                                ctx.restore();
                            } else {
                                ctx.fillText(label, x + w / 2, y + h / 2);
                            }
                        }
                    }
                };

                if (aisle.promoEnds.front) {
                    // Front attached to MaxY (vertical) or MaxX (horizontal)
                    if (isVertical) {
                        // Standard: Front is "Down" (MaxY)
                        const px = centerX - promoWidth / 2;
                        const py = bounds.maxY + gap;
                        drawPromoBox(px, py, promoWidth, promoDepth, aisle.promoEnds.front.code, aisle.promoEnds.front, 'front');

                        // Side units for front
                        const sideWidth = 10;
                        if (aisle.promoEnds.frontLeft) {
                            drawPromoBox(px - sideWidth - 1, py, sideWidth, promoDepth, aisle.promoEnds.frontLeft.code, aisle.promoEnds.frontLeft, 'frontLeft');
                        }
                        if (aisle.promoEnds.frontRight) {
                            drawPromoBox(px + promoWidth + 1, py, sideWidth, promoDepth, aisle.promoEnds.frontRight.code, aisle.promoEnds.frontRight, 'frontRight');
                        }
                    } else {
                        const px = bounds.maxX + gap;
                        const py = centerY - promoWidth / 2;
                        // Swap dimensions for horizontal
                        drawPromoBox(px, py, promoDepth, promoWidth, aisle.promoEnds.front.code, aisle.promoEnds.front, 'front');

                        // Side units for front (horizontal)
                        const sideWidth = 10;
                        if (aisle.promoEnds.frontLeft) {
                            // Left side relative to the aisle facing...
                            // If aisle is horizontal P1->P2 is Left->Right. 
                            // Facing "Front" (Right side), "Left" is Up (minY direction), "Right" is Down (maxY direction)
                            // Let's assume standard orientation matching the vertical logic
                            // Top side (minY)
                            drawPromoBox(px, py - sideWidth - 1, promoDepth, sideWidth, aisle.promoEnds.frontLeft.code, aisle.promoEnds.frontLeft, 'frontLeft');
                        }
                        if (aisle.promoEnds.frontRight) {
                            // Bottom side (maxY)
                            drawPromoBox(px, py + promoWidth + 1, promoDepth, sideWidth, aisle.promoEnds.frontRight.code, aisle.promoEnds.frontRight, 'frontRight');
                        }
                    }
                }

                if (aisle.promoEnds.back) {
                    // Back attached to MinY (vertical) or MinX (horizontal)
                    if (isVertical) {
                        const px = centerX - promoWidth / 2;
                        const py = bounds.minY - gap - promoDepth;
                        drawPromoBox(px, py, promoWidth, promoDepth, aisle.promoEnds.back.code, aisle.promoEnds.back, 'back');

                        // Side units for back
                        const sideWidth = 10;
                        if (aisle.promoEnds.backLeft) {
                            drawPromoBox(px - sideWidth - 1, py, sideWidth, promoDepth, aisle.promoEnds.backLeft.code, aisle.promoEnds.backLeft, 'backLeft');
                        }
                        if (aisle.promoEnds.backRight) {
                            drawPromoBox(px + promoWidth + 1, py, sideWidth, promoDepth, aisle.promoEnds.backRight.code, aisle.promoEnds.backRight, 'backRight');
                        }
                    } else {
                        const px = bounds.minX - gap - promoDepth;
                        const py = centerY - promoWidth / 2;
                        drawPromoBox(px, py, promoDepth, promoWidth, aisle.promoEnds.back.code, aisle.promoEnds.back, 'back');

                        // Side units for back (horizontal)
                        const sideWidth = 10;
                        if (aisle.promoEnds.backLeft) {
                            // Left side relative to Back facing (looking Left/MinX)
                            // "Left" would be Bottom (maxY), "Right" would be Top (minY) - wait
                            // If I stand at back facing out (Left), my Left hand is South/Down/MaxY?
                            // Front facing Right/East: Left hand is North/Up/MinY.
                            // Back facing Left/West: Left hand is South/Down/MaxY.
                            // Let's stick to consistent "Left = Top" visually for now or match Vertical logic?
                            // Vertical Back (MinY): Left is drawn at x - sideWidth (Left on screen). Right at x + width (Right on screen).
                            // Vertical Back faces TOP. Left hand is West/Left. Right hand is East/Right.
                            // Wait, Vertical logic:
                            // Back attached to MinY. pX = center - width/2.
                            // Left drawn at px - sideWidth. (Screen Left).
                            // If facing North (Up/MinY), Screen Left is my LEFT hand. Correct.
                            // Horizontal Back attached to MinX. Facing West (Left).
                            // My Left hand should be South (Down/MaxY).
                            // My Right hand should be North (Up/MinY).

                            // Let's implement consistent w/ Front for now to avoid confusion or swap if needed.
                            // Front (Facing East): Left was Top (MinY).
                            // Back (Facing West): Left should be Bottom (MaxY).

                            drawPromoBox(px, py + promoWidth + 1, promoDepth, sideWidth, aisle.promoEnds.backLeft.code, aisle.promoEnds.backLeft, 'backLeft');
                        }
                        if (aisle.promoEnds.backRight) {
                            // Right side (Top/MinY)
                            drawPromoBox(px, py - sideWidth - 1, promoDepth, sideWidth, aisle.promoEnds.backRight.code, aisle.promoEnds.backRight, 'backRight');
                        }
                    }
                }
            }

            // Draw endpoints for selected aisle
            if (isSelected) {
                ctx.fillStyle = '#10b981';
                ctx.beginPath();
                ctx.arc(aisle.p1[0], aisle.p1[1], 6, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.arc(aisle.p2[0], aisle.p2[1], 6, 0, Math.PI * 2);
                ctx.fill();

                // Draw resize handles at corners
                const handleSize = 8;
                const corners = [
                    { x: bounds.minX, y: bounds.minY }, // top-left
                    { x: bounds.maxX, y: bounds.minY }, // top-right
                    { x: bounds.minX, y: bounds.maxY }, // bottom-left
                    { x: bounds.maxX, y: bounds.maxY }, // bottom-right
                ];

                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#1a1a2e';
                ctx.lineWidth = 2;

                corners.forEach((corner) => {
                    ctx.beginPath();
                    ctx.rect(
                        corner.x - handleSize / 2,
                        corner.y - handleSize / 2,
                        handleSize,
                        handleSize
                    );
                    ctx.fill();
                    ctx.stroke();
                });

                // Draw width resize handles (middle of sides)
                const middles = [
                    { x: centerX, y: bounds.minY }, // top
                    { x: centerX, y: bounds.maxY }, // bottom
                    { x: bounds.minX, y: centerY }, // left
                    { x: bounds.maxX, y: centerY }, // right
                ];

                ctx.fillStyle = '#a5b4fc';
                middles.forEach((mid) => {
                    ctx.beginPath();
                    ctx.rect(
                        mid.x - handleSize / 2,
                        mid.y - handleSize / 2,
                        handleSize,
                        handleSize
                    );
                    ctx.fill();
                    ctx.stroke();
                });

                // Draw rotation handle (above top center)
                const rotateHandleY = bounds.minY - 25;

                // Line connecting to fixture
                ctx.strokeStyle = '#818cf8';
                ctx.lineWidth = 2;
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(centerX, bounds.minY);
                ctx.lineTo(centerX, rotateHandleY);
                ctx.stroke();
                ctx.setLineDash([]);

                // Rotation handle circle
                ctx.fillStyle = '#6366f1';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(centerX, rotateHandleY, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Rotation icon inside
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(centerX, rotateHandleY, 4, -Math.PI * 0.5, Math.PI);
                ctx.stroke();
                // Arrow head
                ctx.beginPath();
                ctx.moveTo(centerX - 4, rotateHandleY + 2);
                ctx.lineTo(centerX - 4, rotateHandleY - 2);
                ctx.lineTo(centerX - 0, rotateHandleY);
                ctx.closePath();
                ctx.fill();
            }

            // Close rotation transform if applied
            if (hasRotation) {
                ctx.restore();
            }
        });

        // PRINT MODE: Draw all collected labels on top with consistent diagonal style
        if (printMode && activeTab === 'range' && printLabels.length > 0) {
            const fontSize = Math.max(8, 10 / viewState.scale);
            ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // De-duplicate labels: group labels with the same text that are close together
            const PROXIMITY_THRESHOLD = 150; // pixels - labels within this distance get grouped
            const deduplicatedLabels: PrintLabel[] = [];
            const processedIndices = new Set<number>();

            printLabels.forEach((label, i) => {
                if (processedIndices.has(i)) return;

                // Find all labels with the same text within proximity
                const cluster: PrintLabel[] = [label];
                processedIndices.add(i);

                printLabels.forEach((other, j) => {
                    if (i === j || processedIndices.has(j)) return;
                    if (label.text !== other.text) return;

                    // Check if within proximity of any label in the cluster
                    const isNearCluster = cluster.some(c => {
                        const dx = c.x - other.x;
                        const dy = c.y - other.y;
                        return Math.sqrt(dx * dx + dy * dy) < PROXIMITY_THRESHOLD;
                    });

                    if (isNearCluster) {
                        cluster.push(other);
                        processedIndices.add(j);
                    }
                });

                // Use the centroid of the cluster as the label position
                const avgX = cluster.reduce((sum, l) => sum + l.x, 0) / cluster.length;
                const avgY = cluster.reduce((sum, l) => sum + l.y, 0) / cluster.length;
                deduplicatedLabels.push({
                    x: avgX,
                    y: avgY,
                    text: label.text,
                    isRangeAffected: label.isRangeAffected
                });
            });

            // Collision resolution: spread overlapping labels apart (gently)
            // Calculate label sizes for collision detection
            interface LabelWithSize extends PrintLabel {
                width: number;
                height: number;
                origX: number;  // Store original position
                origY: number;
            }

            const MAX_DISPLACEMENT = 50; // Max pixels a label can move from original

            const labelsWithSize: LabelWithSize[] = deduplicatedLabels.map(label => {
                const textWidth = ctx.measureText(label.text).width;
                const padding = 3;
                // Diagonal rotation makes effective collision box larger
                const w = (textWidth + padding * 2) * 0.7; // Tighter approximation
                const h = (fontSize + padding * 2) * 1.2;
                return { ...label, width: w, height: h, origX: label.x, origY: label.y };
            });

            // Iteratively resolve collisions (up to 5 iterations, gentler)
            for (let iter = 0; iter < 5; iter++) {
                let hasCollision = false;

                for (let i = 0; i < labelsWithSize.length; i++) {
                    for (let j = i + 1; j < labelsWithSize.length; j++) {
                        const a = labelsWithSize[i];
                        const b = labelsWithSize[j];

                        // Check if labels overlap
                        const dx = b.x - a.x;
                        const dy = b.y - a.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const minDist = (a.width + b.width) / 2 + 5; // 5px gap

                        if (dist < minDist && dist > 0) {
                            hasCollision = true;
                            // Push labels apart gently (only 30% of overlap)
                            const overlap = minDist - dist;
                            const pushX = (dx / dist) * overlap * 0.3;
                            const pushY = (dy / dist) * overlap * 0.3;

                            a.x -= pushX;
                            a.y -= pushY;
                            b.x += pushX;
                            b.y += pushY;

                            // Clamp to max displacement from original
                            const clamp = (val: number, orig: number) =>
                                Math.max(orig - MAX_DISPLACEMENT, Math.min(orig + MAX_DISPLACEMENT, val));
                            a.x = clamp(a.x, a.origX);
                            a.y = clamp(a.y, a.origY);
                            b.x = clamp(b.x, b.origX);
                            b.y = clamp(b.y, b.origY);
                        } else if (dist === 0) {
                            // Labels at exact same position - nudge slightly
                            hasCollision = true;
                            a.x += 10;
                            b.x -= 10;
                        }
                    }
                }

                if (!hasCollision) break;
            }

            labelsWithSize.forEach(label => {
                ctx.save();
                ctx.translate(label.x, label.y);
                ctx.rotate(-Math.PI / 4); // 45 degree angle for all labels

                // Measure text for background
                const textWidth = ctx.measureText(label.text).width;
                const padding = 3;
                const bgWidth = textWidth + padding * 2;
                const bgHeight = fontSize + padding * 2;

                // Draw white background box
                ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                ctx.fillRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight);

                // Draw border (bold for range-affected)
                ctx.strokeStyle = label.isRangeAffected ? '#000' : '#888';
                ctx.lineWidth = label.isRangeAffected ? 1 : 0.5;
                ctx.strokeRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight);

                // Draw text
                ctx.fillStyle = '#000';
                ctx.fillText(label.text, 0, 0);
                ctx.restore();
            });
        }

        ctx.restore();
    }, [aisles, selectedAisleIds, viewState, getAisleBounds, editorSettings, searchTerm, rangeData, activeTab, printMode, theme, dragHoverTarget, customMappings]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            draw();
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [draw]);

    // Redraw when state changes
    useEffect(() => {
        draw();
    }, [draw]);

    // Handle pointer down (replaces mouse down for touch support)
    const handleMouseDown = (e: React.PointerEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Capture pointer for smooth dragging even if moving outside canvas
        // (Optional: e.currentTarget.setPointerCapture(e.pointerId)) 
        // Note: Automatic capture usually works for mouse/touch down

        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const worldPoint = screenToWorld(screenX, screenY);

        const isTouch = e.pointerType === 'touch';

        if (e.button === 1 || (e.button === 0 && e.altKey) || (isTouch && e.button === 0)) {
            // Middle click, Alt+click, or Touch drag: pan
            setIsPanning(true);
            setDragStart({ x: e.clientX, y: e.clientY });
            setDragOffset({ x: viewState.offsetX, y: viewState.offsetY });
        } else if (e.button === 0) {
            // PROMO MODE: Check for promo end click first
            if (activeTab === 'promo') {
                const promoEnd = findPromoEndAtPoint(worldPoint);
                if (promoEnd) {
                    setPromoEndPopup({
                        aisleId: promoEnd.aisleId,
                        endKey: promoEnd.endKey,
                        screenX: e.clientX,
                        screenY: e.clientY,
                    });
                    return;
                }
                setPromoEndPopup(null);
            }

            // Check if clicking on a resize/rotate handle first (Only if exactly one item selected AND in edit mode)
            let handleClicked = false;
            // Only allow handles if in edit mode
            if (activeTab === 'edit' && selectedAisleIds.length === 1) {
                const singleAisleId = selectedAisleIds[0];
                const aisle = aisles.find(a => a.id === singleAisleId);
                if (aisle && !aisle.locked) {
                    const handle = findHandleAtPoint(worldPoint);
                    if (handle) {
                        setIsDragging(true);
                        setDragMode(handle === 'rotate' ? 'rotate' : 'resize');
                        setActiveHandle(handle);
                        setDragStart(worldPoint);
                        handleClicked = true;
                    }
                }
            }

            if (handleClicked) return;

            // Left click: select, drag aisle, or pan background
            const clickedAisle = findAisleAtPoint(worldPoint);

            if (clickedAisle) {
                const isMultiSelect = e.shiftKey;

                if (isMultiSelect) {
                    onSelectAisle(clickedAisle.id, true);
                    // Don't drag on toggle click to avoid accidental moves
                } else {
                    if (!selectedAisleIds.includes(clickedAisle.id)) {
                        // Clicked on unselected item -> select only this
                        onSelectAisle(clickedAisle.id, false);
                    }
                    // If clicking an ALREADY selected item without Shift, we keep selection to allow drag
                }

                // Only allow drag moving if in edit mode
                if (activeTab === 'edit' && !clickedAisle.locked && !isMultiSelect) {
                    setIsDragging(true);
                    setDragMode('move');
                    setDragStart(worldPoint);

                    // Initialize Drag Origins for ALL selected items
                    // Use current props 'selectedAisleIds' but if we just clicked an unselected item, the prop won't update until next render.
                    // However, we can infer what we are dragging:
                    // If we just exclusively selected it: [clickedAisle.id]
                    // If it was already selected: selectedAisleIds

                    // Actually, since state updates are async, 'selectedAisleIds' here is the OLD value.
                    // But if it wasn't selected, strict single selection happened.
                    const isNewSelection = !selectedAisleIds.includes(clickedAisle.id);
                    const idsToDrag = isNewSelection ? [clickedAisle.id] : selectedAisleIds;

                    const origins: Record<string, { p1: [number, number], p2: [number, number], labelPosition?: { x: number, y: number } }> = {};
                    idsToDrag.forEach(id => {
                        const a = aisles.find(x => x.id === id);
                        if (a) {
                            origins[id] = { p1: [...a.p1], p2: [...a.p2], labelPosition: a.labelPosition ? { ...a.labelPosition } : undefined };
                        }
                    });
                    setDragOrigins(origins);
                }
            } else {
                // Clicked on empty space
                onSelectAisle(null);
                setIsPanning(true);
                setDragStart({ x: e.clientX, y: e.clientY });
                setDragOffset({ x: viewState.offsetX, y: viewState.offsetY });
            }
        }
    };

    // Helper: Check if point is inside a rotated rectangle
    const isPointInRotatedRect = (point: Point, rect: { x: number, y: number, w: number, h: number, rotation: number }) => {
        const center = { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
        const local = rotatePoint(point, center, -rect.rotation);
        return local.x >= rect.x && local.x <= rect.x + rect.w &&
            local.y >= rect.y && local.y <= rect.y + rect.h;
    };

    // Helper: Get section at world point
    const getSectionAtPoint = useCallback((point: Point) => {
        for (const aisle of aisles) {
            const bounds = getAisleBounds(aisle);
            // Quick bounds check first
            if (point.x < bounds.minX || point.x > bounds.maxX ||
                point.y < bounds.minY || point.y > bounds.maxY) continue;

            // Detailed geometric check
            // Use bounds directly as they include aisleWidth padding
            const width = bounds.maxX - bounds.minX;
            const height = bounds.maxY - bounds.minY;
            const isVertical = height > width * 1.5; // Match drawing logic threshold
            const length = isVertical ? height : width;

            // Check if inside aisle rect (considering rotation)
            // Aisle rect in world space but unrotated axis-aligned definition
            const aisleRect = {
                x: bounds.minX,
                y: bounds.minY,
                w: width,
                h: height,
                rotation: aisle.rotation || 0
            };

            if (!isPointInRotatedRect(point, aisleRect)) continue;

            // If inside aisle, find which section
            // Transform point to aisle local space (0,0 at top-left of unrotated aisle)
            const aisleCenter = { x: aisleRect.x + aisleRect.w / 2, y: aisleRect.y + aisleRect.h / 2 };
            const localPoint = rotatePoint(point, aisleCenter, -aisleRect.rotation);

            // Relative to top-left
            const relX = localPoint.x - aisleRect.x;
            const relY = localPoint.y - aisleRect.y;

            // Calculate section position along the main axis
            const posAlongAxis = isVertical ? relY : relX;

            // Find section based on accumulated length
            const totalSectionLength = (aisle.sections || []).length;
            // Warning: We don't have explicit lengths stored, usually assumed equal or specific logic?
            // Re-checking draw logic: "const sectionHeight = height / sections.length"

            if (totalSectionLength > 0) {
                const sectionSize = length / totalSectionLength;
                const sectionIndex = Math.floor(posAlongAxis / sectionSize);

                if (sectionIndex >= 0 && sectionIndex < totalSectionLength) {
                    return { aisle, section: aisle.sections![sectionIndex], index: sectionIndex };
                }
            }
        }
        return null;
    }, [aisles, getAisleBounds]);



    // Handle Drop
    const handleCanvasDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragHoverTarget(null); // Clear highlight on drop

        const category = e.dataTransfer.getData('text/plain');
        if (!category) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const worldPoint = screenToWorld(screenX, screenY);

        const hit = getSectionAtPoint(worldPoint);

        if (hit && customMappings) {
            // Found a target section!
            // Callback to update mapping
            onAssignMapping?.(category, hit.section.category);
        }
    };

    const handleCanvasDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // allow drop
        e.dataTransfer.dropEffect = 'link';

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const worldPoint = screenToWorld(screenX, screenY);

        const hit = getSectionAtPoint(worldPoint);

        if (hit) {
            if (dragHoverTarget?.aisleId !== hit.aisle.id || dragHoverTarget?.sectionIndex !== hit.index) {
                setDragHoverTarget({ aisleId: hit.aisle.id, sectionIndex: hit.index });
            }
        } else {
            if (dragHoverTarget) {
                setDragHoverTarget(null);
            }
        }
    };

    const handleCanvasDragLeave = () => {
        setDragHoverTarget(null);
    };

    // Handle pointer move
    const handleMouseMove = (e: React.PointerEvent) => {
        if (isPanning && dragStart) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            onViewChange({
                ...viewState,
                offsetX: dragOffset.x + dx,
                offsetY: dragOffset.y + dy,
            });
        } else if (isDragging && dragStart) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            const screenX = e.clientX - rect.left;
            const screenY = e.clientY - rect.top;
            const worldPoint = screenToWorld(screenX, screenY);

            if (dragMode === 'move') {
                const dx = worldPoint.x - dragStart.x;
                const dy = worldPoint.y - dragStart.y;

                // Move all items based on their origins
                Object.entries(dragOrigins).forEach(([id, origin]) => {
                    let moveDx = dx;
                    let moveDy = dy;

                    // Snap delta if enabled
                    if (editorSettings?.snapEnabled && editorSettings?.gridSize) {
                        moveDx = Math.round(dx / editorSettings.gridSize) * editorSettings.gridSize;
                        moveDy = Math.round(dy / editorSettings.gridSize) * editorSettings.gridSize;
                    }

                    const newP1: [number, number] = [origin.p1[0] + moveDx, origin.p1[1] + moveDy];
                    const newP2: [number, number] = [origin.p2[0] + moveDx, origin.p2[1] + moveDy];

                    onUpdateAisle(id, {
                        p1: newP1,
                        p2: newP2,
                        labelPosition: origin.labelPosition ? {
                            x: origin.labelPosition.x + moveDx,
                            y: origin.labelPosition.y + moveDy
                        } : undefined
                    });
                });
            } else if (selectedAisleIds.length === 1) {
                // Resize / Rotate (Single Item Only)
                const aisleId = selectedAisleIds[0];
                const aisle = aisles.find(a => a.id === aisleId);
                if (!aisle) return;

                if (dragMode === 'rotate') {
                    const bounds = getAisleBounds(aisle);
                    const centerX = (bounds.minX + bounds.maxX) / 2;
                    const centerY = (bounds.minY + bounds.maxY) / 2;

                    const dx = worldPoint.x - centerX;
                    const dy = worldPoint.y - centerY;
                    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // +90 to make "up" = 0°

                    if (angle < 0) angle += 360;

                    if (e.shiftKey) {
                        angle = Math.round(angle / 15) * 15;
                    }

                    onUpdateAisle(aisleId, { rotation: angle % 360 });

                } else if (dragMode === 'resize' && activeHandle) {
                    const bounds = getAisleBounds(aisle);
                    const isVertical = Math.abs(aisle.p1[1] - aisle.p2[1]) > Math.abs(aisle.p1[0] - aisle.p2[0]);
                    let newBounds = { ...bounds };

                    // Transform mouse point to local unrotated space for resizing
                    const centerX = (bounds.minX + bounds.maxX) / 2;
                    const centerY = (bounds.minY + bounds.maxY) / 2;
                    const center = { x: centerX, y: centerY };
                    const localPoint = rotatePoint(worldPoint, center, -(aisle.rotation || 0));

                    let mx = localPoint.x;
                    let my = localPoint.y;
                    if (editorSettings?.snapEnabled && editorSettings?.gridSize) {
                        mx = Math.round(mx / editorSettings.gridSize) * editorSettings.gridSize;
                        my = Math.round(my / editorSettings.gridSize) * editorSettings.gridSize;
                    }

                    if (activeHandle.includes('l')) newBounds.minX = Math.min(newBounds.maxX - 10, mx);
                    if (activeHandle.includes('r')) newBounds.maxX = Math.max(newBounds.minX + 10, mx);
                    if (activeHandle.includes('t')) newBounds.minY = Math.min(newBounds.maxY - 10, my);
                    if (activeHandle.includes('b')) newBounds.maxY = Math.max(newBounds.minY + 10, my);

                    let newP1: [number, number];
                    let newP2: [number, number];
                    let newWidth: number;

                    if (isVertical) {
                        newWidth = newBounds.maxX - newBounds.minX;
                        const centerX = newBounds.minX + newWidth / 2;
                        const p1IsTop = aisle.p1[1] < aisle.p2[1];

                        // Box logic: bounds match points directly
                        const topY = newBounds.minY;
                        let bottomY = newBounds.maxY;

                        // Enforce minimum length (allow inversion)
                        if (Math.abs(bottomY - topY) < 0.1) bottomY = topY + 0.1;

                        if (p1IsTop) { newP1 = [centerX, topY]; newP2 = [centerX, bottomY]; }
                        else { newP1 = [centerX, bottomY]; newP2 = [centerX, topY]; }
                    } else {
                        newWidth = newBounds.maxY - newBounds.minY;
                        const centerY = newBounds.minY + newWidth / 2;
                        const p1IsLeft = aisle.p1[0] < aisle.p2[0];

                        // Box logic: bounds match points directly
                        const leftX = newBounds.minX;
                        let rightX = newBounds.maxX;

                        // Enforce minimum length (allow inversion)
                        if (Math.abs(rightX - leftX) < 0.1) rightX = leftX + 0.1;

                        if (p1IsLeft) { newP1 = [leftX, centerY]; newP2 = [rightX, centerY]; }
                        else { newP1 = [rightX, centerY]; newP2 = [leftX, centerY]; }
                    }

                    onUpdateAisle(aisleId, {
                        p1: newP1,
                        p2: newP2,
                        aisleWidth: newWidth
                    });
                }
            }
        }
    };

    // Handle mouse up
    const handleMouseUp = () => {
        setIsPanning(false);
        setIsDragging(false);
        setDragStart(null);
        setDragMode(null);
        setActiveHandle(null);
        setDragOrigins({});
    };

    // Handle wheel (zoom)
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.1, Math.min(5, viewState.scale * zoomFactor));

        // Zoom towards mouse position
        const newOffsetX = mouseX - (mouseX - viewState.offsetX) * (newScale / viewState.scale);
        const newOffsetY = mouseY - (mouseY - viewState.offsetY) * (newScale / viewState.scale);

        onViewChange({
            scale: newScale,
            offsetX: newOffsetX,
            offsetY: newOffsetY,
        });
    };

    return (
        <div
            ref={containerRef}
            className="map-canvas-container"
            style={{ cursor: isPanning ? 'grabbing' : isDragging ? 'move' : 'default' }}
        >
            <canvas
                ref={canvasRef}
                onPointerDown={handleMouseDown}
                onPointerMove={handleMouseMove}
                onPointerUp={handleMouseUp}
                onPointerLeave={handleMouseUp}
                style={{ touchAction: 'none' }}
                onWheel={handleWheel}
                onContextMenu={(e) => e.preventDefault()}
                onDrop={handleCanvasDrop}
                onDragOver={handleCanvasDragOver}
                onDragLeave={handleCanvasDragLeave}
            />
            <div className="map-canvas-info">
                <span>Zoom: {Math.round(viewState.scale * 100)}%</span>
                <span>•</span>
                <span>Aisles: {aisles.length}</span>
            </div>

            {/* Promo End Group Selector Popup */}
            {promoEndPopup && (() => {
                const aisle = aisles.find(a => a.id === promoEndPopup.aisleId);
                const endInfo = aisle?.promoEnds?.[promoEndPopup.endKey as keyof typeof aisle.promoEnds];
                if (!aisle || !endInfo) return null;

                return (
                    <div
                        style={{
                            position: 'fixed',
                            left: promoEndPopup.screenX,
                            top: promoEndPopup.screenY,
                            transform: 'translate(-50%, 8px)',
                            background: 'var(--card-bg, #1e293b)',
                            border: '1px solid var(--border-color, #334155)',
                            borderRadius: 8,
                            padding: 8,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            zIndex: 1000,
                            minWidth: 160,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type="text"
                            value={endInfo.code}
                            placeholder="Code"
                            onChange={(e) => {
                                const newEnds = { ...aisle.promoEnds };
                                const endKey = promoEndPopup.endKey as keyof typeof newEnds;
                                if (newEnds[endKey]) {
                                    newEnds[endKey] = {
                                        ...newEnds[endKey]!,
                                        code: e.target.value
                                    };
                                }
                                onUpdateAisle(aisle.id, { promoEnds: newEnds });
                            }}
                            style={{
                                width: '100%',
                                padding: '4px 8px',
                                background: 'var(--input-bg, #0f172a)',
                                border: '1px solid var(--border-color, #334155)',
                                borderRadius: 4,
                                color: 'var(--text-muted)',
                                fontSize: 12,
                                marginBottom: 6,
                            }}
                        />
                        <input
                            type="text"
                            value={endInfo.label}
                            placeholder="Label"
                            onChange={(e) => {
                                const newEnds = { ...aisle.promoEnds };
                                const endKey = promoEndPopup.endKey as keyof typeof newEnds;
                                if (newEnds[endKey]) {
                                    newEnds[endKey] = {
                                        ...newEnds[endKey]!,
                                        label: e.target.value
                                    };
                                }
                                onUpdateAisle(aisle.id, { promoEnds: newEnds });
                            }}
                            style={{
                                width: '100%',
                                padding: '4px 8px',
                                background: 'var(--input-bg, #0f172a)',
                                border: '1px solid var(--border-color, #334155)',
                                borderRadius: 4,
                                color: 'var(--text-primary, #fff)',
                                fontSize: 12,
                                marginBottom: 6,
                            }}
                        />
                        <select
                            value={endInfo.group || ''}
                            onChange={(e) => {
                                const newEnds = { ...aisle.promoEnds };
                                const endKey = promoEndPopup.endKey as keyof typeof newEnds;
                                if (newEnds[endKey]) {
                                    newEnds[endKey] = {
                                        ...newEnds[endKey]!,
                                        group: (e.target.value || undefined) as any
                                    };
                                }
                                onUpdateAisle(aisle.id, { promoEnds: newEnds });
                                setPromoEndPopup(null);
                            }}
                            style={{
                                width: '100%',
                                padding: '6px 8px',
                                background: 'var(--input-bg, #0f172a)',
                                border: '1px solid var(--border-color, #334155)',
                                borderRadius: 4,
                                color: 'var(--text-primary, #fff)',
                                fontSize: 12,
                            }}
                            autoFocus
                        >
                            <option value="">-- None --</option>
                            {PROMO_END_GROUPS.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.label}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => setPromoEndPopup(null)}
                            style={{
                                marginTop: 6,
                                width: '100%',
                                padding: '4px 8px',
                                background: 'transparent',
                                border: '1px solid var(--border-color, #334155)',
                                borderRadius: 4,
                                color: 'var(--text-muted)',
                                fontSize: 11,
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                );
            })()}
        </div>
    );
};
