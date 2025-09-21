"use client";

import React, { useEffect, useRef, useState, useMemo, Suspense, lazy } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Bounds, Center, Environment, OrbitControls, Text } from "@react-three/drei";
import gsap from "gsap";
import { GenieOne, GenieTwo, GenieThree } from "@/components/models";
import useDeviceType from "@/components/hooks/useDeviceType";
import InteractiveText from "../models/textModel";

// Lazy load the text component for better performance
const LazyInteractiveText = lazy(() => import("../models/textModel"));
const models = [GenieOne, GenieThree, GenieTwo];


const CyclingModel: React.FC<{ index: number; rotationY: number; scale?: number }> = React.memo(({
  index,
  rotationY,
  scale = 3,
}) => {
  const groupRef = useRef<any>('');
  const lastRotationY = useRef(rotationY);

  // Optimized rotation update - only when rotation actually changes
  useFrame(() => {
    if (groupRef.current && lastRotationY.current !== rotationY) {
      groupRef.current.rotation.y = rotationY;
      lastRotationY.current = rotationY;
    }
  });

  const Model = models[index];
  return (
    <Bounds clip observe margin={0.5}> {/* Reduced margin for better performance */}
      <Center disableZ>
        <group ref={groupRef} scale={scale}>
          <Model />
        </group>
      </Center>
    </Bounds>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return prevProps.index === nextProps.index && 
         prevProps.rotationY === nextProps.rotationY && 
         prevProps.scale === nextProps.scale;
});

const RenderModels: React.FC = React.memo(() => {
  const { isMobile } = useDeviceType();
  const [index, setIndex] = useState(0);
  const rotationY = useRef(0); // tracked rotation value
  const [rotationValue, setRotationValue] = useState(0); // react state to trigger re-renders
  const leftSpotRef = useRef<THREE.SpotLight | null>(null);
  const rightSpotRef = useRef<THREE.SpotLight | null>(null);
  const lightTargetRef = useRef<THREE.Object3D | null>(null);
  
  // Performance monitoring
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  const texts = useMemo(() => ['DESIGN', 'DEPLOY', 'DEVELOP'], []);
  useEffect(() => {
    const runCycle = () => {
      // Step 1: Slow anticlockwise 90° - reduced duration for better performance
      gsap.to(rotationY, {
        current: rotationY.current - Math.PI / 2,
        duration: 2.5, // Reduced from 3
        ease: "power3.in",
        onUpdate: () => setRotationValue(rotationY.current),
        onComplete: () => {
          // Step 2: Apply blur + fade while spinning fast
          gsap.to(rotationY, {
            current: rotationY.current - Math.PI * 1.5, // 540° spin (fast)
            duration: 0.25, // Reduced from 0.3
            ease: "power4.out",
            onUpdate: () => setRotationValue(rotationY.current),
            onStart: () => {
              // Blur + fade out - reduced blur for better performance
              gsap.to(".genie", {
                filter: "blur(20px)", // Reduced from 26px
                opacity: 0.2,
                duration: 0.25, // Reduced from 0.3
                ease: "power2.in",
              });

              // ✅ cycle: 0 → 1 → 2 → 0 …
              setIndex((prev) => (prev + 1) % models.length);
            },
            onComplete: () => {
              // Fade new model back in
              gsap.to(".genie", {
                filter: "blur(0px)",
                opacity: 1,
                duration: 0.25, // Reduced from 0.3
                ease: "power4.out",
              });

              // ✅ Reset rotation to front view (0 rad)
              rotationY.current = 0;
              setRotationValue(0);

              // Loop again
              runCycle();
            }
          });
        }
      });
    };

    runCycle();
  }, [models.length]);


  // Ensure spotlights always point to the character at the origin
  useEffect(() => {
    if (leftSpotRef.current && lightTargetRef.current) {
      leftSpotRef.current.target = lightTargetRef.current;
      leftSpotRef.current.target.updateMatrixWorld();
    }
    if (rightSpotRef.current && lightTargetRef.current) {
      rightSpotRef.current.target = lightTargetRef.current;
      rightSpotRef.current.target.updateMatrixWorld();
    }
  }, []);


  const modelScale = useMemo(() => isMobile ? 2.8 : 3, [isMobile]);
  const cameraFov = useMemo(() => isMobile ? 55 : 45, [isMobile]);
  const cameraZ = useMemo(() => isMobile ? 4.6 : 4.1, [isMobile]);
  
  // Performance monitoring effect
  useEffect(() => {
    const monitorPerformance = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        if (fps < 30) {
          console.warn(`Low FPS detected: ${fps}. Consider reducing quality settings.`);
        }
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      requestAnimationFrame(monitorPerformance);
    };
    
    monitorPerformance();
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas
        camera={{ position: [-.5, 0, cameraZ], fov: cameraFov }}
        shadows
        style={{ touchAction: isMobile ? "pan-y" : "none" }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[3, 5, 4]} intensity={0.4} castShadow />
        {/* Optimized neon spotlights - reduced intensity and complexity */}
        <spotLight
          ref={leftSpotRef}
          color="#00ffff"
          intensity={6} // Reduced from 8
          angle={Math.PI / 6} // Slightly wider angle
          penumbra={0.2} // Reduced penumbra
          distance={20} // Reduced distance
          decay={1.2} // Reduced decay
          position={[-5, 2.5, 3]}
          castShadow
        />
        <spotLight
          ref={rightSpotRef}
          color="#ff00ff"
          intensity={6} // Reduced from 8
          angle={Math.PI / 6} // Slightly wider angle
          penumbra={0.2} // Reduced penumbra
          distance={20} // Reduced distance
          decay={1.2} // Reduced decay
          position={[5, 2.5, 3]}
          castShadow
        />
        {/* Additional rim lights for neon glow */}

        {/* Target object at the character's position */}
        <object3D ref={lightTargetRef} position={[0, 0, 0]} />
        <React.Suspense fallback={null}>
          <CyclingModel index={index} rotationY={rotationValue} scale={modelScale} />


          {/* Optimized Text Model with lazy loading */}
          <Billboard >
            <Suspense fallback={null}>
              <InteractiveText index={index} text={texts[index]} />
            </Suspense>
          </Billboard>

          {/* Torus Model */}
          {/* <TorusModel/> */}

          <Environment preset="city" background={false} /> {/* Disabled background for better performance */}
        </React.Suspense>
        <OrbitControls
          enabled={!isMobile}
          enableRotate={false}
          enableZoom={false}
          target={[0, 0, 0]}
          maxPolarAngle={2}
          makeDefault
        />
      </Canvas>
    </div>
  );
});

export default RenderModels;
