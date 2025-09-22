'use client';

import React, { useEffect, useState } from 'react';
// import { HomeOutlined, TeamOutlined, VideoCameraOutlined, BuildOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Baloo_2 } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import { User } from '@supabase/supabase-js';

const balooFont = Baloo_2({
  subsets: ['vietnamese'],
  weight: ['800'],
});

const Sidebar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

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

  return (
    <section className="w-80 flex flex-col items-center h-screen px-8 -mt-2 flex-none">
      <div className="flex flex-row justify-center items-center gap-4 mb-8 mt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className=''>
          <img src="/XHCN_icon.png" alt="XHCN Logo" width={60} height={60} />
        </div>
        <div>
          <span className={`${balooFont.className} text-[40px] font-bold text-black text-center`}>XHCN</span>
        </div>
      </div>

      <nav className="w-full flex-grow">
        <ul>
          <li className="mb-4">
            <Link
              href="/home"
              className={`flex items-center px-4 py-2 gap-4 justify-start rounded-lg text-gray-700 hover:bg-[#8BDDFB] hover:text-black transition-colors duration-240 ${
                pathname === '/home' ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home _icon.png" alt="" width={24} height={24} className="mb-2 ml-5 mr-5" />
              <span className={`${balooFont.className} text-[25px] lg-6 font-bold`}>Home</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/teammate"
              className={`flex items-center px-4 py-2 gap-4 justify-start rounded-lg text-gray-700 hover:bg-[#8BDDFB] hover:text-black transition-colors duration-240 ${
                pathname.startsWith('/teammate') ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/team_icon.png" alt="" width={24} height={24} className="mb-1 ml-5 mr-5" />
              <span className={`${balooFont.className} text-[25px] lg-6 font-bold`}>Team</span>
            </Link>
          </li>
          
          <li className="mb-4">
            <Link
              href="/videos"
              className={`flex items-center px-4 py-2 gap-4 justify-start rounded-lg text-gray-700 hover:bg-[#8BDDFB] hover:text-black transition-colors duration-240 ${
                pathname.startsWith('/video') ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/video_icon.png" alt="" width={24} height={24} className="mb-1 ml-5 mr-5" />
              <span className={`${balooFont.className} text-[25px] lg-6 font-bold`}>Video</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/build"
              className={`flex items-center px-4 py-2 gap-4 justify-start rounded-lg text-gray-700 hover:bg-[#8BDDFB] hover:text-black transition-colors duration-240 ${
                pathname.startsWith('/build') ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/build_icon.png" alt="" width={24} height={24} className="mb-1 ml-5 mr-5" />
              <span className={`${balooFont.className} text-[25px] lg-6 font-bold`}>Builds</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/account"
              className={`flex items-center px-4 py-2 gap-4 justify-start rounded-lg text-gray-700 hover:bg-[#8BDDFB] hover:text-black transition-colors duration-240 ${
                pathname.startsWith('/account') ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/user_icon1.png" alt="" width={24} height={24} className="mb-2 ml-5 mr-5" />
              <span className={`${balooFont.className} text-[25px] lg-6 font-bold`}>Account</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/setting"
              className={`flex items-center px-4 py-2 gap-4 justify-start rounded-lg text-gray-700 hover:bg-[#8BDDFB] hover:text-black transition-colors duration-240 ${
                pathname.startsWith('/setting') ? '!bg-[#77BFFA] !text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-semibold' : '!text-black hover:!bg-[#8BDDFB]'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/settings_icon.png" alt="" width={24} height={24} className="mb-1 ml-5 mr-5" />
              <span className={`${balooFont.className} text-[25px] lg-6 font-bold`}>About us</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mb-2 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/umaru.png" alt="Umaru-chan" width={400} height={400} />
      </div>
    </section>
  );
};

export default Sidebar;