import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from './store';

// This tracker stays INSIDE the Canvas
export function MinimapTracker({ onUpdate }) {
    const { camera } = useThree();

    useFrame(() => {
        if (onUpdate) {
            onUpdate({
                x: camera.position.x,
                z: camera.position.z,
                rotation: camera.rotation.y
            });
        }
    });

    return null;
}

// This display component goes OUTSIDE the Canvas
export default function MinimapDisplay() {
    const level = useStore((state) => state.level);
    const playerPosRef = useRef({ x: 0, z: 0, rotation: 0 });
    const mapRef = useRef();
    const playerRef = useRef();

    // Map settings
    const mapSize = 150;
    const worldSize = 100;

    const portals = useMemo(() => {
        switch (level) {
            case 1: return [{ x: 0, z: -30, label: 'Exit' }];
            case 2: return [{ x: 0, z: 50, label: 'Back' }, { x: 0, z: -50, label: 'Next' }];
            default: return [];
        }
    }, [level]);

    const handleUpdate = (pos) => {
        playerPosRef.current = pos;

        if (mapRef.current && playerRef.current) {
            const x = (pos.x / worldSize) * mapSize;
            const y = (pos.z / worldSize) * mapSize;

            mapRef.current.style.transform = `translate(${-x}px, ${-y}px)`;
            playerRef.current.style.transform = `translate(-50%, -50%) rotate(${-pos.rotation}rad)`;
        }
    };

    // Expose the update handler so it can be called from inside Canvas
    if (typeof window !== 'undefined') {
        window.__updateMinimap = handleUpdate;
    }

    return (
        <div style={{
            position: 'fixed',
            top: 20,
            right: 20,
            width: mapSize,
            height: mapSize,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            border: '2px solid white',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            pointerEvents: 'none'
        }}>
            <div ref={mapRef} style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                left: '50%',
                top: '50%'
            }}>
                {portals.map((p, i) => {
                    const px = (p.x / worldSize) * mapSize;
                    const py = (p.z / worldSize) * mapSize;
                    return (
                        <div key={i} style={{
                            position: 'absolute',
                            left: px,
                            top: py,
                            width: 8,
                            height: 8,
                            backgroundColor: '#00ffff',
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)'
                        }} title={p.label} />
                    );
                })}

                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 4,
                    height: 4,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translate(-50%, -50%)'
                }} />
            </div>

            <div
                ref={playerRef}
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '10px solid white',
                    zIndex: 10
                }}
            />
        </div>
    );
}
