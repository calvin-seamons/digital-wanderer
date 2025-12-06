import * as THREE from 'three';
import { useMemo, useState, useEffect } from 'react';

function Beam({ start, end, color = '#00ffff', width = 0.04 }) {
  const vec = new THREE.Vector3();
  const mid = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);

  const len = useMemo(() => new THREE.Vector3().subVectors(end, start).length(), [start, end]);
  const pos = useMemo(() => mid.copy(start).add(end).multiplyScalar(0.5).clone(), [start, end]);
  const rot = useMemo(() => {
    const dir = vec.subVectors(end, start).normalize();
    quat.setFromUnitVectors(up, dir.clone().normalize());
    return quat.clone();
  }, [start, end]);

  return (
    <mesh position={pos} quaternion={rot} renderOrder={2}>
      <cylinderGeometry args={[width, width, len, 12, 1, true]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} roughness={0.2} metalness={0.1} transparent opacity={0.9} />
    </mesh>
  );
}

/**
 * Compute a reflected beam from an emitter to a mirror plane and into a capture sphere.
 * Returns {hit, segments:[{a,b},{a,b}], hitPoint}
 */
export function computeReflectedBeam({ emitterPos, emitterDir, mirrorPoint, mirrorNormal, captureCenter, captureRadius = 0.45 }) {
  const S = new THREE.Vector3().fromArray(emitterPos);
  const d = new THREE.Vector3().fromArray(emitterDir).normalize();
  const M = new THREE.Vector3().fromArray(mirrorPoint);
  const n = new THREE.Vector3().fromArray(mirrorNormal).normalize();
  const C = new THREE.Vector3().fromArray(captureCenter);

  const denom = d.dot(n);
  if (Math.abs(denom) < 1e-5) return { hit: false, segments: [] };
  const t = M.clone().sub(S).dot(n) / denom;
  if (t <= 0) return { hit: false, segments: [] };
  const P = S.clone().add(d.clone().multiplyScalar(t)); // hit point on mirror plane

  const r = d.clone().sub(n.clone().multiplyScalar(2 * d.dot(n))).normalize(); // reflection dir

  // Ray-sphere intersection for capture
  const m = P.clone().sub(C);
  const b = m.dot(r);
  const c = m.lengthSq() - captureRadius * captureRadius;
  if (c > 0 && b > 0) return { hit: false, segments: [{ a: S, b: P }] };
  const discr = b * b - c;
  if (discr < 0) return { hit: false, segments: [{ a: S, b: P }] };
  const t2 = -b - Math.sqrt(discr);
  const Q = P.clone().add(r.clone().multiplyScalar(Math.max(t2, 0.0001)));

  return { hit: true, segments: [{ a: S, b: P }, { a: P, b: Q }], hitPoint: Q };
}

export default function BeamSystem({ mirrors, emitters, captureCenter, onCapturedChange }) {
  // mirrors: [{point: () => [x,y,z], normal: () => [nx,ny,nz]}]
  // emitters: [{pos:[x,y,z], dir:[dx,dy,dz]}] (dir is approximate initial)
  const [captures, setCaptures] = useState(emitters.map(() => false));

  const results = useMemo(() => emitters.map((em, i) => {
    const mir = mirrors[i];
    const res = computeReflectedBeam({
      emitterPos: em.pos,
      emitterDir: em.dir,
      mirrorPoint: mir.point(),
      mirrorNormal: mir.normal(),
      captureCenter,
      captureRadius: 0.45,
    });
    return res;
  }), [emitters, mirrors, captureCenter]);

  useEffect(() => {
    const newCaps = results.map(r => !!r.hit);
    setCaptures(newCaps);
    onCapturedChange?.(newCaps.reduce((a, b) => a + (b ? 1 : 0), 0));
  }, [results]);

  return (
    <group>
      {results.map((r, idx) => (
        <group key={idx}>
          {r.segments?.map((s, i) => (
            <Beam key={i} start={s.a} end={s.b} />
          ))}
        </group>
      ))}
    </group>
  );
}
