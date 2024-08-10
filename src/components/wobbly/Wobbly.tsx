"use client";
import * as THREE from "three";
import React, { useRef } from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

const Wobbly: React.FC = () => {
  const { scene } = useThree();

  const uniforms = useRef<{
    uTime: THREE.Uniform<number>;
    uPositionFrequency: THREE.Uniform<number>;
    uTimeFrequency: THREE.Uniform<number>;
    uStrength: THREE.Uniform<number>;
    uWarpPositionFrequency: THREE.Uniform<number>;
    uWarpTimeFrequency: THREE.Uniform<number>;
    uWarpStrength: THREE.Uniform<number>;
    uColorA: THREE.Uniform<THREE.Color>;
    uColorB: THREE.Uniform<THREE.Color>;
  }>({
    uTime: new THREE.Uniform(0),
    uPositionFrequency: new THREE.Uniform(0.5),
    uTimeFrequency: new THREE.Uniform(0.4),
    uStrength: new THREE.Uniform(0.3),
    uWarpPositionFrequency: new THREE.Uniform(0.38),
    uWarpTimeFrequency: new THREE.Uniform(0.12),
    uWarpStrength: new THREE.Uniform(1.7),
    uColorA: new THREE.Uniform(new THREE.Color("#7300ff")),
    uColorB: new THREE.Uniform(new THREE.Color("#c800ff")),
  });

  React.useEffect(() => {
    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms.current,
      silent: true,

      metalness: 0,
      roughness: 0.5,
      color: "#ffffff",
      transmission: 0,
      ior: 1.5,
      thickness: 1.5,
      transparent: true,
      wireframe: false,
    });

    const depthMaterial = new CustomShaderMaterial({
      baseMaterial: THREE.MeshDepthMaterial,
      vertexShader: vertexShader,
      uniforms: uniforms.current,
      silent: true,

      depthPacking: THREE.RGBADepthPacking,
    });

    let geometry: any = new THREE.IcosahedronGeometry(2.5, 20);
    geometry = mergeVertices(geometry);
    geometry.computeTangents();

    const wobble = new THREE.Mesh(geometry, material);
    wobble.customDepthMaterial = depthMaterial;
    scene.add(wobble);
  }, [scene]);

  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <>
      <directionalLight
        position={[0.25, 2, -2.25]}
        intensity={3}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={15}
        shadow-normalBias={0.05}
      />
      <Environment preset="apartment" />
    </>
  );
};

export default Wobbly;
