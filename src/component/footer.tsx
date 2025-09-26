'use client'

import React from 'react'
import Link from 'next/link'
import { FaFacebook, FaDiscord } from 'react-icons/fa'
import { Baloo_2 } from 'next/font/google';

const balooFont = Baloo_2({
    subsets: ['vietnamese'],
    weight: ['800'],
});

export default function Footer() {
    return (
        <section id='footer' className='text-black py-8 border-t border-gray-300 border-solid'>
            {/* Thêm px-4 hoặc px-8 để tạo khoảng đệm bên trong */}
            <div className='container mx-auto px-4'> 
                <div className='flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0'>
                    <div className='flex flex-col items-center md:items-start text-center md:text-left'>
                        <div className="flex flex-row justify-center items-center mb-5 gap-4">
                            <div className=''>
                                <img src="/XHCN_icon.png" alt="XHCN Logo" width={50} height={50} />
                            </div>
                            <div>
                                <span className={`${balooFont.className} text-[40px] font-bold text-black text-center`}>XHCN</span>
                            </div>
                        </div>
                        <p className={`${balooFont.className} text-[25px] font-bold mb-2`}>Contact: </p>
                        <p className={`${balooFont.className} text-[16px] text-black`}>Discord: justhi_1203 (IG: Hi_1203)</p>
                        <p className={`${balooFont.className} text-[16px] text-black`}>Discord: thewise0920 (IG: Thewise209)</p>
                        <p className={`${balooFont.className} text-[16px] text-black`}>Facebook: Khanh Duy (IG: Potato211)</p>
                        <div className='flex flex-col items-center md:items-start text-center md:text-left'>
                            <p className={`${balooFont.className} text-lg font-bold mb-2`}>Contact Us: </p>
                            <div className='flex space-x-4'>
                                <a href="https://www.facebook.com/khanh.duy.57514" target='_blank' aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    <FaFacebook size={36} />
                                </a>
                                <a href="https://discord.com" aria-label="Discord" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    <FaDiscord size={36} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col items-center md:items-start text-center md:text-left'>
                        <p className={`${balooFont.className} text-[30px] font-bold mb-2`}>Directory:</p>
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
                        <Link href="/setting" className={`${balooFont.className} text-[20px] !text-black !font-medium hover:text-white transition-colors duration-300`}>
                            About us
                        </Link>
                        <Link href="/about" className={`${balooFont.className} text-[20px] !text-black !font-medium hover:text-white transition-colors duration-300`}>
                            Settings
                        </Link>
                    </div>

                    <img src='/image_build.png' className='rounded-2xl' alt='' width={600} height={600} />
                </div>

                {/* Bản quyền */}
                <div className={`${balooFont.className} mt-8 pt-8 w-full border-t border-gray-700 text-center text-[25px] text-black font-bold`}>
                    © {new Date().getFullYear()} XHCN Guild - ASIA Server
                </div>
            </div>
        </section>
    );
}