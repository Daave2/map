import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Text, Grid } from '@react-three/drei';
import { XR, createXRStore, useXR } from '@react-three/xr';
import { useRef, useMemo, useEffect, useCallback, useState, useLayoutEffect } from 'react';
import * as THREE from 'three';
import type { Aisle } from '../types';

import { matchesRangeCategory } from '../utils/categoryMatching';
import { getPromoEndGroupColor } from '../constants/promoEndGroups';

interface StoreScene3DProps {
    aisles: Aisle[];
    rangeData?: any[]; // Using any temporarily to avoid circular deps if types aren't exported perfectly yet
    categoryMappings?: any;
    activeTab?: string;
    onExit: () => void;
}

// Create XR store for AR sessions
const xrStore = createXRStore({ depthSensing: true });

// Component to sync XR session state with React state
function XRSessionSync({ onSessionChange }: { onSessionChange: (isAR: boolean) => void }) {
    const session = useXR((state) => state.session);

    useEffect(() => {
        // Session exists when in AR/VR mode, undefined otherwise
        const isInAR = session !== undefined && session !== null;
        onSessionChange(isInAR);
    }, [session, onSessionChange]);

    return null;
}

// AR Scale - the store is ~100 units wide in 2D, we scale it down to fit in a room
const AR_SCALE = 0.02; // 1 unit = 2cm, so 100 units = 2 meters

export interface MoveState {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    sprint: boolean;
    joystickMove: { x: number, y: number };
    joystickLook: { x: number, y: number };
}

// Convert 2D layout coordinates to 3D world coordinates
// 2D uses top-left origin, 3D uses center origin
const SCALE = 0.05; // Scale down the 2D coordinates

// Height mapping - consistent height for all units
const getHeightForType = (_type?: string): number => {
    // All units get the same height for visual consistency
    return 0.8;
};

// Material colors based on aisle type (fixture treated same as gondola)
// Material colors based on aisle type (fixture treated same as gondola)
const getMaterialForType = (type?: string): THREE.MeshStandardMaterial => {
    const materials: Record<string, THREE.MeshStandardMaterial> = {
        // Frides/Freezers: Glossy, metallic
        chilled: new THREE.MeshStandardMaterial({ color: '#3b82f6', roughness: 0.2, metalness: 0.3 }),
        frozen: new THREE.MeshStandardMaterial({ color: '#60a5fa', roughness: 0.2, metalness: 0.4 }),
        // Bakery: Warm, matte (wood-like)
        bakery: new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.9, metalness: 0.0 }),
        // Counter: Solid, standard
        counter: new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.5, metalness: 0.1 }),
        // Standard Shelving: Metal/Plastic composite
        gondola: new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.5, metalness: 0.2 }),
    };
    // fixture is treated the same as gondola
    const normalizedType = type?.toLowerCase() === 'fixture' ? 'gondola' : (type?.toLowerCase() || 'gondola');
    return materials[normalizedType] || materials.gondola;
};

// Helper to get range stats for a section
const getRangeStats = (sectionCategory: string, rangeData: any[] = [], categoryMappings: any = {}) => {
    // Custom mapping logic matching MapCanvas
    const isMatch = (rangeCat: string) => {
        const rangeNorm = rangeCat.toLowerCase().trim();
        const sectionNorm = sectionCategory.toLowerCase().trim();

        // 1. Check custom mappings
        if (categoryMappings && (categoryMappings[rangeCat] || categoryMappings[rangeNorm])) {
            const mappedTarget = categoryMappings[rangeCat] || categoryMappings[rangeNorm];
            if (mappedTarget === 'IGNORE_ITEM') return false;

            const linkedSections = mappedTarget.split('|');
            for (const linked of linkedSections) {
                const linkedNorm = linked.toLowerCase().trim();
                if (sectionNorm.includes(linkedNorm) || linkedNorm.includes(sectionNorm)) {
                    return true;
                }
            }
            // If mappings exist but don't match, return false (don't fallback to default if explicitly mapped? 
            // MapCanvas logic: "If custom mappings exist but none matched, don't fall back". 
            // Actually MapCanvas `if (customMappings[rangeCat]...)` block returns matched: false if looped without match.
            return false;
        }

        // 2. Fallback
        return matchesRangeCategory(sectionCategory, rangeCat).matched;
    };

    // Find all matching activities
    const matches = rangeData.filter(activity => isMatch(activity.category));

    if (matches.length === 0) return null;

    // Aggregate stats
    const stats = matches.reduce((acc, curr) => ({
        newLines: acc.newLines + (curr.newLines || 0),
        delistLines: acc.delistLines + (curr.delistLines || 0),
    }), { newLines: 0, delistLines: 0 });

    return stats;
};

