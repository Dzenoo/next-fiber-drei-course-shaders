"use client";

import Patterns from "@/components/patterns/Patterns";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <Canvas camera={{ position: [0.25, -0.25, 1] }}>
      <OrbitControls enableDamping />
      <Patterns />
    </Canvas>
  );
}
