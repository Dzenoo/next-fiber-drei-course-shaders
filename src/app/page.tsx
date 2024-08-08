"use client";

import AnimatedGalaxy from "@/components/animated-galaxy/AnimatedGalaxy";
import CoffeSmoke from "@/components/coffe-smoke/CoffeSmoke";
import Hologram from "@/components/hologram/Hologram";
import Patterns from "@/components/patterns/Patterns";
import Raging from "@/components/raging/Raging";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <Canvas flat camera={{ position: [8, 10, 12] }}>
      <OrbitControls enableDamping />
      <Hologram />
    </Canvas>
  );
}
