import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, useCursor, Billboard } from '@react-three/drei';
import { useStore } from './store';
import * as THREE from 'three';

export default function Portal({ position, targetLevel, targetSpawn, label }) {
    const { camera } = useThree();
    const enterPortal = useStore((state) => state.enterPortal);
    const isTransitioning = useStore((state) => state.isTransitioning);
    const [hovered, setHover] = useState(false);

    useCursor(hovered);

    useFrame((state, delta) => {
        if (isTransitioning) return;

        const dist = camera.position.distanceTo(new THREE.Vector3(...position));

        // Rotate portal effect
        if (portalRef.current) {
            portalRef.current.rotation.z += delta;
        }

        // Check for entry
        if (dist < 2) {
            enterPortal(targetLevel, targetSpawn);
        }
    });

    const portalRef = useRef();

    return (
        <group position={position}>
            {/* Portal Frame */}
            <mesh rotation={[0, 0, 0]}>
                <torusGeometry args={[1.5, 0.1, 16, 32]} />
                <meshStandardMaterial color="#444" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Portal Effect */}
            <mesh ref={portalRef}>
                <circleGeometry args={[1.4, 32]} />
                <meshBasicMaterial color={hovered ? "#00ffff" : "#0088ff"} transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>

            {/* Label - Billboard makes it always face the camera */}
            <Billboard>
                <Text
                    position={[0, 2, 0]}
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {label || `To Level ${targetLevel}`}
                </Text>
            </Billboard>

            {/* Interactive Hitbox for mouse hover (optional hint) */}
            <mesh
                visible={false}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <circleGeometry args={[1.5, 32]} />
            </mesh>
        </group>
    );
}
