import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function HeroMotionScene() {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8.5);

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. Ultra-Reflective Liquid Rhodium & Polished 925 Silver Materials
    const liquidSilverMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xF0F4F8),
      metalness: 0.97,
      roughness: 0.12,
    });

    const deepChromeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xD2D7DC),
      metalness: 0.99,
      roughness: 0.18,
    });

    const hairlineSilverMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xE0E4E8),
      metalness: 0.95,
      roughness: 0.22,
    });

    // 4. Haute Joaillerie Geometries Orbiting Around Center
    // (a) Flagship Sculptural Ring (Torus) - Left Orbit
    const ringGeo = new THREE.TorusGeometry(1.45, 0.28, 36, 72);
    const ringMesh = new THREE.Mesh(ringGeo, liquidSilverMat);
    ringMesh.position.set(-3.2, 0.4, -0.5);
    ringMesh.rotation.set(0.6, 0.4, 0.2);
    scene.add(ringMesh);

    // (b) Celestial Faceted Pendant (Octahedron) - Right Orbit
    const pendantGeo = new THREE.OctahedronGeometry(1.15, 0);
    const pendantMesh = new THREE.Mesh(pendantGeo, deepChromeMat);
    pendantMesh.position.set(3.3, 0.6, 0.2);
    pendantMesh.rotation.set(0.3, 0.8, -0.4);
    scene.add(pendantMesh);

    // (c) Minimalist Architecture Cuff / Bangle (Slender Torus) - Background Orbit
    const cuffGeo = new THREE.TorusGeometry(2.1, 0.08, 24, 80);
    const cuffMesh = new THREE.Mesh(cuffGeo, hairlineSilverMat);
    cuffMesh.position.set(0.3, -1.2, -1.8);
    cuffMesh.rotation.set(Math.PI / 2.6, 0.2, -0.4);
    scene.add(cuffMesh);

    // (d) Suspended Diamond Prism Earring - Lower Drift
    const prismGeo = new THREE.ConeGeometry(0.65, 1.4, 6);
    const prismMesh = new THREE.Mesh(prismGeo, liquidSilverMat);
    prismMesh.position.set(-2.2, -2.1, -0.8);
    prismMesh.rotation.set(Math.PI - 0.3, 0.2, 0.6);
    scene.add(prismMesh);

    // (e) Subtle Floating Silver Stardust Particles
    const particleCount = 45;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xC8D0D8,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Atelier Studio Three-Point Lighting
    const ambientLight = new THREE.AmbientLight(0x222222, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 3.5);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x88A0B8, 2.0);
    fillLight.position.set(-6, -3, 4);
    scene.add(fillLight);

    // Dynamic Specular Sweep Spotlight (creates authentic liquid chrome glints)
    const glintLight = new THREE.PointLight(0xFFFFFF, 14, 15);
    glintLight.position.set(0, 3, 5);
    scene.add(glintLight);

    // 6. Smooth Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 7. Render Loop with Visibility Optimization
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let animationFrameId;
    let lastTime = performance.now();
    const startTime = lastTime;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      camera.position.x = mouseX * 0.6;
      camera.position.y = mouseY * 0.4;
      camera.lookAt(0, 0, 0);

      // (a) Ring Motion: Slow rotation + subtle levitation breath
      ringMesh.rotation.x += delta * 0.14;
      ringMesh.rotation.y += delta * 0.22;
      ringMesh.rotation.z += delta * 0.08;
      ringMesh.position.y = 0.4 + Math.sin(elapsed * 0.65) * 0.15;

      // (b) Pendant Motion: Faceted glint orbit
      pendantMesh.rotation.y -= delta * 0.26;
      pendantMesh.rotation.x += delta * 0.12;
      pendantMesh.position.y = 0.6 + Math.cos(elapsed * 0.55) * 0.18;

      // (c) Cuff Bangle Motion: Slow gyroscopic precession
      cuffMesh.rotation.z += delta * 0.09;
      cuffMesh.rotation.y = 0.2 + Math.sin(elapsed * 0.35) * 0.15;

      // (d) Prism Earring: Suspended drift
      prismMesh.rotation.y += delta * 0.18;
      prismMesh.rotation.z = 0.6 + Math.sin(elapsed * 0.45) * 0.08;
      prismMesh.position.y = -2.1 + Math.cos(elapsed * 0.5) * 0.12;

      // (e) Particles: Celestial slow twinkle
      particles.rotation.y = elapsed * 0.02;
      particles.rotation.x = Math.sin(elapsed * 0.015) * 0.1;

      // (f) Moving Specular Glint Light (orbiting liquid reflection)
      glintLight.position.x = Math.sin(elapsed * 0.7) * 4.5;
      glintLight.position.y = Math.cos(elapsed * 0.5) * 3.2 + 1.2;
      glintLight.position.z = 4.2 + Math.sin(elapsed * 0.4) * 1.5;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose resources
      ringGeo.dispose();
      pendantGeo.dispose();
      cuffGeo.dispose();
      prismGeo.dispose();
      particleGeo.dispose();
      liquidSilverMat.dispose();
      deepChromeMat.dispose();
      hairlineSilverMat.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 select-none overflow-hidden bg-black pointer-events-none"
      style={{ opacity: hasWebGL ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}
