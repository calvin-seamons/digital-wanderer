import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';

// Preload the GLB
useGLTF.preload('/Industrial_exterior_v2.glb');

/**
 * Hook to access all Machine level asset meshes
 */
export function useMachineAssets() {
    const { nodes, materials } = useGLTF('/Industrial_exterior_v2.glb');
    return { nodes, materials };
}

/**
 * Generic mesh component factory
 * Creates a component that renders a specific mesh from the GLB
 */
function createMeshComponent(meshName) {
    return function MeshComponent({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
        const { nodes } = useGLTF('/Industrial_exterior_v2.glb');
        const mesh = nodes[meshName];
        
        if (!mesh) {
            console.warn(`Mesh "${meshName}" not found in Machine GLB`);
            return null;
        }

        // Clone geometry and material so each instance is independent
        const clonedMesh = useMemo(() => mesh.clone(), [mesh]);

        return (
            <primitive 
                object={clonedMesh} 
                position={position} 
                rotation={rotation}
                scale={typeof scale === 'number' ? [scale, scale, scale] : scale}
                {...props}
            />
        );
    };
}

// ============================================
// BUILDINGS
// ============================================
export const Building1 = createMeshComponent('Building_1');
export const Building2 = createMeshComponent('Building_2');
export const Building3 = createMeshComponent('Building_3');
export const Building4 = createMeshComponent('Building_4');
export const Building5 = createMeshComponent('Building_5');
export const Building6 = createMeshComponent('Building_6');
export const Building7 = createMeshComponent('Building_7');
export const Building8 = createMeshComponent('Building_8');
export const Building9 = createMeshComponent('Building_9');
export const Building10 = createMeshComponent('Building_10');
export const Building11 = createMeshComponent('Building_11');
export const Building12 = createMeshComponent('Building_12');
export const Building13 = createMeshComponent('Building_13');
export const CoolingTower = createMeshComponent('Cooling_tower');

// ============================================
// PROPS
// ============================================
export const Barrel1 = createMeshComponent('Barrel_1');
export const Barrel2 = createMeshComponent('Barrel_2');
export const Barrel3 = createMeshComponent('Barrel_3');
export const BoxWideWood = createMeshComponent('Box_wide_wood');
export const BoxWood = createMeshComponent('Box_wood');
export const Cargo1Close = createMeshComponent('Cargo_1_close');
export const Cargo1Open = createMeshComponent('Cargo_1_open');
export const Cargo2Empty = createMeshComponent('Cargo_2_empty');
export const Cargo2Full = createMeshComponent('Cargo_2_full');
export const LiquidReservoir1 = createMeshComponent('Liquid_reservoir_1');
export const LiquidReservoir2 = createMeshComponent('Liquid_reservoir_2');
export const Bags1 = createMeshComponent('Bags_1');
export const Bags2 = createMeshComponent('Bags_2');
export const Generator = createMeshComponent('Generator');
export const MetalCabinet1 = createMeshComponent('Metal_cabinet_1');
export const MetalCabinet2 = createMeshComponent('Metal_cabinet_2');
export const PaletSingle = createMeshComponent('Palet_single');
export const PaletStack = createMeshComponent('Palet_stack');
export const Roadblock = createMeshComponent('Roadblock');

// ============================================
// BRIDGES & STAIRS
// ============================================
export const Bridge1 = createMeshComponent('Bridges_1');
export const Bridge2 = createMeshComponent('Bridges_2');
export const Bridge3 = createMeshComponent('Bridges_3');
export const BridgeEnd = createMeshComponent('Bridges_end');
export const BridgeStairs1 = createMeshComponent('Bridges_stairs_1');
export const BridgeStairs2 = createMeshComponent('Bridges_stairs_2');
export const BridgeTurn = createMeshComponent('Bridges_turn');
export const BridgeSupport1 = createMeshComponent('Bridges_support_1');
export const BridgeSupport2 = createMeshComponent('Bridges_support_2');
export const BridgeSupport3 = createMeshComponent('Bridges_support_3');

// ============================================
// PIPES
// ============================================
export const PipeArch = createMeshComponent('Pipes_arch');
export const PipeHorizontalLong = createMeshComponent('Pipes_horizontal_long');
export const PipeHorizontalShort = createMeshComponent('Pipes_horizontal_short');
export const PipeHorizontalTurn1 = createMeshComponent('Pipes_horizontal_turn_1');
export const PipeHorizontalTurn2 = createMeshComponent('Pipes_horizontal_turn_2');
export const PipeOut1 = createMeshComponent('Pipes_out_1');
export const PipeOut2 = createMeshComponent('Pipes_out_2');
export const PipeSupport = createMeshComponent('Pipes_support');
export const PipeVerticalLong = createMeshComponent('Pipes_vertical_long');
export const PipeVerticalShort = createMeshComponent('Pipes_vertical_short');
export const PipeVerticalTurn = createMeshComponent('Pipes_vertical_turn');

// ============================================
// VENTILATION
// ============================================
export const Ventilation1 = createMeshComponent('Ventilation_1');
export const Ventilation2 = createMeshComponent('Ventilation_2');
export const Ventilation2Blades = createMeshComponent('Ventilation_2_blades');
export const Ventilation3 = createMeshComponent('Ventilation_3');
export const Ventilation3Blades = createMeshComponent('Ventilation_3_blades');

// ============================================
// GROUND & ROADS
// ============================================
export const AsphaltFloor = createMeshComponent('Alphalt_Floor');
export const ConcreteStairs = createMeshComponent('Concrete_stairs');
export const ConcreteMiniWallLong = createMeshComponent('Concrete_miniwall_long');
export const ConcreteMiniWallShort = createMeshComponent('Concrete_miniwall_short');
export const RoadCurved = createMeshComponent('Road_curved');
export const RoadLong = createMeshComponent('Road_long');
export const RoadShort = createMeshComponent('Road_short');
export const RoadTurn1 = createMeshComponent('Road_turn_1');
export const RoadTurn2 = createMeshComponent('Road_turn_2');
export const RoadTurn3 = createMeshComponent('Road_turn_3');

// ============================================
// WALLS & FENCES
// ============================================
export const Wall = createMeshComponent('Wall');
export const WallColumn = createMeshComponent('Wall_column');
export const WallCorner1 = createMeshComponent('Wall_corner_1');
export const WallCorner2 = createMeshComponent('Wall_corner_2');
export const WallCorner3 = createMeshComponent('Wall_corner_3');
export const Fence = createMeshComponent('Fence');
export const FenceCorner = createMeshComponent('Fence_corner');
export const FenceLong = createMeshComponent('Fence_long');
export const FenceShort = createMeshComponent('Fence_short');

// ============================================
// UTILITY: Render mesh by name dynamically
// ============================================
export function MachineMesh({ name, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
    const { nodes } = useGLTF('/Industrial_exterior_v2.glb');
    const mesh = nodes[name];
    
    if (!mesh) {
        console.warn(`Mesh "${name}" not found`);
        return null;
    }

    const clonedMesh = useMemo(() => mesh.clone(), [mesh]);

    return (
        <primitive 
            object={clonedMesh} 
            position={position} 
            rotation={rotation}
            scale={typeof scale === 'number' ? [scale, scale, scale] : scale}
            {...props}
        />
    );
}
