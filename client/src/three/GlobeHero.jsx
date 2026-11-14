import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { COORDINATES, CORRIDORS, latLonToVector3 } from '../constants/corridors';

// Globe Core with Dot Grid / Lat-Lon Wireframe Simulation
function GlobeCore({ radius = 2 }) {
  const globeRef = useRef();

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Outer Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.15, 32, 32]} />
        <meshBasicMaterial
          color="#10B981"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main Globe Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color="#0B132B"
          emissive="#060B18"
          roughness={0.8}
          metalness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Subtle Latitude/Longitude Grid Lines */}
      <mesh>
        <sphereGeometry args={[radius * 1.002, 24, 16]} />
        <meshBasicMaterial
          color="#1C2541"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Corridors and Markers that rotate with the globe */}
      <CorridorArcs radius={radius} />
      <LocationMarkers radius={radius} />
    </group>
  );
}

// Curved Spline Geographic Arc connecting cities
function ArcLine({ startVec, endVec, color, index }) {
  const lineRef = useRef();

  const { curve, points } = useMemo(() => {
    const vStart = new THREE.Vector3(...startVec);
    const vEnd = new THREE.Vector3(...endVec);

    // Compute midpoint elevated above the globe surface
    const vMid = vStart.clone().add(vEnd).multiplyScalar(0.5);
    const distance = vStart.distanceTo(vEnd);
    vMid.normalize().multiplyScalar(2 + distance * 0.35);

    const curve = new THREE.QuadraticBezierCurve3(vStart, vMid, vEnd);
    const points = curve.getPoints(50);
    return { curve, points };
  }, [startVec, endVec]);

  // Particle traveling along the curve
  const particleRef = useRef();
  useFrame((state) => {
    if (particleRef.current) {
      const t = (state.clock.getElapsedTime() * 0.4 + index * 0.25) % 1;
      const pos = curve.getPointAt(t);
      particleRef.current.position.set(pos.x, pos.y, pos.z);
    }
  });

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <group>
      {/* The Arc Path */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0.65} linewidth={2} />
      </line>

      {/* Animated Traveling Particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>
    </group>
  );
}

function CorridorArcs({ radius }) {
  return (
    <group>
      {CORRIDORS.map((corridor, idx) => {
        const fromCoord = COORDINATES[corridor.from];
        const toCoord = COORDINATES[corridor.to];
        const start = latLonToVector3(fromCoord.lat, fromCoord.lon, radius);
        const end = latLonToVector3(toCoord.lat, toCoord.lon, radius);

        return (
          <ArcLine
            key={`${corridor.from}-${corridor.to}`}
            startVec={start}
            endVec={end}
            color={corridor.color}
            index={idx}
          />
        );
      })}
    </group>
  );
}

function LocationMarkers({ radius }) {
  return (
    <group>
      {Object.entries(COORDINATES).map(([key, loc]) => {
        const pos = latLonToVector3(loc.lat, loc.lon, radius * 1.01);
        const isDhaka = loc.isHub;

        return (
          <group key={key} position={pos}>
            {/* Glowing pin marker */}
            <mesh>
              <sphereGeometry args={[isDhaka ? 0.055 : 0.04, 16, 16]} />
              <meshBasicMaterial color={isDhaka ? '#10B981' : '#F59E0B'} />
            </mesh>
            <mesh>
              <ringGeometry args={[0.06, 0.08, 16]} />
              <meshBasicMaterial
                color={isDhaka ? '#10B981' : '#F59E0B'}
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Hoverable / Viewable label */}
            <Html distanceFactor={8} position={[0, 0.12, 0]} center>
              <div className="pointer-events-none px-2 py-0.5 rounded bg-navy-900/90 text-[10px] text-white font-medium border border-slate-700/60 shadow whitespace-nowrap backdrop-blur-sm">
                <span className={isDhaka ? 'text-trust-500 font-bold' : 'text-gold-400'}>
                  {loc.name.split(',')[0]}
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function GlobeHero() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    // Graceful fallback for non-WebGL devices per Section 4 requirement 9
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-navy-900 to-navy-950 rounded-2xl border border-slate-800">
        <div className="w-48 h-48 rounded-full border-4 border-dashed border-trust-500/40 flex items-center justify-center animate-spin duration-[20000ms]">
          <div className="w-36 h-36 rounded-full bg-trust-500/10 flex items-center justify-center text-center p-4">
            <span className="text-trust-500 font-semibold text-sm">Global Corridor Hub: Dhaka</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2 flex-wrap justify-center text-xs text-slate-400">
          <span className="px-2 py-1 bg-navy-800 rounded border border-slate-700 text-trust-500">Dhaka &rarr; Dubai</span>
          <span className="px-2 py-1 bg-navy-800 rounded border border-slate-700 text-trust-500">Dhaka &rarr; Riyadh</span>
          <span className="px-2 py-1 bg-navy-800 rounded border border-slate-700 text-gold-400">Dhaka &rarr; Warsaw</span>
          <span className="px-2 py-1 bg-navy-800 rounded border border-slate-700 text-blue-400">Dhaka &rarr; Tokyo</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] sm:h-[520px] lg:h-[600px] relative">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <pointLight position={[-5, -3, -5]} color="#10B981" intensity={0.8} />

        <GlobeCore radius={1.9} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          rotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>

      {/* Floating Interactive Corridor Badges */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center pointer-events-none">
        <div className="px-3 py-1 rounded-full bg-navy-900/80 backdrop-blur-md border border-trust-500/30 text-xs text-slate-300 flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-trust-500 animate-pulse"></span>
          <span>UAE (Dubai)</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-navy-900/80 backdrop-blur-md border border-trust-500/30 text-xs text-slate-300 flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-trust-500 animate-pulse"></span>
          <span>Saudi Arabia (Riyadh)</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-navy-900/80 backdrop-blur-md border border-gold-500/30 text-xs text-slate-300 flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
          <span>Poland (Warsaw / EU)</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-navy-900/80 backdrop-blur-md border border-blue-500/30 text-xs text-slate-300 flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>Japan (Tokyo)</span>
        </div>
      </div>
    </div>
  );
}
