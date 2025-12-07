import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, EquirectangularReflectionMapping, BackSide } from 'three';
import Portal from '../../Portal';

function PanoramaSkybox({ url }) {
  const texture = useLoader(TextureLoader, url);
  texture.mapping = EquirectangularReflectionMapping;
  
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 32]} />
      <meshBasicMaterial map={texture} side={BackSide} />
    </mesh>
  );
}

export default function SynthesisLayout() {
  return (
    <group>
      {/* 360° Panorama Skybox */}
      <PanoramaSkybox url="/synthesis-skybox.png" />

      {/* Invisible floor for walking */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[50, 0.1, 50]} position={[0, 0, 0]} />
      </RigidBody>

      {/* Portal back to The Machine */}
      <Portal
        position={[0, 1, -5]}
        targetLevel={2}
        targetSpawn={[0, 1.6, 25]}
        label="Return to The Machine"
      />
    </group>
  );
}
