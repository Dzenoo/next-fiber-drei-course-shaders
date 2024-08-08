"use client";
import React, { useRef } from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const CoffeSmoke: React.FC = () => {
  const coffe = useGLTF("./coffe-assets/coffe.glb");
  const perlin = useTexture("./coffe-assets/perlin.png");
  perlin.wrapS = THREE.RepeatWrapping;
  perlin.wrapT = THREE.RepeatWrapping;

  const uniforms = useRef({
    uTime: new THREE.Uniform(0),
    uPerlinTexture: new THREE.Uniform(perlin),
  }).current;

  useFrame((state) => {
    const clock = state.clock.getElapsedTime();
    uniforms.uTime.value = clock;
  });

  return (
    <>
      <primitive object={coffe.scene} />
      <mesh position-y={1.83} scale={[1.5, 6, 1.5]}>
        <planeGeometry args={[1, 1, 16, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={THREE.DoubleSide}
          transparent={true}
          depthWrite={true}
        />
      </mesh>
    </>
  );
};

export default CoffeSmoke;
