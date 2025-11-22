import * as THREE from 'three';
import { useMemo } from 'react';

export default function CobblestonePath() {
    const curve = useMemo(() => {
        const points = [];
        for (let i = 0; i <= 50; i++) {
            const t = i / 50;
            const x = Math.sin(t * Math.PI * 4) * 20;
            const z = (t - 0.5) * 100;
            points.push(new THREE.Vector3(x, 0.1, z));
        }
        return new THREE.CatmullRomCurve3(points);
    }, []);

    const geometry = useMemo(() => new THREE.TubeGeometry(curve, 64, 2, 8, false), [curve]);

    return (
        <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            {/* Using a simple gray color to simulate cobblestone for now */}
            <meshStandardMaterial color="#555" roughness={0.8} />
        </mesh>
    );
}
