"use client";
import React from 'react';

const YouTubeTV = ({ videoId }: { videoId: string }) => {
  return (
    <div className="relative w-full max-w-[1000px] mx-auto group">
      <div className="relative bg-[#2a2a2a] p-6 rounded-[3.5rem] shadow-[0_0_60px_rgba(0,0,0,0.7),inset_0_2px_10px_rgba(255,255,255,0.1)] border-b-[10px] border-black">
        
        <div className="relative bg-black rounded-[2.5rem] overflow-hidden aspect-[4/3] border-[15px] border-[#1a1a1a] shadow-inner">
          
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[2rem]">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-60"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_3px,3px_100%]"></div>
          </div>

          <div className="absolute inset-0 z-10 scale-[1.02]">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&modestbranding=1&rel=0&controls=1`}
              className="w-full h-full object-cover"
              title="YouTube TV Screen"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center px-10">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_red] animate-pulse"></div>
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">Power</span>
            </div>
            <div className="w-16 h-1 bg-black rounded-full opacity-30"></div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#333] to-[#222] border border-black shadow-lg flex items-center justify-center text-[9px] text-gray-400 font-bold active:scale-95 cursor-pointer">VOL</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#333] to-[#222] border border-black shadow-lg flex items-center justify-center text-[9px] text-gray-400 font-bold active:scale-95 cursor-pointer">CH</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex justify-center -mt-2">
        <div className="w-40 h-6 bg-[#151515] rounded-b-2xl shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-black/50"></div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeTV;