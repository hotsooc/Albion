'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Users, Film, Wrench, BookOpen, X, CornerDownLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import useTrans from '@/hooks/useTrans';
import { glossaryTerms, GlossaryTerm } from '@/store/glossary';
import { allItemsData, ItemType } from '@/store/data';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'teammate' | 'video' | 'build' | 'dictionary';
  url: string;
  extra?: any;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { trans, lang } = useTrans();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Cache data sets to speed up search
  const [builds, setBuilds] = useState<ItemType[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [teams, setTeams] = useState<string[]>([]);

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch initial search data
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Builds
        const { data: buildsData } = await supabase
          .from('teams_data')
          .select('data')
          .eq('id', 2)
          .single();
        if (buildsData && buildsData.data) {
          setBuilds((buildsData.data as any).builds || allItemsData);
        } else {
          setBuilds(allItemsData);
        }

        // 2. Fetch Videos
        const { data: videosData } = await supabase
          .from('videos')
          .select('*');
        if (videosData) {
          setVideos(videosData);
        }

        // 3. Fetch Teammates (teams_list)
        const { data: teamData } = await supabase
          .from('teams_list')
          .select('*')
          .eq('id', 1)
          .single();
        if (teamData) {
          setTeams(teamData.team_names || []);
        }
      } catch (err) {
        console.error('Error caching command palette data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    setQuery('');
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  // Handle Search Input
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const tempResults: SearchResult[] = [];

    // Priority 1: Teammates (Teams list)
    teams.forEach((team, index) => {
      if (team.toLowerCase().includes(q)) {
        tempResults.push({
          id: `team-${index}`,
          title: team,
          subtitle: trans.sidebar.team,
          type: 'teammate',
          url: '/teammate'
        });
      }
    });

    // Priority 2: Videos
    videos.forEach((video) => {
      if (
        video.name.toLowerCase().includes(q) ||
        (video.description && video.description.toLowerCase().includes(q))
      ) {
        tempResults.push({
          id: `video-${video.id}`,
          title: video.name,
          subtitle: video.description || trans.sidebar.video,
          type: 'video',
          url: `/videos/${video.id}`
        });
      }
    });

    // Priority 3: Builds
    builds.forEach((build) => {
      if (
        build.name.toLowerCase().includes(q) ||
        (build.detail && build.detail.toLowerCase().includes(q))
      ) {
        tempResults.push({
          id: `build-${build.id}`,
          title: build.name,
          subtitle: build.detail || trans.sidebar.builds,
          type: 'build',
          url: `/build?q=${encodeURIComponent(build.name)}`
        });
      }
    });

    // Priority 4: Dictionary
    glossaryTerms.forEach((term) => {
      const definition = lang === 'vi' ? term.definitionVi : term.definitionEn;
      if (
        term.term.toLowerCase().includes(q) ||
        term.fullName.toLowerCase().includes(q) ||
        definition.toLowerCase().includes(q)
      ) {
        tempResults.push({
          id: `dict-${term.term}`,
          title: `${term.term} - ${term.fullName}`,
          subtitle: definition,
          type: 'dictionary',
          url: '/dictionary'
        });
      }
    });

    setResults(tempResults);
    setSelectedIndex(0);
  }, [query, builds, videos, teams, lang, trans]);

  // Navigate using Keyboard Arrow Keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsRef.current) {
      const activeEl = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (item: SearchResult) => {
    router.push(item.url);
    setIsOpen(false);
  };

  const getIcon = (type: SearchResult['type']) => {
    const cls = "text-[var(--text-primary)] opacity-70";
    switch (type) {
      case 'teammate':
        return <Users size={18} className={cls} />;
      case 'video':
        return <Film size={18} className={cls} />;
      case 'build':
        return <Wrench size={18} className={cls} />;
      case 'dictionary':
        return <BookOpen size={18} className={cls} />;
    }
  };

  return (
    <>
      {/* Trigger Button in Header (Responsive: Collapses to icon on mobile) */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between bg-[var(--bg-input)] hover:bg-[var(--bg-hover-nav)] text-[var(--text-secondary)] border-2 border-[var(--border-color)] rounded-full h-[40px] md:h-11 p-2 md:px-4 w-[40px] md:w-full max-w-xl cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.15)] transition-all duration-200"
      >
        <div className="flex items-center gap-2 justify-center w-full md:justify-start">
          <Search size={18} className="text-[var(--text-primary)] flex-shrink-0" />
          <span className="hidden md:inline text-sm font-semibold tracking-tight sora-font text-left truncate">
            {trans.common.searchPlaceholder || 'Tìm kiếm...'}
          </span>
        </div>
        <kbd className="hidden md:inline-flex items-center gap-0.5 select-none rounded border border-[var(--border-color)] bg-[var(--bg-column)] px-2 font-mono text-[10px] font-bold text-[var(--text-primary)] h-6">
          <span>Ctrl</span>K
        </kbd>
      </button>

      {/* Backdrop & Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(120,100,240,0.25)] overflow-hidden z-10 flex flex-col max-h-[60vh] theme-transition"
            >
              {/* Header Input */}
              <div className="flex items-center border-b-2 border-[var(--border-color)] px-4 py-3 bg-[var(--bg-column)]">
                <Search size={20} className="text-[var(--text-primary)] mr-3 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Gõ để tìm kiếm video, builds, đội hình..."
                  className="w-full bg-transparent border-none text-[var(--text-primary)] font-semibold sora-font outline-none placeholder:text-[var(--text-secondary)] text-base focus:ring-0 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 hover:bg-[var(--bg-hover-nav)] rounded-full text-[var(--text-primary)] mr-2 flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-2 py-1 text-[11px] font-bold border border-[var(--border-color)] bg-[var(--bg-panel-solid)] rounded-md text-[var(--text-primary)] hover:bg-[var(--bg-hover-nav)] flex-shrink-0"
                >
                  ESC
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-grow overflow-y-auto no-scrollbar p-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent)]" />
                    <span className="text-sm font-bold text-[var(--text-secondary)] sora-font">Đang tải dữ liệu...</span>
                  </div>
                ) : !query ? (
                  // Welcome/Placeholder view
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs uppercase font-extrabold text-[var(--text-secondary)] mb-2 tracking-wider">
                        Phân loại tìm kiếm
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => { router.push('/teammate'); setIsOpen(false); }}
                          className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] transition-all text-left font-bold text-sm cursor-pointer"
                        >
                          <Users size={18} className="text-indigo-500" />
                          <span>Tìm kiếm Đội hình / Đồng đội</span>
                        </button>
                        <button
                          onClick={() => { router.push('/videos'); setIsOpen(false); }}
                          className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] transition-all text-left font-bold text-sm cursor-pointer"
                        >
                          <Film size={18} className="text-rose-500" />
                          <span>Tìm kiếm Video hướng dẫn</span>
                        </button>
                        <button
                          onClick={() => { router.push('/build'); setIsOpen(false); }}
                          className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] transition-all text-left font-bold text-sm cursor-pointer"
                        >
                          <Wrench size={18} className="text-emerald-500" />
                          <span>Tìm kiếm Builds trang bị</span>
                        </button>
                        <button
                          onClick={() => { router.push('/dictionary'); setIsOpen(false); }}
                          className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] transition-all text-left font-bold text-sm cursor-pointer"
                        >
                          <BookOpen size={18} className="text-amber-500" />
                          <span>Từ điển thuật ngữ Albion</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  // Empty State
                  <div className="flex flex-col items-center justify-center py-12 text-[var(--text-secondary)]">
                    <p className="font-extrabold sora-font text-lg mb-1">Không tìm thấy kết quả</p>
                    <p className="text-sm">Hãy thử từ khóa khác như "Bloodletter" hoặc "ZvZ"...</p>
                  </div>
                ) : (
                  // Search Results
                  <div ref={resultsRef} className="space-y-1">
                    {results.map((item, index) => {
                      const isSelected = selectedIndex === index;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                            isSelected
                              ? 'bg-[var(--color-accent)] border-[var(--border-color)] text-[var(--text-btn-upload)] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                              : 'bg-transparent border-transparent text-[var(--text-primary)]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2 rounded-lg bg-[var(--bg-column)] border border-[var(--border-color)]`}>
                              {getIcon(item.type)}
                            </div>
                            <div className="min-w-0">
                              <span className="block text-sm truncate font-bold sora-font">{item.title}</span>
                              <span
                                className={`block text-[11px] truncate ${
                                  isSelected ? 'text-[var(--text-btn-upload)] opacity-80' : 'text-[var(--text-secondary)]'
                                }`}
                              >
                                {item.subtitle}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-1 text-[11px] border border-[var(--border-color)] bg-[var(--bg-panel-solid)] px-1.5 py-0.5 rounded text-[var(--text-primary)]">
                              <span>Enter</span>
                              <CornerDownLeft size={10} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer Instructions */}
              <div className="border-t-2 border-[var(--border-color)] px-4 py-2.5 bg-[var(--bg-column)] text-[var(--text-secondary)] flex justify-between items-center text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="border border-[var(--border-color)] bg-[var(--bg-panel-solid)] px-1.5 py-0.5 rounded text-[10px] font-bold">↑↓</kbd>
                    Di chuyển
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="border border-[var(--border-color)] bg-[var(--bg-panel-solid)] px-1.5 py-0.5 rounded text-[10px] font-bold">Enter</kbd>
                    Chọn
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="border border-[var(--border-color)] bg-[var(--bg-panel-solid)] px-1.5 py-0.5 rounded text-[10px] font-bold">Esc</kbd>
                    Đóng
                  </span>
                </div>
                <div className="text-[var(--text-primary)] font-bold sora-font text-[10px] uppercase tracking-wider">
                  XHCN Search
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
