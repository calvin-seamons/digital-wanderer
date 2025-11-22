import { Sky } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import Portal from './Portal';

export default function AbstractIsland() {
    return (
        <group>
            {/* Lighting */}
            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 10, 0]} intensity={2} />

            {/* TODO: Add your Level 3 environment here */}

            {/* Ground plane */}
            <RigidBody type="fixed" colliders={false}>
                <CuboidCollider args={[50, 0.1, 50]} position={[0, -0.1, 0]} />
            </RigidBody>

            {/* Temporary visual ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Boundary walls */}
            <RigidBody type="fixed" colliders={false}>
                <CuboidCollider args={[40, 15, 0.5]} position={[0, 7, -35]} />
                <CuboidCollider args={[40, 15, 0.5]} position={[0, 7, 35]} />
                <CuboidCollider args={[0.5, 15, 40]} position={[35, 7, 0]} />
                <CuboidCollider args={[0.5, 15, 40]} position={[-35, 7, 0]} />
                <CuboidCollider args={[100, 0.5, 100]} position={[0, -50, 0]} />
            </RigidBody>

            {/* Portals */}
            <Portal
                position={[0, 0, 0]}
                targetLevel={2}
                targetSpawn={[0, 1.6, -40]}
                label="Back to Level 2"
            />
        </group>
    );
}
