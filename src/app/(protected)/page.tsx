'use client';

import React, { useState, useEffect } from 'react';

export default function Page() {
  const [showFullImage, setShowFullImage] = useState(true);
  const [imageSrc, setImageSrc] = useState('/image/Image_Guild.png');
  const [isAnimating, setIsAnimating] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);
 
  const handleCloseFullImage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowFullImage(false);
      setIsAnimating(false);
    }, 400);
  };
 
  const handleImageClick = (src: string) => {
    setImageSrc(src);
    setShowFullImage(true);
    setIsAnimating(false);
  };

  return (
    <>
      {showFullImage && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-[9999] overflow-hidden bg-[#f8efe5]/95 backdrop-blur-sm ${
            isAnimating ? 'animate-fade-out-screen' : 'animate-fade-in-screen'
          }`}
          onClick={handleCloseFullImage}
        >
          {/* Cloud elements */}
          <div className={`cloud-base cloud-sm top-[10%] left-[5%] ${isAnimating ? 'animate-cloud-fade-out-1' : 'animate-cloud-fade-in-1'}`}></div>
          <div className={`cloud-base cloud-md top-[20%] right-[10%] ${isAnimating ? 'animate-cloud-fade-out-2' : 'animate-cloud-fade-in-2'}`}></div>
          <div className={`cloud-base cloud-lg top-[35%] left-[15%] ${isAnimating ? 'animate-cloud-fade-out-3' : 'animate-cloud-fade-in-3'}`}></div>
          <div className={`cloud-base cloud-md bottom-[25%] left-[20%] ${isAnimating ? 'animate-cloud-fade-out-4' : 'animate-cloud-fade-in-4'}`}></div>
          <div className={`cloud-base cloud-sm bottom-[10%] right-[5%] ${isAnimating ? 'animate-cloud-fade-out-5' : 'animate-cloud-fade-in-5'}`}></div>
          <div className={`cloud-base cloud-lg top-[5%] right-[25%] ${isAnimating ? 'animate-cloud-fade-out-6' : 'animate-cloud-fade-in-6'}`}></div>
          <div className={`cloud-base cloud-sm bottom-[5%] left-[25%] ${isAnimating ? 'animate-cloud-fade-out-7' : 'animate-cloud-fade-in-7'}`}></div>
          <div className={`cloud-base cloud-md top-[40%] right-[30%] ${isAnimating ? 'animate-cloud-fade-out-8' : 'animate-cloud-fade-in-8'}`}></div>
          <div className={`cloud-base cloud-sm top-[50%] left-[30%] ${isAnimating ? 'animate-cloud-fade-out-9' : 'animate-cloud-fade-in-9'}`}></div>
          <div className={`cloud-base cloud-lg bottom-[15%] right-[15%] ${isAnimating ? 'animate-cloud-fade-out-10' : 'animate-cloud-fade-in-10'}`}></div>
          <div className={`cloud-base cloud-md top-[25%] left-[40%] ${isAnimating ? 'animate-cloud-fade-out-11' : 'animate-cloud-fade-in-11'}`}></div>
          <div className={`cloud-base cloud-sm bottom-[40%] right-[40%] ${isAnimating ? 'animate-cloud-fade-out-12' : 'animate-cloud-fade-in-12'}`}></div>
          <div className={`cloud-base cloud-lg top-[15%] right-[45%] ${isAnimating ? 'animate-cloud-fade-out-13' : 'animate-cloud-fade-in-13'}`}></div>
          <div className={`cloud-base cloud-md bottom-[50%] left-[5%] ${isAnimating ? 'animate-cloud-fade-out-14' : 'animate-cloud-fade-in-14'}`}></div>
          <div className={`cloud-base cloud-sm top-[60%] right-[50%] ${isAnimating ? 'animate-cloud-fade-out-15' : 'animate-cloud-fade-in-15'}`}></div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt="Full-screen Guild Image"
            className={`w-[85%] h-[85%] object-contain cursor-pointer rounded-2xl border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white p-3 ${
              isAnimating ? 'animate-zoom-out-clear' : 'animate-zoom-in-clear'
            }`}
          />
        </div>
      )}

      <div className="flex flex-col items-center justify-start py-8 max-w-5xl mx-auto px-4">
        {/* Intro */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest font-extrabold px-4 py-1.5 bg-[#ebc7b5] border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block mb-4 sora-font text-black">
            Guild Banner
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight sora-font mb-4 text-black">
            XHCN Albion Guild Showcase
          </h1>
          <p className="text-sm md:text-base text-[#2d3748] max-w-lg mx-auto font-bold sora-font">
            Click on the banner below to expand it in full screen and view the interactive cloud transitions.
          </p>
        </div>
        
        {/* Banner image Neo-brutalist container */}
        <div
          className="cursor-pointer border-4 border-black rounded-[32px] bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-4xl"
          onClick={() => handleImageClick('/image/Image_Guild.png')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/image/Image_Guild.png"
            alt="Guild Image"
            className="w-full h-auto max-h-[60vh] object-contain rounded-2xl"
          />
        </div>
      </div>

      <style jsx global>{`
        /* Keyframes */
        @keyframes cloudBaseIn {
          0% { opacity: 0; transform: scale(0.5) translate(-50px, 50px); }
          50% { opacity: 0.8; transform: scale(1) translate(0px, 0px); }
          100% { opacity: 0; transform: scale(1.5) translate(50px, -50px); }
        }

        .cloud-base {
          position: absolute;
          background: #ffffff;
          border-radius: 50%;
          filter: blur(8px);
          box-shadow: 
            50px 10px 0 10px #f8f8f8,
            -30px 20px 0 15px #f8f8f8,
            20px -40px 0 10px #f8f8f8;
          z-index: 10;
          pointer-events: none;
        }

        .cloud-sm { width: 80px; height: 80px; }
        .cloud-md { width: 120px; height: 120px; }
        .cloud-lg { width: 180px; height: 180px; }

        .animate-cloud-fade-in-1 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 0s; }
        .animate-cloud-fade-out-1 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 0s; }
        .animate-cloud-fade-in-2 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 0.2s; }
        .animate-cloud-fade-out-2 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 0.2s; }
        .animate-cloud-fade-in-3 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 0.4s; }
        .animate-cloud-fade-out-3 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 0.4s; }
        .animate-cloud-fade-in-4 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 0.6s; }
        .animate-cloud-fade-out-4 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 0.6s; }
        .animate-cloud-fade-in-5 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 0.8s; }
        .animate-cloud-fade-out-5 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 0.8s; }
        .animate-cloud-fade-in-6 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 1s; }
        .animate-cloud-fade-out-6 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 1s; }
        .animate-cloud-fade-in-7 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 1.2s; }
        .animate-cloud-fade-out-7 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 1.2s; }
        .animate-cloud-fade-in-8 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 1.4s; }
        .animate-cloud-fade-out-8 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 1.4s; }
        .animate-cloud-fade-in-9 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 1.6s; }
        .animate-cloud-fade-out-9 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 1.6s; }
        .animate-cloud-fade-in-10 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 1.8s; }
        .animate-cloud-fade-out-10 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 1.8s; }
        .animate-cloud-fade-in-11 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 2s; }
        .animate-cloud-fade-out-11 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 2s; }
        .animate-cloud-fade-in-12 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 2.2s; }
        .animate-cloud-fade-out-12 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 2.2s; }
        .animate-cloud-fade-in-13 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 2.4s; }
        .animate-cloud-fade-out-13 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 2.4s; }
        .animate-cloud-fade-in-14 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 2.6s; }
        .animate-cloud-fade-out-14 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 2.6s; }
        .animate-cloud-fade-in-15 { animation: cloudBaseIn 2.2s ease-in-out forwards; animation-delay: 2.8s; }
        .animate-cloud-fade-out-15 { animation: cloudBaseIn 2.2s ease-in-out reverse forwards; animation-delay: 2.8s; }
        
        @keyframes fadeInScreen {
          from { background-color: rgba(248, 239, 229, 0); backdrop-filter: blur(0px); }
          to { background-color: rgba(248, 239, 229, 0.95); backdrop-filter: blur(4px); }
        }

        @keyframes fadeOutScreen {
          from { background-color: rgba(248, 239, 229, 0.95); backdrop-filter: blur(4px); }
          to { background-color: rgba(248, 239, 229, 0); backdrop-filter: blur(0px); }
        }

        @keyframes zoomInClear {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes zoomOutClear {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0; }
        }

        .animate-fade-in-screen {
          animation: fadeInScreen 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-out-screen {
          animation: fadeOutScreen 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-zoom-in-clear {
          animation: zoomInClear 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-zoom-out-clear {
          animation: zoomOutClear 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}
