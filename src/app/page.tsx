"use client";

import AnimatedGalaxy from "@/components/animated-galaxy/AnimatedGalaxy";
import CoffeSmoke from "@/components/coffe-smoke/CoffeSmoke";
import Earth from "@/components/earth/Earth";
import Fireworks from "@/components/fireworks/Fireworks";
import GpGpu from "@/components/gpgpu/GpGpu";
import Hologram from "@/components/hologram/Hologram";
import LightsShading from "@/components/lights-shading/LightsShading";
import ParticlesCursor from "@/components/particles-cursor/ParticlesCursor";
import ParticlesMorphing from "@/components/particles-morphing/ParticlesMorphing";
import Patterns from "@/components/patterns/Patterns";
import Raging from "@/components/raging/Raging";
import Sliced from "@/components/sliced-model/Sliced";
import Wobbly from "@/components/wobbly/Wobbly";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <Canvas gl={{ antialias: true }} camera={{ position: [4.5, 4, 11] }}>
      <OrbitControls enableDamping />
      <Sliced />
    </Canvas>
  );
}
