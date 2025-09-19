'use client';

import React from "react";
import ReactPlayer from "react-player";
import { Button } from "antd";
import CommentSection from '@/component/Comment';
import { useRouter } from 'next/navigation';
import { Baloo_2 } from "next/font/google";

const tabs = ["Highlight", "Funny Moment", "Record"];
const balooFont = Baloo_2({
    subsets: ['vietnamese'],
    weight: ['800'],
});

export default function VideoDetailClient({ videoData, videoId }: { videoData: any, videoId: string }) {
    const router = useRouter();
    console.log('video', videoData)

    return (
        <section className="bg-[#E4FFFE] w-auto h-[90%] p-4 shadow-xl rounded-xl mx-4 ">
            <div>
                <div className="flex gap-2 mb-6">
                    <Button onClick={() => router.push('/videos')} className="!bg-[#97DDD9] !h-[46px] !font-bold !text-black !hover:bg-[#97DDD9] !rounded-xl !mr-80">
                        <img src='/back_icon.png' alt="" width={20} height={20} />
                        <span className="text-black font-bold text-[20px]">Back</span>
                    </Button>
                    
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => router.push(`/videos/?tab=${tab}`)}
                            className={`${balooFont.className} not-only-of-type:px-4 py-2 w-1/6 !shadow-xl !rounded-full !font-normal !text-[24px] !text-black cursor-pointer transition bg-[#8BDDFB] hover:bg-[#77BFFA]`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                
                <div className="grid grid-cols-[4fr_2fr] gap-4 p-4">
                    <div className="video-wrapper">
                        <ReactPlayer
                            src={videoData.url}
                            controls={true}
                            width="100%"
                            height="100%"
                            className="!shadow-xl"
                        />
                        <h1 className="text-black text-[30px] font-bold mt-4">{videoData.title}</h1>
                        <h2 className="text-black text-[24px]">Author: {videoData.channel}</h2>
                    </div>
                    <div>
                        <CommentSection videoId={videoId} />
                    </div>
                </div>
            </div>
        </section>
    );
}