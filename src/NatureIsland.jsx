import { useMemo } from 'react';
import { Environment } from '@react-three/drei';

function Tree({ position }) {
    return (
        <group position={position}>
            {/* Trunk */}
            <mesh position={[0, 1, 0]}>
                <cylinderGeometry args={[0.2, 0.4, 2, 8]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 2.5, 0]}>
                <coneGeometry args={[1.5, 3, 8]} />
                <meshStandardMaterial color="#228B22" />
            </mesh>
        </group>
    );
}

export default function NatureIsland() {
    const trees = useMemo(() => {
        return new Array(50).fill(0).map(() => ({
            x: (Math.random() - 0.5) * 80,
            z: (Math.random() - 0.5) * 80,
        }));
    }, []);

    return (
        <group>
            <Environment preset="sunset" background />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#90EE90" />
            </mesh>

            {/* Trees */}
            {trees.map((pos, i) => (
                <Tree key={i} position={[pos.x, 0, pos.z]} />
            ))}
        </group>
    );
}
