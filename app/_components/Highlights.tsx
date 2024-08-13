"use client";

import { rightImg, watchImg } from "@/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import React from "react";
import VidCarousel from "./VidCarousel";

type Props = {};

const Highlights = (props: Props) => {
  useGSAP(() => {
    gsap.to("#title", {
      opacity: 1,
      y: 0,
    });
    gsap.to(".link", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
    });
  }, []);

  return (
    <section
      id='highlights'
      className='w-screen overflow-hidden h-full common-padding bg-zinc'
    >
      <div className='screen-max-width'>
        <div className='mb-12 w-full md:flex items-end justify-between'>
          <h1 id='title' className='section-heading'>
            Get The Highlights
          </h1>
          <div className='flex flex-wrap items-end gap-5'>
            <p className='link'>
              Watch The Film
              <Image
                src={watchImg}
                alt='watch'
                className='ml-2'
                width={20}
                height={20}
              />
            </p>
            <p className='link'>
              Watch The Event
              <Image
                src={rightImg}
                alt='watch'
                className='ml-2'
                width={8}
                height={8}
              />
            </p>
          </div>
        </div>
        <VidCarousel />
      </div>
    </section>
  );
};

export default Highlights;
