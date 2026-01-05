"use client";
import YouTubeTV from '@/component/retroTV';
import React, { useState } from 'react';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState('');

  const handleUpdateVideo = (e: any) => {
    const value = e.target.value;
    setInputUrl(value);

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = value.match(regExp);
    
    if (match && match[2].length === 11) {
      setCurrentVideoId(match[2]);
    }
  };

  return (
    <main className="bg-[#0f172a] flex flex-col items-center justify-center rounded-2xl">
      <div className="my-5 text-center">
        <p className="text-4xl font-black text-white tracking-tighter">
          Retro <span className="text-red-500">Tube</span>
        </p>
      </div>

      <YouTubeTV videoId={currentVideoId} />

      <div className="my-5 w-full max-w-md group">
        <div className="relative">
          <input
            type="text"
            placeholder="Dán link YouTube vào đây..."
            value={inputUrl}
            onChange={handleUpdateVideo}
            className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-300"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 group-focus-within:text-red-500 transition-colors">
            LIVE PREVIEW
          </div>
        </div>
      </div>
    </main>
  );
}