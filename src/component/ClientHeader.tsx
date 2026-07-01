'use client';

import React, { useState, useEffect } from 'react';
import { Dropdown, MenuProps, Image } from 'antd';
import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { ChevronDownIcon, Sun, Moon, LogOut, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import useTrans from '@/hooks/useTrans';
import { useStyle } from '@/component/StyleProvider';
import CommandPalette from '@/component/CommandPalette';

interface ClientHeaderProps {
  onSearch: (value: string) => void;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ onSearch: _onSearch }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const router = useRouter();
  const { changeLanguage, lang, trans } = useTrans();
  const { theme, setTheme } = useTheme();
  const { style, toggleStyle } = useStyle();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const getProfile = () => {
      if (!user) {
        setProfile(null);
        return;
      }
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
        .then(({ data: profileData }) => {
          if (profileData) {
            setProfile(profileData);
          }
        });
    };
    getProfile();
  }, [user]);

  const handleLogout = () => {
    supabase.auth.signOut().then(() => {
      setUser(null);
      router.push('/login');
    });
  };

  const menuItems: MenuProps['items'] = [
    { key: 'logout', label: trans.common.logout, icon: <LogOut size={20} className="text-[var(--text-primary)]" /> },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') handleLogout();
  };

  const RenderFlag = (language: string, size: number) => {
    const flagMap: { [key: string]: { src: string; text: string } } = {
      vi: { src: '/vietnam.png', text: trans.common.viFull },
      en: { src: '/united-kingdom.png', text: trans.common.enFull },
    };
    const flagSource = flagMap[language] || flagMap['vi'];
    return (
      <div className='flex items-center gap-2'>
        <span className="hidden md:inline">{flagSource.text}</span>
        <Image src={flagSource.src} alt={flagSource.text} width={size} height={size} />
      </div>
    );
  };



  if (!user) return null;

  return (
    <header className="p-3 md:p-4 flex flex-col gap-2 mt-3 md:mt-4 mx-3 md:mx-6 rounded-3xl border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.2)] transition-all duration-300 text-[var(--text-primary)] theme-transition">
      <div className="flex items-center justify-between w-full">
      <div className="flex flex-row justify-center items-center gap-2 md:gap-4 ml-2 md:ml-4">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/XHCN_icon.png" alt="XHCN Logo" width={44} height={44} className="w-9 h-9 md:w-11 md:h-11" />
        </div>
        <div>
          <span className="text-xl md:text-3xl font-extrabold text-[var(--text-primary)] text-center tracking-tight sora-font">XHCN</span>
        </div>
      </div>

      <div className="flex-grow flex justify-center max-w-xl mx-2 md:mx-8">
        <CommandPalette />
      </div>

      <div className="flex items-center gap-1 md:gap-3 mr-2 md:mr-4 flex-shrink-0">
        {/* Style Toggle */}
        <button
          onClick={toggleStyle}
          className="theme-toggle relative"
          aria-label="Toggle UI Style"
          title={style === 'glass' ? 'Chuyển sang Brutalism' : 'Chuyển sang Glassmorphism'}
        >
          <Sparkles size={18} className={`transition-all duration-300 ${style === 'glass' ? 'text-purple-500' : 'text-[var(--text-nav)]'}`} />
          {style === 'glass' && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500 border border-[var(--border-color)]"></span>
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          <Sun size={18} className="icon-sun text-amber-400" />
          <Moon size={18} className="icon-moon text-[var(--text-nav)]" />
        </button>

        {/* Language Switcher */}
        <Dropdown
          placement='bottomRight'
          menu={{
            items: [
              {
                key: 'vn',
                label: <div>{trans.common.vi}</div>,
                onClick: () => { if (lang !== 'vi') changeLanguage('vi'); },
              },
              {
                key: 'en',
                label: <div>{trans.common.en}</div>,
                onClick: () => { if (lang !== 'en') changeLanguage('en'); },
              },
            ],
          }}
        >
          <div className="flex flex-row items-center gap-2 cursor-pointer bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] border-2 border-[var(--border-color)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.15)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.25)] hover:-translate-y-[1px] font-bold text-[var(--text-primary)] rounded-full py-1.5 px-4 h-[40px] transition-all sora-font">
            <div className='flex flex-row items-center'>{lang && RenderFlag(lang, 20)}</div>
            <ChevronDownIcon size={14} className="text-[var(--text-primary)] ml-1" />
          </div>
        </Dropdown>

        {/* User Menu */}
        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight" arrow>
          <a
            onClick={(e) => e.preventDefault()}
            className="flex items-center space-x-2 cursor-pointer transition-all duration-200 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] border-2 border-[var(--border-color)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.15)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.25)] hover:-translate-y-[1px] py-1.5 px-4 rounded-full h-[40px] sora-font font-bold text-[var(--text-btn-upload)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/user_icon.png" width={22} height={22} alt="User" className="mr-1" />
            <span className="hidden md:inline text-[15px]" style={{ color: 'var(--text-btn-upload)' }}>
              {profile?.full_name || user?.user_metadata?.full_name || user?.email}
            </span>
          </a>
        </Dropdown>
      </div>
      </div>
    </header>
  );
};

export default ClientHeader;
