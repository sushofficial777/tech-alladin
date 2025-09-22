"use client";
import { useEffect, useState } from "react";

export function useCursorVelocity(): number {
  const [velocity, setVelocity] = useState<number>(0);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastTime = performance.now();

    function handleMove(e: MouseEvent) {
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dt = now - lastTime;

      if (dt > 0) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = dist / dt; // px per ms
        setVelocity(speed * 20); // amplify a bit
      }

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return velocity;
}
