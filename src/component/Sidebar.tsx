'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Baloo_2, Baloo_Bhai_2 } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import { User, Session } from '@supabase/supabase-js'; // Import User và Session từ supabase
import { motion, Variants } from 'framer-motion';

const balooFont = Baloo_Bhai_2({
  subsets: ['vietnamese'],
  weight: ['800'],
});

const Sidebar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
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
      x: 5,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
    tap: { scale: 0.95 },
  };

  return (
    <section className="w-80 flex flex-col items-center h-auto px-8 -mt-2 flex-none">
      {/* <div className="flex flex-row justify-center items-center gap-4 mb-8 mt-4"> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <div className=''>
          <img src="/XHCN_icon.png" alt="XHCN Logo" width={60} height={60} />
        </div>
        <div>
          <span className={`${balooFont.className} text-[40px] font-bold text-black text-center`}>XHCN</span>
        </div>
      </div> */}

      <nav className="w-full flex-grow">
        <ul>
          <li className="mb-4">
            <motion.div variants={linkVariants} initial="initial" whileHover="hover" whileTap="tap">
              <Link
                href="/home"
                className={`flex items-center px-4 py-2 gap-4 justify-start rounded-lg text-gray-700 transition-colors duration-240 ${
                  pathname === '/home' ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/home _icon.png" alt="" width={20} height={20} className="mb-2 ml-5 mr-5" />
                <span className={`${balooFont.className} text-[25px] lg-6 font-bold`}>Home</span>
              </Link>
            </motion.div>
          </li>
          <li className="mb-4">
            <motion.div variants={linkVariants} initial="initial" whileHover="hover" whileTap="tap">
              <Link
                href="/teammate"
                className={`flex items-center px-4 py-2 gap-4 justify-start rounded-lg text-gray-700 transition-colors duration-240 ${
                  pathname.startsWith('/teammate') ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/team_icon.png" alt="" width={24} height={24} className="mb-1 ml-5 mr-5" />
                <span className={`${balooFont.className} text-[25px] lg-6 font-bold`}>Team</span>
              </Link>
            </motion.div>
          </li>
          <li className="mb-4">
            <motion.div variants={linkVariants} initial="initial" whileHover="hover" whileTap="tap">
              <Link
                href="/videos"
                className={`flex items-center px-4 py-2 gap-4 justify-start rounded-lg text-gray-700 transition-colors duration-240 ${
                  pathname.startsWith('/video') ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/video_icon.png" alt="" width={24} height={24} className="mb-1 ml-5 mr-5" />
                <span className={`${balooFont.className} text-[25px] lg-6 font-bold`}>Video</span>
              </Link>
            </motion.div>
          </li>
          <li className="mb-4">
            <motion.div variants={linkVariants} initial="initial" whileHover="hover" whileTap="tap">
              <Link
                href="/build"
                className={`flex items-center px-4 py-2 gap-4 justify-start rounded-lg text-gray-700 transition-colors duration-240 ${
                  pathname.startsWith('/build') ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/build_icon.png" alt="" width={24} height={24} className="mb-1 ml-5 mr-5" />
                <span className={`${balooFont.className} text-[25px] lg-6 font-bold`}>Builds</span>
              </Link>
            </motion.div>
          </li>
          <li className="mb-4">
            <motion.div variants={linkVariants} initial="initial" whileHover="hover" whileTap="tap">
              <Link
                href="/aboutus"
                className={`flex items-center px-4 py-2 gap-4 justify-start rounded-lg text-gray-700 transition-colors duration-240 ${
                  pathname.startsWith('/aboutus') ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/user_icon1.png" alt="" width={20} height={20} className="mb-1 ml-5 mr-5" />
                <span className={`${balooFont.className} text-[25px] lg-6 font-bold`}>About us</span>
              </Link>
            </motion.div>
          </li>
          <li className="mb-4">
            <motion.div variants={linkVariants} initial="initial" whileHover="hover" whileTap="tap">
              <Link
                href="/settings"
                className={`flex items-center px-4 py-2 gap-4 justify-start rounded-lg text-gray-700 transition-colors duration-240 ${
                  pathname.startsWith('/settings') ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/settings_icon.png" alt="" width={20} height={20} className="mb-1 ml-5 mr-5" />
                <span className={`${balooFont.className} text-[25px] lg-6 font-bold`}>Settings</span>
              </Link>
            </motion.div>
          </li>
        </ul>
      </nav>

      <div className="p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/umaru.png" alt="Umaru-chan" width={400} height={400} />
      </div>
    </section>
  );
};

export default Sidebar;