// Single Aisle/Shelf mesh component
function ShelfMesh({ aisle, rangeData = [], categoryMappings = {}, onSelect, selectedCategory, activeTab }: {
    aisle: Aisle,
    rangeData?: any[],
    categoryMappings?: any,
    onSelect: (category: string, stats?: any) => void,
    selectedCategory?: string,
    activeTab?: string
}) {
    const { position, size, rotation, leftSections, rightSections, promoEnds } = useMemo(() => {
        const x1 = aisle.p1[0] * SCALE;
        const z1 = aisle.p1[1] * SCALE;
        const x2 = aisle.p2[0] * SCALE;
        const z2 = aisle.p2[1] * SCALE;

        const centerX = (x1 + x2) / 2;
        const centerZ = (z1 + z2) / 2;
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
        const depth = (aisle.aisleWidth || 30) * SCALE;
        const height = getHeightForType(aisle.type);

        // Calculate rotation from p1 to p2
        const angle = Math.atan2(z2 - z1, x2 - x1);

        // --- SCANLINE MATCHING LOGIC ---
        // 2D Map renders Top-to-Bottom / Left-to-Right regardless of P1->P2.
        const dx = aisle.p2[0] - aisle.p1[0];
        const dy = aisle.p2[1] - aisle.p1[1];
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);

        const isVertical = ady > adx;
        const isPointingDown = isVertical && dy > 0; // P1 Top -> P2 Bottom
        const isPointingUp = isVertical && dy < 0;   // P1 Bottom -> P2 Top

        const isPointingLeft = !isVertical && dx < 0;

        // Force Visual Top->Bottom / Left->Right order
        const shouldReverseOrder = isPointingUp || isPointingLeft;
        // Force "Left" side to appear on Visual Left
        const shouldSwapSides = isPointingDown || isPointingLeft;

        // Separate and Swap Sections
        const allSections = aisle.sections || [];
        const rawLeft = allSections.filter(s => s.side === 'L');
        const rawRight = allSections.filter(s => s.side === 'R');
        const noSide = allSections.filter(s => !s.side);

        const left = shouldSwapSides ? rawRight : rawLeft;
        const right = shouldSwapSides ? rawLeft : rawRight;

        let finalLeft = left.length > 0 ? left : [];
        let finalRight = right.length > 0 ? right : [];

        if (noSide.length > 0) {
            // Standard noSide case (Wall with no side props)
            if (finalLeft.length === 0) finalLeft = noSide;
            if (finalRight.length === 0) finalRight = noSide;
        } else {
            // Explicit sides exist (or empty)
            // Mirror if one side is completely empty (Single Sided Unit)
            if (finalLeft.length === 0 && finalRight.length > 0) finalLeft = finalRight;
            if (finalRight.length === 0 && finalLeft.length > 0) finalRight = finalLeft;
        }

        // Fallback to label if still empty
        const leftList = finalLeft.length > 0 ? finalLeft : [{ bay: '', category: aisle.label }];
        const rightList = finalRight.length > 0 ? finalRight : [{ bay: '', category: aisle.label }];

        // Helper to map sections to display data including range stats
        const mapSectionData = (list: any[], reverseOrder: boolean) => {
            const width = length / list.length;
            return list.map((section, index) => {
                const category = section.category || aisle.label;
                return {
                    category,
                    stats: getRangeStats(category, rangeData, categoryMappings),
                    xOffset: reverseOrder
                        ? length / 2 - width / 2 - index * width
                        : -length / 2 + width / 2 + index * width,
                    width,
                };
            });
        };









        const leftData = mapSectionData(leftList, shouldReverseOrder);   // Back face
        const rightData = mapSectionData(rightList, shouldReverseOrder); // Front face

        // Promo ends data - including side units
        const promoEndData: {
            position: 'front' | 'back';
            subPosition: 'main' | 'left' | 'right';
            category: string;
            group?: string;
            stats: any;
        }[] = [];

        const addPromo = (pos: 'front' | 'back', sub: 'main' | 'left' | 'right', item: any) => {
            if (!item) return;
            const category = item.name || item.label;
            promoEndData.push({
                position: pos,
                subPosition: sub,
                category,
                group: item.group,
                stats: getRangeStats(category, rangeData, categoryMappings)
            });
        };

        addPromo('front', 'main', aisle.promoEnds?.front);
        addPromo('front', 'left', aisle.promoEnds?.frontLeft);
        addPromo('front', 'right', aisle.promoEnds?.frontRight);
        addPromo('back', 'main', aisle.promoEnds?.back);
        addPromo('back', 'left', aisle.promoEnds?.backLeft);
        addPromo('back', 'right', aisle.promoEnds?.backRight);

        return {
            position: new THREE.Vector3(centerX, height / 2, centerZ), // Removed hardcoded offset
            size: { width: length, height, depth },
            rotation: angle + (aisle.rotation || 0) * Math.PI / 180, // Original rotation
            leftSections: leftData,
            rightSections: rightData,
            promoEnds: promoEndData,
        };
    }, [aisle, rangeData, categoryMappings]);

    const material = useMemo(() => getMaterialForType(aisle.type), [aisle.type]);


    // Helper to color sections based on stats
    const getSectionColor = (stats: any) => {
        if (!stats) return material.color.getStyle();
        const net = stats.newLines - stats.delistLines;
        return net >= 0 ? '#22c55e' : '#ef4444';
    };

    // Render a section face
    const renderSection = (section: any, idx: number, zPos: number, rotY: number) => {
        const color = section.stats ? getSectionColor(section.stats) : undefined;
        const hasStats = !!section.stats;
        const isSelected = selectedCategory && (
            section.category === selectedCategory ||
            (section.stats && selectedCategory === section.category) // simplistic check, ideally use ID
        );

        return (
            <group
                key={`sec-${idx}`}
                position={[section.xOffset, 0, zPos]}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(section.category, section.stats);
                }}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; }}
            >
                {/* Visual feedback for selection */}
                {isSelected && (
                    <mesh position={[0, 0, rotY === 0 ? 0.005 : -0.005]}>
                        <planeGeometry args={[section.width * 0.98, size.height * 0.85]} />
                        <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} transparent opacity={0.5} />
                    </mesh>
                )}

                {hasStats && (
                    <mesh position={[0, 0, rotY === 0 ? 0.01 : -0.01]}>
                        <planeGeometry args={[section.width * 0.95, size.height * 0.8]} />
                        <meshStandardMaterial
                            color={color}
                            side={THREE.DoubleSide}
                            emissive={isSelected ? color : '#000000'}
                            emissiveIntensity={isSelected ? 0.5 : 0}
                        />
                    </mesh>
                )}

                <Text
                    rotation={[0, rotY, 0]}
                    fontSize={Math.min(0.1, size.height * 0.12)}
                    maxWidth={section.width * 0.9}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.01}
                    outlineColor="#000000"
                    textAlign="center"
                    position={[0, hasStats ? 0.05 : 0, hasStats ? (rotY === 0 ? 0.02 : -0.02) : 0]}
                >
                    {section.category.toUpperCase()}
                </Text>

                {/* Stats Text below key */}
                {hasStats && (
                    <Text
                        rotation={[0, rotY, 0]}
                        fontSize={0.07}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        position={[0, -0.1, rotY === 0 ? 0.02 : -0.02]}
                        outlineWidth={0.005}
                        outlineColor="black"
                    >
                        {`+${section.stats.newLines} / -${section.stats.delistLines}`}
                    </Text>
                )}
            </group>
        );
    };

    return (
        <group position={position} rotation={[0, -rotation, 0]} frustumCulled={false}>
            {/* Main shelf body */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[size.width, size.height, size.depth]} />
                <primitive object={material} attach="material" />
            </mesh>

            {/* Left sections on BACK face (negative Z) */}
            {leftSections.map((section, index) => renderSection(section, index, -size.depth / 2 - 0.05, Math.PI))}

            {/* Right sections on FRONT face (positive Z) */}
            {rightSections.map((section, index) => renderSection(section, index, size.depth / 2 + 0.05, 0))}

            {/* Promo ends */}
            {promoEnds.map((promo, index) => {
                // Calculate position based on main/side unit
                let xPos = promo.position === 'front' ? -size.width / 2 - 0.3 : size.width / 2 + 0.3;
                let zPos = 0;
                let width = 0.5;
                let depth = size.depth;
                let rotationY = promo.position === 'front' ? -Math.PI / 2 : Math.PI / 2;

                // Adjust for side units
                if (promo.subPosition === 'left') {
                    // Left side unit (relative to facing the promo)
                    // If front (facing towards +X from outside), left is -Z
                    zPos = -size.depth / 2 - 0.3;
                    depth = 0.5; // thinner depth for side unit
                    width = 0.5;
                    // Rotation needed?
                } else if (promo.subPosition === 'right') {
                    // Right side unit
                    zPos = size.depth / 2 + 0.3;
                    depth = 0.5;
                    width = 0.5;
                }

                let color = '#e2e8f0'; // Default neutral (was green #22c55e)

                if (activeTab === 'promo') {
                    if (promo.group) {
                        const groupColor = getPromoEndGroupColor(promo.group as any);
                        if (groupColor) color = groupColor;
                    } else {
                        // Dimmed if no group in promo mode
                        color = '#94a3b8'; // Slate 400
                    }
                } else {
                    // Range Mode (or others)
                    if (promo.stats) {
                        color = getSectionColor(promo.stats);
                    }
                }

                // If it's a side unit, rotate label to face outward (Z axis)
                // Left unit (-Z) label should face -Z
                // Right unit (+Z) label should face +Z
                let labelRotationY = rotationY;
                let labelXOffset = 0;
                let labelZOffset = 0;

                if (promo.subPosition === 'left') {
                    labelRotationY = Math.PI; // Face -Z
                    zPos = -size.depth / 2; // Align with edge
                    xPos += (promo.position === 'front' ? 0.2 : -0.2); // Shift slightly back towards aisle
                    width = 0.4; // Smaller width for wing
                    depth = 0.4;
                    labelZOffset = -depth / 2 - 0.06;
                } else if (promo.subPosition === 'right') {
                    labelRotationY = 0; // Face +Z
                    zPos = size.depth / 2;
                    xPos += (promo.position === 'front' ? 0.2 : -0.2);
                    width = 0.4;
                    depth = 0.4;
                    labelZOffset = depth / 2 + 0.06;
                } else {
                    // Main unit label offset
                    labelXOffset = promo.position === 'front' ? -width / 2 - 0.06 : width / 2 + 0.06;
                }

                const hasStats = !!promo.stats;
                const isSelected = selectedCategory === promo.category;

                return (
                    <group
                        key={`promo-${index}`}
                        onClick={(e) => { e.stopPropagation(); onSelect(promo.category, promo.stats); }}
                        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
                    >
                        <mesh position={[xPos, (promo.subPosition === 'main' ? 0 : -0.025), zPos]} castShadow>
                            <boxGeometry args={[width, size.height - (promo.subPosition === 'main' ? 0 : 0.05), depth]} />
                            <meshStandardMaterial color={color} emissive={isSelected ? color : '#000'} emissiveIntensity={isSelected ? 0.5 : 0} />
                        </mesh>
                        <group position={[xPos + labelXOffset, 0, zPos + labelZOffset]} rotation={[0, labelRotationY, 0]}>
                            <Text
                                fontSize={0.08}
                                maxWidth={promo.subPosition === 'main' ? size.depth * 0.9 : 0.4}
                                color="#ffffff"
                                anchorX="center"
                                anchorY="middle"
                                outlineWidth={0.01}
                                outlineColor="#000000"
                                textAlign="center"
                                position={[0, hasStats ? 0.05 : 0, 0]}
                            >
                                {promo.category.toUpperCase()}
                            </Text>
                            {hasStats && (
                                <Text
                                    fontSize={0.05}
                                    color="white"
                                    anchorX="center"
                                    anchorY="middle"
                                    position={[0, -0.05, 0]}
                                    outlineWidth={0.005}
                                    outlineColor="black"
                                >
                                    {`+${promo.stats.newLines} / -${promo.stats.delistLines}`}
                                </Text>
                            )}
                        </group>
                    </group>
                );
            })}
        </group>
    );
}

