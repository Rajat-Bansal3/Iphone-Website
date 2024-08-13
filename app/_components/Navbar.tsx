import { navLists } from "@/lib/constants";
import { appleImg, bagImg, searchImg } from "@/utils";
import Image from "next/image";
import React from "react";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <header className='w-full py-5 sm:px-10 px-5 flex justify-between items-center'>
      <nav className='flex w-full screen-max-width'>
        <Image src={appleImg} width={14} height={44} alt='logo' />
        <div className='flex flex-1 justify-center max-sm:hidden'>
          {navLists.map((acc) => (
            <div
              key={acc}
              className='px-5 text-sm cursor-pointer text-gray hover:text-white transition-all'
            >
              {acc}
            </div>
          ))}
        </div>
        <div className='flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1 hover:text-green-400'>
          <Image src={searchImg} width={18} height={18} alt='Seatch' />
          <Image src={bagImg} width={18} height={18} alt='Bag' />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
