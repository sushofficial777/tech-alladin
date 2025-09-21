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
    genie_body_3: THREE.Mesh
    belt_3: THREE.Mesh & { material: THREE.Material }
    goggle_left_mota_belt: THREE.Mesh
    goggle_outer_glass: THREE.Mesh
    goggle_inner_glass: THREE.Mesh
    goggle_right_mota_belt: THREE.Mesh
  }
  materials: {
    'Material_0.002': THREE.Material
    '02___Default': THREE.Material
    '03___Default': THREE.Material
    '02___Default.001': THREE.Material
  }
}

export function GenieThree(props: ModelProps) {

  const { nodes, materials } = useGLTF('/assets/models/model_genie_3.glb') as unknown as GLTFResult
  const { gradient, ...groupProps } = props;


  //

// Simplified gradient material - static colors instead of canvas texture
const outerGlass = useMemo(
  () =>
    new THREE.MeshStandardMaterial({
      color: "#00FFDE",
      metalness: 0.8,
      roughness: 0,
      emissive: new THREE.Color(0x00FFDE),
      emissiveIntensity: 1.2,
    }),
  []
);

// Clone your mesh and assign the new material
const outerGlassMeterial = useMemo(() => {
  const cloned = nodes.goggle_outer_glass.clone();
  cloned.material = outerGlass;
  return cloned;
}, [nodes.goggle_outer_glass, outerGlass]);


  //

  const innerGlass = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#333446",
    metalness: 0.5,
    roughness: .5
  }), []);

  const innerGlassMeterial = useMemo(() => {
    const cloned = nodes.goggle_inner_glass.clone();
    cloned.material = innerGlass;
    return cloned;
  }, [nodes.goggle_inner_glass, innerGlass]);

  //

  const leftMotaBelt = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#333446",
    metalness: 0.5,
    roughness: .5
  }), []);

  const leftMotaBeltMeterial = useMemo(() => {
    const cloned = nodes.goggle_left_mota_belt.clone();
    cloned.material = leftMotaBelt;
    return cloned;
  }, [nodes.goggle_left_mota_belt, leftMotaBelt]);


  //

  const rightMotaBelt = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#333446",
    metalness: 0.4,
    roughness: .5
  }), []);

  const rightMotaBeltMeterial = useMemo(() => {
    const cloned = nodes.goggle_right_mota_belt.clone();
    cloned.material = rightMotaBelt;
    return cloned;
  }, [nodes.goggle_right_mota_belt, rightMotaBelt]);

  //

  const belt = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#333446",
    metalness: 0.5,
    roughness: .5
  }), []);

  const beltMeterial = useMemo(() => {
    const cloned = nodes.belt_3.clone();
    cloned.material = belt;
    return cloned;
  }, [nodes.belt_3, belt]);


  // Static material props for better performance (removed useControls)
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
        {...nodes.genie_body_3}
      >
        <MeshTransmissionMaterial {...materialProps} />

      </mesh>

      <primitive object={beltMeterial} />
      <primitive object={leftMotaBeltMeterial} />
      <primitive object={rightMotaBeltMeterial} />
      <primitive object={outerGlassMeterial} />

      <primitive object={innerGlassMeterial} />

    </group>
  )
}

export const Model = GenieThree

useGLTF.preload('/assets/models/model_genie_3.glb')
