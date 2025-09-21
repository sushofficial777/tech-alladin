import { useEffect, useMemo, useState } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

function detectDeviceType(width: number, isCoarsePointer: boolean): DeviceType {
  // Prefer width breakpoints with a hint from coarse pointer (touch devices)
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  // Fallback: if very large but coarse pointer, consider tablet
  if (isCoarsePointer && width < 1280) return "tablet";
  return "desktop";
}

export function useDeviceType() {
  const getState = () => {
    if (typeof window === "undefined") {
      return {
        type: "desktop" as DeviceType,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      };
    }

    const width = window.innerWidth;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    const type = detectDeviceType(width, coarse);
    return {
      type,
      isMobile: type === "mobile",
      isTablet: type === "tablet",
      isDesktop: type === "desktop",
    };
  };

  const [state, setState] = useState(getState);

  useEffect(() => {
    const onResize = () => setState(getState());
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  // Stable helpers to avoid re-renders when destructuring
  const result = useMemo(() => state, [state]);
  return result;
}

export default useDeviceType;


