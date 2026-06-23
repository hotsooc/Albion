'use client';

import React, { useState, useEffect } from 'react';
import { Dropdown, MenuProps, Input, Button, Tag, Space, Image } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { ChevronDownIcon, Sun, Moon, Home, Users, Film, Wrench, User as UserIcon, Settings, LogOut, BookOpen } from 'lucide-react';
import { useTheme } from 'next-themes';
import useTrans from '@/hooks/useTrans';

interface ClientHeaderProps {
  onSearch: (value: string) => void;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchDropdownVisible, setIsSearchDropdownVisible] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { changeLanguage, lang, trans } = useTrans();
  const { theme, setTheme } = useTheme();

  const categories = [
    { name: trans.sidebar.home, icon: <Home size={20} className="text-[var(--text-primary)]" />, path: '/home'},
    { name: trans.sidebar.team, icon: <Users size={20} className="text-[var(--text-primary)]" />, path: '/teammate' },
    { name: trans.sidebar.video, icon: <Film size={20} className="text-[var(--text-primary)]" />, path: '/videos' },
    { name: trans.sidebar.builds, icon: <Wrench size={20} className="text-[var(--text-primary)]" />, path: '/build' },
    { name: trans.sidebar.dictionary, icon: <BookOpen size={20} className="text-[var(--text-primary)]" />, path: '/dictionary' },
    { name: trans.sidebar.aboutUs, icon: <UserIcon size={20} className="text-[var(--text-primary)]" />, path: '/aboutus' },
    { name: trans.sidebar.settings, icon: <Settings size={20} className="text-[var(--text-primary)]" />, path: '/settings' },
  ];

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (profileData) {
        setProfile(profileData);
      }
    };
    getProfile();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  const handleSearchSubmit = () => {
    if (searchTerm) {
      setRecentSearches(prev => [searchTerm, ...prev.filter(t => t !== searchTerm)].slice(0, 5));
      router.push(`/build?q=${encodeURIComponent(searchTerm)}`);
      onSearch(searchTerm);
      setIsSearchDropdownVisible(false);
    }
  };

  const menuItems: MenuProps['items'] = [
    { key: 'logout', label: trans.common.logout, icon: <LogOut size={20} className="text-[var(--text-primary)]" /> },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') handleLogout();
  };

  const handleCategoryClick = (path: string) => {
    router.push(path);
    setIsSearchDropdownVisible(false);
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

  const searchDropdownContent = (
    <div className="bg-white dark:bg-[#1a1a30] p-4 rounded-lg shadow-lg min-w-[300px] border border-gray-200 dark:border-[#2d2d4a] theme-transition">
      {recentSearches.length > 0 && (
        <div className="mb-4">
          <h3 className="text-gray-500 dark:text-[#a1a1aa] text-sm font-semibold mb-2">{trans.common.recent}</h3>
          <Space size={[0, 8]} wrap>
            {recentSearches.map(tag => (
              <Tag
                key={tag}
                closable
                onClose={(e) => {
                  e.stopPropagation();
                  setRecentSearches(recentSearches.filter(t => t !== tag));
                }}
                onClick={() => {
                  setSearchTerm(tag);
                  onSearch(tag);
                  router.push(`/build?q=${encodeURIComponent(tag)}`);
                  setIsSearchDropdownVisible(false);
                }}
                className="!bg-gray-200 dark:!bg-[#252550] !text-gray-700 dark:!text-[#e4e4e7] !rounded-md !px-3 !py-1 !cursor-pointer hover:!bg-gray-300 dark:hover:!bg-[#3d3d6e]"
              >
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
      )}
      <div>
        <h3 className="text-gray-500 dark:text-[#a1a1aa] text-sm font-semibold mb-2">{trans.common.categories}</h3>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(category => (
            <Button
              key={category.name}
              icon={category.icon}
              onClick={() => handleCategoryClick(category.path)}
              className="!h-auto !py-3 !rounded-lg !text-base !flex !items-center !justify-start !gap-2 !bg-gray-100 dark:!bg-[#252550] hover:!bg-gray-200 dark:hover:!bg-[#3d3d6e] theme-transition"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

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

      <div className="hidden md:flex flex-grow justify-center max-w-xl mx-8">
        <Dropdown
          dropdownRender={() => searchDropdownContent}
          trigger={['click']}
          placement="bottomLeft"
          arrow
          open={isSearchDropdownVisible}
          onOpenChange={setIsSearchDropdownVisible}
        >
          <Input
            placeholder={trans.common.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearchSubmit}
            prefix={<SearchOutlined className="text-[var(--text-primary)] text-lg mr-2" />}
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-input)',
              borderColor: 'var(--border-color)',
            }}
            className="!h-11 !px-4 focus:ring-0 !flex !items-center !rounded-full w-full !cursor-pointer border-2 border-[var(--border-color)] transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.15)] focus-within:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:focus-within:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.25)] focus-within:-translate-y-[1px]"
            onClick={() => setIsSearchDropdownVisible(true)}
          />
        </Dropdown>
      </div>

      <div className="flex items-center gap-1 md:gap-3 mr-2 md:mr-4">
        <button
          className="md:hidden cursor-pointer bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] border-2 border-[var(--border-color)] rounded-full p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.15)] transition-all duration-200"
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
        >
          <SearchOutlined className="text-[var(--text-primary)] text-lg" />
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
      {isMobileSearchOpen && (
        <div className="md:hidden w-full">
          <Dropdown
            dropdownRender={() => searchDropdownContent}
            trigger={['click']}
            placement="bottomLeft"
            arrow
            open={isSearchDropdownVisible}
            onOpenChange={setIsSearchDropdownVisible}
          >
            <Input
              placeholder={trans.common.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearchSubmit}
              prefix={<SearchOutlined className="text-[var(--text-primary)] text-lg mr-2" />}
              style={{
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-input)',
                borderColor: 'var(--border-color)',
              }}
              className="!h-11 !px-4 focus:ring-0 !flex !items-center !rounded-full w-full !cursor-pointer border-2 border-[var(--border-color)] transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.15)]"
              onClick={() => setIsSearchDropdownVisible(true)}
            />
          </Dropdown>
        </div>
      )}
    </header>
  );
};

export default ClientHeader;
