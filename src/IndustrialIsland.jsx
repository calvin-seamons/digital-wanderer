import { Sky } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import Portal from './Portal';
import IndustrialInspector from './IndustrialInspector';

export default function IndustrialIsland() {
    return (
        <group>
            {/* Lighting */}
            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 5]} intensity={1} color="#ffffff" />

            {/* Inspector - logs all meshes to console */}
            <IndustrialInspector />

            {/* Ground plane */}
            <RigidBody type="fixed" colliders={false}>
                <CuboidCollider args={[50, 0.1, 50]} position={[0, -0.1, 0]} />
            </RigidBody>

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
                position={[0, 0, 45]}
                targetLevel={1}
                targetSpawn={[0, 1.6, -25]}
                label="Back to Nature"
            />
            <Portal
                position={[0, 0, -45]}
                targetLevel={3}
                targetSpawn={[0, 1.6, 0]}
                label="To Level 3"
            />
        </group>
    );
}
