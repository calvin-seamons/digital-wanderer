import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import Player from "./Player";
import Effects from "./Effects";
import { useStore } from "./store";
import ThePastoral from "./levels/pastoral/ThePastoral";
import TheMachine from "./levels/machine/TheMachine";
import Synthesis from "./levels/synthesis/Synthesis";
import TransitionOverlay from "./TransitionOverlay";
import AudioManager from "./AudioManager";
import MinimapDisplay, { MinimapTracker } from "./Minimap";
import ScrollOverlay from "./ScrollOverlay";

function LevelIndicator() {
  const level = useStore((state) => state.level);
  const levelNames = { 1: 'The Pastoral', 2: 'The Machine', 3: 'Synthesis' };
  return (
    <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 10 }}>
      <h1>{levelNames[level] || 'Unknown'}</h1>
      <p>Walk to the portal to advance.</p>
    </div>
  );
}

function CurrentIsland() {
  const level = useStore((state) => state.level);
  switch (level) {
    case 1: return <ThePastoral key="the-pastoral" />;
    case 2: return <TheMachine key="the-machine" />;
    case 3: return <Synthesis key="synthesis" />;
    default: return <ThePastoral key="default" />;
  }
}

export default function App() {
  return (
    <>
      <TransitionOverlay />
      <AudioManager />
      <LevelIndicator />
      <MinimapDisplay />
      <ScrollOverlay />
      <Canvas>
        <Physics gravity={[0, -20, 0]}>
          <MinimapTracker onUpdate={(pos) => window.__updateMinimap?.(pos)} />
          <Player />
          <Effects />
          <CurrentIsland />
        </Physics>
      </Canvas>
    </>
  );
}
