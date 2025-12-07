import SynthesisLayout from './SynthesisLayout';

export default function Synthesis() {
  return (
    <group>
      {/* No sky - just the panorama skybox */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 10]} intensity={0.5} />
      <SynthesisLayout />
    </group>
  );
}
