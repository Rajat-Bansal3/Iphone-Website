"use client";

import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from "@/utils";

type Props = {};

const Hero = (props: Props) => {
  useGSAP(() => {
    gsap.to(".hero-title", { opacity: 1, delay: 1.5, ease: "circ.in" });
    gsap.to("#cta", { opacity: 1, y: -50, delay: 1.5, ease: "back.in" });
  }, []);

  const [videoSrc, setVideoSrc] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 760 ? smallHeroVideo : heroVideo;
    }
    return smallHeroVideo;
  });

  useEffect(() => {
    const handleVidSrc = () => {
      if (typeof window !== "undefined") {
        setVideoSrc(window.innerWidth < 760 ? smallHeroVideo : heroVideo);
      }
    };

    handleVidSrc();
    window.addEventListener("resize", handleVidSrc);

    return () => {
      window.removeEventListener("resize", handleVidSrc);
    };
  }, []);

  return (
    <section className='w-full nav-height bg-black relative'>
      <div className='h-5/6 w-full flex-col flex-center'>
        <p className='hero-title'>Iphone 15 Pro</p>
        <div className='md:w-10/12 w-9/12'>
          <video autoPlay muted playsInline className='pointer-events-none'>
            <source src={videoSrc} type='video/mp4' />
          </video>
        </div>
      </div>
      <div
        id='cta'
        className='flex flex-col items-center opacity-0 translate-y-20'
      >
        <a id='' href='#highlights' className='btn'>
          buy
        </a>
        <button className='text-normal'>Buy $99/month or $999</button>
      </div>
    </section>
  );
};

export default Hero;
