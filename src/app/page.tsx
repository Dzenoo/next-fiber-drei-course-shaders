"use client";

import AnimatedGalaxy from "@/components/animated-galaxy/AnimatedGalaxy";
import CoffeSmoke from "@/components/coffe-smoke/CoffeSmoke";
import Earth from "@/components/earth/Earth";
import Fireworks from "@/components/fireworks/Fireworks";
import Hologram from "@/components/hologram/Hologram";
import LightsShading from "@/components/lights-shading/LightsShading";
import ParticlesCursor from "@/components/particles-cursor/ParticlesCursor";
import Patterns from "@/components/patterns/Patterns";
import Raging from "@/components/raging/Raging";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <Canvas gl={{ antialias: true }} camera={{ position: [0, 0, 7] }}>
      <OrbitControls enableDamping />
      <ParticlesCursor />
    </Canvas>
  );
}
