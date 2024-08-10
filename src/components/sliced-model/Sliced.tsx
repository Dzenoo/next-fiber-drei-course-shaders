"use client";
import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { Environment, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const Sliced: React.FC = () => {
  const { scene } = useThree();
  const uniforms = useRef({
    uSliceStart: new THREE.Uniform(1.75),
    uSliceArc: new THREE.Uniform(1.25),
  });
  const { scene: modelScene } = useGLTF("./sliced-model-assets/gears.glb");

  useEffect(() => {
    if (!modelScene) return;

    const patchMap = {
      csm_Slice: {
        "#include <colorspace_fragment>": `
            #include <colorspace_fragment>

            if(!gl_FrontFacing)
                gl_FragColor = vec4(0.75, 0.15, 0.3, 1.0);
        `,
      },
    };

    const material = new THREE.MeshStandardMaterial({
      metalness: 0.5,
      roughness: 0.25,
      envMapIntensity: 0.5,
      color: "#858080",
    });

    const slicedMaterial = new CustomShaderMaterial({
      baseMaterial: THREE.MeshStandardMaterial,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms.current,
      patchMap: patchMap,
      silent: true,

      metalness: 0.5,
      roughness: 0.25,
      envMapIntensity: 0.5,
      color: "#858080",
      side: THREE.DoubleSide,
    });

    const slicedDepthMaterial = new CustomShaderMaterial({
      baseMaterial: THREE.MeshDepthMaterial,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms.current,
      patchMap: patchMap,
      silent: true,

      depthPacking: THREE.RGBADepthPacking,
    });

    modelScene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.name === "outerHull") {
          child.material = slicedMaterial;
          child.customDepthMaterial = slicedDepthMaterial;
        } else {
          child.material = material;
        }

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(modelScene);

    return () => {
      modelScene.traverse((child: any) => {
        if (child.isMesh) {
          child.geometry.dispose();
          if (child.material.isMaterial) {
            child.material.dispose();
          }
          if (child.customDepthMaterial) {
            child.customDepthMaterial.dispose();
          }
        }
      });
      scene.remove(modelScene);
    };
  }, [scene, modelScene]);

  return (
    <>
      <Environment preset="apartment" />
    </>
  );
};

export default Sliced;
