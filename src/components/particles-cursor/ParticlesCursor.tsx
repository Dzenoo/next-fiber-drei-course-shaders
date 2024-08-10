"use client";
import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

const ParticlesCursor: React.FC = () => {
  const picture = useTexture("./particles-cursor-assets/picture-1.png");
  const displacement = useRef<any>({});
  const uniforms = useMemo(
    () => ({
      uDisplacementTexture: { value: null },
      uPictureTexture: { value: picture },
      uResolution: { value: new THREE.Vector2() },
    }),
    [picture]
  );
  const { camera, scene, size } = useThree();

  useEffect(() => {
    const handleResize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      uniforms.uResolution.value.set(
        window.innerWidth * pixelRatio,
        window.innerHeight * pixelRatio
      );
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const canvas = document.createElement("canvas");
    canvas.style.width = "256px";
    canvas.style.height = "256px";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "10";
    canvas.width = 128;
    canvas.height = 128;
    document.body.append(canvas);

    const context = canvas.getContext("2d");
    context?.fillRect(0, 0, canvas.width, canvas.height);

    const glowImage = new Image();
    glowImage.src = "./particles-cursor-assets/glow.png";

    const interactivePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: "red" })
    );
    interactivePlane.visible = false;
    scene.add(interactivePlane);

    const raycaster = new THREE.Raycaster();
    const screenCursor = new THREE.Vector2(9999, 9999);
    const canvasCursor = new THREE.Vector2(9999, 9999);
    const canvasCursorPrevious = new THREE.Vector2(9999, 9999);

    window.addEventListener("pointermove", (event) => {
      screenCursor.x = (event.clientX / size.width) * 2 - 1;
      screenCursor.y = -(event.clientY / size.height) * 2 + 1;
    });

    const texture = new THREE.CanvasTexture(canvas);
    uniforms.uDisplacementTexture.value = texture as any;

    const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);
    particlesGeometry.setIndex(null);
    particlesGeometry.deleteAttribute("normal");

    const intensitiesArray = new Float32Array(
      particlesGeometry.attributes.position.count
    );

    const anglesArray = new Float32Array(
      particlesGeometry.attributes.position.count
    );

    for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
      intensitiesArray[i] = Math.random();
      anglesArray[i] = Math.random() * Math.PI * 2;
    }

    particlesGeometry.setAttribute(
      "aIntensity",
      new THREE.BufferAttribute(intensitiesArray, 1)
    );

    particlesGeometry.setAttribute(
      "aAngle",
      new THREE.BufferAttribute(anglesArray, 1)
    );

    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    displacement.current = {
      canvas,
      context,
      glowImage,
      interactivePlane,
      raycaster,
      screenCursor,
      canvasCursor,
      canvasCursorPrevious,
      texture,
    };

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.remove();
    };
  }, [size, camera]);

  useFrame(() => {
    displacement.current.raycaster.setFromCamera(
      displacement.current.screenCursor,
      camera
    );
    const intersections = displacement.current.raycaster.intersectObject(
      displacement.current.interactivePlane
    );

    if (intersections.length) {
      const uv = intersections[0].uv;

      displacement.current.canvasCursor.x =
        uv.x * displacement.current.canvas.width;
      displacement.current.canvasCursor.y =
        (1 - uv.y) * displacement.current.canvas.height;
    }

    displacement.current.context.globalCompositeOperation = "source-over";
    displacement.current.context.globalAlpha = 0.02;
    displacement.current.context.fillRect(
      0,
      0,
      displacement.current.canvas.width,
      displacement.current.canvas.height
    );

    const cursorDistance = displacement.current.canvasCursorPrevious.distanceTo(
      displacement.current.canvasCursor
    );
    displacement.current.canvasCursorPrevious.copy(
      displacement.current.canvasCursor
    );
    const alpha = Math.min(cursorDistance * 0.05, 1);

    const glowSize = displacement.current.canvas.width * 0.25;
    displacement.current.context.globalCompositeOperation = "lighten";
    displacement.current.context.globalAlpha = alpha;
    displacement.current.context.drawImage(
      displacement.current.glowImage,
      displacement.current.canvasCursor.x - glowSize * 0.5,
      displacement.current.canvasCursor.y - glowSize * 0.5,
      glowSize,
      glowSize
    );

    displacement.current.texture.needsUpdate = true;
  });

  return (
    <>
      <color args={["#181818"]} attach="background" />
    </>
  );
};

export default ParticlesCursor;
