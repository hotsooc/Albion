'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Home, Users, Film, Wrench, User as UserIcon, Settings } from 'lucide-react';
import useTrans from '@/hooks/useTrans';

const Sidebar = ({
  isOpen = true,
  toggleSidebar = () => {},
  isMobile: mobileMode,
  mobileOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  toggleSidebar?: () => void;
  isMobile?: boolean;
  mobileOpen?: boolean;
  onClose?: () => void;
}) => {
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
    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  if (!user) return null;

  const linkVariants: Variants = {
    initial: { scale: 1, x: 0 },
    hover: { scale: 1.02, x: isOpen && !mobileMode ? 4 : 0, transition: { type: 'spring', stiffness: 400, damping: 15 } },
    tap: { scale: 0.98 },
  };

  const NavLabelAndIcon = (
    <div className='flex flex-row justify-center items-center gap-2'>
      <span className="sora-font text-lg font-extrabold text-[var(--text-primary)] tracking-tight">{trans.sidebar.navigation}</span>
    </div>
  );
  const MenuIcon = <span className='text-2xl text-[var(--text-primary)] hover:scale-110 transition-transform duration-200'>☰</span>;

  const iconMap: Record<string, React.ReactNode> = {
    "/home":     <Home size={20} className="text-[var(--text-primary)] flex-shrink-0" />,
    "/teammate": <Users size={20} className="text-[var(--text-primary)] flex-shrink-0" />,
    "/videos":   <Film size={20} className="text-[var(--text-primary)] flex-shrink-0" />,
    "/youtube":  <Film size={20} className="text-[var(--text-primary)] flex-shrink-0" />,
    "/build":    <Wrench size={20} className="text-[var(--text-primary)] flex-shrink-0" />,
    "/aboutus":  <UserIcon size={20} className="text-[var(--text-primary)] flex-shrink-0" />,
    "/settings": <Settings size={20} className="text-[var(--text-primary)] flex-shrink-0" />,
  };

  const navItems = [
    { href: "/home", label: trans.sidebar.home },
    { href: "/teammate", label: trans.sidebar.team },
    { href: "/videos", label: trans.sidebar.video },
    { href: "/youtube", label: trans.sidebar.retroTV },
    { href: "/build", label: trans.sidebar.builds },
    { href: "/aboutus", label: trans.sidebar.aboutUs },
    { href: "/settings", label: trans.sidebar.settings },
  ];

  const renderNavLink = (item: typeof navItems[0], onClick?: () => void) => (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center rounded-full border-2 transition-all duration-150 will-change-transform backface-visibility-hidden ${
        pathname.startsWith(item.href)
          ? 'bg-[var(--bg-active-nav)] border-[var(--border-color)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.25)] text-[var(--text-active-nav)] font-bold'
          : 'bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] border-[var(--border-color)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.2)] text-[var(--text-primary)]'
      } ${mobileMode ? 'justify-start py-2.5 px-6 gap-4 w-full' : isOpen ? 'justify-start py-2.5 px-6 gap-4 w-full' : 'justify-center w-12 h-12 p-0'}`}
    >
      {iconMap[item.href]}
      <span className={`text-[14px] text-[var(--text-primary)] tracking-tight sora-font font-bold whitespace-nowrap ${!isOpen && !mobileMode && 'hidden'}`}>
        {item.label}
      </span>
    </Link>
  );

  // Mobile overlay mode
  if (mobileMode) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <div key="mobile-sidebar-overlay" className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50" onClick={onClose}
            />
            <motion.section
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-0 h-full w-64 flex flex-col bg-[var(--bg-panel-solid)] border-r-2 border-[var(--border-color)] py-6 px-4 shadow-xl overflow-y-auto"
            >
              <div className="flex items-center justify-between w-full pt-2 pb-6">
                <span className="sora-font text-lg font-extrabold text-[var(--text-primary)]">{trans.sidebar.navigation}</span>
                <button
                  onClick={onClose}
                  className="cursor-pointer bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] border-2 border-[var(--border-color)] rounded-full p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.15)] transition-all duration-200"
                >
                  <span className="text-xl text-[var(--text-primary)]">✕</span>
                </button>
              </div>
              <nav className="w-full flex-grow">
                <ul className="w-full flex flex-col gap-2">
                  {navItems.map((item) => (
                    <li key={item.href} className="w-full">
                      <motion.div variants={linkVariants} initial="initial" whileHover="hover" whileTap="tap">
                        {renderNavLink(item, onClose)}
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop mode
  return (
    <section
      className={`${isOpen ? "w-64" : "w-24"} flex flex-col items-center flex-none transition-[width] duration-200 ease-out py-6 px-4`}
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
      <nav className={`w-full ${!isOpen && 'overflow-hidden flex flex-col items-center'}`} style={{ flexGrow: 1 }}>
        <ul className="w-full flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.href} className="w-full">
              <motion.div variants={linkVariants} initial="initial" whileHover="hover" whileTap="tap" className={`w-full flex ${isOpen ? '' : 'justify-center'}`}>
                {renderNavLink(item)}
              </motion.div>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export default Sidebar;
