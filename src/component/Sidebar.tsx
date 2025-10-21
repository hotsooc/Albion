'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Baloo_2, Baloo_Bhai_2 } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { motion, Variants } from 'framer-motion';

const HEADER_HEIGHT_PX = 64; 

const balooFont = Baloo_Bhai_2({
  subsets: ['vietnamese'],
  weight: ['800'],
});

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => { 
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } = {} } = await supabase.auth.getUser();
      setUser(user || null); 
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!user) {
    return null;
  }

  const linkVariants: Variants = {
    initial: { scale: 1, x: 0 },
    hover: {
      scale: 1.05,
      x: isOpen ? 5 : 0,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
    tap: { scale: 0.95 },
  };
  
  const sidebarWidthClass = isOpen ? "w-80" : "w-20";
  const back = 
  <div className='flex flex-row gap-2'>
    {/* <img src="/image/left-icon.png" alt="Previous team" width="20" height="20"></img> */}
    <span className={`${balooFont.className} text-[25px] font-bold`}>Navigation</span>
  </div>
  const abc = <span className='text-[30px]'>☰</span>

  return (
    <section 
      className={`${sidebarWidthClass} flex flex-col items-center px-4 flex-none transition-all duration-300 ease-in-out overflow-hidden`}
      style={{
          top: `${HEADER_HEIGHT_PX}px`, 
          height: `calc(100vh - ${HEADER_HEIGHT_PX}px)`, 
      }}
    >
      <div className={`flex flex-row gap-2 mb-2 mt-10 w-full pt-8 ${isOpen ? 'px-4 ml-8' : 'px-1 justify-center'}`}>
        {isOpen} 
        
        <button
            onClick={toggleSidebar}
            className="p-2 cursor-pointer transition-colors duration-200"
        >
            {isOpen ? back : abc } 
        </button>
      </div>

      <nav className="w-full flex-grow">
        <ul>
          {[
            { href: "/home", icon: "/image/home _icon.png", label: "Home" },
            { href: "/teammate", icon: "/image/team_icon.png", label: "Team" },
            { href: "/videos", icon: "/image/video_icon.png", label: "Video" },
            { href: "/build", icon: "/image/build_icon.png", label: "Builds" },
            { href: "/aboutus", icon: "/image/user_icon1.png", label: "About us" },
            { href: "/settings", icon: "/image/settings_icon.png", label: "Settings" },
          ].map((item) => (
            <li key={item.href} className="mb-4">
              <motion.div variants={linkVariants} initial="initial" whileHover="hover" whileTap="tap">
                <Link
                  href={item.href}
                  className={`flex items-center py-2 justify-start rounded-lg text-gray-700 transition-colors duration-240 ${
                    pathname.startsWith(item.href) ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
                  } ${isOpen ? 'px-4 gap-4' : 'justify-center'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.icon} alt={item.label} width={24} height={24} className={`${isOpen ? 'ml-5' : 'ml-2.5'} flex-shrink-0`} />
                  <span className={`${balooFont.className} text-[25px] font-bold whitespace-nowrap ${!isOpen && 'hidden'}`}>
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>
      </nav>

      {isOpen && (
        <div className="p-4 flex-grow-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/umaru.png" alt="Umaru-chan" width={200} height={200} className='w-full h-auto' />
        </div>
      )}
    </section>
  );
};

export default Sidebar;