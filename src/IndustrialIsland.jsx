import { useMemo } from 'react';
import { Environment } from '@react-three/drei';

function Building({ position, height }) {
    return (
        <mesh position={[position[0], height / 2, position[2]]}>
            <boxGeometry args={[3, height, 3]} />
            <meshStandardMaterial color="#444" roughness={0.2} metalness={0.8} />
        </mesh>
    );
}

export default function IndustrialIsland() {
    const buildings = useMemo(() => {
        const items = [];
        for (let i = 0; i < 40; i++) {
            items.push({
                x: (Math.random() - 0.5) * 80,
                z: (Math.random() - 0.5) * 80,
                height: 5 + Math.random() * 15,
            });
        }
        return items;
    }, []);

    return (
        <group>
            <Environment preset="city" background />
            <fog attach="fog" args={['#202020', 5, 60]} />

            {/* Harsh Red Light */}
            <directionalLight position={[10, 20, 5]} intensity={2} color="#ff3333" />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>

            {/* Buildings */}
            {buildings.map((b, i) => (
                <Building key={i} position={[b.x, 0, b.z]} height={b.height} />
            ))}
        </group>
    );
}
