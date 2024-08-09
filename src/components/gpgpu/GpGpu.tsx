"use client";
import React, { useEffect, useRef } from "react";
import gpgpuParticlesShader from "./gpgpu/particles.glsl";
import particlesVertexShader from "./particles/vertex.glsl";
import particlesFragmentShader from "./particles/fragment.glsl";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GPUComputationRenderer } from "three/examples/jsm/Addons.js";
import { useFrame, useThree } from "@react-three/fiber";

const GpGpu: React.FC = () => {
  const particles = useRef<any>({});
  const gpgpu = useRef<any>({});
  const { scene, size: sizes, gl } = useThree();
  const gltf = useGLTF("./gpgpu-assets/model.glb") as any;

  useEffect(() => {
    const instance = gltf.scene.children[0].geometry;
    const count = instance.attributes.position.count;

    const size = Math.ceil(Math.sqrt(count));
    const computation = new GPUComputationRenderer(size, size, gl);

    const baseParticlesTexture = computation.createTexture();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i4 = i * 4;

      baseParticlesTexture.image.data[i4 + 0] =
        instance.attributes.position.array[i3 + 0];
      baseParticlesTexture.image.data[i4 + 1] =
        instance.attributes.position.array[i3 + 1];
      baseParticlesTexture.image.data[i4 + 2] =
        instance.attributes.position.array[i3 + 2];
      baseParticlesTexture.image.data[i4 + 3] = Math.random();
    }

    const particlesVariable = computation.addVariable(
      "uParticles",
      gpgpuParticlesShader,
      baseParticlesTexture
    );
    computation.setVariableDependencies(particlesVariable, [particlesVariable]);

    particlesVariable.material.uniforms.uTime = new THREE.Uniform(0);
    particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0);
    particlesVariable.material.uniforms.uBase = new THREE.Uniform(
      baseParticlesTexture
    );
    particlesVariable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(
      0.5
    );
    particlesVariable.material.uniforms.uFlowFieldStrength = new THREE.Uniform(
      2
    );
    particlesVariable.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(
      0.5
    );

    computation.init();

    const particlesUvArray = new Float32Array(count * 2);
    const sizesArray = new Float32Array(count);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = y * size + x;
        const i2 = i * 2;

        const uvX = (x + 0.5) / size;
        const uvY = (y + 0.5) / size;

        particlesUvArray[i2 + 0] = uvX;
        particlesUvArray[i2 + 1] = uvY;

        sizesArray[i] = Math.random();
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setDrawRange(0, count);
    geometry.setAttribute(
      "aParticlesUv",
      new THREE.BufferAttribute(particlesUvArray, 2)
    );
    geometry.setAttribute("aColor", instance.attributes.color);
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizesArray, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms: {
        uSize: new THREE.Uniform(0.07),
        uResolution: new THREE.Uniform(
          new THREE.Vector2(
            sizes.width * Math.min(window.devicePixelRatio, 2),
            sizes.height * Math.min(window.devicePixelRatio, 2)
          )
        ),
        uParticlesTexture: new THREE.Uniform(null),
      },
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    gpgpu.current = {
      size,
      computation,
      particlesVariable,
    };

    particles.current = {
      geometry,
      material,
      points,
    };
  }, []);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    gpgpu.current.particlesVariable.material.uniforms.uTime.value = elapsed;
    gpgpu.current.particlesVariable.material.uniforms.uDeltaTime.value = delta;
    gpgpu.current.computation.compute();
    particles.current.material.uniforms.uParticlesTexture.value =
      gpgpu.current.computation.getCurrentRenderTarget(
        gpgpu.current.particlesVariable
      ).texture;
  });

  return (
    <>
      <color args={["#29191f"]} attach="background" />
    </>
  );
};

export default GpGpu;
