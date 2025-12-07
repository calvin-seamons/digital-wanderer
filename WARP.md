# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Digital Wanderer is a 3D first-person exploration experience built with React Three Fiber. Players navigate through three thematically distinct worlds (The Pastoral, The Machine, Synthesis), each with unique visual post-processing effects conveying different artistic moods representing the cultural shift from nature worship to industrial modernity to environmental synthesis.

## Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Production build to dist/
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Tech Stack

- **React 19** with Vite
- **React Three Fiber** (`@react-three/fiber`) - React renderer for Three.js
- **Drei** (`@react-three/drei`) - R3F helpers (PointerLockControls, useGLTF, Sky, Text, etc.)
- **Rapier** (`@react-three/rapier`) - Physics engine for collisions and rigid bodies
- **Postprocessing** (`@react-three/postprocessing`) - Visual effects (Bloom, Glitch, Noise, etc.)
- **Zustand** - Lightweight state management for level/transition state

## Architecture

### Core Flow

```
App.jsx
├── Canvas (R3F)
│   └── Physics (Rapier)
│       ├── Player (first-person controller)
│       ├── CurrentIsland (level-based switch)
│       │   ├── ThePastoral (level 1 - Romantic nature)
│       │   ├── TheMachine (level 2 - Industrial/Futurist)
│       │   └── Synthesis (level 3 - Nature + Technology)
│       └── Effects (level-specific post-processing)
├── TransitionOverlay (fade effect)
├── AudioManager (ambient audio per level)
├── ScrollOverlay (educational content, press P)
└── MinimapDisplay (HUD)
```

### State Management (store.js)

Zustand store manages:
- `level` - Current level (1-3)
- `isTransitioning` - Controls fade overlay and player teleport
- `spawnPosition` - Player spawn coordinates after portal entry
- `enterPortal(targetLevel, targetSpawn)` - Triggers level transition with 1s fade

### Key Patterns

**Island Components**: Each island follows a consistent structure:
- Lighting setup (Sky, ambient/directional lights)
- RigidBody with `type="fixed"` for static geometry
- Boundary walls via CuboidCollider to prevent falling
- Portal components linking to other levels

**Player Controller** (`Player.jsx`):
- Capsule collider with Rapier RigidBody
- WASD/Arrow keys for movement, Space to jump
- Camera follows player position via `useFrame`
- PointerLockControls for mouse look

**Post-Processing Effects** (`Effects.jsx`):
- The Pastoral: Bloom + Vignette for soft/romantic feel
- The Machine: Noise + ChromaticAberration + Glitch for harsh aesthetic
- Synthesis: Ethereal/abstract effects

**Portal Transitions** (`Portal.jsx`):
- Proximity-based trigger (< 2 units from camera)
- Calls `enterPortal()` which fades screen, updates level, teleports player

### 3D Assets

GLB models stored in `/public`:
- `Nature.glb` - The Pastoral environment
- `Industrial_exterior_v2.glb` - The Machine environment
- `synthesis-skybox.png` - Synthesis 360° panorama
- Tree models: `Tree2.glb`, `Tree3.glb`, `rowoftrees.glb`

Load models using `useGLTF('/ModelName.glb')` from drei.

### Collision Setup

For static level geometry:
```jsx
<RigidBody type="fixed" colliders="trimesh">
  <primitive object={scene} />
</RigidBody>
```

For simple box/plane colliders:
```jsx
<RigidBody type="fixed" colliders={false}>
  <CuboidCollider args={[halfWidth, halfHeight, halfDepth]} position={[x, y, z]} />
</RigidBody>
```

## Component Reference

| Component | Purpose |
|-----------|---------|
| `ThePastoral.jsx` | Level 1 - Romantic nature environment |
| `TheMachine.jsx` | Level 2 - Industrial/Futurist environment |
| `Synthesis.jsx` | Level 3 - Nature + technology synthesis |
| `MachineLayout.jsx` | Layout and assets for The Machine level |
| `MachineAssets.jsx` | Industrial GLB mesh components |
| `ScrollOverlay.jsx` | Educational scroll popup (press P) |
| `Waterfall.jsx` | Particle-based waterfall effect (instanced mesh) |
| `CobblestonePath.jsx` | Procedural curved path using TubeGeometry |
| `MachineInspector.jsx` | Debug utility - logs GLB structure to console |
| `Minimap.jsx` | Exports `MinimapDisplay` (outside Canvas) and `MinimapTracker` (inside Canvas) |