// First-person movement controls
function WalkControls({ speed = 5, moveState }: { speed?: number, moveState: React.MutableRefObject<MoveState> }) {
    const { camera } = useThree();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': moveState.current.forward = true; break;
                case 'KeyS': case 'ArrowDown': moveState.current.backward = true; break;
                case 'KeyA': case 'ArrowLeft': moveState.current.left = true; break;
                case 'KeyD': case 'ArrowRight': moveState.current.right = true; break;
                case 'ShiftLeft': case 'ShiftRight': moveState.current.sprint = true; break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': moveState.current.forward = false; break;
                case 'KeyS': case 'ArrowDown': moveState.current.backward = false; break;
                case 'KeyA': case 'ArrowLeft': moveState.current.left = false; break;
                case 'KeyD': case 'ArrowRight': moveState.current.right = false; break;
                case 'ShiftLeft': case 'ShiftRight': moveState.current.sprint = false; break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame((_, delta) => {
        const { forward, backward, left, right, sprint, joystickMove, joystickLook } = moveState.current;

        // 1. Rotation (Mobile Look)
        if (joystickLook.x !== 0 || joystickLook.y !== 0) {
            // Adjust sensitivity as needed
            const lookSpeed = 1.5;
            // Yaw (Y-axis)
            camera.rotation.y -= joystickLook.x * lookSpeed * delta;
            // Pitch (X-axis) - clamped
            // Note: camera.rotation is Euler. 
            // We need to be careful not to introduce Gimbal lock, but usually simple pitch clamp is fine for FPS.
            // Using a temporary Euler to clamp
            const newPitch = camera.rotation.x - (joystickLook.y * lookSpeed * delta);
            camera.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, newPitch));
            // Reset Z to prevent rolling
            camera.rotation.z = 0;
            // Rotation order usually YXZ for FPS
            camera.rotation.order = 'YXZ';
        }

        // 2. Movement
        if (!forward && !backward && !left && !right && joystickMove.y === 0 && joystickMove.x === 0) return;

        // Get camera's forward direction (where it's looking)
        const forwardVec = new THREE.Vector3();
        camera.getWorldDirection(forwardVec);
        forwardVec.y = 0; // Keep movement on XZ plane
        forwardVec.normalize();

        // Calculate right vector (perpendicular to forward on XZ plane)
        const rightVec = new THREE.Vector3();
        rightVec.crossVectors(forwardVec, new THREE.Vector3(0, 1, 0)).normalize();

        // Build movement vector based on input
        const movement = new THREE.Vector3();

        if (forward) movement.add(forwardVec);
        if (backward) movement.sub(forwardVec);
        if (right) movement.add(rightVec);
        if (left) movement.sub(rightVec);

        // Add Joystick input (Analog)
        // joystickMove.y is -1 (fwd) to 1 (back) or inverse? Usually joystick up is -1.
        // Let's assume joystickMove.y < 0 is Forward.
        if (joystickMove.y !== 0) movement.addScaledVector(forwardVec, -joystickMove.y);
        if (joystickMove.x !== 0) movement.addScaledVector(rightVec, joystickMove.x);

        const currentSpeed = sprint ? speed * 2.5 : speed;
        const len = movement.length();
        if (len > 0) {
            movement.normalize().multiplyScalar(currentSpeed * delta);
            camera.position.add(movement);
        }

        // Keep camera at eye level
        camera.position.y = 1.6;
    });

    return null;
}

