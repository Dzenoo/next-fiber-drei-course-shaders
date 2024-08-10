"use client";
import React, { useEffect, useRef } from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { Environment } from "@react-three/drei";

const Procedural: React.FC = () => {
  const { scene } = useThree();

  const uniforms = useRef<{
    uTime: THREE.Uniform<number>;
    uPositionFrequency: THREE.Uniform<number>;
    uStrength: THREE.Uniform<number>;
    uWarpFrequency: THREE.Uniform<number>;
    uWarpStrength: THREE.Uniform<number>;
    uColorWaterDeep: THREE.Uniform<THREE.Color>;
    uColorWaterSurface: THREE.Uniform<THREE.Color>;
    uColorSand: THREE.Uniform<THREE.Color>;
    uColorGrass: THREE.Uniform<THREE.Color>;
    uColorSnow: THREE.Uniform<THREE.Color>;
    uColorRock: THREE.Uniform<THREE.Color>;
  }>({
    uTime: new THREE.Uniform(0),
    uPositionFrequency: new THREE.Uniform(0.2),
    uStrength: new THREE.Uniform(2.0),
    uWarpFrequency: new THREE.Uniform(5),
    uWarpStrength: new THREE.Uniform(0.5),
    uColorWaterDeep: new THREE.Uniform(new THREE.Color("#002b3d")),
    uColorWaterSurface: new THREE.Uniform(new THREE.Color("#66a8ff")),
    uColorSand: new THREE.Uniform(new THREE.Color("#ffe894")),
    uColorGrass: new THREE.Uniform(new THREE.Color("#85d534")),
    uColorSnow: new THREE.Uniform(new THREE.Color("#ffffff")),
    uColorRock: new THREE.Uniform(new THREE.Color("#bfbd8d")),
  });

  useEffect(() => {
    const geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
    geometry.deleteAttribute("uv");
    geometry.deleteAttribute("normal");
    geometry.rotateX(-Math.PI * 0.5);

    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshStandardMaterial,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms.current,
      silent: true,

      metalness: 0,
      roughness: 0.5,
      color: "#85d534",
    });

    const depthMaterial = new CustomShaderMaterial({
      baseMaterial: THREE.MeshDepthMaterial,
      vertexShader: vertexShader,
      uniforms: uniforms.current,
      silent: true,
      depthPacking: THREE.RGBADepthPacking,
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.customDepthMaterial = depthMaterial;
    terrain.receiveShadow = true;
    terrain.castShadow = true;
    scene.add(terrain);

    const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11));
    const boardHole = new Brush(new THREE.BoxGeometry(10, 2.1, 10));

    const evaluator = new Evaluator();
    const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION);
    board.geometry.clearGroups();
    board.material = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      metalness: 0,
      roughness: 0.3,
    });
    board.castShadow = true;
    board.receiveShadow = true;
    scene.add(board);

    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 1, 1),
      new THREE.MeshPhysicalMaterial({
        transmission: 1,
        roughness: 0.3,
      })
    );
    water.rotation.x = -Math.PI * 0.5;
    water.position.y = -0.1;
    water.receiveShadow = true;
    scene.add(water);

    return () => {
      geometry.dispose();
      material.dispose();
      depthMaterial.dispose();
      board.geometry.dispose();
      water.geometry.dispose();
      water.material.dispose();
      scene.remove(terrain);
      scene.remove(board);
      scene.remove(water);
    };
  }, [scene]);

  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <>
      <Environment preset="apartment" />
    </>
  );
};

export default Procedural;
