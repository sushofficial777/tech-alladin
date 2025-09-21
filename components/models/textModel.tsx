'use client'
import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import gsap from 'gsap';

export default function InteractiveText({text, index} : {text:string, index:number}) {
  const containerRef = useRef<any>(null);
  const { mouse } = useThree();
  const [currentText, setCurrentText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);
  
  // Create animatable properties for each character
  const charAnimProps = useRef<Array<{
    scale: number;
    rotationY: number;
    opacity: number;
    y: number;
  }>>([]);

  // Initialize character animation properties
  useEffect(() => {
    const chars = text.split('');
    charAnimProps.current = chars.map(() => ({
      scale: 1,
      rotationY: 0,
      opacity: 1,
      y: 0
    }));
  }, [text]);

  // Handle index changes - smooth split text animation
  useEffect(() => {
    if (index !== currentIndex && !isAnimating) {
      setIsAnimating(true);
      
      // Change text immediately
      setCurrentText(text);
      setCurrentIndex(index);
      
      // Reset all characters to initial state
      const chars = text.split('');
      charAnimProps.current = chars.map(() => ({
        scale: 0,
        rotationY: -Math.PI * 0.5, // Reduced rotation for smoother look
        opacity: 0,
        y: -1 // Reduced distance for smoother movement
      }));
      
      // Animate each character with minimal stagger for smoothness
      chars.forEach((_, i) => {
        gsap.to(charAnimProps.current[i], {
          scale: 1,
          rotationY: 0,
          opacity: 1,
          y: 0,
          duration: 0.4, // Faster duration
          ease: "power3.out", // Smoother easing
          delay: i * 0.03, // Much smaller stagger for fluid motion
          onComplete: i === chars.length - 1 ? () => {
            // Smooth transition to floating state
            setTimeout(() => setIsAnimating(false), 50);
          } : undefined
        });
      });
    }
  }, [index, text, currentIndex, isAnimating]);

  // Initial appearance animation with smooth split text
  useEffect(() => {
    const chars = text.split('');
    charAnimProps.current = chars.map(() => ({
      scale: 0,
      rotationY: -Math.PI * 0.5,
      opacity: 0,
      y: -1
    }));
    
    chars.forEach((_, i) => {
      gsap.to(charAnimProps.current[i], {
        scale: 1,
        rotationY: 0,
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.1 + (i * 0.05) // Smoother initial stagger
      });
    });
  }, []);

  useFrame(() => {
    if (containerRef.current) {
      // Apply animated properties to each character
      const chars = currentText.split('');
      chars.forEach((_, i) => {
        if (charAnimProps.current[i] && containerRef.current.children[i]) {
          const child = containerRef.current.children[i];
          child.scale.setScalar(charAnimProps.current[i].scale);
          child.rotation.y = charAnimProps.current[i].rotationY;
          child.material.opacity = charAnimProps.current[i].opacity;
          
          // Always apply Y position from animation props for consistency
          child.position.y = charAnimProps.current[i].y;
        }
      });
      
      // Smooth tilt effect based on cursor position (always active)
      const targetRotationX = mouse.y * 0.1;
      const targetRotationY = mouse.x * 0.1;
      
      // Smooth interpolation for natural movement
      containerRef.current.rotation.x += (targetRotationX - containerRef.current.rotation.x) * 0.08;
      containerRef.current.rotation.y += (targetRotationY - containerRef.current.rotation.y) * 0.08;
      
      // Subtle floating animation - apply to container
      containerRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <group ref={containerRef}>
      {currentText.split('').map((char, i) => (
        <Text
          key={`${char}-${i}-${currentIndex}`}
          fontSize={2}
          font="/fonts/Jost-VariableFont_wght.ttf"
          fontWeight='bold'
          anchorX="center"
          anchorY="middle"
          position={[
            (i - (currentText.length - 1) / 2) * 1.3, // Spread characters horizontally
            0, 
            -5
          ]}
          color="#ffffff"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {char}
        </Text>
      ))}
    </group>
  );
}
