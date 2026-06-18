"use client";

const YouTubeTV = ({ videoId }: { videoId: string }) => {
  return (
    <div className="relative w-full max-w-[760px] mx-auto">
      <div className="relative bg-[#ebc7b5] p-4 md:p-6 rounded-[2.5rem] md:rounded-[3.5rem] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
        
        {/* Screen Container */}
        <div className="relative w-full aspect-[4/3] bg-black rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-[8px] md:border-[12px] border-black shadow-inner">
          
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[1.2rem] md:rounded-[2rem]">
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

        {/* Controls Panel */}
        <div className="flex justify-between items-center px-4 md:px-8">
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-2 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-black shadow-[0_0_8px_red] animate-pulse"></div>
              <span className="text-[10px] text-black font-extrabold font-mono uppercase tracking-tighter">Power</span>
            </div>
            <div className="w-12 h-1 bg-black rounded-full opacity-50"></div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-white hover:bg-[#fcf8f2] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-[9px] text-black font-extrabold cursor-pointer transition-all">VOL</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-white hover:bg-[#fcf8f2] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-[9px] text-black font-extrabold cursor-pointer transition-all">CH</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legs Stand */}
      <div className="relative flex justify-center -mt-1">
        <div className="w-32 h-4 bg-black border-2 border-black rounded-b-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-white/20"></div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeTV;
