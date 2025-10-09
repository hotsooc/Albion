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

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [isVantaActive, setIsVantaActive] = useState(false); 
    const vantaRef = useRef<HTMLDivElement>(null); 
    const vantaEffect = useRef<VantaInstance>(null); 
    const treeMeshRef = useRef<THREE.Group | null>(null);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null); 
    const pathname = usePathname(); 

    const handleToggleTheme = () => {
        setIsVantaActive(prev => !prev);
    };
    
    const fallbackBgClassName = isVantaActive
        ? "bg-gray-900" 
        : "bg-gradient-to-r from-sky-200 to-green-200"; 

    useEffect(() => {
        if (isVantaActive && vantaRef.current) {
            vantaEffect.current = FOG({
                el: vantaRef.current, 
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                highlightColor: 0x7c3bfe,
                midtoneColor: 0x2f2dd5,
                lowlightColor: 0x3010a3,
                baseColor: 0x9513fc,
                blurFactor: 0.50,
                speed: 2.50,
                zoom: 1.40,
                THREE: THREE,
                onInit: (vantaInstance: any) => {
                    const scene = vantaInstance.scene;

                    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
                    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B }); 
                    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
                    trunk.position.y = 1;

                    const leavesGeometry = new THREE.ConeGeometry(0.8, 2, 16);
                    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); 
                    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
                    leaves.position.y = 2.5;

                    const treeMesh = new THREE.Group();
                    treeMesh.add(trunk);
                    treeMesh.add(leaves);
                    treeMesh.position.set(0, 0, -5);

                    treeMeshRef.current = treeMesh; 
                    
                    scene.add(treeMeshRef.current);
                }
            }) as VantaInstance; 
        }

        return () => {
            if (vantaEffect.current) {
                if (treeMeshRef.current && vantaEffect.current.scene) {
                    vantaEffect.current.scene.remove(treeMeshRef.current);
                    treeMeshRef.current = null;
                }
                vantaEffect.current.destroy();
                vantaEffect.current = null;
            }
        };

    }, [isVantaActive]); 

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [pathname]);

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

                        <div className='flex flex-col -mt-4 mb-5 flex-grow'>
                            <main className='grid grid-cols-1 md:grid-cols-[1fr_5fr]'>
                                <div className='mt-10'>
                                    <Sidebar />
                                </div>
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