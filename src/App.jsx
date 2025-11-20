import { Canvas } from "@react-three/fiber";
import Player from "./Player";
import { useStore } from "./store";

function LevelIndicator() {
  const level = useStore((state) => state.level);
  return (
    <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 10 }}>
      <h1>Level: {level}</h1>
      <p>Walk to the edge (Z &gt; 50) to advance.</p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <LevelIndicator />
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Player />

        {/* Ground Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="green" />
        </mesh>

        {/* Marker at the edge */}
        <mesh position={[0, 1, 50]}>
          <boxGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
      </Canvas>
    </>
  );
}
