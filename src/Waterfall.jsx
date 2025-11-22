import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PositionalAudio } from '@react-three/drei';
import * as THREE from 'three';

export default function Waterfall({ position }) {
    const particlesCount = 1000;
    const mesh = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < particlesCount; i++) {
            const x = (Math.random() - 0.5) * 2;
            const y = Math.random() * 10;
            const z = (Math.random() - 0.5) * 0.5;
            const speed = 0.1 + Math.random() * 0.2;
            temp.push({ x, y, z, speed, originalY: y });
        }
        return temp;
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame(() => {
        particles.forEach((particle, i) => {
            particle.y -= particle.speed;
            if (particle.y < 0) {
                particle.y = 10;
            }
            dummy.position.set(particle.x, particle.y, particle.z);
            dummy.scale.set(0.1, 0.1, 0.1);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group position={position}>
            {/* Water Particles */}
            <instancedMesh ref={mesh} args={[null, null, particlesCount]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="#aaddff" transparent opacity={0.6} />
            </instancedMesh>

            {/* Pool at bottom */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[3, 32]} />
                <meshStandardMaterial color="#0044aa" roughness={0.1} />
            </mesh>

            {/* Sound Source - Note: Requires a user interaction to start audio context usually, 
                 but we'll place it here. Ideally we need a sound file. 
                 For now, we will comment it out until we have a valid URL or asset.
             */}
            {/* <PositionalAudio url="/sounds/waterfall.mp3" distance={10} loop autoplay /> */}
        </group>
    );
}
