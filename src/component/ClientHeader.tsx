'use client';

import React, { useState, useEffect } from 'react';
import { Dropdown, MenuProps, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface ClientHeaderProps {
  onSearch: (value: string) => void;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login'); 
  };

  const menuItems: MenuProps['items'] = [
    { key: 'profile', label: <Link href="/profile">Hồ sơ</Link> },
    { key: 'logout', label: 'Đăng xuất' },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') handleLogout();
  };

  if (!user) return null; 

  return (
    <header className="p-4 flex items-center justify-end bg-gradient-to-r from-sky-200 to-green-200">
      <div className="flex-grow flex justify-center">
        <div className="flex items-center bg-white rounded-full w-2/5 border-none px-4 shadow-sm">
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={() => onSearch(searchTerm)}
            prefix={<SearchOutlined className="text-gray-400 text-lg" />}
            className="!border-none !shadow-none bg-transparent flex-grow h-10 px-4 focus:ring-0"
          />
        </div>
      </div>
      <div className="flex items-center ml-auto">
        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight" arrow>
          <a
            onClick={(e) => e.preventDefault()}
            className="flex items-center space-x-2 text-gray-700 hover:text-sky-700 cursor-pointer transition-colors duration-200 bg-[#97DDD9] py-1 px-4 rounded-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/user_icon.png" width={30} height={30} alt="User" />
            <span className="text-[20px] font-medium">
              {user.user_metadata?.full_name || user.email}
            </span>
          </a>
        </Dropdown>
      </div>
    </header>
  );
};

export default ClientHeader;