// Mobile Controls Component - Dual joysticks
const MobileControls = ({ moveState }: { moveState: React.MutableRefObject<MoveState> }) => {
    const moveOrigin = useRef<{ x: number, y: number } | null>(null);
    const lookOrigin = useRef<{ x: number, y: number } | null>(null);

    const handleTouchStart = (e: React.TouchEvent, type: 'move' | 'look') => {
        const touch = e.changedTouches[0];
        if (type === 'move') {
            moveOrigin.current = { x: touch.clientX, y: touch.clientY };
        } else {
            lookOrigin.current = { x: touch.clientX, y: touch.clientY };
        }
    };

    const handleTouchMove = (e: React.TouchEvent, type: 'move' | 'look') => {
        const touch = e.changedTouches[0];
        const origin = type === 'move' ? moveOrigin.current : lookOrigin.current;
        if (!origin) return;

        const dx = touch.clientX - origin.x;
        const dy = touch.clientY - origin.y;

        const maxDist = 50;
        const x = Math.max(-1, Math.min(1, dx / maxDist));
        const y = Math.max(-1, Math.min(1, dy / maxDist));

        if (type === 'move') {
            moveState.current.joystickMove = { x, y };
        } else {
            moveState.current.joystickLook = { x, y };
        }
    };

    const handleTouchEnd = (_e: React.TouchEvent, type: 'move' | 'look') => {
        if (type === 'move') {
            moveOrigin.current = null;
            moveState.current.joystickMove = { x: 0, y: 0 };
        } else {
            lookOrigin.current = null;
            moveState.current.joystickLook = { x: 0, y: 0 };
        }
    };

    const zoneStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: 20,
        width: 100,
        height: 100,
        background: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto'
    };

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }} className="mobile-controls">
            {/* Move Zone (Left) */}
            <div
                style={{ ...zoneStyle, left: 20 }}
                onTouchStart={(e) => handleTouchStart(e, 'move')}
                onTouchMove={(e) => handleTouchMove(e, 'move')}
                onTouchEnd={(e) => handleTouchEnd(e, 'move')}
            >
                <span style={{ fontSize: 20, opacity: 0.5 }}>🏃</span>
            </div>

            {/* Look Zone (Right) */}
            <div
                style={{ ...zoneStyle, right: 20 }}
                onTouchStart={(e) => handleTouchStart(e, 'look')}
                onTouchMove={(e) => handleTouchMove(e, 'look')}
                onTouchEnd={(e) => handleTouchEnd(e, 'look')}
            >
                <span style={{ fontSize: 20, opacity: 0.5 }}>👀</span>
            </div>
        </div>
    );
};

