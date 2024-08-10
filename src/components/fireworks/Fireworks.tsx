"use client";
import * as THREE from "three";
import React, { useEffect } from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import gsap from "gsap";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const Fireworks: React.FC = () => {
  const { scene, size: resolution } = useThree();
  const texture = useTexture("./fireworks-assets/1.png");

  const createFirework = (
    count: number,
    position: THREE.Vector3,
    size: number,
    texture: THREE.Texture,
    radius: number,
    color: any
  ) => {
    const positionsArray = new Float32Array(count * 3);
    const sizesArray = new Float32Array(count);
    const timeMultipliersArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const spherical = new THREE.Spherical(
        radius * (0.75 + Math.random() * 0.25),
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );

      const particlePosition = new THREE.Vector3();
      particlePosition.setFromSpherical(spherical);

      positionsArray[i3 + 0] = particlePosition.x;
      positionsArray[i3 + 1] = particlePosition.y;
      positionsArray[i3 + 2] = particlePosition.z;

      sizesArray[i] = Math.random();
      timeMultipliersArray[i] = 1 + Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positionsArray, 3)
    );
    geometry.setAttribute(
      "aSize",
      new THREE.Float32BufferAttribute(sizesArray, 1)
    );
    geometry.setAttribute(
      "aTimeMultiplier",
      new THREE.Float32BufferAttribute(timeMultipliersArray, 1)
    );

    texture.flipY = false;

    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uColor: { value: color },
        uTexture: { value: texture },
        uResolution: {
          value: new THREE.Vector2(resolution.width, resolution.height),
        },
        uSize: { value: size },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const fireworks = new THREE.Points(geometry, material);
    fireworks.position.copy(position);
    scene.add(fireworks);

    const destroy = () => {
      scene.remove(fireworks);
      geometry.dispose();
      material.dispose();
    };

    gsap.to(material.uniforms.uProgress, {
      value: 1,
      duration: 3,
      ease: "linear",
      onComplete: destroy,
    });
  };

  const createRandomFirework = () => {
    const count = Math.round(300 + Math.random() * 1000);
    const position = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random(),
      (Math.random() - 0.5) * 2
    );
    const size = 0.1 + Math.random() * 0.1;
    const radius = 0.6 + Math.random();
    const color = new THREE.Color();
    color.setHSL(Math.random(), 1, 0.7);

    createFirework(count, position, size, texture, radius, color);
  };

  useEffect(() => {
    createRandomFirework();
    document.addEventListener("click", createRandomFirework);

    return () => {
      document.removeEventListener("click", createRandomFirework);
    };
  }, []);

  return <color args={["#1b1b1b"]} attach="background"></color>;
};

export default Fireworks;
