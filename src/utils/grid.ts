import type { Point, ViewState } from '../types';

/**
 * Snap a point to the nearest grid intersection
 */
export function snapToGrid(point: Point, gridSize: number): Point {
    return {
        x: Math.round(point.x / gridSize) * gridSize,
        y: Math.round(point.y / gridSize) * gridSize,
    };
}

/**
 * Snap a coordinate tuple to grid
 */
export function snapCoordToGrid(
    coord: [number, number],
    gridSize: number
): [number, number] {
    return [
        Math.round(coord[0] / gridSize) * gridSize,
        Math.round(coord[1] / gridSize) * gridSize,
    ];
}

/**
 * Snap an angle to the nearest increment
 */
export function snapAngle(angle: number, increment: number = 15): number {
    return Math.round(angle / increment) * increment;
}

/**
 * Generate grid lines for rendering
 */
export function getGridLines(
    viewState: ViewState,
    canvasWidth: number,
    canvasHeight: number,
    gridSize: number
): { horizontal: number[]; vertical: number[] } {
    const { offsetX, offsetY, scale } = viewState;

    // Calculate visible area in world coordinates
    const worldLeft = -offsetX / scale;
    const worldTop = -offsetY / scale;
    const worldRight = worldLeft + canvasWidth / scale;
    const worldBottom = worldTop + canvasHeight / scale;

    // Find starting grid lines
    const startX = Math.floor(worldLeft / gridSize) * gridSize;
    const startY = Math.floor(worldTop / gridSize) * gridSize;

    const horizontal: number[] = [];
    const vertical: number[] = [];

    // Generate vertical lines
    for (let x = startX; x <= worldRight; x += gridSize) {
        vertical.push(x);
    }

    // Generate horizontal lines
    for (let y = startY; y <= worldBottom; y += gridSize) {
        horizontal.push(y);
    }

    return { horizontal, vertical };
}

/**
 * Calculate rotation angle from a point relative to center
 */
export function calculateAngle(
    center: Point,
    point: Point
): number {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Normalize to 0-360
    if (angle < 0) angle += 360;

    return angle;
}

/**
 * Rotate a point around a center
 */
export function rotatePoint(
    point: Point,
    center: Point,
    angleDegrees: number
): Point {
    const angleRad = angleDegrees * (Math.PI / 180);
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    const dx = point.x - center.x;
    const dy = point.y - center.y;

    return {
        x: center.x + dx * cos - dy * sin,
        y: center.y + dx * sin + dy * cos,
    };
}
