import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import BeamSystem from './BeamSystem';
import Portal from '../Portal';

function GLB({ file, position=[0,0,0], rotation=[0,0,0], scale=1 }) {
  const { scene } = useGLTF(file);
  return <primitive object={scene.clone()} position={position} rotation={rotation} scale={Array.isArray(scale)? scale : [scale,scale,scale]} />
}

function useKeyOnce(code, enabled=true, cooldownMs=300) {
  const [ready, setReady] = useState(true);
  useEffect(() => {
    const onKey = (e) => {
      if (!enabled || !ready) return;
      if (e.code === code) {
        setReady(false);
        window.dispatchEvent(new CustomEvent('level3-key', { detail: { code } }));
        setTimeout(() => setReady(true), cooldownMs);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, ready, cooldownMs]);
}

function MirrorControl({ id, position=[0,0,0], initialDeg=0, onChange }) {
  const [angle, setAngle] = useState(initialDeg);
  const groupRef = useRef();
  const padActive = useRef(false);
  useKeyOnce('KeyE', true, 250);

  useEffect(() => {
    const handler = (e) => {
      if (!padActive.current) return;
      if (e.detail.code === 'KeyE') {
        setAngle(a => {
          const next = (a + 15) % 360;
          onChange?.(next);
          return next;
        });
      }
    };
    window.addEventListener('level3-key', handler);
    return () => window.removeEventListener('level3-key', handler);
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(0, THREE.MathUtils.degToRad(angle), 0);
    }
  }, [angle]);

  return (
    <group>
      {/* Mirror slab */}
      <RigidBody type="kinematicPosition" colliders={false}>
        <group ref={groupRef} position={position}>
          <GLB file="/level3/MirrorSlab.glb" />
          {/* Simple thin box for collisions */}
          <CuboidCollider args={[1.0, 2.0, 0.05]} position={[0, 2.0, 0]} />
        </group>
      </RigidBody>

      {/* Marker pad with sensor to enable rotations */}
      <RigidBody type="fixed" colliders={false}>
        <GLB file="/level3/MarkerPad.glb" position={[position[0], 0, position[2]-1.6]} />
        <CuboidCollider args={[0.7, 0.15, 0.7]} position={[position[0], 0.15, position[2]-1.6]} sensor onIntersectionEnter={() => (padActive.current = true)} onIntersectionExit={() => (padActive.current = false)} />
      </RigidBody>
    </group>
  );
}

export default function Level3Layout() {
  const prismY = 1.5;
  const captureCenter = useMemo(() => [0, prismY, 0], []);
  const [captures, setCaptures] = useState(0);

  // Mirror refs (compute plane point/normal) — plane normal is object's +Z in local space
  const leftRef = useRef();
  const rightRef = useRef();

  const mirrorFns = [leftRef, rightRef].map(ref => ({
    point: () => {
      if (!ref.current) return [0,0,0];
      const p = new THREE.Vector3();
      ref.current.getWorldPosition(p);
      return p.toArray();
    },
    normal: () => {
      if (!ref.current) return [0,0,1];
      const dir = new THREE.Vector3(0,0,1).applyQuaternion(ref.current.getWorldQuaternion(new THREE.Quaternion()));
      return dir.normalize().toArray();
    }
  }));

  const emitters = useMemo(() => ([
    { pos: [-12, 1.2, 8], dir: [0.6, 0.0, -0.7] },
    { pos: [ 12, 1.2, 8], dir: [-0.6, 0.0, -0.7] },
  ]), []);

  const [portalActive, setPortalActive] = useState(false);
  useEffect(() => setPortalActive(captures >= 2), [captures]);

  return (
    <group>
      {/* Ground hub */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[14, 0.1, 14]} position={[0, -0.05, 0]} />
      </RigidBody>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.9} />
      </mesh>

      {/* Canopy (visual only) */}
      <GLB file="/level3/GeodesicCanopy.glb" />

      {/* Prism at center (capture height ~1.5m) */}
      <GLB file="/level3/PrismMonolith.glb" position={[0, 0, 0]} />

      {/* Mirrors */}
      <group ref={leftRef}>
        <MirrorControl position={[-10, 0, 8]} initialDeg={25} />
      </group>
      <group ref={rightRef}>
        <MirrorControl position={[10, 0, 8]} initialDeg={-25} />
      </group>

      {/* Beams */}
      <BeamSystem
        mirrors={mirrorFns}
        emitters={emitters}
        captureCenter={captureCenter}
        onCapturedChange={setCaptures}
      />

      {/* Boundaries + safety */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[16, 10, 0.5]} position={[0, 5, 16]} />
        <CuboidCollider args={[16, 10, 0.5]} position={[0, 5, -16]} />
        <CuboidCollider args={[0.5, 10, 16]} position={[16, 5, 0]} />
        <CuboidCollider args={[0.5, 10, 16]} position={[-16, 5, 0]} />
        <CuboidCollider args={[40, 0.5, 40]} position={[0, -6, 0]} />
      </RigidBody>

      {/* Exit portal becomes active after 2 captures */}
      {portalActive && (
        <Portal
          position={[0, 0, 14]}
          targetLevel={1}
          targetSpawn={[0, 1.6, -25]}
          label="Return to Nature"
        />
      )}
    </group>
  );
}
