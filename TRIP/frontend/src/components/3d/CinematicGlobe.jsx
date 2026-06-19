import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export function CinematicGlobe() {
  const groupRef = useRef();
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.3, -1.5, 0]}>
      {/* Dark core sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#0d0f2b" 
          roughness={0.8}
          metalness={0.2}
          wireframe={false}
        />
      </Sphere>

      {/* Glow / Atmosphere layer */}
      <Sphere args={[2.05, 64, 64]}>
        <meshBasicMaterial 
          color="#545e9d" 
          transparent={true} 
          opacity={0.1} 
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Abstract wireframe mesh to look like a digital map */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial 
          color="#2E3192" 
          wireframe={true} 
          transparent={true}
          opacity={0.3}
        />
      </Sphere>
      
      {/* A single glowing marker representing the heart of India */}
      <mesh position={[1.4, 0.8, 1.0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#FF9933" />
      </mesh>
      
      {/* A ring indicating a travel route radiating outwards */}
      <mesh position={[1.4, 0.8, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.09, 32]} />
        <meshBasicMaterial color="#FF9933" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
