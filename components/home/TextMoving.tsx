'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Svg from './Svg';
import SvgReverse from './SvgReverse';
import Image from 'next/image';
gsap.registerPlugin(ScrollTrigger);

export default function TextMoving() {
    const textReverseRef: any = useRef(null);
    const containerRef: any = useRef(null);
    const ScrollRef: any = useRef(null);



    useLayoutEffect(() => {
 
        const textReverseElement: any = textReverseRef.current;
        const containerRefElement: any = containerRef.current;
        const ScrollRefElement: any = ScrollRef.current;

        // Calculate the duration based on the width of the text element
        if (textReverseElement && containerRefElement && ScrollRefElement) {
          
            const ReverseDuration = textReverseElement.clientWidth / 50;

         
            const tlReverse = gsap.timeline({ repeat: -1 });

          
            tlReverse.to(textReverseElement, {
                x: -textReverseElement.clientWidth, // Move the text to the left by its width
                duration: ReverseDuration, // Adjust duration based on the width
                ease: "linear",
            });
        
            gsap.to(ScrollRefElement, {
                duration: .3,
                bottom: '-60vh',
                opacity: 0,
                scrollTrigger: {
                    trigger: containerRefElement,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true, // animates smoothly during scroll
                },
            });


            return () => {
             
                tlReverse.kill();
                ScrollTrigger.killAll();
            };



        }

    }, []);


    return (
        <>
            <div ref={containerRef} className=" w-full relative h-screen bg-primary  overflow-hidden   ">

                <div ref={textReverseRef} style={{
                    left: "-500%",
                }} className="   text-secondry z-10 !bg-amber-50 font-['Fahkwang']  capitalize font-extrabold    h-fit absolute top-[80%]  translate-y-[-50%] w-full bg-secondry/20 text-[180px] md:text-[213px] lg:text-[212px]   flex   items-center justify-start ">
                    <p className="  flex  " >
                        <span>Design</span>
                        <span className='   rounded-full w-12 h-12   mx-10 mt-[12vw] ' >
                            <SvgReverse />
                        </span> <span> Develop</span>
                        <span className='   rounded-full w-12 h-12   mx-10 mt-[12vw] ' >
                            <SvgReverse />
                        </span> <span>Deploy</span>

                        <span className='   rounded-full w-12 h-12   mx-10 mt-[12vw] ' >
                            <SvgReverse />
                        </span> <span>Develope</span>
                        <span className='   rounded-full w-12 h-12   mx-10 mt-[12vw] ' >
                            <SvgReverse />
                        </span> <span>Design</span>
                        <span className='   rounded-full w-12 h-12   mx-10 mt-[12vw] ' >
                            <SvgReverse />
                        </span> <span>Deploy</span>

                        <span className='   rounded-full w-12 h-12   mx-10 mt-[12vw] ' >
                            <SvgReverse />
                        </span> <span>Dev</span>
                        <span className='   rounded-full w-12 h-12   mx-10 mt-[12vw] ' >
                            <SvgReverse />
                        </span> <span>Design</span>
                        <span className='   rounded-full w-12 h-12   mx-10 mt-[12vw] ' >
                            <SvgReverse />
                        </span><span>Branding</span>

                        <span className='   rounded-full w-12 h-12   mx-10 mt-[12vw] ' >
                            <SvgReverse />
                        </span> <span>Dev</span>
                        <span className='   rounded-full w-12 h-12   mx-10 mt-[12vw] ' >
                            <SvgReverse />
                        </span><span>Design</span>
                        <span className='   rounded-full w-12 h-12   mx-10 mt-[12vw] ' >
                            <SvgReverse />
                        </span><span>Branding</span>
                    </p>
                </div>
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 2, delay: 2 }}
                    className=" z-[100] absolute top-0 left-0 w-full h-full bg-secondry ">

                </motion.div>

                <div className=" w-[90%]   flex items-center justify-center relative  mx-auto h-full   ">

                    <div ref={ScrollRef} className=" absolute left-0 flex items-center  flex-col justify-center bottom-[13vh]   ">
                        <p className=' text-white text-[11px] font-bold 20 rotate-[-90deg] font-[Fahkwang] tracking-[.3em]  ' >SCROLL </p>
                        <div className=" relative h-7 w-[14px]  mt-14   ">
                            <div className=" w-[1.5px] absolute top-1 left-0 rounded-full h-[20px] bg-white "></div>
                            <div className=" w-[1.5px] rounded-full h-[40px] absolute left-[50%] translate-x-[-50%] -bottom-2 bg-white "></div>
                            <div className=" w-[1.5px] rounded-full h-[20px] absolute right-0 -bottom-1 bg-white "></div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}