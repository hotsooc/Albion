'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import BuildPageClient from '@/component/BuildPageClient';
import { Baloo_2 } from 'next/font/google';
import useTrans from '@/hooks/useTrans';

const balooFont = Baloo_2({
    subsets: ['vietnamese'],
    weight: ['800'],
});

export default function BuildPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const showContent = searchParams['show'] === 'true';
    const { trans } = useTrans();
    const [isAnime, setIsAnime] = useState(false);

    const handleAnimeClick = () => {
        setIsAnime(prev => !prev);
    };

    if (!showContent) {
        const bannerImageSrc = isAnime ? '/image/umaru_build.png' : '/image/image_build.png';
        const albionImage = isAnime ? '/image/albionIcon.png' : '/image/albion-icon.png';

        return (
            <div className='flex justify-center items-center w-full h-full pl-1 pr-10'>
                <div className='albion-banner cursor-pointer'>
                    <img src={bannerImageSrc} alt="Albion Online Banner" className='banner-image w-screen rounded-xl' />
                    <div className='overlay-content'>
                        <img src={albionImage} alt='Albion Online Icon' className='logo w-120 h-80 flex items-start justify-start -mt-20' />
                        <span className={`${balooFont.className} flex justify-center items-center text-center ml-20 text-[40px]`}>{trans.build.title}</span>
                        <p className={`${balooFont.className} text-[24px] ml-10 text-center`}>{trans.build.subtitle}</p>
                        <div className='ml-25 flex flex-col gap-5'>
                            <Link href="/build?show=true">
                                <button className={`${balooFont.className} h-16 w-70 rounded-4xl !text-[24px] view-builds-button`}>
                                    {trans.build.viewBuilds}
                                </button>
                            </Link>
                            <button
                                onClick={handleAnimeClick}
                                className={`${balooFont.className} border-none bg-black h-16 w-70 rounded-4xl !text-[24px] anime-button mt-4`}
                            >
                                {isAnime ? trans.common.normal : trans.build.anime}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={<div>{trans.common.loading}</div>}>
            <BuildPageClient />
        </Suspense>
    );
}
