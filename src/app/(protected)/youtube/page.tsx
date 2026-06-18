"use client";
import YouTubeTV from '@/component/retroTV';
import { useState } from 'react';
import useTrans from '@/hooks/useTrans';
import { getYouTubeVideoId } from '@/utils/youtube';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState('');
  const { trans } = useTrans();

  const handleUpdateVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputUrl(value);

    const videoId = getYouTubeVideoId(value);
    if (videoId) {
      setCurrentVideoId(videoId);
    }
  };

  return (
    <main className="p-8 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-[32px] ml-1 mr-6 text-black transition-all duration-300 flex flex-col items-center justify-center">
      <div className="my-5 text-center">
        <h1 className="text-4xl font-black text-black tracking-tighter sora-font">
          Retro <span className="text-red-600">Tube</span>
        </h1>
      </div>

      <YouTubeTV videoId={currentVideoId} />

      <div className="my-5 w-full max-w-md group">
        <div className="relative">
          <input
            type="text"
            placeholder={trans.youtube.placeholder}
            value={inputUrl}
            onChange={handleUpdateVideo}
            className="w-full px-6 py-4 bg-white border-2 border-black rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 font-bold sora-font"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-[#2d3748] group-focus-within:text-black transition-colors sora-font">
            LIVE PREVIEW
          </div>
        </div>
      </div>
    </main>
  );
}
