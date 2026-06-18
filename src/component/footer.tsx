'use client';

import Link from 'next/link';
import { FaFacebook, FaDiscord } from 'react-icons/fa';
import useTrans from '@/hooks/useTrans';

export default function Footer() {
    const { trans } = useTrans();
    
    return (
        <footer className="mx-6 mt-8 mb-8 p-8 rounded-[32px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 text-black">
            <div className="w-full"> 
                <div className="flex flex-col lg:flex-row justify-between items-stretch gap-8">
                    
                    {/* Brand & Contacts */}
                    <div className="flex flex-col justify-between gap-6 flex-1">
                        <div>
                            <div className="flex flex-row items-center mb-4 gap-3">
                                <img src="/image/XHCN_icon.png" alt="XHCN Logo" width={40} height={40} />
                                <span className="text-3xl font-extrabold tracking-tight sora-font">XHCN</span>
                            </div>
                            <h3 className="text-lg font-bold mb-3 sora-font text-black">{trans.footer.contact}</h3>
                            <div className="flex flex-col gap-1.5 text-sm text-[#2d3748] font-semibold">
                                <span>Discord: <strong className="text-black">justhi_1203</strong> (IG: Hi_1203)</span>
                                <span>Discord: <strong className="text-black">thewise0920</strong> (IG: Thewise209)</span>
                                <span>Facebook: <strong className="text-black">Khanh Duy</strong> (IG: Potato211)</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <h4 className="text-sm font-extrabold sora-font text-[#2d3748]">{trans.footer.contactUs}</h4>
                            <div className="flex space-x-3">
                                <a 
                                    href="https://www.facebook.com/khanh.duy.57514" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    aria-label="Facebook" 
                                    className="text-black hover:text-[#ebbea7] transition-colors duration-300"
                                >
                                    <FaFacebook size={28} />
                                </a>
                                <a 
                                    href="https://discord.gg/Xe6Hg7aW" 
                                    aria-label="Discord" 
                                    className="text-black hover:text-[#ebbea7] transition-colors duration-300"
                                >
                                    <FaDiscord size={28} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Directory Links */}
                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <span className="text-xl font-extrabold sora-font tracking-tight mb-2 border-b-2 border-black pb-1">
                            {trans.footer.directory}
                        </span>
                        <div className="flex flex-col gap-2">
                            {[
                                { href: "/home", label: trans.sidebar.home },
                                { href: "/teammate", label: trans.sidebar.team },
                                { href: "/videos", label: trans.sidebar.video },
                                { href: "/build", label: trans.sidebar.builds },
                                { href: "/aboutus", label: trans.sidebar.aboutUs },
                                { href: "/settings", label: trans.sidebar.settings },
                            ].map(item => (
                                <Link 
                                    key={item.href}
                                    href={item.href} 
                                    className="text-[15px] font-bold text-black! hover:text-[#ebbea7] transition-colors duration-200"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Graphic/Banner */}
                    <div className="flex items-center justify-center lg:justify-end max-w-md">
                        <img 
                            src="/image/image_build.png" 
                            className="rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] object-cover w-full h-48 lg:h-56" 
                            alt="Guild Banner" 
                        />
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 w-full border-t-2 border-black text-center text-sm text-[#2d3748] font-bold sora-font">
                    {trans.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
                </div>
            </div>
        </footer>
    );
}
