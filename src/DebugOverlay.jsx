import { useEffect, useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Debug state shared between overlay and 3D components
const debugState = {
    position: [0, 0, 0],
    meshUnderCursor: null,
    gridVisible: false,
};

// Make debug state accessible globally for the HUD
if (typeof window !== 'undefined') {
    window.__debugState = debugState;
}

/**
 * 3D Debug Helper - goes inside Canvas/Physics
 * Tracks player position and provides grid visualization
 */
export function DebugHelper() {
    const { camera, raycaster, scene } = useThree();
    const gridRef = useRef();
    const [gridVisible, setGridVisible] = useState(false);

    useFrame(() => {
        // Update position in debug state
        debugState.position = [
            camera.position.x.toFixed(2),
            camera.position.y.toFixed(2),
            camera.position.z.toFixed(2)
        ];

        // Raycast from camera center to find mesh under cursor
        raycaster.setFromCamera({ x: 0, y: 0 }, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        if (intersects.length > 0) {
            const hit = intersects[0];
            debugState.meshUnderCursor = {
                name: hit.object.name || 'unnamed',
                distance: hit.distance.toFixed(2),
                point: hit.point.toArray().map(v => v.toFixed(2))
            };
        } else {
            debugState.meshUnderCursor = null;
        }
    });

    useEffect(() => {
        const handleKey = (e) => {
            if (e.code === 'KeyG' && e.shiftKey) {
                setGridVisible(v => !v);
                debugState.gridVisible = !debugState.gridVisible;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <>
            {gridVisible && (
                <gridHelper 
                    ref={gridRef}
                    args={[100, 100, '#444444', '#222222']} 
                    position={[0, 0.01, 0]}
                />
            )}
        </>
    );
}

/**
 * Debug HUD Overlay - goes outside Canvas
 * Shows position, controls, and mesh info
 */
export default function DebugOverlay() {
    const [position, setPosition] = useState([0, 0, 0]);
    const [meshInfo, setMeshInfo] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [logHistory, setLogHistory] = useState([]);

    // Poll debug state for updates
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.__debugState) {
                setPosition([...window.__debugState.position]);
                setMeshInfo(window.__debugState.meshUnderCursor);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKey = (e) => {
            // P - Log current position
            if (e.code === 'KeyP' && !e.shiftKey && !e.ctrlKey) {
                const pos = window.__debugState?.position || [0, 0, 0];
                const logEntry = `position={[${pos.join(', ')}]}`;
                console.log('📍 Position:', logEntry);
                setLogHistory(prev => [...prev.slice(-4), logEntry]);
            }
            
            // T - Teleport to coordinates
            if (e.code === 'KeyT' && !e.shiftKey && !e.ctrlKey) {
                const input = prompt('Enter coordinates (x, y, z):');
                if (input) {
                    const coords = input.split(',').map(s => parseFloat(s.trim()));
                    if (coords.length === 3 && coords.every(n => !isNaN(n))) {
                        // Dispatch teleport event
                        window.dispatchEvent(new CustomEvent('debug-teleport', { 
                            detail: { x: coords[0], y: coords[1], z: coords[2] }
                        }));
                        console.log('🚀 Teleporting to:', coords);
                    }
                }
            }

            // I - Inspect mesh under cursor
            if (e.code === 'KeyI' && !e.shiftKey && !e.ctrlKey) {
                const mesh = window.__debugState?.meshUnderCursor;
                if (mesh) {
                    console.log('🔍 Mesh:', mesh);
                    const logEntry = `${mesh.name} @ [${mesh.point.join(', ')}]`;
                    setLogHistory(prev => [...prev.slice(-4), logEntry]);
                } else {
                    console.log('🔍 No mesh under cursor');
                }
            }

            // H - Toggle help
            if (e.code === 'KeyH' && e.shiftKey) {
                setShowHelp(v => !v);
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const overlayStyle = {
        position: 'fixed',
        bottom: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.75)',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: '12px',
        padding: '10px 15px',
        borderRadius: '5px',
        zIndex: 1000,
        minWidth: '200px',
        pointerEvents: 'none',
    };

    const helpStyle = {
        position: 'fixed',
        bottom: 20,
        right: 20,
        background: 'rgba(0, 0, 0, 0.85)',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontSize: '11px',
        padding: '10px 15px',
        borderRadius: '5px',
        zIndex: 1000,
        pointerEvents: 'none',
    };

    return (
        <>
            {/* Position HUD */}
            <div style={overlayStyle}>
                <div style={{ marginBottom: '5px', color: '#888' }}>DEBUG (Shift+H for help)</div>
                <div>X: {position[0]}</div>
                <div>Y: {position[1]}</div>
                <div>Z: {position[2]}</div>
                {meshInfo && (
                    <div style={{ marginTop: '8px', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <div style={{ color: '#888' }}>Under cursor:</div>
                        <div style={{ color: '#ffaa00' }}>{meshInfo.name}</div>
                        <div style={{ color: '#666', fontSize: '10px' }}>
                            dist: {meshInfo.distance}
                        </div>
                    </div>
                )}
                {logHistory.length > 0 && (
                    <div style={{ marginTop: '8px', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <div style={{ color: '#888' }}>Recent logs:</div>
                        {logHistory.map((log, i) => (
                            <div key={i} style={{ color: '#aaa', fontSize: '10px' }}>{log}</div>
                        ))}
                    </div>
                )}
            </div>

            {/* Help Panel */}
            {showHelp && (
                <div style={helpStyle}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Debug Controls</div>
                    <div><span style={{ color: '#ffaa00' }}>P</span> - Log position to console</div>
                    <div><span style={{ color: '#ffaa00' }}>T</span> - Teleport to coordinates</div>
                    <div><span style={{ color: '#ffaa00' }}>I</span> - Inspect mesh under cursor</div>
                    <div><span style={{ color: '#ffaa00' }}>Shift+G</span> - Toggle grid</div>
                    <div><span style={{ color: '#ffaa00' }}>Shift+H</span> - Toggle this help</div>
                </div>
            )}
        </>
    );
}
