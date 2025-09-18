'use client';

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Spin, Button } from "antd";
import CommentSection from '@/component/Comment';
import { useRouter } from 'next/navigation';
import { Baloo_2 } from "next/font/google";
import { supabase } from "../../../../../lib/supabase/client";

const tabs = ["Highlight", "Funny Moment", "Record"];
const balooFont = Baloo_2({
  subsets: ['vietnamese'],
  weight: ['800'],
});

const getYouTubeVideoId = (url: string | null) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const fetchYouTubeMetadata = async (videoId: string) => {
    const res = await fetch(`/api/youtube-metadata?videoId=${videoId}`);
    if (!res.ok) {
        return { title: "Không có tiêu đề", channel: "Không rõ tác giả" };
    }
    const data = await res.json();
    return data;
};

export default function VideoDetailPage({ params }: { params: { videoId: string } }) {
    const [videoData, setVideoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchVideoDetails = async () => {
            setLoading(true);
            
            const { data, error } = await supabase
                .from('videos')
                .select('url')
                .eq('id', params.videoId)
                .single();

            if (error || !data || !data.url) {
                console.error("Lỗi khi lấy video từ Supabase:", error);
                setLoading(false);
                return;
            }

            const youtubeId = getYouTubeVideoId(data.url);
            let metadata = { title: "Không có tiêu đề", author: "Không rõ tác giả" };
            
            if (youtubeId) {
                const youtubeMetadata = await fetchYouTubeMetadata(youtubeId);
                metadata = { title: youtubeMetadata.title, author: youtubeMetadata.channel };
            }

            setVideoData({ ...data, ...metadata });
            setLoading(false);
        };
        fetchVideoDetails();
    }, [params.videoId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
    }

    if (!videoData) {
        return <div>Video không tồn tại.</div>;
    }

    return (
        <section className="bg-[#E4FFFE] w-auto h-[90%] p-4 shadow-xl rounded-xl mx-4 ">
            <div className=''>
                <div className="flex gap-2 mb-6">
                    <Button onClick={() => router.back()} className="!bg-[#97DDD9] !h-[46px] !font-bold !text-black !hover:bg-[#97DDD9] !rounded-xl !mr-80">
                        <img src='/back_icon.png' alt="" width={20} height={20} />
                        <span className="text-black font-bold text-[20px]">Back</span>
                    </Button>
                    
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => router.push(`/?tab=${tab}`)}
                            disabled
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
                        <h2 className="text-black text-[24px]">Author: {videoData.author}</h2>
                    </div>
                    <div>
                        <CommentSection videoId={params.videoId} />
                    </div>
                </div>
            </div>
        </section>
    );
}