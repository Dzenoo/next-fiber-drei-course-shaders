"use client";
import React, { useEffect, useRef } from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Hologram: React.FC = () => {
  const suzanne = useGLTF("./hologram-assets/suzanne.glb");
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    suzanne.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uColor: { value: new THREE.Color("#70c1ff") },
            uTime: { value: 0 },
          },
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        materialRef.current = child.material;
      }
    });
  }, [suzanne]);

  useFrame((state) => {
    const clock = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock;
    }
  });

  return (
    <>
      <primitive object={suzanne.scene} />
      <color args={["#1d1f2a"]} attach="background" />
    </>
  );
};

export default Hologram;
