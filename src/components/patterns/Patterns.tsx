"use client";
import React from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import * as THREE from "three";

const Patterns: React.FC = () => {
  return (
    <mesh>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Patterns;