// Main 3D scene
function Scene({ aisles, rangeData, categoryMappings, onSelect, selectedCategory, moveState, activeTab }: {
    aisles: Aisle[],
    rangeData: any[],
    categoryMappings?: any,
    onSelect: (cat: string, stats?: any) => void,
    selectedCategory?: string,
    moveState: React.MutableRefObject<MoveState>,
    activeTab?: string
}) {
    const controlsRef = useRef<any>(null);
    const { camera } = useThree();

    // Calculate layout bounds and center
    const { center, size, bounds } = useMemo(() => {
        let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
        aisles.forEach(a => {
            const x1 = a.p1[0] * SCALE;
            const z1 = a.p1[1] * SCALE;
            const x2 = a.p2[0] * SCALE;
            const z2 = a.p2[1] * SCALE;
            minX = Math.min(minX, x1, x2);
            maxX = Math.max(maxX, x1, x2);
            minZ = Math.min(minZ, z1, z2);
            maxZ = Math.max(maxZ, z1, z2);
        });

        if (minX === Infinity) return { center: new THREE.Vector3(0, 0, 0), size: [200, 200], bounds: { minX: -100, maxX: 100, minZ: -100, maxZ: 100 } };

        const centerX = (minX + maxX) / 2;
        const centerZ = (minZ + maxZ) / 2;
        const width = maxX - minX;
        const depth = maxZ - minZ;

        return {
            center: new THREE.Vector3(centerX, 0, centerZ),
            size: [Math.max(200, width + 50), Math.max(200, depth + 50)],
            bounds: { minX, maxX, minZ, maxZ }
        };
    }, [aisles]);

    // Ensure camera looks at center on load and starts OUTSIDE but CLOSER
    useLayoutEffect(() => {
        // Start just outside the actual content bounds (Z axis), not the huge floor
        const startZ = bounds.maxZ + 8; // 8 units back from the front-most aisle
        camera.position.set(center.x, 1.6, startZ);
        camera.lookAt(center.x, 1.6, center.z); // Look slightly ahead
    }, [camera, center, bounds]);

    // Filter out aisle voids (type === 'aisle')
    const visibleAisles = useMemo(() =>
        aisles.filter(a => a.type !== 'aisle'),
        [aisles]
    );

    // Teleport handler
    const handleTeleport = (e: any) => {
        e.stopPropagation();
        // Teleport camera to clicked point (keeping height)
        const target = e.point;
        camera.position.set(target.x, 1.6, target.z);
    };

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[10, 20, 10]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <pointLight position={[center.x, 8, center.z]} intensity={0.5} />
            <pointLight position={[-20, 8, -10]} intensity={0.3} />
            <pointLight position={[20, 8, 10]} intensity={0.3} />

            {/* Floor based on bounds + padding */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[center.x, 0, center.z]}
                receiveShadow
                onDoubleClick={handleTeleport}
                onPointerOver={() => { document.body.style.cursor = 'crosshair'; }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; }}
            >
                <planeGeometry args={[size[0], size[1]]} />
                <meshStandardMaterial color="#e2e8f0" />
            </mesh>

            <Grid position={[center.x, 0.01, center.z]} args={[size[0], size[1]]} cellSize={2} cellThickness={0.5} cellColor="#cbd5e1" sectionSize={10} sectionThickness={1} sectionColor="#94a3b8" fadeDistance={100} fadeStrength={1} followCamera={false} />

            {/* Walls */}
            <group>
                {/* Back Wall (-Z) */}
                <mesh position={[center.x, 3, bounds.minZ - 10]} receiveShadow>
                    <boxGeometry args={[size[0], 6, 1]} />
                    <meshStandardMaterial color="#f1f5f9" />
                </mesh>
                {/* Front Wall (+Z) - with gap for "entrance" if desired, or solid for now */}
                <mesh position={[center.x, 3, bounds.maxZ + 10]} receiveShadow>
                    <boxGeometry args={[size[0], 6, 1]} />
                    <meshStandardMaterial color="#f1f5f9" />
                </mesh>
                {/* Left Wall (-X) */}
                <mesh position={[bounds.minX - 10, 3, center.z]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                    <boxGeometry args={[size[1], 6, 1]} />
                    <meshStandardMaterial color="#f1f5f9" />
                </mesh>
                {/* Right Wall (+X) */}
                <mesh position={[bounds.maxX + 10, 3, center.z]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                    <boxGeometry args={[size[1], 6, 1]} />
                    <meshStandardMaterial color="#f1f5f9" />
                </mesh>
            </group>

            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[center.x, 6, center.z]}>
                <planeGeometry args={[size[0], size[1]]} />
                <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} />
            </mesh>

            {/* Render all shelves */}
            {visibleAisles.map((aisle) => (
                <ShelfMesh
                    key={aisle.id}
                    aisle={aisle}
                    rangeData={rangeData}
                    categoryMappings={categoryMappings}
                    onSelect={onSelect}
                    selectedCategory={selectedCategory}
                    activeTab={activeTab}
                />
            ))}

            {/* First-person controls */}
            {/* First-person controls - only lock when clicking canvas, not UI */}
            <PointerLockControls ref={controlsRef} selector="#store-3d-canvas" />
            <WalkControls speed={5} moveState={moveState} />
        </>
    );
}

