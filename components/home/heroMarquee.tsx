import React, { useEffect } from "react";
import { gsap } from "gsap";

interface MarqueeSection {
  text: string;
  logo: string;
  logoStyle: string;
  gradient: string;
}

export function HeroMarquee({}) {
  const marqueeSections: MarqueeSection[] = [
    {
      text: "Helping to provide telecom for the whole planet",
      logo: "telfoni",
      logoStyle: "text-[#00FF41] font-bold text-2xl",
      gradient: "from-purple-900 to-purple-800"
    },
    {
      text: "\"The brand is getting the attention we needed\"",
      logo: "Фонд президента України",
      logoStyle: "text-[#00FF41] font-bold text-lg",
      gradient: "from-purple-800 to-purple-600"
    },
    {
      text: "\"Now, our website showcases our brand at a new level\"",
      logo: "MKA",
      logoStyle: "text-[#00FF41] font-bold text-2xl",
      gradient: "from-purple-600 to-gray-400"
    },
    {
      text: "Scaling new brand visuals, even seen on Times Square",
      logo: "LURKIT",
      logoStyle: "text-[#00FF41] font-bold text-xl",
      gradient: "from-gray-400 to-purple-800"
    },
    {
      text: "Supporting a company from the Fortune 1000 list",
      logo: "TRANSPOREON",
      logoStyle: "text-[#00FF41] font-bold text-lg",
      gradient: "from-purple-800 to-purple-900"
    },
    {
      text: "Giving a fresh look service brand",
      logo: "BITTER SWEET CARS",
      logoStyle: "text-[#00FF41] font-bold text-sm",
      gradient: "from-purple-900 to-purple-800"
    }
  ];

  useEffect(() => {
    const rollingElement = document.querySelector(".rollingText") as HTMLElement;
    if (!rollingElement) return;

    // Calculate total width of all sections
    const totalWidth = marqueeSections.length * 400; // 400px per section * 2 sets
    
    // Create smooth infinite scroll animation
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.fromTo(rollingElement, 
      { x: 0 },
      { 
        x: -totalWidth, 
        duration: 25, 
        ease: "none",
        onComplete: () => {
          gsap.set(rollingElement, { x: 0 });
        }
      }
    );

    // Handle window resize
    const handleResize = () => {
      const currentTime = tl.totalTime();
      tl.kill();
      tl.fromTo(rollingElement, 
        { x: 0 },
        { 
          x: -totalWidth, 
          duration: 25, 
          ease: "none",
          onComplete: () => {
            gsap.set(rollingElement, { x: 0 });
          }
        }
      );
      tl.totalTime(currentTime);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      tl.kill();
      window.removeEventListener("resize", handleResize);
      gsap.killTweensOf(rollingElement);
    };
  }, []);

  return (
    <div className="wrapperRollingText w-full h-[120px] pointer-events-none z-20 select-none overflow-hidden relative">
      <div className="rollingText flex h-full absolute top-0 left-0 whitespace-nowrap">
        {/* First set of sections */}
        {marqueeSections.map((section, index) => (
          <div
            key={`first-${index}`}
            className={`inline-block flex-shrink-0 px-4 w-[400px] !h-[120px] relative`}
          >
            <p className="text-white text-sm font-medium leading-tight">
              {section.text}
            </p>
            <div className={`${section.logoStyle}`}>
              {section.logo}
            </div>
            <div className=" h-full absolute top-0 left-0 w-[1px] bg-purple-600 "></div>
          </div>
        ))}
        
        {/* Second set of sections for seamless loop */}
        {marqueeSections.map((section, index) => (
          <div
            key={`second-${index}`}
            className={`inline-block flex-shrink-0 px-4 w-[400px] !h-[120px] relative `}
          >
            <p className="text-white text-sm font-medium leading-tight">
              {section.text}
            </p>
            <div className={`${section.logoStyle}`}>
              {section.logo}
            </div>
            <div className=" h-full absolute top-0 left-0 w-[1px] bg-purple-600 "></div>
          </div>
        ))}
      </div>
    </div>
  );
}
