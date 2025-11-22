import { Canvas } from "@react-three/fiber";
import Player from "./Player";
import Effects from "./Effects";
import { useStore } from "./store";
import NatureIsland from "./NatureIsland";
import IndustrialIsland from "./IndustrialIsland";
import AbstractIsland from "./AbstractIsland";
import TransitionOverlay from "./TransitionOverlay";
import AudioManager from "./AudioManager";

function LevelIndicator() {
  const level = useStore((state) => state.level);
  return (
    <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 10 }}>
      <h1>Level: {level}</h1>
      <p>Walk to the edge to advance.</p>
    </div>
  );
}

function CurrentIsland() {
  const level = useStore((state) => state.level);
  switch (level) {
    case 1: return <NatureIsland />;
    case 2: return <IndustrialIsland />;
    case 3: return <AbstractIsland />;
    default: return <NatureIsland />;
  }
}

export default function App() {
  return (
    <>
      <TransitionOverlay />
      <AudioManager />
      <LevelIndicator />
      <Canvas>
        <Player />
        <Effects />
        <CurrentIsland />
      </Canvas>
    </>
  );
}
