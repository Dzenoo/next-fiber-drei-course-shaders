"use client";

import Patterns from "@/components/patterns/Patterns";
import Raging from "@/components/raging/Raging";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <Canvas flat camera={{ position: [1, 1, 1] }}>
      <OrbitControls enableDamping />
      <Raging />
    </Canvas>
  );
}
