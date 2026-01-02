import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Text, Grid } from '@react-three/drei';
import { useRef, useMemo, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import type { Aisle } from '../types';

interface StoreScene3DProps {
    aisles: Aisle[];
    onExit: () => void;
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
const getMaterialForType = (type?: string): THREE.MeshStandardMaterial => {
    const materials: Record<string, THREE.MeshStandardMaterial> = {
        chilled: new THREE.MeshStandardMaterial({ color: '#3b82f6', roughness: 0.7 }),
        frozen: new THREE.MeshStandardMaterial({ color: '#60a5fa', roughness: 0.7 }),
        bakery: new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.8 }),
        counter: new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.6 }),
        gondola: new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.8 }),
    };
    // fixture is treated the same as gondola
    const normalizedType = type?.toLowerCase() === 'fixture' ? 'gondola' : (type?.toLowerCase() || 'gondola');
    return materials[normalizedType] || materials.gondola;
};

// Single Aisle/Shelf mesh component
function ShelfMesh({ aisle }: { aisle: Aisle }) {
    const { position, size, rotation, sections } = useMemo(() => {
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

        // Calculate section positions along the shelf length
        const sectionList = aisle.sections || [{ bay: '', category: aisle.label }];
        const sectionCount = sectionList.length;
        const sectionWidth = length / sectionCount;

        const sectionData = sectionList.map((section, index) => ({
            category: section.category || aisle.label,
            xOffset: -length / 2 + sectionWidth / 2 + index * sectionWidth,
            width: sectionWidth,
        }));

        return {
            position: new THREE.Vector3(centerX - 45, height / 2, centerZ - 25),
            size: { width: length, height, depth },
            rotation: angle + (aisle.rotation || 0) * Math.PI / 180,
            sections: sectionData,
        };
    }, [aisle]);

    const material = useMemo(() => getMaterialForType(aisle.type), [aisle.type]);

    return (
        <group position={position} rotation={[0, -rotation, 0]}>
            {/* Main shelf body */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[size.width, size.height, size.depth]} />
                <primitive object={material} attach="material" />
            </mesh>

            {/* Render each section as a separate label along the shelf - FRONT */}
            {sections.map((section, index) => (
                <Text
                    key={`front-${index}`}
                    position={[section.xOffset, 0, size.depth / 2 + 0.02]}
                    fontSize={Math.min(0.1, size.height * 0.12)}
                    maxWidth={section.width * 0.9}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.01}
                    outlineColor="#000000"
                    textAlign="center"
                >
                    {section.category.toUpperCase()}
                </Text>
            ))}

            {/* Render each section as a separate label along the shelf - BACK */}
            {sections.map((section, index) => (
                <Text
                    key={`back-${index}`}
                    position={[section.xOffset, 0, -size.depth / 2 - 0.02]}
                    rotation={[0, Math.PI, 0]}
                    fontSize={Math.min(0.1, size.height * 0.12)}
                    maxWidth={section.width * 0.9}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.01}
                    outlineColor="#000000"
                    textAlign="center"
                >
                    {section.category.toUpperCase()}
                </Text>
            ))}
        </group>
    );
}

// First-person movement controls
function WalkControls({ speed = 5 }: { speed?: number }) {
    const { camera } = useThree();
    const moveState = useRef({ forward: false, backward: false, left: false, right: false });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': moveState.current.forward = true; break;
                case 'KeyS': case 'ArrowDown': moveState.current.backward = true; break;
                case 'KeyA': case 'ArrowLeft': moveState.current.left = true; break;
                case 'KeyD': case 'ArrowRight': moveState.current.right = true; break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': moveState.current.forward = false; break;
                case 'KeyS': case 'ArrowDown': moveState.current.backward = false; break;
                case 'KeyA': case 'ArrowLeft': moveState.current.left = false; break;
                case 'KeyD': case 'ArrowRight': moveState.current.right = false; break;
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
        if (!moveState.current.forward && !moveState.current.backward &&
            !moveState.current.left && !moveState.current.right) {
            return; // No movement
        }

        // Get camera's forward direction (where it's looking)
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0; // Keep movement on XZ plane
        forward.normalize();

        // Calculate right vector (perpendicular to forward on XZ plane)
        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        // Build movement vector based on input
        const movement = new THREE.Vector3();

        if (moveState.current.forward) movement.add(forward);
        if (moveState.current.backward) movement.sub(forward);
        if (moveState.current.right) movement.add(right);
        if (moveState.current.left) movement.sub(right);

        movement.normalize().multiplyScalar(speed * delta);
        camera.position.add(movement);

        // Keep camera at eye level
        camera.position.y = 1.6;
    });

    return null;
}

// Main 3D scene
function Scene({ aisles }: { aisles: Aisle[] }) {
    const controlsRef = useRef<any>(null);

    // Filter out aisle voids (type === 'aisle')
    const visibleAisles = useMemo(() =>
        aisles.filter(a => a.type !== 'aisle'),
        [aisles]
    );

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
            <pointLight position={[0, 8, 0]} intensity={0.5} />
            <pointLight position={[-20, 8, -10]} intensity={0.3} />
            <pointLight position={[20, 8, 10]} intensity={0.3} />

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial color="#e2e8f0" />
            </mesh>

            {/* Grid overlay on floor */}
            <Grid
                position={[0, 0.01, 0]}
                args={[200, 200]}
                cellSize={2}
                cellThickness={0.5}
                cellColor="#cbd5e1"
                sectionSize={10}
                sectionThickness={1}
                sectionColor="#94a3b8"
                fadeDistance={100}
                fadeStrength={1}
                followCamera={false}
            />

            {/* Ceiling (optional, subtle) */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial color="#f8fafc" side={THREE.BackSide} />
            </mesh>

            {/* Render all shelves */}
            {visibleAisles.map((aisle) => (
                <ShelfMesh key={aisle.id} aisle={aisle} />
            ))}

            {/* First-person controls */}
            <PointerLockControls ref={controlsRef} />
            <WalkControls speed={5} />
        </>
    );
}

// Main exported component
export function StoreScene3D({ aisles, onExit }: StoreScene3DProps) {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            // Exit pointer lock is handled automatically
            // But we can use this for other escape actions
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas
                shadows
                camera={{ position: [0, 1.6, 10], fov: 75 }}
                style={{ background: '#1a1a2e' }}
            >
                <Scene aisles={aisles} />
            </Canvas>

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
        </div>
    );
}

export default StoreScene3D;
