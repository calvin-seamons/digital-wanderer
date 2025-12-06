import { Sky } from '@react-three/drei';
import Level3Layout from './level3/Level3Layout';

export default function AbstractIsland() {
  return (
    <group>
      <Sky sunPosition={[80, 15, 40]} turbidity={6} rayleigh={0.4} />
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 8, -10]} intensity={1.2} color="#a0cfff" />
      <Level3Layout />
    </group>
  );
}
