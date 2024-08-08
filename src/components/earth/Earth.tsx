"use client";
import React, { useRef } from "react";
import earthVertexShader from "./earth-shaders/vertex.glsl";
import earthFragmentShader from "./earth-shaders/fragment.glsl";
import atmosphereVertexShader from "./atmosphere-shaders/vertex.glsl";
import atmosphereFragmentShader from "./atmosphere-shaders/fragment.glsl";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Earth: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const earthDayTexture = useTexture("./earth-assets/earth/day.jpg");
  earthDayTexture.colorSpace = THREE.SRGBColorSpace;
  earthDayTexture.anisotropy = 8;
  const earthNightTexture = useTexture("./earth-assets/earth/night.jpg");
  earthNightTexture.anisotropy = 8;
  earthNightTexture.colorSpace = THREE.SRGBColorSpace;
  const earthSpecularCloudsTexture = useTexture(
    "./earth-assets/earth/specularClouds.jpg"
  );
  earthSpecularCloudsTexture.anisotropy = 8;
  earthSpecularCloudsTexture.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    const clock = state.clock.getElapsedTime();
    earthRef.current!.rotation.y = clock * 0.1;
  });

  return (
    <>
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          vertexShader={earthVertexShader}
          fragmentShader={earthFragmentShader}
          uniforms={{
            uDayTexture: new THREE.Uniform(earthDayTexture),
            uNightTexture: new THREE.Uniform(earthNightTexture),
            uSpecularCloudsTexture: new THREE.Uniform(
              earthSpecularCloudsTexture
            ),
            uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
            uAtmosphereDayColor: new THREE.Uniform(new THREE.Color("#00aaff")),
            uAtmosphereTwilightColor: new THREE.Uniform(
              new THREE.Color("#ff6600")
            ),
          }}
        />
      </mesh>
      <color args={["#1b1b1b"]} attach="background" />
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          transparent={true}
          side={THREE.BackSide}
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={{
            uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
            uAtmosphereDayColor: new THREE.Uniform(new THREE.Color("#00aaff")),
            uAtmosphereTwilightColor: new THREE.Uniform(
              new THREE.Color("#ff6600")
            ),
          }}
        />
      </mesh>
    </>
  );
};

export default Earth;