// AR HUD - 3D UI that follows camera in AR mode
function ARHUD({ scale, onExit }: { scale: number, onExit: () => void }) {
    const { camera } = useThree();
    const hudRef = useRef<THREE.Group>(null);

    // Update HUD position to follow camera each frame
    useFrame(() => {
        if (hudRef.current) {
            // Position HUD in front of camera
            const offset = new THREE.Vector3(0, 0, -0.5); // 50cm in front
            offset.applyQuaternion(camera.quaternion);
            hudRef.current.position.copy(camera.position).add(offset);
            hudRef.current.quaternion.copy(camera.quaternion);
        }
    });

    return (
        <group ref={hudRef}>
            {/* Exit button - top left of view */}
            <group position={[-0.15, 0.1, 0]} onClick={onExit}>
                <mesh>
                    <planeGeometry args={[0.1, 0.04]} />
                    <meshBasicMaterial color="#ef4444" />
                </mesh>
                <Text
                    position={[0, 0, 0.001]}
                    fontSize={0.02}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                >
                    ✕ Exit
                </Text>
            </group>

            {/* Scale indicator - top center */}
            <group position={[0, 0.1, 0]}>
                <mesh>
                    <planeGeometry args={[0.08, 0.03]} />
                    <meshBasicMaterial color="#000000" opacity={0.6} transparent />
                </mesh>
                <Text
                    position={[0, 0, 0.001]}
                    fontSize={0.015}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                >
                    {Math.round(scale * 100)}%
                </Text>
            </group>

            {/* Instructions - bottom center */}
            <group position={[0, -0.12, 0]}>
                <mesh>
                    <planeGeometry args={[0.25, 0.03]} />
                    <meshBasicMaterial color="#000000" opacity={0.6} transparent />
                </mesh>
                <Text
                    position={[0, 0, 0.001]}
                    fontSize={0.012}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                >
                    Drag: Rotate • Pinch: Scale
                </Text>
            </group>
        </group>
    );
}

