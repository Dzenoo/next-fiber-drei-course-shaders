"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

const ParticlesMorphing: React.FC = () => {
  const particles = useRef<any>({});
  const { scene, size } = useThree();
  const models = useGLTF("./particles-morphing-assets/models.glb");

  useEffect(() => {
    const index = 0;

    const positions = models.scene.children.map(
      (child: any) => child.geometry.attributes.position
    );

    let maxCount = 0;
    for (const position of positions) {
      if (position.count > maxCount) {
        maxCount = position.count;
      }
    }

    const positionsParticles = [];
    for (const position of positions) {
      const originalArray = position.array;
      const newArray = new Float32Array(maxCount * 3);

      for (let i = 0; i < maxCount; i++) {
        const i3 = i * 3;

        if (i3 < originalArray.length) {
          newArray[i3 + 0] = originalArray[i3 + 0];
          newArray[i3 + 1] = originalArray[i3 + 1];
          newArray[i3 + 2] = originalArray[i3 + 2];
        } else {
          const randomIndex = Math.floor(position.count * Math.random()) * 3;
          newArray[i3 + 0] = originalArray[randomIndex + 0];
          newArray[i3 + 1] = originalArray[randomIndex + 1];
          newArray[i3 + 2] = originalArray[randomIndex + 2];
        }
      }

      positionsParticles.push(new THREE.Float32BufferAttribute(newArray, 3));
    }

    const sizesArray = new Float32Array(maxCount);
    for (let i = 0; i < maxCount; i++) sizesArray[i] = Math.random();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", positionsParticles[index]);
    geometry.setAttribute("aPositionTarget", positionsParticles[3]);
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizesArray, 1));

    const colorA = "#ff7300";
    const colorB = "#0091ff";

    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uSize: new THREE.Uniform(0.4),
        uResolution: new THREE.Uniform(
          new THREE.Vector2(
            size.width * Math.min(window.devicePixelRatio, 2),
            size.height * Math.min(window.devicePixelRatio, 2)
          )
        ),
        uProgress: new THREE.Uniform(0),
        uColorA: new THREE.Uniform(new THREE.Color(colorA)),
        uColorB: new THREE.Uniform(new THREE.Color(colorB)),
      },
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    particles.current = {
      index,
      maxCount,
      positionsParticles,
      geometry,
      material,
    };

    return () => {
      // Clean up the points and scene
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, size, models]);

  const morph = (index: number) => {
    if (particles.current) {
      // Update the position and target attributes
      particles.current.geometry.setAttribute(
        "position",
        particles.current.positionsParticles[particles.current.index]
      );
      particles.current.geometry.setAttribute(
        "aPositionTarget",
        particles.current.positionsParticles[index]
      );
      particles.current.geometry.attributes.position.needsUpdate = true;
      particles.current.geometry.attributes.aPositionTarget.needsUpdate = true;

      // Animate the progress from 0 to 1
      gsap.fromTo(
        particles.current.material.uniforms.uProgress,
        { value: 0 },
        { value: 1, duration: 3, ease: "linear" }
      );

      particles.current.index = index;
    }
  };

  useEffect(() => {
    const handleClick = () => morph((particles.current.index + 1) % 4); // Cycle through targets
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return <color args={["#1b1b1b"]} attach="background" />;
};

export default ParticlesMorphing;
