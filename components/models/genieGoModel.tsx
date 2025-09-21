import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import type { GLTF } from 'three-stdlib'
import * as THREE from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei';
type Props = ThreeElements['group'];
type ModelProps = Props & {
  gradient?: {
    color1?: THREE.ColorRepresentation;
    color2?: THREE.ColorRepresentation;
    color3?: THREE.ColorRepresentation;
    metalness?: number;
    roughness?: number;
  }
};

type GLTFResult = GLTF & {
  nodes: {
    genie_body_1: THREE.Mesh
    Cyclops_Glasses_BezierCurve002: THREE.Mesh
    Cyclops_Glasses_BezierCurve002_1: THREE.Mesh
    belt_1: THREE.Mesh & { material: THREE.Material }
    goggle_outer_frame_1: THREE.Mesh
  }
  materials: {
    Material_0: THREE.Material
    frame: THREE.Material
    glass: THREE.Material
  }
}



export function GenieOne(props: ModelProps) {

  const { nodes, materials } = useGLTF('/assets/models/genie_go.gltf') as unknown as GLTFResult
  const { gradient, ...groupProps } = props;

  // Optimized materials for better performance
  const glassFrame = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#000",
    metalness: 0.2, // Reduced metalness
    roughness: 0.5  // Increased roughness for simpler calculations
  }), []);

  const beltMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#333446",
    metalness: 0.2, // Reduced metalness
    roughness: 0.5  // Increased roughness for simpler calculations
  }), []);

  const beltMesh = useMemo(() => {
    const cloned = nodes.belt_1.clone();
    cloned.material = beltMaterial;
    return cloned;
  }, [nodes.belt_1, beltMaterial]);

  // Optimized material props for better performance
  const materialProps = useMemo(() => ({
    thickness: 0.2,
    roughness: 0,
    transmission: 1,
    ior: 1.2,
    chromaticAberration: 0.02,
    backSide: true
  }), []);


  return (
    <group  {...groupProps} dispose={null} userData={{ tag: "genie" }}>
      <mesh
        {...nodes.genie_body_1}
      >
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>

      <group position={[-0.004, 0.172, 0.121]} rotation={[Math.PI / 2, 0, 1.636]} scale={0.93}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cyclops_Glasses_BezierCurve002.geometry}
          material={glassFrame}
        />

        // glass
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cyclops_Glasses_BezierCurve002_1.geometry}
          material={glassFrame}
        >
        </mesh>
      </group>
      <primitive object={beltMesh} />
      <mesh
        geometry={nodes.goggle_outer_frame_1.geometry}
        position={[-0.004, 0.172, 0.121]}
        rotation={[Math.PI / 2, 0, 1.636]}
        scale={0.93}
      >
        <meshStandardMaterial 
          color="#00FFDE"
          emissive="#FFF7D1" 
          emissiveIntensity={1.5} // Reduced emissive intensity
          metalness={0.6} // Reduced metalness
          roughness={0.2} // Increased roughness
        />
      </mesh>

    </group>
  )
}

export const Model = GenieOne

useGLTF.preload('/assets/models/genie_go.gltf')
