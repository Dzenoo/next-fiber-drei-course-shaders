"use client";
import * as THREE from "three";
import React from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

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
