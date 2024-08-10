"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <Canvas gl={{ antialias: true }}>
      <OrbitControls enableDamping />
    </Canvas>
  );
}
