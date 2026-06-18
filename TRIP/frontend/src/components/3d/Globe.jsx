import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Earth() {
  const meshRef = useRef();
  
  // Rotate slowly
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.z = 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Core Planet */}
      <Sphere args={[1, 64, 64]}>
        <meshStandardMaterial 
          color="#061624" 
          roughness={0.8}
          metalness={0.2}
          wireframe={true}
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Atmospheric glow */}
      <Sphere args={[1.05, 32, 32]}>
        <MeshDistortMaterial
          color="#fca835"
          attach="material"
          distort={0.2}
          speed={1.5}
          roughness={0.2}
          transparent
          opacity={0.15}
        />
      </Sphere>
      
      {/* Simple Marker for India */}
      <mesh position={[0.7, 0.4, 0.6]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#fca835" />
      </mesh>
    </group>
  );
}

export function Globe() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#059669" />
        <Earth />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
