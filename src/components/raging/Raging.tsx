"use client";
import React, { useRef } from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

const Raging: React.FC = () => {
  const uniforms = useRef({
    uTime: { value: 0 },

    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesElevation: { value: 0.3 },
    uBigWavesSpeed: { value: 0.75 },

    uDepthColor: { value: new THREE.Color("#9bd8ff") },
    uSurfaceColor: { value: new THREE.Color("blue") },

    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4.0 },
  }).current;

  const controls = useControls({
    BigWavesFrequencyX: {
      value: uniforms.uBigWavesFrequency.value.x,
      min: 0,
      max: 10,
    },
    BigWavesFrequencyY: {
      value: uniforms.uBigWavesFrequency.value.y,
      min: 0,
      max: 10,
    },
    BigWavesElevation: {
      value: uniforms.uBigWavesElevation.value,
      min: 0,
      max: 1,
    },
    BigWavesSpeed: { value: uniforms.uBigWavesSpeed.value, min: 0, max: 2 },

    ColorOffset: { value: uniforms.uColorOffset.value, min: 0, max: 1 },
    ColorMultiplier: {
      value: uniforms.uColorMultiplier.value,
      min: 1,
      max: 10,
    },

    SmallWavesElevation: {
      value: uniforms.uSmallWavesElevation.value,
      min: 0,
      max: 1,
    },
    SmallWavesFrequency: {
      value: uniforms.uSmallWavesFrequency.value,
      min: 0,
      max: 10,
    },
    SmallWavesSpeed: { value: uniforms.uSmallWavesSpeed.value, min: 0, max: 1 },
    SmallWavesIterations: {
      value: uniforms.uSmallWavesIterations.value,
      min: 1,
      max: 10,
    },
  });

  useFrame((state) => {
    const clock = state.clock.getElapsedTime();
    uniforms.uTime.value = clock;
    uniforms.uBigWavesFrequency.value.set(
      controls.BigWavesFrequencyX,
      controls.BigWavesFrequencyY
    );
    uniforms.uBigWavesElevation.value = controls.BigWavesElevation;
    uniforms.uBigWavesSpeed.value = controls.BigWavesSpeed;
    uniforms.uColorMultiplier.value = controls.ColorMultiplier;
    uniforms.uSmallWavesElevation.value = controls.SmallWavesElevation;
    uniforms.uSmallWavesFrequency.value = controls.SmallWavesFrequency;
    uniforms.uSmallWavesSpeed.value = controls.SmallWavesSpeed;
    uniforms.uSmallWavesIterations.value = controls.SmallWavesIterations;
  });

  return (
    <mesh rotation-x={-Math.PI * 0.5}>
      <planeGeometry args={[2, 2, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default Raging;
