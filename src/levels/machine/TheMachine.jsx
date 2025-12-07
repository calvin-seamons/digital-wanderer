import { Sky } from '@react-three/drei';
import Portal from '../../Portal';
import MachineLayout from './MachineLayout';

export default function TheMachine() {
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
            <MachineLayout />

            {/* Portals - positioned within the designed layout */}
            {/* Portal back to The Pastoral */}
            <Portal
                position={[0, 1, 28]}
                targetLevel={1}
                targetSpawn={[5.82, -9.71, 25.76]}
                label="Return to The Pastoral"
            />

            {/* Portal to Synthesis */}
            <Portal
                position={[0, 1, -28]}
                targetLevel={3}
                targetSpawn={[2, 1.6, 3]}
                label="Enter Synthesis"
            />
        </group>
    );
}
