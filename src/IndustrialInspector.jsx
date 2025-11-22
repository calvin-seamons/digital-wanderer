import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

// Temporary component to inspect the GLB file structure
export default function IndustrialInspector() {
    const { scene, nodes } = useGLTF('/Industrial_exterior_v2.glb');

    useEffect(() => {
        console.log('=== INDUSTRIAL GLB INSPECTION ===');
        console.log('Scene:', scene);
        console.log('All nodes:', nodes);
        console.log('Node names:', Object.keys(nodes));

        // Log mesh information
        Object.entries(nodes).forEach(([name, node]) => {
            if (node.isMesh) {
                console.log(`Mesh: ${name}`, {
                    position: node.position.toArray(),
                    geometry: node.geometry,
                    material: node.material
                });
            }
        });
    }, [scene, nodes]);

    return (
        <group>
            <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} />
        </group>
    );
}
