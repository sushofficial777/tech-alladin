'use client'
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import useDeviceType from '@/components/hooks/useDeviceType'
import ParticleAnimation from '../common/animationTestig';
import TextMoving from './TextMoving';
const RenderModels = dynamic(() => import('./RenderModels'), { ssr: false })
import { HeroMarquee } from './heroMarquee';
const HeroSection = () => {
    const { isMobile } = useDeviceType()
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    return (
        <>
            <section className='w-full bg-black relative min-h-screen  overflow-hidden ' >
                <div
                    className="w-full top-0 z-[0]     pt-[40px] left-0  h-[100vh] "
                    style={{
                        minHeight: '480px',
                        position: (mounted && isMobile) ? 'relative' as const : 'absolute' as const,
                        touchAction: (mounted && isMobile) ? 'pan-y' : 'auto',
                    }}
                >
                    <RenderModels />
                </div>
                {/* <HeroMarquee/> */}
                {/* <div className=" absolute top-0 left-0 w-full h-full bg-black/20 z-0 backdrop-blur"></div> */}
                
                {/* <div className=" absolute  top-[20%] -z-1 w-full h-full  ">
                    <ParticleAnimation/>            
                </div> */}

            </section>
        </>
    );
}

export default HeroSection;
