'use client';

import React, { useEffect, useState } from 'react';
import { HomeOutlined, TeamOutlined, VideoCameraOutlined, BuildOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Baloo_2 } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';

const balooFont = Baloo_2({
  subsets: ['vietnamese'],
  weight: ['800'],
});

const Sidebar = () => {
  const pathname = usePathname(); 
  const [user, setUser] = useState<any>(null);

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
    <section className="w-64 bg-white p-4 shadow-md flex flex-col items-center border-r h-[960px] border-gray-200 rounded-lg m-4">
      <div className="flex flex-row justify-center items-center gap-4 mb-8 mt-4">
        <img src="/XHCN_icon.png" alt="XHCN Logo" width={60} height={60} />
        <span className={`${balooFont.className} text-[40px] font-bold text-black text-center drop-shadow-lg`}>XHCN</span>
      </div>

      <nav className="w-full flex-grow">
        <ul>
          <li className="mb-4">
            <Link 
              href="/home"
              className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-sky-100 hover:text-sky-700 transition-colors duration-200 ${
                pathname === '/home' ? 'bg-sky-100 text-sky-700 font-semibold' : ''
              }`}
            >
              <HomeOutlined className="mr-3 text-lg" />
              <span className="text-lg">Home</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link 
              href="/teammate"
              className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-sky-100 hover:text-sky-700 transition-colors duration-200 ${
                pathname.startsWith('/teammate') ? 'bg-sky-100 text-sky-700 font-semibold' : ''
              }`}
            >
              <TeamOutlined className="mr-3 text-lg" />
              <span className="text-lg">Team</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link 
              href="/video"
              className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-sky-100 hover:text-sky-700 transition-colors duration-200 ${
                pathname.startsWith('/video') ? 'bg-sky-100 text-sky-700 font-semibold' : ''
              }`}
            >
              <VideoCameraOutlined className="mr-3 text-lg" />
              <span className="text-lg">Video</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link 
              href="/build"
              className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-sky-100 hover:text-sky-700 transition-colors duration-200 ${
                pathname.startsWith('/build') ? 'bg-sky-100 text-sky-700 font-semibold' : ''
              }`}
            >
              <BuildOutlined className="mr-3 text-lg" />
              <span className="text-lg">Builds</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto p-4">
        <img src="/umaru.png" alt="Umaru-chan" width={300} height={300} />
      </div>
    </section>
  );
};

export default Sidebar;