// AR Scene - Enhanced with surface detection and gestures
function ARScene({ aisles, rangeData, categoryMappings, position, rotation, scale, activeTab }: {
    aisles: Aisle[],
    rangeData: any[],
    categoryMappings?: any,
    position: [number, number, number],
    rotation: number,
    scale: number,
    activeTab?: string,
}) {
    const groupRef = useRef<THREE.Group>(null);

    // Filter visible aisles (same logic as Scene)
    const visibleAisles = useMemo(() =>
        aisles.filter(a => a.type !== 'door'),
        [aisles]
    );

    // Calculate bounds for centering
    const { center, size } = useMemo(() => {
        let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
        aisles.forEach(a => {
            const x1 = a.p1[0] * SCALE;
            const z1 = a.p1[1] * SCALE;
            const x2 = a.p2[0] * SCALE;
            const z2 = a.p2[1] * SCALE;
            minX = Math.min(minX, x1, x2);
            maxX = Math.max(maxX, x1, x2);
            minZ = Math.min(minZ, z1, z2);
            maxZ = Math.max(maxZ, z1, z2);
        });
        return {
            center: { x: (minX + maxX) / 2, z: (minZ + maxZ) / 2 },
            size: { x: maxX - minX, z: maxZ - minZ }
        };
    }, [aisles]);

    const finalScale = AR_SCALE * scale;

    return (
        <group
            ref={groupRef}
            position={position}
            rotation={[0, rotation, 0]}
            scale={[finalScale, finalScale, finalScale]}
        >
            {/* Offset to center the model */}
            <group position={[-center.x, 0, -center.z]}>
                {/* Lighting for AR */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 10, 5]} intensity={0.6} />

                {/* Floor indicator - shows store footprint */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[center.x, 0.01, center.z]}>
                    <planeGeometry args={[size.x + 20, size.z + 20]} />
                    <meshBasicMaterial color="#3b82f6" opacity={0.15} transparent />
                </mesh>

                {/* Store boundary using a simple ring */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[center.x, 0.02, center.z]}>
                    <ringGeometry args={[Math.max(size.x, size.z) / 2 + 5, Math.max(size.x, size.z) / 2 + 8, 4]} />
                    <meshBasicMaterial color="#60a5fa" opacity={0.5} transparent />
                </mesh>

                {/* Render all shelves */}
                {visibleAisles.map((aisle) => (
                    <ShelfMesh
                        key={aisle.id}
                        aisle={aisle}
                        rangeData={rangeData}
                        categoryMappings={categoryMappings}
                        onSelect={() => { }}
                        selectedCategory={undefined}
                        activeTab={activeTab}
                    />
                ))}
            </group>
        </group>
    );
}

