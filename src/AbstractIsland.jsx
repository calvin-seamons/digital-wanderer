import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

function FloatingSphere({ position, color }) {
    const meshRef = useRef();

    useFrame((state) => {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </mesh>
    );
}

export default function AbstractIsland() {
    return (
        <group>
            <color attach="background" args={['#ffffff']} />
            <ambientLight intensity={1} />

            {/* Wireframe Ground */}
            <gridHelper args={[100, 20, 0x000000, 0xcccccc]} />

            {/* Floating Spheres */}
            <FloatingSphere position={[-5, 3, -10]} color="#ff00ff" />
            <FloatingSphere position={[5, 4, -15]} color="#00ffff" />
            <FloatingSphere position={[0, 6, -20]} color="#ffff00" />
            <FloatingSphere position={[-8, 2, 5]} color="#ff0000" />
            <FloatingSphere position={[8, 5, 10]} color="#0000ff" />
        </group>
    );
}
