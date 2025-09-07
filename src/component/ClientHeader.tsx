'use client';

import React, { useState } from 'react';
import { Input, Dropdown, Menu } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface ClientHeaderProps {
  loggedIn: boolean;
  onSearch: (value: string) => void;
  onLogout: () => void; // Thêm prop onLogout
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ loggedIn, onSearch, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm xử lý việc nhấp chuột vào các mục trong menu
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      onLogout();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">
        <Link href="/profile">Hồ sơ</Link>
      </Menu.Item>
      <Menu.Item key="logout">
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  return (
    <header className="p-4 flex items-center justify-end m-4 mb-0 bg-gradient-to-r from-sky-200 to-green-200">
      <div className="flex-grow flex justify-center">
        <div className="flex items-center bg-white rounded-full w-96 border-none px-4 shadow-sm">
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleKeyPress}
            prefix={<SearchOutlined className="text-gray-400 text-lg" />}
            className="!border-none !shadow-none bg-transparent flex-grow h-10 px-4 focus:ring-0"
          />
        </div>
      </div>
      <div className="flex items-center ml-auto">
        {loggedIn ? (
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <a onClick={e => e.preventDefault()} className="flex items-center space-x-2 text-gray-700 hover:text-sky-700 cursor-pointer transition-colors duration-200 bg-[#97DDD9] py-1 px-4 rounded-md">
              {/* <Avatar icon={<UserOutlined />} /> */}
              <img src="/user_icon.png" alt="User Icon" width={30} height={30} />
              <span className='text-[20px] text-center font-medium'>user</span>
            </a>
          </Dropdown>
        ) : (
          <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};

export default ClientHeader;