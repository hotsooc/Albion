'use client';

import React, { useState, useEffect } from 'react';
import { Dropdown, MenuProps, Input, Button, Tag, Space, Image } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { supabase } from '../../lib/supabase/client'; 
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Baloo_Bhai_2 } from 'next/font/google';
import { ChevronDownIcon } from 'lucide-react';
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
  const { changeLanguage, lang, trans } = useTrans();

  const categories = [
    { name: trans.sidebar.home, icon: <img src="/image/home _icon.png" alt="" width={24} height={24} />, path: '/home'},
    { name: trans.sidebar.team, icon: <img src="/image/team_icon.png" alt="" width={24} height={24} />, path: '/teammate' },
    { name: trans.sidebar.video, icon: <img src="/image/video_icon.png" alt="" width={24} height={24} />, path: '/videos' },
    { name: trans.sidebar.builds, icon: <img src="/image/build_icon.png" alt="" width={24} height={24} />, path: '/build' },
    { name: trans.sidebar.aboutUs, icon: <img src="/image/user_icon1.png" alt="" width={24} height={24} />, path: '/aboutus' },
    { name: trans.sidebar.settings, icon: <img src="/image/settings_icon.png" alt="" width={24} height={24} />, path: '/settings' },
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
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
    
      if (profileData) {
        setProfile(profileData);
      } else {
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
    { key: 'logout', label: trans.common.logout, icon: <img src='/image/logout.png' alt='' width={24} height={24} /> },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') handleLogout();
  };
  
  const handleCategoryClick = (path: string) => {
    router.push(path);
    setIsSearchDropdownVisible(false);
  };

  const RenderFlag = (language: string, size: number) => {
  const flagMap: {
    [key: string]: {
      src: string;
      text: string;
    };
  } = {
    vi: {
      src: '/vietnam.png',
      text: trans.common.viFull,
    },
    en: {
      src: '/united-kingdom.png',
      text: trans.common.enFull,
    },
  };

  const flagSource = flagMap[language] || flagMap['vi'];

  return (
    <div className='flex items-center gap-2'>
      {flagSource.text}
      <Image src={flagSource.src} alt={flagSource.text} width={size} height={size} />
    </div>
  );
};

  const searchDropdownContent = (
    <div className="bg-white p-4 rounded-lg shadow-lg min-w-[300px]">
      {recentSearches.length > 0 && (
        <div className="mb-4">
          <h3 className="text-gray-500 text-sm font-semibold mb-2">{trans.common.recent}</h3>
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
                className="!bg-gray-200 !text-gray-700 !rounded-md !px-3 !py-1 !cursor-pointer hover:!bg-gray-300"
              >
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
      )}
      
      <div>
        <h3 className="text-gray-500 text-sm font-semibold mb-2">{trans.common.categories}</h3>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(category => (
            <Button 
              key={category.name} 
              icon={category.icon} 
              onClick={() => handleCategoryClick(category.path)} 
              className="!h-auto !py-3 !rounded-lg !text-base !flex !items-center !justify-start !gap-2 !bg-gray-100 hover:!bg-gray-200"
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
    <header className="p-4 flex items-center justify-between mt-4 mx-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 text-black">
      <div className="flex flex-row justify-center items-center gap-4 ml-4">
        <div className=''>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/XHCN_icon.png" alt="XHCN Logo" width={44} height={44} />
        </div>
        <div>
          <span className="text-3xl font-extrabold text-black text-center tracking-tight sora-font">XHCN</span>
        </div>
      </div>
      <div className="flex-grow flex justify-center max-w-xl mx-8">
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
            prefix={<SearchOutlined className="text-black text-lg mr-2" />}
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              borderColor: '#000000',
            }}
            className="!h-11 !px-4 focus:ring-0 !flex !items-center !rounded-full w-full !cursor-pointer border-2 border-black focus:border-black hover:border-black transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-within:-translate-y-[1px]"
            onClick={() => setIsSearchDropdownVisible(true)}
          />
        </Dropdown>
      </div>
      
      <div className="flex items-center gap-4 mr-4"> 
        <Dropdown
            placement='bottomRight'
            menu={{
              items: [
                {
                  key: 'vn',
                  label: <div>{trans.common.vi}</div>,
                  onClick: () => {
                    if (lang !== 'vi') changeLanguage('vi');
                  },
                },
                {
                  key: 'en',
                  label: <div>{trans.common.en}</div>,
                  onClick: () => {
                    if (lang !== 'en') changeLanguage('en');
                  },
                },
              ],
            }}
          >
            <div className="flex flex-row items-center gap-2 cursor-pointer bg-white hover:bg-[#fcf8f2] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] font-bold text-black rounded-full py-1.5 px-4 h-[40px] transition-all sora-font">
              <div className='flex flex-row items-center'>{lang && RenderFlag(lang, 20)}</div>
              <ChevronDownIcon size={14} className="text-black ml-1" />
            </div>
          </Dropdown>

        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight" arrow>
          <a
            onClick={(e) => e.preventDefault()}
            className="flex items-center space-x-2 text-black cursor-pointer transition-all duration-200 bg-[#ebc7b5] hover:bg-[#ebbea7] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] py-1.5 px-4 rounded-full h-[40px] sora-font font-bold"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/user_icon.png" width={22} height={22} alt="User" className="mr-1" />
            <span className="text-[15px] text-black">
              {profile?.full_name || user?.user_metadata?.full_name || user?.email}
            </span>
          </a>
        </Dropdown>
      </div>
    </header>
  );
};

export default ClientHeader;
