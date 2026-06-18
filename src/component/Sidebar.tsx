'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { motion, Variants } from 'framer-motion';
import useTrans from '@/hooks/useTrans';

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const { trans } = useTrans();

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
      scale: 1.02,
      x: isOpen ? 4 : 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15
      },
    },
    tap: { scale: 0.98 },
  };

  const sidebarWidthClass = isOpen ? "w-64" : "w-24";

  const NavLabelAndIcon = (
    <div className='flex flex-row justify-center items-center gap-2'>
      <span className="sora-font text-lg font-extrabold text-[var(--text-primary)] tracking-tight">{trans.sidebar.navigation}</span>
    </div>
  );
  const MenuIcon = <span className='text-2xl text-[var(--text-primary)] hover:scale-110 transition-transform duration-200'>☰</span>

  return (
    <section
      className={`${sidebarWidthClass} flex flex-col items-center flex-none transition-[width] duration-200 ease-out py-6 px-4`}
      style={{ height: 'calc(100vh - 80px)' }}
    >
      <div className={`flex flex-row items-center pt-2 pb-6 transition-all duration-200 ${isOpen ? '' : 'justify-center w-full'}`}>
        <button
          onClick={toggleSidebar}
          className="cursor-pointer bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] border-2 border-[var(--border-color)] rounded-full p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.15)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.25)] transition-all duration-200 will-change-transform backface-visibility-hidden"
        >
          {isOpen ? NavLabelAndIcon : MenuIcon}
        </button>
      </div>

      <nav
        className={`w-full ${!isOpen && 'overflow-hidden flex flex-col items-center'}`}
        style={{ flexGrow: 1 }}
      >
        <ul className="w-full flex flex-col gap-2">
          {[
            { href: "/home", icon: "/image/home _icon.png", label: trans.sidebar.home },
            { href: "/teammate", icon: "/image/team_icon.png", label: trans.sidebar.team },
            { href: "/videos", icon: "/image/video_icon.png", label: trans.sidebar.video },
            { href: "/youtube", icon: "/image/video_icon.png", label: trans.sidebar.retroTV },
            { href: "/build", icon: "/image/build_icon.png", label: trans.sidebar.builds },
            { href: "/aboutus", icon: "/image/user_icon1.png", label: trans.sidebar.aboutUs },
            { href: "/settings", icon: "/image/settings_icon.png", label: trans.sidebar.settings },
          ].map((item) => (
            <li key={item.href} className="w-full">
              <motion.div
                variants={linkVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className={`w-full flex ${isOpen ? '' : 'justify-center'}`}
              >
                <Link
                  href={item.href}
                  className={`flex items-center rounded-full border-2 transition-all duration-150 will-change-transform backface-visibility-hidden ${
                    pathname.startsWith(item.href)
                      ? 'bg-[var(--bg-active-nav)] border-[var(--border-color)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.25)] text-[var(--text-active-nav)] font-bold'
                      : 'bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] border-[var(--border-color)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.2)] text-[var(--text-primary)]'
                  } ${isOpen ? 'justify-start py-2.5 px-6 gap-4 w-full' : 'justify-center w-12 h-12 p-0'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                  <span className={`text-[14px] text-[var(--text-primary)] tracking-tight sora-font font-bold whitespace-nowrap ${!isOpen && 'hidden'}`}>
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export default Sidebar;
