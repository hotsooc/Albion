'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Row, Col, Badge, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { supabase } from '../../../../lib/supabase/client';
import useTrans from '@/hooks/useTrans';
import type { VideoItem, NewsItem } from '@/types';
import dynamic from 'next/dynamic';
import { Wrench, Users, BookOpen, Film, Newspaper, ArrowRight, Video, Image as ImageIcon } from 'lucide-react';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as React.ComponentType<{
  src: string | null;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
}>;

export default function HomePage() {
  const { trans } = useTrans();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [highlightedVideo, setHighlightedVideo] = useState<VideoItem | null>(null);
  
  // Real-time Albion News State
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [activeNewsTab, setActiveNewsTab] = useState<'news' | 'patchnotes'>('news');

  // Original Cloud Overlay States
  const [showFullImage, setShowFullImage] = useState(true);
  const [imageSrc, setImageSrc] = useState('/image/group123.png');
  const [isAnimating, setIsAnimating] = useState(true);

  // Load cloud overlay anim on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch highlighted video
  useEffect(() => {
    const fetchVideo = async () => {
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .limit(1);

      if (videoError) {
        console.error('Error fetching latest video:', videoError);
      } else if (videoData && videoData.length > 0) {
        setHighlightedVideo(videoData[0] as VideoItem);
      } else {
        setHighlightedVideo({
          id: 'default',
          name: 'Epic Guild Fight - Highlight',
          url: 'https://www.youtube.com/watch?v=dAi2Bl-kStM&feature=youtu.be',
          description: 'Trận chiến Guild nảy lửa vùng Black Zone.',
          category: 'Highlight'
        });
      }
    };

    fetchVideo();
  }, []);

  // Fetch real-time Steam news based on active tab
  useEffect(() => {
    const fetchNews = async () => {
      setNewsLoading(true);
      const res = await fetch(`/api/albion-news?type=${activeNewsTab}`);
      if (res.ok) {
        const newsData = await res.json();
        setNewsList(newsData);
      } else {
        console.error('Failed to load real-time news');
      }
      setNewsLoading(false);
    };

    fetchNews();
  }, [activeNewsTab]);

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

  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      router.push(`/build?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const categories = [
    {
      title: trans.home.cardBuildsTitle,
      desc: trans.home.cardBuildsDesc,
      icon: <Wrench size={24} className="text-[var(--text-primary)]" />,
      path: '/build?show=true'
    },
    {
      title: trans.home.cardTeammateTitle,
      desc: trans.home.cardTeammateDesc,
      icon: <Users size={24} className="text-[var(--text-primary)]" />,
      path: '/teammate'
    },
    {
      title: trans.home.cardDictTitle,
      desc: trans.home.cardDictDesc,
      icon: <BookOpen size={24} className="text-[var(--text-primary)]" />,
      path: '/dictionary'
    },
    {
      title: trans.home.cardVideosTitle,
      desc: trans.home.cardVideosDesc,
      icon: <Film size={24} className="text-[var(--text-primary)]" />,
      path: '/videos'
    },
    {
      title: 'Kỷ niệm Guild XHCN',
      desc: 'Hiển thị ảnh tập thể bang hội với hiệu ứng đám mây đặc trưng của XHCN.',
      icon: <ImageIcon size={24} className="text-[var(--text-primary)]" />,
      action: () => handleImageClick('/image/group123.png'),
      isOverlayTrigger: true
    }
  ];

  return (
    <>
      {/* Original Cloud Overlay & Animations */}
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

      {/* Main Wiki Dashboard Homepage */}
      <div className="flex flex-col gap-8 w-auto mx-2 md:mr-10 transition-all duration-300 text-[var(--text-primary)]">
        
        {/* Hero Welcome Banner */}
        <section className="relative rounded-[32px] border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] p-6 md:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.2)] overflow-hidden theme-transition flex flex-col items-center text-center">
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[var(--color-accent)] opacity-10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[var(--color-accent)] opacity-10 blur-3xl pointer-events-none"></div>
          
          <div className="relative max-w-2xl mx-auto space-y-4">
            <Badge count="WIKI PORTAL" className="!bg-[var(--color-accent)] !text-[var(--text-btn-upload)] border-none font-extrabold px-3 py-1 rounded-full sora-font text-[10px]" />
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display sora-font leading-tight">
              {trans.home.welcomeTitle}
            </h1>
            <p className="text-sm md:text-base text-[var(--text-secondary)] font-semibold leading-relaxed max-w-xl mx-auto">
              {trans.home.welcomeSubtitle}
            </p>
          </div>

          {/* Hero Search input */}
          <div className="w-full max-w-md mt-8 flex items-center rounded-full overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-input)] px-4 transition-all duration-300 focus-within:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:focus-within:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.2)]">
            <SearchOutlined className="text-[var(--text-primary)] text-lg mr-2" />
            <Input
              placeholder={trans.common.searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearchSubmit}
              className="!border-none !shadow-none bg-transparent flex-grow h-11 focus:ring-0 !text-[var(--text-primary)]"
            />
            <Button
              type="primary"
              onClick={handleSearchSubmit}
              className="!h-8 !px-4 !rounded-full border-none !bg-[var(--color-accent)] hover:!bg-[var(--color-accent-hover)] !text-[var(--text-btn-upload)] font-bold sora-font transition-all flex items-center gap-1 shrink-0"
            >
              <span>Search</span>
            </Button>
          </div>
        </section>

        {/* Wiki Categories Grid Section */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold sora-font tracking-tight ml-2">
            {trans.home.categoriesTitle}
          </h2>
          
          <Row gutter={[16, 16]}>
            {categories.map((cat, idx) => (
              <Col key={idx} xs={24} sm={12} md={idx === 4 ? 24 : 12} lg={idx === 4 ? 8 : 4} className="flex-grow">
                <div
                  onClick={cat.isOverlayTrigger ? cat.action : () => router.push(cat.path!)}
                  className={`group cursor-pointer h-full rounded-2xl border-2 border-[var(--border-color)] p-6 bg-[var(--bg-panel-solid)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.15)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(120,100,240,0.25)] hover:-translate-y-[2px] transition-all duration-200 flex flex-col justify-between ${
                    cat.isOverlayTrigger ? '!bg-[var(--bg-column)] border-dashed' : ''
                  }`}
                >
                  <div>
                    <div className="inline-flex p-3 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-column)] group-hover:bg-[var(--color-accent)] transition-colors duration-200 mb-4">
                      {cat.icon}
                    </div>
                    <h3 className="text-lg font-extrabold sora-font tracking-tight text-[var(--text-primary)] mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] font-semibold leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-end text-xs font-bold text-[var(--text-primary)] group-hover:translate-x-1 transition-transform duration-200">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </section>

        {/* Main Grid: Highlight Video & Real-time News split */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
          
          {/* Highlighted Video Card */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-extrabold sora-font tracking-tight ml-2 flex items-center gap-2">
              <Video size={22} />
              {trans.home.recentVideos}
            </h2>
            
            {highlightedVideo && (
              <div className="rounded-[32px] border-2 border-[var(--border-color)] p-5 bg-[var(--bg-panel-solid)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.2)] flex flex-col gap-4 h-full">
                <div className="video-wrapper relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-[var(--border-color)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.15)] bg-black">
                  <ReactPlayer
                    src={highlightedVideo.url}
                    controls={true}
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0"
                  />
                </div>
                <div className="flex flex-col ml-1">
                  <span className="text-xl font-extrabold sora-font tracking-tight text-[var(--text-primary)]">
                    {highlightedVideo.name}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] font-bold uppercase mt-1">
                    Category: {highlightedVideo.category}
                  </span>
                  <p className="text-sm text-[var(--text-secondary)] mt-3 whitespace-pre-wrap bg-[var(--bg-column)] p-3 rounded-xl border border-[var(--border-color)]">
                    {highlightedVideo.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Albion News Column */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-extrabold sora-font tracking-tight ml-2 flex items-center gap-2">
              <Newspaper size={22} />
              {trans.home.newsTitle}
            </h2>

            <div className="rounded-[32px] border-2 border-[var(--border-color)] p-5 bg-[var(--bg-panel-solid)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.2)] flex flex-col gap-4 h-full max-h-[500px] overflow-y-auto">
              
              {/* Tab Switcher */}
              <div className="flex border-b border-[var(--border-color)] mb-2 p-1 bg-[var(--bg-column)] rounded-xl gap-2">
                <button
                  onClick={() => setActiveNewsTab('news')}
                  className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all duration-200 ${
                    activeNewsTab === 'news'
                      ? 'bg-[var(--color-accent)] text-[var(--text-btn-upload)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel-solid)]'
                  }`}
                >
                  Bản Tin Game
                </button>
                <button
                  onClick={() => setActiveNewsTab('patchnotes')}
                  className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all duration-200 ${
                    activeNewsTab === 'patchnotes'
                      ? 'bg-[var(--color-accent)] text-[var(--text-btn-upload)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel-solid)]'
                  }`}
                >
                  Patch Updates
                </button>
              </div>

              {newsLoading ? (
                <div className="flex justify-center items-center h-48">
                  <Spin size="large" />
                </div>
              ) : newsList.length === 0 ? (
                <div className="text-center p-8 text-[var(--text-secondary)] font-bold">
                  Không thể tải bản tin trực tiếp. Vui lòng kiểm tra lại kết nối.
                </div>
              ) : (
                newsList.map((news) => (
                  <a
                    key={news.id}
                    href={news.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-xl border-2 border-[var(--border-color)] p-4 bg-[var(--bg-column)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] transition-all duration-200 flex flex-col gap-1.5"
                  >
                    <div className="flex justify-between items-center w-full">
                      <Badge 
                        count={news.category} 
                        className={`border-none font-bold text-[9px] rounded-full ${
                          news.category === 'NEWS' 
                            ? '!bg-[var(--color-accent)] !text-[var(--text-btn-upload)]' 
                            : (news.category === 'PATCH'
                              ? '!bg-emerald-100 dark:!bg-emerald-950 !text-emerald-700 dark:!text-emerald-300'
                              : '!bg-amber-100 dark:!bg-amber-950 !text-amber-700 dark:!text-amber-300')
                        }`} 
                      />
                      <span className="text-[10px] text-[var(--text-secondary)] font-bold">
                        {news.date}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold sora-font text-[var(--text-primary)] group-hover:text-[var(--color-accent-hover)] dark:group-hover:text-white transition-colors duration-200 leading-snug">
                      {news.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                      {news.description}
                    </p>
                  </a>
                ))
              )}

            </div>
          </div>

        </section>

        {/* XHCN Guild Memory Showcase Section */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold sora-font tracking-tight ml-2 flex items-center gap-2">
            <ImageIcon size={22} className="text-[var(--text-primary)]" />
            Điểm Nhấn Guild XHCN
          </h2>
          <div 
            onClick={() => handleImageClick('/image/group123.png')}
            className="group cursor-pointer relative rounded-[32px] border-2 border-[var(--border-color)] p-6 bg-[var(--bg-panel-solid)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(120,100,240,0.3)] hover:-translate-y-[2px] transition-all duration-300 overflow-hidden flex flex-col items-center justify-center gap-4"
          >
            {/* Elegant preview container */}
            <div className="relative w-full max-w-4xl aspect-[21/9] rounded-2xl overflow-hidden border-2 border-[var(--border-color)] bg-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/group123.png"
                alt="Guild XHCN Group Memory"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <h3 className="text-xl font-black sora-font tracking-wide">
                    Đại Gia Đình Guild XHCN
                  </h3>
                  <p className="text-xs text-gray-200 font-medium">
                    Nơi hội tụ các anh hùng Albion Việt Nam - Xã Hội Chủ Nghĩa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Global CSS Styles for Cloud Animations */}
      <style jsx global>{`
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
