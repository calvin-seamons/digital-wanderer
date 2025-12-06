# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Digital Wanderer is a 3D first-person exploration experience built with React Three Fiber. Players navigate through three thematically distinct "islands" (Nature, Industrial, Abstract), each with unique visual post-processing effects conveying different artistic moods.

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
│       │   ├── NatureIsland (level 1)
│       │   ├── IndustrialIsland (level 2)
│       │   └── AbstractIsland (level 3)
│       └── Effects (level-specific post-processing)
├── TransitionOverlay (fade effect)
├── AudioManager (ambient audio per level)
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
- Level 1 (Nature): Bloom + Vignette for soft/romantic feel
- Level 2 (Industrial): Noise + ChromaticAberration + Glitch for harsh aesthetic
- Level 3 (Abstract): Pixelation effect

**Portal Transitions** (`Portal.jsx`):
- Proximity-based trigger (< 2 units from camera)
- Calls `enterPortal()` which fades screen, updates level, teleports player

### 3D Assets

GLB models stored in `/public`:
- `Nature.glb` - Nature island environment
- `Industrial_exterior_v2.glb` - Industrial island
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
| `Waterfall.jsx` | Particle-based waterfall effect (instanced mesh) |
| `CobblestonePath.jsx` | Procedural curved path using TubeGeometry |
| `IndustrialInspector.jsx` | Debug utility - logs GLB structure to console |
| `Minimap.jsx` | Exports `MinimapDisplay` (outside Canvas) and `MinimapTracker` (inside Canvas) |
