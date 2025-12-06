import { Sky } from '@react-three/drei';
import Portal from './Portal';
import IndustrialLayout from './IndustrialLayout';

export default function IndustrialIsland() {
    return (
        <group>
            {/* Lighting - Industrial/overcast feel */}
            <Sky 
                sunPosition={[50, 10, 0]} 
                turbidity={10}
                rayleigh={0.5}
            />
            <ambientLight intensity={0.4} />
            <directionalLight 
                position={[20, 30, 10]} 
                intensity={0.8} 
                color="#ffe4c4"
                castShadow
            />
            {/* Secondary fill light */}
            <directionalLight 
                position={[-10, 10, -10]} 
                intensity={0.3} 
                color="#b0c4de"
            />

            {/* Main level layout with collision */}
            <IndustrialLayout />

            {/* Portals - positioned within the designed layout */}
            {/* North portal - back to Nature */}
            <Portal
                position={[0, 1, 28]}
                targetLevel={1}
                targetSpawn={[0, 1.6, -25]}
                label="Back to Nature"
            />

            <Portal
                position={[0, 1, -28]}
                targetLevel={3}
                targetSpawn={[0, 1.6, 0]}
                label="To Re-evaluation"
            />
        </group>
    );
}
