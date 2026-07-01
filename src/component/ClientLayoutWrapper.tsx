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
import { StyleProvider } from '@/component/StyleProvider';
import AIChatbot from '@/component/AIChatbot';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const isAuthPage = pathname === '/login' || pathname === '/register';

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (!isMobile) setMobileSidebarOpen(false);
    }, [isMobile]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [pathname]);

    // Desktop
    if (!isMobile) {
        return (
          <ThemeProvider>
            <StyleProvider>
              <AntdProvider>
              <TransProvider>
                <App>
                  <div className="flex flex-col h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] theme-transition">
                    <div ref={scrollContainerRef} className="relative flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar flex-grow z-10">
                      {!isAuthPage && (
                        <div className="flex-shrink-0">
                          <AppHeader />
                        </div>
                      )}
                      <div className={`flex flex-grow flex-shrink-0 ${isAuthPage ? 'min-h-screen' : 'min-h-[calc(100vh-64px)]'}`}>
                        {!isAuthPage && (
                          <div className="h-[calc(100vh-64px)] -mt-14 sticky top-16 z-20 ml-6 flex-shrink-0">
                            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(p => !p)} />
                          </div>
                        )}
                        <main className={`flex-grow transition-all duration-200 ${isAuthPage ? 'p-0 m-0' : 'p-6 mt-4 mb-8'}`} style={{ width: '100%' }}>
                          {children}
                        </main>
                      </div>
                      <div className="flex-shrink-0">
                        <Footer />
                      </div>
                    </div>
                    {!isAuthPage && <AIChatbot />}
                  </div>
                </App>
              </TransProvider>
              </AntdProvider>
            </StyleProvider>
          </ThemeProvider>
        );
    }

    // Mobile
    return (
      <ThemeProvider>
        <StyleProvider>
          <AntdProvider>
          <TransProvider>
            <App>
              <div className="flex flex-col h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] theme-transition">
                <div ref={scrollContainerRef} className="relative flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar flex-grow z-10">
                  {!isAuthPage && (
                    <div className="flex-shrink-0">
                      <AppHeader />
                    </div>
                  )}
                  <div className={`flex-grow ${isAuthPage ? 'min-h-screen' : ''}`}>
                    <main className={`${isAuthPage ? 'p-0 m-0' : 'px-3 py-4'}`}>
                      {children}
                    </main>
                  </div>
                  <div className="flex-shrink-0">
                    <Footer />
                  </div>
                </div>

                {!isAuthPage && <AIChatbot />}

                {!isAuthPage && (
                  <Sidebar isMobile mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
                )}

                {!isAuthPage && !mobileSidebarOpen && (
                  <button
                    className="fixed top-4 left-3 z-40 cursor-pointer bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] border-2 border-[var(--border-color)] rounded-full p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.15)] transition-all duration-200 will-change-transform backface-visibility-hidden"
                    onClick={() => setMobileSidebarOpen(true)}
                  >
                    <span className="text-xl text-[var(--text-primary)]">☰</span>
                  </button>
                )}
              </div>
            </App>
          </TransProvider>
          </AntdProvider>
        </StyleProvider>
      </ThemeProvider>
    );
}
