'use client';

import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;
import { Button } from "antd";
import CommentSection from '@/component/Comment';
import { useRouter } from 'next/navigation';
import useTrans from "@/hooks/useTrans";

export default function VideoDetailClient({ videoData, videoId }: { videoData: any, videoId: string }) {
    const router = useRouter();
    const { trans } = useTrans();
    const tabs = [
        { key: "Highlight", label: trans.video.categoryHighlight },
        { key: "Funny Moment", label: trans.video.categoryFunny },
        { key: "Record", label: trans.video.categoryRecord }
    ];

    return (
        <section className="w-auto p-6 rounded-[32px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-4 transition-all duration-300 text-black">
            <div>
                {/* Back button and Category Quick links */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <Button 
                        onClick={() => router.push('/videos')} 
                        className="!h-11 !px-5 !rounded-full border-2 border-black !bg-[#ebc7b5] hover:!bg-[#ebbea7] !text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] !font-bold sora-font transition-all duration-200 flex items-center gap-1.5"
                    >
                        <img src='/image/back_icon.png' alt="" width={16} height={16} />
                        <span className="font-bold text-[14px]">{trans.video.back}</span>
                    </Button>
                    
                    <div className="flex gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => router.push(`/videos/?tab=${tab.key}`)}
                                className="py-2 px-5 rounded-full border-2 border-black font-extrabold sora-font text-xs tracking-tight cursor-pointer transition-all duration-200 bg-white hover:bg-[#fcf8f2] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]"
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Player and Comments Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[4fr_2fr] gap-6 p-2">
                    <div className="flex flex-col gap-4">
                        <div className="video-wrapper h-auto rounded-2xl overflow-hidden border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-black">
                            <ReactPlayer
                                url={videoData.url}
                                controls={true}
                                width="100%"
                                height="100%"
                            />
                        </div>
                        <div className="flex flex-col ml-1">
                            <span className="text-black text-2xl font-extrabold tracking-tight mt-2 sora-font">
                                {videoData.title}
                            </span>
                            <span className="text-[#5d6c7b] text-base font-bold sora-font">
                                {trans.video.author} {videoData.channel}
                            </span>
                        </div>
                    </div>
                    <div>
                        <CommentSection videoId={videoId} />
                    </div>
                </div>
            </div>
        </section>
    );
}
