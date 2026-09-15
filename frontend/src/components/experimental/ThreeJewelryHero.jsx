import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import lunarImg from '../../assets/lunar_collection.jpg';

// Sculptural Liquid Rhodium Ring Mesh
function LuxuryJewelryMesh({ scrollProgress }) {
  const meshRef = useRef();
  const innerMeshRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scroll = scrollProgress.current || 0;

    if (meshRef.current) {
      // Cinematic slow physical rotation + scroll tilt
      meshRef.current.rotation.x = 0.4 + Math.sin(t * 0.35) * 0.08 + scroll * 0.0018;
      meshRef.current.rotation.y = t * 0.22 + scroll * 0.0035;
      meshRef.current.rotation.z = Math.cos(t * 0.25) * 0.05;

      // Subtle breath scale
      const breath = 1 + Math.sin(t * 0.8) * 0.012;
      const scrollScale = Math.max(0.82, 1 - scroll * 0.0006);
      meshRef.current.scale.setScalar(breath * scrollScale);
    }

    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x = -0.3 - scroll * 0.0015;
      innerMeshRef.current.rotation.y = -t * 0.18 - scroll * 0.002;
    }

    // Moving studio specular light sweep
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(t * 0.6) * 3.5;
      lightRef.current.position.y = Math.cos(t * 0.4) * 2.5 + 1.5;
      lightRef.current.position.z = 3 + Math.sin(t * 0.5) * 1.5;
    }
  });

  // Premium liquid rhodium / polished 925 silver material
  const rhodiumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D8DCDE'),
        metalness: 0.98,
        roughness: 0.12,
        wireframe: false,
      }),
    []
  );

  const innerBandMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#9FA6AC'),
        metalness: 0.95,
        roughness: 0.25,
      }),
    []
  );

  return (
    <group position={[0, 0, 0]}>
      {/* Dynamic Specular Sweep Spotlight */}
      <pointLight ref={lightRef} intensity={45} distance={10} color="#FFFFFF" />

      {/* Primary Architectural Ring (Sculptural Outer Band) */}
      <mesh ref={meshRef} material={rhodiumMaterial}>
        <torusGeometry args={[1.4, 0.32, 64, 128]} />
      </mesh>

      {/* Secondary Concentric Architectural Halo */}
      <mesh ref={innerMeshRef} material={innerBandMaterial} scale={[0.88, 0.88, 1.2]}>
        <torusGeometry args={[1.35, 0.1, 48, 96]} />
      </mesh>
    </group>
  );
}

// Atmospheric Ambient Dust / Starlight Particles
function AtmosphericParticles({ count = 120 }) {
  const pointsRef = useRef();

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      scl[i] = Math.random() * 0.03 + 0.01;
    }
    return [pos, scl];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime() * 0.05;
    pointsRef.current.rotation.y = t * 0.3;
    pointsRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#C0C0C0"
        transparent
        opacity={0.45}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ThreeJewelryHero({ onExplore }) {
  const scrollProgress = useRef(0);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      scrollProgress.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // WebGL support check
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full h-[95dvh] sm:h-screen bg-black overflow-hidden select-none">
      {/* 1. THREE.JS 3D CANVAS */}
      {hasWebGL ? (
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 4.2], fov: 45 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            {/* Volumetric Obsidian Depth Fog */}
            <fogExp2 attach="fog" args={['#000000', 0.045]} />

            {/* Studio Rim & Ambient Lighting Rig */}
            <ambientLight intensity={0.45} />
            <directionalLight position={[4, 5, 3]} intensity={2.8} color="#FFFFFF" />
            <directionalLight position={[-4, -3, -2]} intensity={1.5} color="#A8B4C0" />
            <directionalLight position={[0, -4, 2]} intensity={0.8} color="#C0C0C0" />

            {/* Floating 3D Sculptural Jewelry */}
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
              <LuxuryJewelryMesh scrollProgress={scrollProgress} />
            </Float>

            {/* Floating Specular Particle Dust */}
            <AtmosphericParticles count={140} />
          </Canvas>
        </div>
      ) : (
        /* Fallback for devices without WebGL */
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <img
            src={lunarImg}
            alt="Cosmic Flagship Jewelry"
            className="w-72 h-72 object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]"
          />
        </div>
      )}

      {/* 2. ATMOSPHERIC SHADOW & RADIAL VIGNETTE OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-black/60 via-transparent to-black" />
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80" />

      {/* 3. EDITORIAL TYPOGRAPHY OVERLAY */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between items-center px-6 py-12 text-center pointer-events-none">
        {/* Top Minimal Brand Mark */}
        <div className="pt-4 pointer-events-auto">
          <span className="text-[10px] uppercase tracking-[0.45em] text-[#A0A0A0] font-mono block">
            MAISON COSMIC • ATELIER MILANESE
          </span>
        </div>

        {/* Center Space Left Open for Three.js 3D Jewelry */}
        <div className="w-full flex-1" />

        {/* Bottom Hero Editorial Typography */}
        <div className="space-y-6 pb-6 max-w-md w-full pointer-events-auto">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.25em] text-white font-light drop-shadow-lg">
              COSMIC
            </h1>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#C0C0C0] font-light">
              FORGED IN INTENTION
            </p>
            <p className="text-xs text-[#808080] font-light max-w-xs mx-auto leading-relaxed pt-1">
              Solid 925 sterling silver engineered with liquid rhodium finishes. Designed for tactile weight and eternal brilliance.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                if (onExplore) onExplore();
                else {
                  const el = document.getElementById('spatial-collection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full max-w-xs mx-auto py-4 px-8 chrome-button text-xs uppercase tracking-[0.3em] font-bold rounded-sm shadow-[0_0_25px_rgba(192,192,192,0.35)] cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              Explore Collection ↓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
