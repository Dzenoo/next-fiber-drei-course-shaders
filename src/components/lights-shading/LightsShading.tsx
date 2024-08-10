"use client";
import * as THREE from "three";
import React from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

const LightsShading: React.FC = () => {
  return (
    <mesh>
      <sphereGeometry />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uColor: new THREE.Uniform(new THREE.Color("#ffffff")),
        }}
      />
    </mesh>
  );
};

export default LightsShading;
