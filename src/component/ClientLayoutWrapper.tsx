'use client';

import React from 'react';
import { App } from 'antd';
import AppHeader from '@/component/AppHeader';
import Sidebar from '@/component/Sidebar';
import AntdProvider from '@/component/AntdProvider';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AntdProvider>
      <App>
        <div className="flex h-screen overflow-hidden bg-gradient-to-r from-sky-200 to-green-200">
          <Sidebar />
          <div className="flex flex-col flex-grow">
            <AppHeader />
            <main className='flex-grow'>
              {children}
            </main>
          </div>
        </div>
      </App>
    </AntdProvider>
  );
}