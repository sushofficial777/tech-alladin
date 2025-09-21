"use client";
import React, { useEffect, useRef } from "react";
import { engine, animate, utils } from 'animejs';

const ParticleAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const colors: string[] = ['#9D00FF', '#FFFFFF'];

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return; // safety check

    const { width, height } = container.getBoundingClientRect();


    for (let i = 0; i < 200; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      const randomIndex = Math.floor(Math.random() * colors.length);
      particle.classList.add(randomIndex === 0 ? "purple" : "white");

      console.log( width, height," width, height")
      // pick random start position inside parent dimensions
      const startX = utils.random(0, width, 1);
      const startY = utils.random(0, height, 1);

      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;

      animate(particle, {
        x: utils.random(-10, 10, 2) + "rem",
        y: utils.random(-10, 10, 2) + "rem",
        scale: [{ from: 0, to: 1 }, { to: 0 }],
        delay: utils.random(0, 1000),
        loop: true,
      });

      // Add the particle to the container
      container.appendChild(particle);
    }

    //engine
    engine.fps = 60
    engine.speed = .5
    // engine.precision = 1;

  }, []);

  return (
    <div className=" w-[400px] h-[500px] rounded-full relative flex   overflow-hidden justify-center mx-auto   " >
      <div ref={containerRef} className=" overflow-hidden h-full w-full absolute top-0  z-0 flex items-center justify-center  "></div>
    </div>
  );
};

export default ParticleAnimation;
