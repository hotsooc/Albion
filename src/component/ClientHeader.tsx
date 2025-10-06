'use client';

import React, { useState, useEffect } from 'react';
import { Dropdown, MenuProps, Input, Button, Tag, Space } from 'antd';
import { SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import { supabase } from '../../lib/supabase/client'; 
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Baloo_2, Baloo_Bhai_2 } from 'next/font/google';

interface ClientHeaderProps {
  onSearch: (value: string) => void;
  isVantaActive: boolean;      
  onToggleVanta: () => void;  
}

const balooFont = Baloo_Bhai_2({
    subsets: ['vietnamese'],
    weight: ['800'],
});

const ClientHeader: React.FC<ClientHeaderProps> = ({ onSearch, isVantaActive, onToggleVanta }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchDropdownVisible, setIsSearchDropdownVisible] = useState(false);

  const categories = [
    { name: 'Home', icon: <img src="/home _icon.png" alt="" width={24} height={24} />, path: '/home'},
    { name: 'Team', icon: <img src="/team_icon.png" alt="" width={24} height={24} />, path: '/teammate' },
    { name: 'Videos', icon: <img src="/video_icon.png" alt="" width={24} height={24} />, path: '/videos' },
    { name: 'Builds', icon: <img src="/build_icon.png" alt="" width={24} height={24} />, path: '/build' },
    { name: 'About Us', icon: <img src="/user_icon1.png" alt="" width={24} height={24} />, path: '/aboutus' },
    { name: 'Settings', icon: <img src="/settings_icon.png" alt="" width={24} height={24} />, path: '/settings' },
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
        console.error('Lỗi khi lấy hồ sơ:', profileError);
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
    { key: 'logout', label: 'Log Out', icon: <img src='/logout.png' alt='' width={24} height={24} /> },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') handleLogout();
  };
  
  const handleCategoryClick = (path: string) => {
    router.push(path);
    setIsSearchDropdownVisible(false);
  };

  const searchDropdownContent = (
    <div className="bg-white p-4 rounded-lg shadow-lg min-w-[300px]">
      {recentSearches.length > 0 && (
        <div className="mb-4">
          <h3 className="text-gray-500 text-sm font-semibold mb-2">Recent</h3>
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
        <h3 className="text-gray-500 text-sm font-semibold mb-2">Categories</h3>
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
    <header className="p-4 flex items-center justify-end -mt-4">
      <div className="flex flex-row justify-center items-center gap-4 ml-10">
        <div className=''>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/XHCN_icon.png" alt="XHCN Logo" width={50} height={50} />
        </div>
        <div>
          <span className={`${balooFont.className} text-[40px] font-bold text-black text-center`}>XHCN</span>
        </div>
      </div>
      <div className="flex-grow flex justify-center ml-20">
        <Dropdown
          overlay={searchDropdownContent}
          trigger={['click']}
          placement="bottomLeft"
          arrow
          open={isSearchDropdownVisible}
          onOpenChange={setIsSearchDropdownVisible}
        >
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearchSubmit}
            prefix={<SearchOutlined className="text-gray-400 text-lg" />}
            className="!border-none !shadow-xl !h-10 !px-4 focus:ring-0 !flex !items-center bg-white !rounded-full !w-2/5 !cursor-pointer"
            onClick={() => setIsSearchDropdownVisible(true)}
          />
        </Dropdown>
      </div>
      
      <div className="flex items-center ml-auto gap-4"> 
        
        <Button
            onClick={onToggleVanta}
            type="primary"
            className="!bg-[#97DDD9] !border-[#97DDD9] !shadow-xl hover:!bg-sky-700 !text-black !rounded-full !py-1 !px-4 !h-[40px] transition-colors"
        >
            <span className={`${balooFont.className} font-medium text-[16px]`}>
                {isVantaActive ? 'Normal' : 'The Mist'}
            </span>
        </Button>
        
        <div className="flex items-center bg-[#97DDD9] rounded-xl">
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight" arrow>
            <a
              onClick={(e) => e.preventDefault()}
              className="flex items-center space-x-2 text-gray-700 hover:text-sky-700 cursor-pointer transition-colors duration-200 bg-[#97DDD9] py-1 px-4 rounded-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/user_icon.png" width={30} height={30} alt="User" />
              <span className="text-[20px] text-black font-medium">
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