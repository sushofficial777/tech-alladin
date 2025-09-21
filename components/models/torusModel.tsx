import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import * as THREE from 'three';
import { useControls } from 'leva';
import { MeshTransmissionMaterial } from '@react-three/drei';


type GLTFResult = GLTF & {
  nodes: {
    Torus002: THREE.Mesh
  }
}

export function TorusModel() {

  const { nodes } = useGLTF('/assets/models/torus.glb') as unknown as GLTFResult

  // leva Implementations

  const materialProps = useControls({
    thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 3, step: 0.1 },
    transmission: { value: 1, min: 0, max: 3, step: 0.1 },
    ior: { value: 0.9, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.02, min: 0, max: 1 },
    backSide: { value: true }
  })


  return (
    <group  position={[0,-.7,0]}  dispose={null} >
      <mesh
          {...nodes.Torus002}
      >
        <MeshTransmissionMaterial {...materialProps}  />

      </mesh>

    </group>
  )
}

export const Model = TorusModel

useGLTF.preload('/assets/models/torus.glb')
