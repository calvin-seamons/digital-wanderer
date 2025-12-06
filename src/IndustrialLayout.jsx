import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import {
    Building1, Building3, Building5, Building7,
    CoolingTower,
    Cargo1Close, Cargo2Full,
    LiquidReservoir1, LiquidReservoir2,
    Barrel1, Barrel2, Barrel3,
    Generator,
    PipeHorizontalLong, PipeVerticalLong, PipeSupport,
    FenceLong, FenceCorner,
    RoadLong, RoadShort,
    IndustrialMesh,
} from './IndustrialAssets';

/**
 * Industrial Level Layout
 * 
 * Layout Design (top-down view, +Z is "north"):
 * 
 *         [Portal to Nature - North]
 *                   |
 *     +-------------+-------------+
 *     |                           |
 *     | [Building]   [Cooling]    |
 *     |     |          Tower      |
 *     +-----+------[Road]---------+
 *     |     |          |          |
 *     | [Cargo]   [Tanks/Pipes]   |
 *     |     |          |          |
 *     +-----+---------+----------+
 *                   |
 *         [Portal to Abstract - South]
 * 
 * Approx bounds: 60x60 units centered near origin
 * Spawn: Center of the road area
 */

export default function IndustrialLayout() {
    const { nodes } = useGLTF('/Industrial_exterior_v2.glb');

    // Clone a mesh node for use with RigidBody
    const cloneMesh = (name) => {
        if (!nodes[name]) {
            console.warn(`Node ${name} not found`);
            return null;
        }
        return nodes[name].clone();
    };

    return (
        <group>
            {/* ============================================ */}
            {/* GROUND - Large asphalt area with collision */}
            {/* ============================================ */}
            <RigidBody type="fixed" colliders={false}>
                {/* Main walkable floor */}
                <CuboidCollider args={[35, 0.1, 35]} position={[0, -0.1, 0]} />
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[70, 70]} />
                    <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
                </mesh>
            </RigidBody>

            {/* ============================================ */}
            {/* ROADS - Visual road markings */}
            {/* ============================================ */}
            <group position={[0, 0.01, 0]}>
                {/* Main road running north-south */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <planeGeometry args={[8, 60]} />
                    <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
                </mesh>
                {/* Road markings */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                    <planeGeometry args={[0.3, 50]} />
                    <meshStandardMaterial color="#ffcc00" roughness={0.5} />
                </mesh>
            </group>

            {/* ============================================ */}
            {/* BUILDINGS - West side */}
            {/* ============================================ */}
            <RigidBody type="fixed" colliders="cuboid">
                <group position={[-20, 0, 10]}>
                    <IndustrialMesh name="Building_1" />
                </group>
            </RigidBody>

            <RigidBody type="fixed" colliders="cuboid">
                <group position={[-20, 0, -15]}>
                    <IndustrialMesh name="Building_3" />
                </group>
            </RigidBody>

            {/* ============================================ */}
            {/* COOLING TOWER & TANKS - East side */}
            {/* ============================================ */}
            <RigidBody type="fixed" colliders="cuboid">
                <group position={[20, 0, 10]}>
                    <IndustrialMesh name="Cooling_tower" />
                </group>
            </RigidBody>

            <RigidBody type="fixed" colliders="cuboid">
                <group position={[20, 0, -10]}>
                    <IndustrialMesh name="Liquid_reservoir_1" />
                </group>
            </RigidBody>

            <RigidBody type="fixed" colliders="cuboid">
                <group position={[15, 0, -18]}>
                    <IndustrialMesh name="Liquid_reservoir_2" />
                </group>
            </RigidBody>

            {/* ============================================ */}
            {/* CARGO & PROPS - Scattered around */}
            {/* ============================================ */}
            <RigidBody type="fixed" colliders="cuboid">
                <group position={[-12, 0, -5]}>
                    <IndustrialMesh name="Cargo_2_full" />
                </group>
            </RigidBody>

            <RigidBody type="fixed" colliders="cuboid">
                <group position={[-8, 0, 0]}>
                    <IndustrialMesh name="Cargo_1_close" />
                </group>
            </RigidBody>

            {/* Barrels near cargo */}
            <RigidBody type="fixed" colliders="cuboid">
                <group position={[-10, 0, 3]}>
                    <IndustrialMesh name="Barrel_1" />
                </group>
            </RigidBody>

            <RigidBody type="fixed" colliders="cuboid">
                <group position={[-9, 0, 4]}>
                    <IndustrialMesh name="Barrel_2" />
                </group>
            </RigidBody>

            {/* Generator */}
            <RigidBody type="fixed" colliders="cuboid">
                <group position={[10, 0, 5]}>
                    <IndustrialMesh name="Generator" />
                </group>
            </RigidBody>

            {/* ============================================ */}
            {/* PIPES - Connecting structures */}
            {/* ============================================ */}
            <group position={[18, 3, 0]}>
                <IndustrialMesh name="Pipes_horizontal_long" />
            </group>
            <group position={[22, 0, -5]}>
                <IndustrialMesh name="Pipes_vertical_long" />
            </group>
            <group position={[22, 0, 5]}>
                <IndustrialMesh name="Pipes_support" />
            </group>

            {/* ============================================ */}
            {/* FENCE BOUNDARY - Perimeter */}
            {/* ============================================ */}
            {/* Note: These are visual only. Collision walls are below. */}
            <group>
                {/* North fence */}
                <group position={[-15, 0, 30]}>
                    <IndustrialMesh name="Fence_long" />
                </group>
                <group position={[15, 0, 30]}>
                    <IndustrialMesh name="Fence_long" />
                </group>
                
                {/* South fence */}
                <group position={[-15, 0, -30]}>
                    <IndustrialMesh name="Fence_long" />
                </group>
                <group position={[15, 0, -30]}>
                    <IndustrialMesh name="Fence_long" />
                </group>
            </group>

            {/* ============================================ */}
            {/* INVISIBLE BOUNDARY WALLS */}
            {/* ============================================ */}
            <RigidBody type="fixed" colliders={false}>
                {/* North wall */}
                <CuboidCollider args={[35, 10, 0.5]} position={[0, 5, 32]} />
                {/* South wall */}
                <CuboidCollider args={[35, 10, 0.5]} position={[0, 5, -32]} />
                {/* East wall */}
                <CuboidCollider args={[0.5, 10, 35]} position={[32, 5, 0]} />
                {/* West wall */}
                <CuboidCollider args={[0.5, 10, 35]} position={[-32, 5, 0]} />
                {/* Safety net floor */}
                <CuboidCollider args={[50, 0.5, 50]} position={[0, -10, 0]} />
            </RigidBody>
        </group>
    );
}

// Preload assets
useGLTF.preload('/Industrial_exterior_v2.glb');
