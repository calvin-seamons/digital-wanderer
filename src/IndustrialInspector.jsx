import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

// Temporary component to inspect the GLB file structure
export default function IndustrialInspector() {
    const { scene, nodes } = useGLTF('/Industrial_exterior_v2.glb');

    useEffect(() => {
        console.log('=== INDUSTRIAL GLB INSPECTION ===');
        
        // Calculate overall scene bounding box
        const boundingBox = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        boundingBox.getSize(size);
        boundingBox.getCenter(center);
        
        console.log('\n📦 SCENE BOUNDING BOX:');
        console.log('  Min:', boundingBox.min.toArray().map(v => v.toFixed(2)));
        console.log('  Max:', boundingBox.max.toArray().map(v => v.toFixed(2)));
        console.log('  Size (W x H x D):', size.toArray().map(v => v.toFixed(2)));
        console.log('  Center:', center.toArray().map(v => v.toFixed(2)));
        
        console.log('\n🧱 RECOMMENDED WALL POSITIONS (based on bounding box):');
        const padding = 2; // Extra space beyond model bounds
        console.log(`  North wall (Z-): position=[0, ${(size.y/2).toFixed(1)}, ${(boundingBox.min.z - padding).toFixed(1)}]`);
        console.log(`  South wall (Z+): position=[0, ${(size.y/2).toFixed(1)}, ${(boundingBox.max.z + padding).toFixed(1)}]`);
        console.log(`  East wall (X+): position=[${(boundingBox.max.x + padding).toFixed(1)}, ${(size.y/2).toFixed(1)}, 0]`);
        console.log(`  West wall (X-): position=[${(boundingBox.min.x - padding).toFixed(1)}, ${(size.y/2).toFixed(1)}, 0]`);
        console.log(`  Wall half-sizes: args=[${(size.x/2 + padding).toFixed(1)}, ${(size.y/2 + 5).toFixed(1)}, 0.5] for N/S`);
        console.log(`  Wall half-sizes: args=[0.5, ${(size.y/2 + 5).toFixed(1)}, ${(size.z/2 + padding).toFixed(1)}] for E/W`);
        
        console.log('\n📍 ALL MESHES:');
        Object.entries(nodes).forEach(([name, node]) => {
            if (node.isMesh) {
                const meshBox = new THREE.Box3().setFromObject(node);
                const meshSize = new THREE.Vector3();
                meshBox.getSize(meshSize);
                console.log(`  ${name}:`, {
                    position: node.position.toArray().map(v => v.toFixed(2)),
                    worldPos: node.getWorldPosition(new THREE.Vector3()).toArray().map(v => v.toFixed(2)),
                    size: meshSize.toArray().map(v => v.toFixed(2))
                });
            }
        });
        
        console.log('\nNode names:', Object.keys(nodes));
    }, [scene, nodes]);

    return (
        <group>
            <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} />
        </group>
    );
}
