import React, { useMemo } from 'react'
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import type { GLTF } from 'three-stdlib'
import * as THREE from 'three';

type Props = ThreeElements['group']
type ModelProps = Props & {
  gradient?: {
    color1?: THREE.ColorRepresentation;
    color2?: THREE.ColorRepresentation;
    color3?: THREE.ColorRepresentation;
    metalness?: number;
    roughness?: number;
  }
}

type GLTFResult = GLTF & {
  nodes: {
    genie_body_2: THREE.Mesh
    cap_2: THREE.Mesh
    goggle_outer_frame_2: THREE.Mesh
    goggle_outer_glass_2: THREE.Mesh
    headphone_2: THREE.Mesh
  }
  materials: {
    'Material_0.001': THREE.Material
    Material: THREE.Material
    Background: THREE.Material
    Lense: THREE.Material
    'headset.003': THREE.Material
  }
}

export function GenieTwo(props: ModelProps) {
  const { nodes, materials } = useGLTF('/assets/models/model_genie_2.glb') as unknown as GLTFResult
  const { gradient, ...groupProps } = props;

  // Simplified materials for better performance
  const frameGlassMeterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#000",
    metalness: 0.8,
    roughness: 0
  }), []);

  const outerGlassMeterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#000",
    metalness: 0.8,
    roughness: 0
  }), []);

  const headPhone = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#74BCE3",
    metalness: 0.1,
    roughness: 0.3
  }), []);

  const CapMeterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#74BCE3",
    metalness: 0.3,
    roughness: 0.4
  }), []);

  // Simplified material props without useControls for better performance
  const materialProps = useMemo(() => ({
    thickness: 0.2,
    roughness: 0,
    transmission: 1,
    ior: 1.2,
    chromaticAberration: 0.02,
    backSide: true
  }), []);



  return (
    <group {...groupProps} dispose={null} userData={{ tag: "genie" }}>
      <mesh
        {...nodes.genie_body_2}
      >
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
      <mesh {...nodes.cap_2}
        material={CapMeterial}
        position={[0.013, 0.332, 0.018]}
        rotation={[1.426, 0.331, -0.697]}
        scale={0.016}

      >
        <MeshTransmissionMaterial
          color={'#A3D8FF'}
          thickness={3.00}
          roughness={0.1}
          transmission={1}
          ior={1.2}
          chromaticAberration={0.02}
          backside={true}
        />

      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.goggle_outer_frame_2.geometry}
        material={frameGlassMeterial}
        position={[0, 0.123, 0.139]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={1.695}
      />
      <mesh
        geometry={nodes.goggle_outer_glass_2.geometry}
        position={[0, 0.123, 0.139]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={1.695}
      >
        <meshStandardMaterial 
          color="#00FFDE"
          emissive="#FFF7D1" 
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      <mesh {...nodes.headphone_2}
        position={[0.012, 0.241, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.413}
      >
        <MeshTransmissionMaterial
          thickness={3.00}
          roughness={0.1}
          transmission={1}
          ior={1.2}
          chromaticAberration={0.02}
          backside={true}
        />

      </mesh>
    </group>
  )
}

export const Model = GenieTwo

useGLTF.preload('/assets/models/model_genie_2.glb')
