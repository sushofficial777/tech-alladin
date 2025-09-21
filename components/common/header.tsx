'use client';

import React from 'react';
import Image from 'next/image';
import Magentic from './magentic';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { toggleMenu } from '@/lib/slices/menuSlice';
import '@/app/header.css'
type HeaderProps = {
    color?: "Dark" | "Light";
    className?: string;
    mode?: "hamburger" | "cross";
};
const Header = ({ color = "Light", className, mode = "hamburger" }: HeaderProps) => {
    const dispatch = useAppDispatch();
    const { isMenuOpen } = useAppSelector((state) => state.menu);

    return (
        <div className=' fixed top-5 left-0 z-[120] flex items-center justify-center  w-full  h-16  ' >
            <div className=" h-full w-[95%] flex items-center justify-between  rounded-xl  ">
                <div className="">
                    <Image src={'/logo.jpg'} width={50} height={50} className=' rounded-full ' alt='tech alladin' />
                </div>
                <div className="">
                    <Magentic
                        strength={50}
                        className={`mask nav__item h-8 w-8 cursor-pointer items-center text-color${color} before:bg-color${color}`}
                        onClick={() => {
                            if (mode === "cross") {
                                dispatch(toggleMenu({ isMenuOpen: false }));
                            } else {
                                dispatch(toggleMenu({ isMenuOpen: true, color: color }));
                            }
                        }}
                    >
                        <div
                            className={cn(
                                "flex h-[0.9rem] w-full  flex-col justify-between ",
                                {
                                    "scale-[.90] justify-center": mode === "cross",
                                },
                            )}
                        >
                            <div
                                className={cn(`h-[0.15rem] w-full  bg-white`, {
                                    "absolute rotate-45": mode === "cross",
                                })}
                            ></div>
                            <div
                                className={cn(`h-[0.15rem]  w-full bg-white`, {
                                    "absolute -rotate-45": mode === "cross",
                                })}
                            ></div>
                        </div>
                    </Magentic>
                </div>
            </div>
        </div>
    );
}

export default Header;
