'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

interface ParticleGlobeProps {
  particleCount?: number;
  rotationSpeed?: number;
  color?: string;
  secondaryColor?: string;
  interactive?: boolean;
}

// Generate points on a sphere surface
function generateSpherePoints(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere algorithm for even distribution
    const phi = Math.acos(1 - 2 * (i + 0.5) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  
  return positions;
}

// Generate atmospheric glow points
function generateAtmospherePoints(count: number, innerRadius: number, outerRadius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
    
    // Varying radius for atmospheric effect
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  
  return positions;
}

// Data flow lines between points
function generateDataFlows(count: number, radius: number): [Float32Array, Float32Array] {
  const starts = new Float32Array(count * 3);
  const ends = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const phi1 = Math.random() * Math.PI;
    const theta1 = Math.random() * 2 * Math.PI;
    const phi2 = Math.random() * Math.PI;
    const theta2 = Math.random() * 2 * Math.PI;
    
    starts[i * 3] = radius * Math.sin(phi1) * Math.cos(theta1);
    starts[i * 3 + 1] = radius * Math.sin(phi1) * Math.sin(theta1);
    starts[i * 3 + 2] = radius * Math.cos(phi1);
    
    ends[i * 3] = radius * Math.sin(phi2) * Math.cos(theta2);
    ends[i * 3 + 1] = radius * Math.sin(phi2) * Math.sin(theta2);
    ends[i * 3 + 2] = radius * Math.cos(phi2);
  }
  
  return [starts, ends];
}

function ParticleGlobe({
  particleCount = 8000,
  rotationSpeed = 0.001,
  color = '#059669',
  secondaryColor = '#00d4ff',
  interactive = true,
}: ParticleGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<any>(null);
  const atmosphereRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const mouseRef = useRef(new THREE.Vector2());
  const targetRotation = useRef(new THREE.Vector2());
  const { viewport, clock } = useThree();
  
  // Generate geometry data
  const spherePositions = useMemo(() => 
    generateSpherePoints(particleCount, 2), 
    [particleCount]
  );
  
  const atmospherePositions = useMemo(() => 
    generateAtmospherePoints(2000, 2.1, 2.5), 
    []
  );
  
  // Mouse move handler
  const handleMouseMove = useCallback((e: THREE.Event) => {
    if (!interactive) return;
    mouseRef.current.set(e.uv.x - 0.5, e.uv.y - 0.5);
  }, [interactive]);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Smooth rotation based on mouse position
    if (interactive && hovered) {
      targetRotation.current.x = mouseRef.current.y * 0.5;
      targetRotation.current.y = mouseRef.current.x * 0.5;
      
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 2 * delta;
      groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 2 * delta;
    } else {
      // Auto-rotation when not interacting
      groupRef.current.rotation.y += rotationSpeed;
      groupRef.current.rotation.x += rotationSpeed * 0.5;
    }
    
    // Pulse animation for particles
    if (particlesRef.current) {
      const time = clock.getElapsedTime();
      particlesRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.02);
    }
    
    // Atmosphere shimmer
    if (atmosphereRef.current) {
      const time = clock.getElapsedTime();
      atmosphereRef.current.material.opacity = 0.3 + Math.sin(time * 3) * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Main particle sphere */}
      <Points 
        ref={particlesRef}
        positions={spherePositions}
        stride={3}
        frustumCulled={false}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <PointMaterial
          transparent
          color={color}
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Atmospheric glow layer */}
      <Points
        ref={atmosphereRef}
        positions={atmospherePositions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color={secondaryColor}
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Inner core glow */}
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default ParticleGlobe;
