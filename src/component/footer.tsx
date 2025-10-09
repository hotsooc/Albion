'use client'

import React from 'react'
import Link from 'next/link'
import { FaFacebook, FaDiscord } from 'react-icons/fa'
import { Baloo_2, Baloo_Bhai_2 } from 'next/font/google';

const balooFont = Baloo_Bhai_2({
    subsets: ['vietnamese'],
    weight: ['800'],
});

export default function Footer() {
    return (
        <section id='footer' className='text-black py-8 w-full border-t border-gray-300 border-solid'>
            <div className='w-full px-10'> 
                <div className='flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0'>
                    <div className='flex flex-col items-center md:items-start text-center md:text-left'>
                        <div className="flex flex-row justify-center items-center mb-5 gap-4">
                            <div className=''>
                                <img src="/image/XHCN_icon.png" alt="XHCN Logo" width={50} height={50} />
                            </div>
                            <div>
                                <span className={`${balooFont.className} text-[40px] font-bold text-black text-center`}>XHCN</span>
                            </div>
                        </div>
                        <span className={`${balooFont.className} text-[25px] font-bold mb-2`}>Contact: </span>
                        <span className={`${balooFont.className} text-[16px] text-black`}>Discord: justhi_1203 (IG: Hi_1203)</span>
                        <span className={`${balooFont.className} text-[16px] text-black`}>Discord: thewise0920 (IG: Thewise209)</span>
                        <span className={`${balooFont.className} text-[16px] text-black`}>Facebook: Khanh Duy (IG: Potato211)</span>
                        <div className='flex flex-col items-center md:items-start text-center md:text-left'>
                            <span className={`${balooFont.className} text-lg font-bold mb-2`}>Contact Us: </span>
                            <div className='flex space-x-4'>
                                <a href="https://www.facebook.com/khanh.duy.57514" target='_blank' aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    <FaFacebook size={36} />
                                </a>
                                <a href="https://discord.gg/Xe6Hg7aW" aria-label="Discord" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    <FaDiscord size={36} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col items-center md:items-start text-center md:text-left'>
                        <span className={`${balooFont.className} text-[30px] font-bold`}>Directory:</span>
                        <Link href="/home" className={`${balooFont.className} text-[20px] !text-black !font-medium hover:text-white transition-colors duration-300`}>
                            Home
                        </Link>
                        <Link href="/teammate" className={`${balooFont.className} text-[20px] !text-black !font-medium hover:text-white transition-colors duration-300`}>
                            Team
                        </Link>
                        <Link href="/videos" className={`${balooFont.className} text-[20px] !text-black !font-medium hover:text-white transition-colors duration-300`}>
                            Video
                        </Link>
                        <Link href="/build" className={`${balooFont.className} text-[20px] !text-black !font-medium hover:text-white transition-colors duration-300`}>
                            Builds
                        </Link>
                        <Link href="/aboutus" className={`${balooFont.className} text-[20px] !text-black !font-medium hover:text-white transition-colors duration-300`}>
                            About us
                        </Link>
                        <Link href="/settings" className={`${balooFont.className} text-[20px] !text-black !font-medium hover:text-white transition-colors duration-300`}>
                            Settings
                        </Link>
                    </div>

                    <img src='/image/image_build.png' className='rounded-2xl' alt='' width={600} height={600} />
                </div>

                {/* Bản quyền */}
                <div className={`${balooFont.className} mt-8 pt-8 w-full border-t border-gray-700 text-center text-[25px] text-black font-bold`}>
                    © {new Date().getFullYear()} XHCN Guild - ASIA Server
                </div>
            </div>
        </section>
    );
}