// Main exported component
export function StoreScene3D({ aisles, rangeData = [], categoryMappings = {}, onExit, activeTab }: StoreScene3DProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [selectedStats, setSelectedStats] = useState<any>(null);
    const [arMode, setArMode] = useState(false);

    // AR gesture state
    const [arRotation, setArRotation] = useState(0);
    const [arScale, setArScale] = useState(1);

    // Touch gesture tracking for AR
    const touchStartRef = useRef<{ x: number, y: number, distance?: number } | null>(null);

    // Shared state for movement (Keyboard + Mobile)
    const moveState = useRef<MoveState>({
        forward: false, backward: false, left: false, right: false, sprint: false,
        joystickMove: { x: 0, y: 0 },
        joystickLook: { x: 0, y: 0 }
    });

    const handleEnterAR = async () => {
        try {
            await xrStore.enterAR();
            setArMode(true);
        } catch (e) {
            console.error('Failed to enter AR:', e);
            alert('AR not supported on this device. Requires ARCore (Android) or Safari on iOS.');
        }
    };

    const handleExitAR = () => {
        setArMode(false);
        setArRotation(0);
        setArScale(1);
    };

    // Touch handlers for AR gestures
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!arMode) return;

        if (e.touches.length === 1) {
            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            touchStartRef.current = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
                distance
            };
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!arMode || !touchStartRef.current) return;

        if (e.touches.length === 1) {
            // Single finger drag = rotate
            const dx = e.touches[0].clientX - touchStartRef.current.x;
            setArRotation(prev => prev + dx * 0.01);
            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2 && touchStartRef.current.distance) {
            // Pinch = scale
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const scaleDelta = distance / touchStartRef.current.distance;
            setArScale(prev => Math.max(0.2, Math.min(3, prev * scaleDelta)));
            touchStartRef.current.distance = distance;
        }
    };

    const handleTouchEnd = () => {
        touchStartRef.current = null;
    };

    const handleSelect = useCallback((category: string, stats?: any) => {
        setSelectedCategory(category);
        setSelectedStats(stats);
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (selectedCategory) {
                setSelectedCategory(undefined);
                setSelectedStats(null);
            }
        }
    }, [selectedCategory]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1000,
                background: '#000'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <Canvas
                frameloop="always"
                shadows
                camera={{ position: [0, 5, 10], fov: 50 }}
                onCreated={({ gl }) => { gl.domElement.id = 'store-3d-canvas'; }}
            >
                <XR store={xrStore}>
                    {/* Sync XR session state with React state */}
                    <XRSessionSync onSessionChange={setArMode} />

                    {arMode ? (
                        <>
                            {/* 3D HUD that follows camera */}
                            <ARHUD scale={arScale} onExit={handleExitAR} />

                            {/* Store model */}
                            <ARScene
                                aisles={aisles}
                                rangeData={rangeData}
                                categoryMappings={categoryMappings}
                                position={[0, -0.5, -2]} // 2m in front, slightly below eye level
                                rotation={arRotation}
                                scale={arScale}
                                activeTab={activeTab}
                            />
                            {/* Ambient light for AR */}
                            <ambientLight intensity={1} />
                        </>
                    ) : (
                        <Scene
                            aisles={aisles}
                            rangeData={rangeData}
                            categoryMappings={categoryMappings}
                            onSelect={handleSelect}
                            selectedCategory={selectedCategory}
                            moveState={moveState}
                            activeTab={activeTab}
                        />
                    )}
                </XR>
            </Canvas>

            {/* Selection Detail Panel */}
            {
                selectedCategory && (
                    <div style={{
                        position: 'absolute',
                        top: 16,
                        right: 120, // To left of exit button
                        width: 300,
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        color: 'white',
                        padding: 20,
                        borderRadius: 12,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 'bold', color: '#60a5fa' }}>{selectedCategory}</h3>
                            <button
                                onClick={() => { setSelectedCategory(undefined); setSelectedStats(null); }}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 20 }}
                            >×</button>
                        </div>

                        {selectedStats ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <div style={{ flex: 1, padding: 10, background: 'rgba(34, 197, 94, 0.2)', borderRadius: 8, border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                                        <div style={{ fontSize: 12, color: '#86efac' }}>New Lines</div>
                                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#22c55e' }}>+{selectedStats.newLines}</div>
                                    </div>
                                    <div style={{ flex: 1, padding: 10, background: 'rgba(239, 68, 68, 0.2)', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                        <div style={{ fontSize: 12, color: '#fca5a5' }}>Delisted</div>
                                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ef4444' }}>-{selectedStats.delistLines}</div>
                                    </div>
                                </div>

                                <div style={{ fontSize: 14, color: '#cbd5e1', lineHeight: '1.5' }}>
                                    <div style={{ marginBottom: 4 }}><span style={{ color: '#94a3b8' }}>Net Change:</span> <strong style={{ color: (selectedStats.newLines - selectedStats.delistLines) >= 0 ? '#4ade80' : '#f87171' }}>{selectedStats.newLines - selectedStats.delistLines}</strong></div>
                                    {selectedStats.reason && <div><span style={{ color: '#94a3b8' }}>Reason:</span> {selectedStats.reason}</div>}
                                </div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontStyle: 'italic' }}>
                                    Click 'Edit' in 2D map to modify layout.
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>No range activity data available for this section.</div>
                        )}
                    </div>
                )
            }

            {/* UI Overlay */}
            <div style={{
                position: 'absolute',
                top: 16,
                left: 16,
                color: '#fff',
                fontSize: 14,
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '12px 16px',
                borderRadius: 8,
                pointerEvents: 'none',
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: 8 }}>🎮 Controls</div>
                <div>WASD / Arrows - Move</div>
                <div>Mouse - Look around</div>
                <div>Click - Enable mouse look</div>
                <div>L-Click Shelf - detailed view</div>
                <div>Esc - Clear Selection</div>
            </div>

            {/* Exit button */}
            <button
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    padding: '10px 20px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: 14,
                }}
            >
                Exit 3D View
            </button>

            {/* AR Button - Bottom center for mobile visibility */}
            {!arMode && (
                <button
                    onClick={handleEnterAR}
                    style={{
                        position: 'absolute',
                        bottom: 80,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '14px 28px',
                        backgroundColor: '#8b5cf6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 12,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: 16,
                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                    }}
                >
                    📱 Enter AR Mode
                </button>
            )}

            {/* AR Mode UI */}
            {arMode && (
                <>
                    {/* Exit AR Button */}
                    <button
                        onClick={handleExitAR}
                        style={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            padding: '12px 20px',
                            backgroundColor: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: 14,
                            zIndex: 10,
                        }}
                    >
                        ✕ Exit AR
                    </button>

                    {/* AR Instructions */}
                    <div style={{
                        position: 'absolute',
                        bottom: 30,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#fff',
                        padding: '12px 20px',
                        borderRadius: 8,
                        fontSize: 14,
                        textAlign: 'center',
                        maxWidth: '80%',
                    }}>
                        <span>☝️ Drag to rotate • 🤏 Pinch to scale</span>
                    </div>

                    {/* Scale indicator */}
                    <div style={{
                        position: 'absolute',
                        top: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: 4,
                        fontSize: 12,
                    }}>
                        Scale: {Math.round(arScale * 100)}%
                    </div>
                </>
            )}

            {/* Crosshair */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 20,
                height: 20,
                pointerEvents: 'none',
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    transform: 'translateY(-50%)',
                }} />
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: 2,
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    transform: 'translateX(-50%)',
                }} />
            </div>

            {/* Mobile Controls Overlay */}
            <MobileControls moveState={moveState} />
        </div >
    );
}

export default StoreScene3D;
