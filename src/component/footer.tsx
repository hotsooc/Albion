'use client';

import Link from 'next/link';
import { FaFacebook, FaDiscord } from 'react-icons/fa';
import useTrans from '@/hooks/useTrans';

export default function Footer() {
    const { trans } = useTrans();

    return (
        <footer className="mx-3 md:mx-6 mt-6 md:mt-8 mb-6 md:mb-8 p-4 md:p-8 rounded-[32px] border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.2)] transition-all duration-300 text-[var(--text-primary)] theme-transition">
            <div className="w-full">
                <div className="flex flex-col lg:flex-row justify-between items-stretch gap-8">

                    {/* Brand & Contacts */}
                    <div className="flex flex-col justify-between gap-6 flex-1">
                        <div>
                            <div className="flex flex-row items-center mb-4 gap-3">
                                <img src="/image/XHCN_icon.png" alt="XHCN Logo" width={40} height={40} />
                                <span className="text-3xl font-extrabold tracking-tight sora-font">XHCN</span>
                            </div>
                            <h3 className="text-lg font-bold mb-3 sora-font text-[var(--text-primary)]">{trans.footer.contact}</h3>
                            <div className="flex flex-col gap-1.5 text-sm text-[var(--text-secondary)] font-semibold">
                                <span>Discord: <strong className="text-[var(--text-primary)]">justhi_1203</strong> (IG: Hi_1203)</span>
                                <span>Discord: <strong className="text-[var(--text-primary)]">thewise0920</strong> (IG: Thewise209)</span>
                                <span>Facebook: <strong className="text-[var(--text-primary)]">Khanh Duy</strong> (IG: Potato211)</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-sm font-extrabold sora-font text-[var(--text-secondary)]">{trans.footer.contactUs}</h4>
                            <div className="flex space-x-3">
                                <a
                                    href="https://www.facebook.com/khanh.duy.57514"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Facebook"
                                    className="text-[var(--text-primary)] hover:text-[var(--color-accent-hover)] transition-colors duration-300"
                                >
                                    <FaFacebook size={28} />
                                </a>
                                <a
                                    href="https://discord.gg/Xe6Hg7aW"
                                    aria-label="Discord"
                                    className="text-[var(--text-primary)] hover:text-[var(--color-accent-hover)] transition-colors duration-300"
                                >
                                    <FaDiscord size={28} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Directory Links */}
                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <span className="text-xl font-extrabold sora-font tracking-tight mb-2 border-b-2 border-[var(--border-color)] pb-1">
                            {trans.footer.directory}
                        </span>
                        <div className="flex flex-col gap-2">
                            {[
                                { href: "/home", label: trans.sidebar.home },
                                { href: "/teammate", label: trans.sidebar.team },
                                { href: "/videos", label: trans.sidebar.video },
                                { href: "/build", label: trans.sidebar.builds },
                                { href: "/dictionary", label: trans.sidebar.dictionary },
                                { href: "/aboutus", label: trans.sidebar.aboutUs },
                                { href: "/settings", label: trans.sidebar.settings },
                            ].map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-[15px] font-bold text-[var(--text-primary)] hover:text-[var(--color-accent-hover)] transition-colors duration-200"
                                    style={{ color: 'var(--text-primary)' }}
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
                            className="rounded-2xl border-2 border-[var(--border-color)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.2)] object-cover w-full h-48 lg:h-56"
                            alt="Guild Banner"
                        />
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 w-full border-t-2 border-[var(--border-color)] text-center text-sm text-[var(--text-secondary)] font-bold sora-font">
                    {trans.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
                </div>
            </div>
        </footer>
    );
}
