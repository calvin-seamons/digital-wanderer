import { useGLTF, Environment, Sky } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import Portal from './Portal';

export default function NatureIsland() {
    const { scene } = useGLTF('/Nature.glb');

    return (
        <group>
            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            {/* Model with automatic collision from geometry */}
            <RigidBody type="fixed" colliders="trimesh">
                <primitive object={scene} position={[0, -10, 0]} scale={[20, 20, 20]} />
            </RigidBody>

            {/* Invisible boundary walls to prevent falling off */}
            <RigidBody type="fixed" colliders={false}>
                {/* North wall */}
                <CuboidCollider args={[40, 15, 0.5]} position={[0, 7, -35]} />
                {/* South wall */}
                <CuboidCollider args={[40, 15, 0.5]} position={[0, 7, 35]} />
                {/* East wall */}
                <CuboidCollider args={[0.5, 15, 40]} position={[35, 7, 0]} />
                {/* West wall */}
                <CuboidCollider args={[0.5, 15, 40]} position={[-35, 7, 0]} />

                {/* Safety net floor far below to catch falling players */}
                <CuboidCollider args={[100, 0.5, 100]} position={[0, -50, 0]} />
            </RigidBody>

            {/* Portals - Positioned within the map area */}
            {/* Exit to Level 2 */}
            <Portal
                position={[0, -10, -30]}
                targetLevel={2}
                targetSpawn={[0, 1.6, 30]}
                label="To Industrial Zone"
            />
        </group>
    );
}
