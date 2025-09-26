'use client';

import React, { useState, useEffect, useRef } from 'react';
import { App } from 'antd';
import AppHeader from '@/component/AppHeader';
import Sidebar from '@/component/Sidebar';
import AntdProvider from '@/component/AntdProvider';
import Footer from './footer';
import { usePathname } from 'next/navigation'; 

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [isPurpleTheme, setIsPurpleTheme] = useState(false);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null); 
    
    const pathname = usePathname(); 

    const handleToggleTheme = () => {
        setIsPurpleTheme(prev => !prev);
    };
    
    const bgClassName = isPurpleTheme
        ? "bg-gradient-to-r from-[#2c2560] via-[#3a2c7a] to-[#522d86]"
        : "bg-gradient-to-r from-sky-200 to-green-200";

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [pathname]);

    return (
        <AntdProvider>
            <App>
                <div className={`flex flex-col h-screen overflow-hidden ${bgClassName}`}>
                    <div ref={scrollContainerRef} className="flex flex-col overflow-auto no-scrollbar flex-grow"> 
                        <AppHeader />
                        <div className='flex flex-col -mt-4'>
                            <main className='grid grid-cols-[1fr_5fr] mb-5'>
                                <div className='mt-10'>
                                    <Sidebar />
                                </div>
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </div>
                </div>
                {/* <button
                    onClick={handleToggleTheme}
                    className="fixed top-4 right-55 p-2 rounded-full bg-blue-500 text-white shadow-lg z-50 hover:bg-blue-600 transition-colors"
                >
                    Đổi màu nền
                </button> */}
            </App>
        </AntdProvider>
    );
}