'use client';

import React, { useState, useEffect, useRef } from 'react';
import { App } from 'antd';
import AppHeader from '@/component/AppHeader';
import Sidebar from '@/component/Sidebar';
import AntdProvider from '@/component/AntdProvider';
import ThemeProvider from '@/component/ThemeProvider';
import Footer from './footer';
import { TransProvider } from '@/hooks/useTrans';
import { usePathname } from 'next/navigation';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    const isAuthPage = pathname === '/login' || pathname === '/register';

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [pathname]);

    return (
      <ThemeProvider>
        <AntdProvider>
          <TransProvider>
            <App>
              <div className="flex flex-col h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] theme-transition">
                <div
                  ref={scrollContainerRef}
                  className="relative flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar flex-grow z-10"
                >
                  {!isAuthPage && (
                    <div className="flex-shrink-0">
                      <AppHeader />
                    </div>
                  )}

                  <div className={`flex flex-grow flex-shrink-0 ${isAuthPage ? 'min-h-screen' : 'min-h-[calc(100vh-64px)]'}`}>
                    {!isAuthPage && (
                      <div className="h-[calc(100vh-64px)] -mt-14 sticky top-16 z-20 ml-6 flex-shrink-0">
                        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                      </div>
                    )}

                    <main
                      className={`flex-grow transition-all duration-200 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
                        isAuthPage ? 'p-0 m-0' : 'p-6 mt-4 mb-8'
                      }`}
                      style={{ width: '100%' }}
                    >
                      {children}
                    </main>
                  </div>

                  <div className="flex-shrink-0">
                    <Footer />
                  </div>
                </div>
              </div>
            </App>
          </TransProvider>
        </AntdProvider>
      </ThemeProvider>
    );
}
