"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Center,
  ContactShadows,
  PerformanceMonitor,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import CanvasLoader from "../CanvasLoader";
import { Leva, useControls } from "leva";
import * as THREE from "three";

export default function TrailerCanvas({
  children,
  shadowCounter,
}: {
  children: React.ReactNode;
  shadowCounter: number;
}) {
  const div = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const canvasElement = document.querySelector("#canvas-container");
    if (canvasElement) {
      observer.observe(canvasElement);
    }

    return () => {
      if (canvasElement) {
        observer.unobserve(canvasElement);
      }
    };
  }, []);

  let device = "low";

  // const t0 = performance.now();
  // // Render di una scena
  // const t1 = performance.now();

  // const frameTime = t1 - t0;

  // if (frameTime > 16.7) {
  //   // Bassa performance - riduci la risoluzione
  //   device = "low";
  // } else if (frameTime < 10) {
  //   // Alta performance - aumenta la risoluzione
  //   device = "high";
  // }

  // console.log(`Frame time: ${frameTime}ms, device: ${device}`);

  return (
    <div id="canvas-container" className="w-full h-full relative" ref={div}>
      {isVisible && (
        <Canvas
          // gl={{ logarithmicDepthBuffer: true, antialias: true }}
          dpr={0.4}
          shadows
          gl={{
            powerPreference: "high-performance", // Ottimizza per GPU performanti
            antialias: true, // Smoothing dei bordi
          }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <ContactShadows
              resolution={512}
              frames={1}
              position={[0, -4, 0]}
              scale={15}
              blur={1}
              opacity={0.2}
              far={20}
              key={shadowCounter}
            />
            <Center>{children}</Center>
          </Suspense>
          <Hangar />
          {/* <Environment preset="city" /> */}
          <ambientLight intensity={3.5} />
          {/* <directionalLight
            position={[10, 50, 10]}
            intensity={1}
          /> */}
          {/* <directionalLight
            position={[-10, 50, -10]}
            intensity={3.5}
          />
          <directionalLight
            position={[10, 50, 10]}
            intensity={3.5}
          /> */}
          <directionalLight
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
            position={[10, 50, 10]}
            intensity={3.5}
          />
          <Leva hidden />
          <PerformanceMonitor />
          <PerspectiveCamera position={[-20, 10, 40]} fov={50} makeDefault />
        </Canvas>
      )}
    </div>
  );
}

function Hangar() {
  const [colorMap, normalMap, roughnessMap, displacementMap] = useTexture([
    "/textures/wall6/Plaster003_1K-JPG_Color.jpg",
    "/textures/wall6/Plaster003_1K-JPG_NormalGL.jpg",
    "/textures/wall6/Plaster003_1K-JPG_Roughness.jpg",
    "/textures/wall6/Plaster003_1K-JPG_Displacement.jpg",
  ]); // Sostituisci con il percorso della tua texture
  const [
    wallColorMap,
    wallNormalMap,
    wallRoughnessMap,
    wallDisplacementMap,
    logoMap,
  ] = useTexture([
    "/textures/wall7/PavingStones126B_1K-JPG_Color.jpg",
    "/textures/wall7/PavingStones126B_1K-JPG_Roughness.jpg",
    "/textures/wall7/PavingStones126B_1K-JPG_NormalGL.jpg",
    "/textures/wall7/PavingStones126B_1K-JPG_Displacement.jpg",
    "/logo.png",
  ]); // Sostituisci con il percorso della tua texture

  // Ripeti la texture per un effetto più realistico
  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
  displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping;

  colorMap.repeat.set(10, 10);
  normalMap.repeat.set(10, 10);
  roughnessMap.repeat.set(10, 10);
  displacementMap.repeat.set(10, 10);

  wallColorMap.wrapS = wallColorMap.wrapT = THREE.RepeatWrapping;
  wallNormalMap.wrapS = wallNormalMap.wrapT = THREE.RepeatWrapping;
  wallRoughnessMap.wrapS = wallRoughnessMap.wrapT = THREE.RepeatWrapping;
  wallDisplacementMap.wrapS = wallDisplacementMap.wrapT = THREE.RepeatWrapping;

  wallColorMap.repeat.set(2, 1);
  wallNormalMap.repeat.set(2, 1);
  wallRoughnessMap.repeat.set(2, 1);
  wallDisplacementMap.repeat.set(2, 1);

  return (
    <>
      {/* Pavimento */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -4.11, 0]}
        receiveShadow
        frustumCulled={true}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          displacementMap={displacementMap}
          displacementScale={0.1}
        />
      </mesh>

      {/* Pareti */}
      <mesh position={[0, 16, -50]} receiveShadow frustumCulled={true}>
        <boxGeometry args={[100, 50, 0.1]} />
        <meshStandardMaterial
          map={wallColorMap}
          normalMap={wallNormalMap}
          roughnessMap={wallRoughnessMap}
          displacementMap={wallDisplacementMap}
          displacementScale={0.1}
        />
      </mesh>

      <mesh
        position={[-50, 16, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        frustumCulled={true}
      >
        <boxGeometry args={[100, 50, 0.1]} />
        <meshStandardMaterial
          map={wallColorMap}
          normalMap={wallNormalMap}
          roughnessMap={wallRoughnessMap}
          displacementMap={wallDisplacementMap}
          displacementScale={0.1}
        />
      </mesh>

      <mesh
        position={[50, 16, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        frustumCulled={true}
      >
        <boxGeometry args={[100, 50, 0.1]} />
        <meshStandardMaterial
          map={wallColorMap}
          normalMap={wallNormalMap}
          roughnessMap={wallRoughnessMap}
          displacementMap={wallDisplacementMap}
          displacementScale={0.1}
        />
      </mesh>

      <mesh position={[0, 16, 50]} receiveShadow frustumCulled={true}>
        <boxGeometry args={[100, 50, 0.1]} />
        <meshStandardMaterial
          map={wallColorMap}
          normalMap={wallNormalMap}
          roughnessMap={wallRoughnessMap}
          displacementMap={wallDisplacementMap}
          displacementScale={0.1}
        />
      </mesh>

      {/* Logo sulla parete posteriore */}
      {/* <mesh position={[0, 15, -49.7]} receiveShadow frustumCulled={true}>
        <planeGeometry args={[80, 30]} />
        <meshStandardMaterial map={logoMap} transparent />
      </mesh> */}

      {/* Logo sulla parete frontale */}
      {/* <mesh position={[0, 15, 49.7]} rotation={[0, Math.PI, 0]} receiveShadow frustumCulled={true}>
        <planeGeometry args={[80, 30]} />
        <meshStandardMaterial map={logoMap} transparent />
      </mesh> */}

      {/* Logo sulla parete destra */}
      <mesh
        position={[49.7, 12, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[75, 25]} />
        <meshStandardMaterial
          map={logoMap}
          transparent
          opacity={0.15}
          color={"black"}
        />
      </mesh>

      {/* Logo sulla parete sinistra */}
      <mesh
        position={[-49.7, 12, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[75, 25]} />
        <meshStandardMaterial
          map={logoMap}
          transparent
          opacity={0.15}
          color={"black"}
        />
      </mesh>
    </>
  );
}
