"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function DustParticles() {
  const ref = useRef<THREE.Points>(null);

  // Generate particle positions
  const count = 4000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 20; // x spread
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20; // y spread
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20; // z spread
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="white"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}

export default function DustOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none", // allows clicking through
        zIndex: -1,
      }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <DustParticles />
      </Canvas>
    </div>
  );
}
