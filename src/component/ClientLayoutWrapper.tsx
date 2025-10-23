'use client';

import React, { useState, useEffect, useRef } from 'react';

import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min'; 
import { App } from 'antd';
import AppHeader from '@/component/AppHeader'; 
import Sidebar from '@/component/Sidebar';
import AntdProvider from '@/component/AntdProvider';
import Footer from './footer';
import { usePathname } from 'next/navigation'; 

type VantaInstance = { destroy: () => void; scene: THREE.Scene } | null;

const SIDEBAR_WIDTH_OPEN = '0rem'; 
const SIDEBAR_WIDTH_CLOSED = '0rem';
const HEADER_HEIGHT_PX = 64; 

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {

    const [isVantaActive, setIsVantaActive] = useState(false); 
    const vantaRef = useRef<HTMLDivElement>(null); 
    const vantaEffect = useRef<VantaInstance>(null); 
    const treeMeshRef = useRef<THREE.Group | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null); 
    const pathname = usePathname(); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    const handleToggleTheme = () => {
        setIsVantaActive(prev => !prev);
    };

    const fallbackBgClassName = isVantaActive
        ? "bg-gray-900" 
        : "bg-gradient-to-r from-sky-200 to-green-200"; 
    
    useEffect(() => {
    }, [isVantaActive]); 

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [pathname]);
    
    const mainMarginLeft = isSidebarOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED;


  return (
    <AntdProvider>
      <App>
        <div className={`flex flex-col h-screen overflow-hidden ${fallbackBgClassName}`}>
          {isVantaActive && (
            <div 
              ref={vantaRef} 
              className="fixed inset-0 z-0 opacity-90 transition-opacity duration-500" 
            >
            </div>
          )}
          <div ref={scrollContainerRef} className="relative flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar flex-grow z-10"> 
            
            <AppHeader 
              isVantaActive={isVantaActive}
              onToggleVanta={handleToggleTheme}
            /> 
                        <div className='flex flex-grow'>
                            <div className="h-[calc(100vh-64px)] -mt-14"> 
                                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                            </div>

                            <main 
                                className='flex-grow p-4 mt-2 mb-5 transition-all duration-300 ease-in-out' 
                                style={{
                                    marginLeft: mainMarginLeft,
                                    width: `calc(100% - ${mainMarginLeft})`,
                                }}
                            >
                                {children}
                            </main>
                        </div>
            <Footer />
          </div>
        </div>
      </App>
    </AntdProvider>
  );
}