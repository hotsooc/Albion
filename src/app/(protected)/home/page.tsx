'use client';

import React, { useState, useEffect } from 'react';
// import { Baloo_2 } from 'next/font/google';

// const balooFont = Baloo_2({
//   subsets: ['vietnamese'],
//   weight: ['800'],
// });

export default function Home() {
  const [showFullImage, setShowFullImage] = useState(true);
  const [imageSrc, setImageSrc] = useState('/group123.png');
  const [isAnimating, setIsAnimating] = useState(true); 

  useEffect(() => {
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  }, []);

  const handleCloseFullImage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowFullImage(false);
      setIsAnimating(false);
    }, 2000);
  };

  const handleImageClick = (src: string) => {
    setImageSrc(src);
    setIsAnimating(true);
    setTimeout(() => {
      setShowFullImage(true);
      setIsAnimating(false);
    }, 2000);
  };

  return (
    <>
      {showFullImage && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-[9999] overflow-hidden bg-black ${isAnimating ? 'animate-fade-out-screen' : 'animate-fade-in-screen'}`}
          onClick={handleCloseFullImage}
        >
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
            className={`w-auto h-auto object-cover cursor-pointer ${isAnimating ? 'animate-zoom-out-clear' : 'animate-zoom-in-clear'}`}
          />
        </div>
      )}

      <section className='flex flex-col justify-start items-center w-auto h-auto rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] mt-10 mx-4'>
        <div
          className="transition-all duration-300 ease-in-out transform shadow-xl hover:scale-105 cursor-pointer overflow-hidden "
          onClick={() => handleImageClick('/group123.png')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/group123.png"
            alt="Guild Image"
            className='max-w-auto max-h-[90vh] !rounded-xl !shadow-xl'
          />
        </div>
      </section>

      <style jsx global>{`
        /* Các keyframes */
        @keyframes cloudBaseIn {
          0% { opacity: 0; transform: scale(0.5) translate(-50px, 50px); }
          50% { opacity: 0.9; transform: scale(1) translate(0px, 0px); }
          100% { opacity: 0; transform: scale(1.5) translate(50px, -50px); }
        }

        @keyframes cloudBaseOut {
          from { opacity: 0; }
          to { opacity: 0.9; }
        }

        .cloud-base {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          filter: blur(5px);
          box-shadow: 
            50px 10px 0 10px #f8f8f8,
            -30px 20px 0 15px #f8f8f8,
            20px -40px 0 10px #f8f8f8;
        }

        .cloud-sm { width: 80px; height: 80px; }
        .cloud-md { width: 120px; height: 120px; }
        .cloud-lg { width: 180px; height: 180px; }

        .animate-cloud-fade-in-1 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 0s; }
        .animate-cloud-fade-out-1 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 0s; }
        .animate-cloud-fade-in-2 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 0.2s; }
        .animate-cloud-fade-out-2 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 0.2s; }
        .animate-cloud-fade-in-3 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 0.4s; }
        .animate-cloud-fade-out-3 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 0.4s; }
        .animate-cloud-fade-in-4 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 0.6s; }
        .animate-cloud-fade-out-4 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 0.6s; }
        .animate-cloud-fade-in-5 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 0.8s; }
        .animate-cloud-fade-out-5 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 0.8s; }
        .animate-cloud-fade-in-6 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 1s; }
        .animate-cloud-fade-out-6 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 1s; }
        .animate-cloud-fade-in-7 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 1.2s; }
        .animate-cloud-fade-out-7 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 1.2s; }
        .animate-cloud-fade-in-8 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 1.4s; }
        .animate-cloud-fade-out-8 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 1.4s; }
        .animate-cloud-fade-in-9 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 1.6s; }
        .animate-cloud-fade-out-9 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 1.6s; }
        .animate-cloud-fade-in-10 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 1.8s; }
        .animate-cloud-fade-out-10 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 1.8s; }
        .animate-cloud-fade-in-11 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 2s; }
        .animate-cloud-fade-out-11 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 2s; }
        .animate-cloud-fade-in-12 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 2.2s; }
        .animate-cloud-fade-out-12 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 2.2s; }
        .animate-cloud-fade-in-13 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 2.4s; }
        .animate-cloud-fade-out-13 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 2.4s; }
        .animate-cloud-fade-in-14 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 2.6s; }
        .animate-cloud-fade-out-14 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 2.6s; }
        .animate-cloud-fade-in-15 { animation: cloudBaseIn 2s ease-in-out forwards; animation-delay: 2.8s; }
        .animate-cloud-fade-out-15 { animation: cloudBaseIn 2s ease-in-out reverse forwards; animation-delay: 2.8s; }
        
        @keyframes fadeInScreen {
          from { background-color: rgba(0, 0, 0, 0); }
          to { background-color: rgba(0, 0, 0, 1); }
        }

        @keyframes fadeOutScreen {
          from { background-color: rgba(0, 0, 0, 1); }
          to { background-color: rgba(0, 0, 0, 0); }
        }

        @keyframes zoomInClear {
          0% { transform: scale(0.8); opacity: 0; filter: blur(20px); }
          50% { transform: scale(0.9); opacity: 0.5; filter: blur(10px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0px); }
        }

        @keyframes zoomOutClear {
          0% { transform: scale(1); opacity: 1; filter: blur(0px); }
          50% { transform: scale(0.9); opacity: 0.5; filter: blur(10px); }
          100% { transform: scale(0.8); opacity: 0; filter: blur(20px); }
        }

        .animate-fade-in-screen {
          animation: fadeInScreen 0.5s ease-out forwards;
        }
        .animate-fade-out-screen {
          animation: fadeOutScreen 0.5s ease-out forwards;
        }

        .animate-zoom-in-clear {
          animation: zoomInClear 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-zoom-out-clear {
          animation: zoomOutClear 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </>
  );
}