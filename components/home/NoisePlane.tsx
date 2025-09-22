"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

interface NoisePlaneProps {
  materialProps?: Partial<React.ComponentProps<typeof MeshTransmissionMaterial>>;
  width?: number;
  height?: number;
}

const NoisePlane: React.FC<NoisePlaneProps> = ({
  materialProps,
  width = 50,
  height = 100,
}) => {
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(width, height, 100, 100), [width, height]);

  // Optional: Animate vertices slightly for a "dust/noise" effect
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = planeGeometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.2 + t) * 0.1 + Math.cos(y * 0.2 + t) * 0.1);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh
      geometry={planeGeometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      <MeshTransmissionMaterial {...materialProps} />
    </mesh>
  );
};

export default NoisePlane;
