import * as THREE from 'three';

export type GradientBodyMaterialParams = {
  geometry: THREE.BufferGeometry;
  color1?: THREE.ColorRepresentation;
  color2?: THREE.ColorRepresentation;
  color3?: THREE.ColorRepresentation;
  metalness?: number;
  roughness?: number;
};

export function createGradientBodyMaterial({
  geometry,
  color1 = '#9DAAFF',
  color2 = '#a8b7f0',
  color3 = '#74bbe2',
  metalness = 0.05,
  roughness = 0.45,
}: GradientBodyMaterialParams): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({ metalness, roughness });

  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox ?? new THREE.Box3(
    new THREE.Vector3(-1, -1, -1),
    new THREE.Vector3(1, 1, 1)
  );
  const minY = bbox.min.y;
  const maxY = bbox.max.y;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.color1 = { value: new THREE.Color(color1) } as any;
    shader.uniforms.color2 = { value: new THREE.Color(color2) } as any;
    shader.uniforms.color3 = { value: new THREE.Color(color3) } as any;
    shader.uniforms.minY = { value: minY } as any;
    shader.uniforms.maxY = { value: maxY } as any;

    shader.vertexShader = shader.vertexShader.replace(
      `#include <common>`,
      `\n#include <common>\n\tvarying float vY;\n`
    );

    shader.vertexShader = shader.vertexShader.replace(
      `#include <begin_vertex>`,
      `\n#include <begin_vertex>\n\tvY = position.y;\n`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <common>`,
      `\n#include <common>\n\tvarying float vY;\n\tuniform vec3 color1;\n\tuniform vec3 color2;\n\tuniform vec3 color3;\n\tuniform float minY;\n\tuniform float maxY;\n`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `\nfloat t = 0.0;\nfloat denom = max(maxY - minY, 1e-6);\nt = clamp((vY - minY) / denom, 0.0, 1.0);\nvec3 gradColor;\nif (t < 0.5) {\n\tfloat f = smoothstep(0.0, 0.5, t);\n\tgradColor = mix(color1, color2, f);\n} else {\n\tfloat f = smoothstep(0.6, 1.0, t);\n\tgradColor = mix(color2, color3, f);\n}\nvec4 diffuseColor = vec4(gradColor, opacity);\n`
    );
  };

  material.needsUpdate = true;
  return material;
}


