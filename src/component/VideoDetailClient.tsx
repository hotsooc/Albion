'use client';

import React from "react";
import ReactPlayer from "react-player";
import { Button } from "antd";
import CommentSection from '@/component/Comment';
import { useRouter } from 'next/navigation';
import { Baloo_2 } from "next/font/google";

import useTrans from "@/hooks/useTrans";
 
const balooFont = Baloo_2({
    subsets: ['vietnamese'],
    weight: ['800'],
});

export default function VideoDetailClient({ videoData, videoId }: { videoData: any, videoId: string }) {
    const router = useRouter();
    const { trans } = useTrans();
    const tabs = [
        { key: "Highlight", label: trans.video.categoryHighlight },
        { key: "Funny Moment", label: trans.video.categoryFunny },
        { key: "Record", label: trans.video.categoryRecord }
    ];

    return (
        <section className="bg-[#E4FFFE] w-auto p-4 shadow-xl rounded-xl mx-4 ">
            <div>
                <div className="flex gap-2 mb-6">
                    <Button onClick={() => router.push('/videos')} className="!bg-[#97DDD9] !h-[46px] !font-bold !text-black !hover:bg-[#97DDD9] !rounded-xl !mr-80">
                        <img src='/image/back_icon.png' alt="" width={20} height={20} />
                        <span className="text-black font-bold text-[20px]">{trans.video.back}</span>
                    </Button>
                    
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => router.push(`/videos/?tab=${tab.key}`)}
                            className={`${balooFont.className} not-only-of-type:px-4 py-2 w-1/6 !shadow-xl !rounded-full !font-normal !text-[24px] !text-black cursor-pointer transition bg-[#8BDDFB] hover:bg-[#77BFFA]`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                
                <div className="grid grid-cols-[4fr_2fr] gap-4 p-4">
                    <div className="video-wrapper h-auto">
                        <ReactPlayer
                            src={videoData.url}
                            controls={true}
                            width="100%"
                            height="100%"
                            className="!shadow-2xl"
                        />
                    </div>
                    <div>
                        <CommentSection videoId={videoId} />
                    </div>
                    <div className="flex flex-col -mt-5 ml-3">
                        <span className="text-black text-[32px] font-bold mt-4">{videoData.title}</span>
                        <span className="text-black text-[20px] font-medium">{trans.video.author} {videoData.channel}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
