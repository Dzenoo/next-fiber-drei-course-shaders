"use client";
import React, { useEffect, useRef, useCallback } from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";

const AnimatedGalaxy: React.FC = () => {
  const pointsRef = useRef<THREE.Points | null>(null);
  const { scene, gl } = useThree();

  const parameters = useRef({
    count: 200000,
    size: 0.005,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.1,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
  }).current;

  const controls = useControls({
    Count: { value: parameters.count, min: 0, max: 200000 },
    Radius: { value: parameters.radius, min: 5, max: 10 },
    Branches: { value: parameters.branches, min: 3, max: 5 },
    Randomness: { value: parameters.randomness, min: 0.1, max: 0.5 },
    RandomnessPower: { value: parameters.randomnessPower, min: 1, max: 7 },
  });

  const generateGalaxy = useCallback(() => {
    if (pointsRef.current) {
      pointsRef.current.geometry.dispose();
      if (pointsRef.current.material instanceof THREE.Material) {
        pointsRef.current.material.dispose();
      } else {
        pointsRef.current.material.forEach((material: THREE.Material) =>
          material.dispose()
        );
      }
      scene.remove(pointsRef.current);
    }

    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(controls.Count * 3);
    const colors = new Float32Array(controls.Count * 3);
    const scales = new Float32Array(controls.Count);
    const randomness = new Float32Array(controls.Count * 3);

    const insideColor = new THREE.Color(parameters.insideColor);
    const outsideColor = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < controls.Count; i++) {
      const i3 = i * 3;

      const radius = Math.random() * controls.Radius;

      const branchAngle =
        ((i % controls.Branches) / controls.Branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), controls.RandomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        controls.Randomness *
        radius;
      const randomY =
        Math.pow(Math.random(), controls.RandomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        controls.Randomness *
        radius;
      const randomZ =
        Math.pow(Math.random(), controls.RandomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        controls.Randomness *
        radius;

      positions[i3] = Math.cos(branchAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle) * radius + randomZ;

      randomness[i3] = randomX;
      randomness[i3 + 1] = randomY;
      randomness[i3 + 2] = randomZ;

      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / controls.Radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      scales[i] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute(
      "aRandomness",
      new THREE.BufferAttribute(randomness, 3)
    );

    const material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 3 * gl.getPixelRatio() },
      },
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    pointsRef.current = points;
  }, [
    controls.Count,
    controls.Radius,
    controls.Branches,
    controls.Randomness,
    controls.RandomnessPower,
    parameters.insideColor,
    parameters.outsideColor,
    scene,
    gl,
  ]);

  useEffect(() => {
    generateGalaxy();
    return () => {
      if (pointsRef.current) {
        pointsRef.current.geometry.dispose();
        if (pointsRef.current.material instanceof THREE.Material) {
          pointsRef.current.material.dispose();
        } else {
          pointsRef.current.material.forEach((material: THREE.Material) =>
            material.dispose()
          );
        }
        scene.remove(pointsRef.current);
      }
    };
  }, [generateGalaxy]);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    if (pointsRef.current) {
      (
        pointsRef.current.material as THREE.ShaderMaterial
      ).uniforms.uTime.value = elapsedTime;
    }
  });

  return null;
};

export default AnimatedGalaxy;
