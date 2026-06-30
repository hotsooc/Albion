'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  Film, 
  Wrench, 
  User as UserIcon, 
  Settings, 
  BookOpen, 
  ChevronDown, 
  Gamepad2, 
  Swords,
  Compass
} from 'lucide-react';
import useTrans from '@/hooks/useTrans';

interface SidebarSubItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  href?: string;
  children?: SidebarSubItem[];
}

interface SidebarChapter {
  id: string;
  title: string;
  subtitle?: string;
  items: SidebarItem[];
}

const Sidebar = ({
  isOpen = true,
  toggleSidebar = () => {},
  isMobile: mobileMode = false,
  mobileOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  toggleSidebar?: () => void;
  isMobile?: boolean;
  mobileOpen?: boolean;
  onClose?: () => void;
}) => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const { trans } = useTrans();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } = {} } = await supabase.auth.getUser();
      setUser(user || null);
    };
    fetchUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  // Storytelling branches and data structure
  const chapters: SidebarChapter[] = useMemo(() => [
    {
      id: "chapter1",
      title: trans.sidebar.chapter1Title || "Chương I: Khởi Hành",
      subtitle: trans.sidebar.chapter1Subtitle || "Cập nhật bản doanh",
      items: [
        {
          id: "home",
          label: trans.sidebar.home,
          description: trans.sidebar.homeDesc || "Bản doanh XHCN",
          icon: <Home size={18} className="text-[var(--text-primary)] flex-shrink-0" />,
          href: "/home"
        },
        {
          id: "dictionary",
          label: trans.sidebar.dictionary,
          description: trans.sidebar.dictionaryDesc || "Giải mã thuật ngữ",
          icon: <BookOpen size={18} className="text-[var(--text-primary)] flex-shrink-0" />,
          href: "/dictionary"
        }
      ]
    },
    {
      id: "chapter2",
      title: trans.sidebar.chapter2Title || "Chương II: Binh Khí Phổ",
      subtitle: trans.sidebar.chapter2Subtitle || "Vũ khí & kỹ thuật",
      items: [
        {
          id: "arsenal",
          label: trans.sidebar.arsenalTitle || "Kho Thần Khí",
          description: trans.sidebar.arsenalDesc || "Trang bị & Clip chiến sự",
          icon: <Swords size={18} className="text-[var(--text-primary)] flex-shrink-0" />,
          children: [
            { id: "builds", label: trans.sidebar.builds, href: "/build", icon: <Wrench size={14} /> },
            { id: "videos", label: trans.sidebar.video, href: "/videos", icon: <Film size={14} /> },
            { id: "youtube", label: trans.sidebar.retroTV, href: "/youtube", icon: <Film size={14} /> }
          ]
        }
      ]
    },
    {
      id: "chapter3",
      title: trans.sidebar.chapter3Title || "Chương III: Liên Minh CTA",
      subtitle: trans.sidebar.chapter3Subtitle || "Tìm đội & Rèn luyện",
      items: [
        {
          id: "warband",
          label: trans.sidebar.warbandTitle || "Sảnh Tụ Nghĩa",
          description: trans.sidebar.warbandDesc || "CTA & Mini-games",
          icon: <Users size={18} className="text-[var(--text-primary)] flex-shrink-0" />,
          children: [
            { id: "teammate", label: trans.sidebar.team, href: "/teammate", icon: <Users size={14} /> },
            { id: "games", label: trans.sidebar.games || "Giải trí", href: "/games", icon: <Gamepad2 size={14} /> }
          ]
        }
      ]
    },
    {
      id: "chapter4",
      title: trans.sidebar.chapter4Title || "Chương IV: Sử Ký & Trại",
      subtitle: trans.sidebar.chapter4Subtitle || "Thông tin & Thiết lập",
      items: [
        {
          id: "aboutus",
          label: trans.sidebar.aboutUs,
          description: trans.sidebar.aboutUsDesc || "Bộ lạc Cu Đỏ",
          icon: <UserIcon size={18} className="text-[var(--text-primary)] flex-shrink-0" />,
          href: "/aboutus"
        },
        {
          id: "settings",
          label: trans.sidebar.settings,
          description: trans.sidebar.settingsDesc || "Doanh trại cá nhân",
          icon: <Settings size={18} className="text-[var(--text-primary)] flex-shrink-0" />,
          href: "/settings"
        }
      ]
    }
  ], [trans]);

  // Auto-expand parents of active sub-items on mount and pathname change
  useEffect(() => {
    chapters.forEach(ch => {
      ch.items.forEach(item => {
        if (item.children) {
          const hasActiveChild = item.children.some(sub => pathname.startsWith(sub.href));
          if (hasActiveChild) {
            setExpandedItems(prev => ({ ...prev, [item.id]: true }));
          }
        }
      });
    });
  }, [pathname, chapters]);

  if (!user) return null;

  const linkVariants: Variants = {
    initial: { scale: 1, x: 0 },
    hover: { scale: 1.01, x: (isOpen || mobileMode) ? 4 : 0, transition: { type: 'spring', stiffness: 400, damping: 15 } },
    tap: { scale: 0.99 },
  };

  const NavLabelAndIcon = (
    <div className='flex flex-row justify-center items-center gap-2.5 group/header'>
      <Compass size={20} className="text-[var(--text-primary)] group-hover/header:rotate-[360deg] transition-transform duration-700 ease-in-out" />
      <span className="sora-font text-[13px] font-extrabold text-[var(--text-primary)] tracking-wider uppercase">
        {trans.sidebar.navigation}
      </span>
    </div>
  );
  const MenuIcon = (
    <Compass 
      size={24} 
      className='text-[var(--text-primary)] hover:rotate-[360deg] transition-transform duration-700 ease-in-out' 
    />
  );

  // Helper to determine if parent contains the active child route
  const isParentActive = (item: SidebarItem) => {
    if (item.href) {
      return pathname.startsWith(item.href);
    }
    if (item.children) {
      return item.children.some(sub => pathname.startsWith(sub.href));
    }
    return false;
  };

  const renderCollapsedPopover = (item: SidebarItem) => {
    if (!item.children) {
      // Direct tooltip popover
      return (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50 bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] rounded-xl py-2 px-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.2)] whitespace-nowrap">
          <span className="text-xs font-bold text-[var(--text-primary)] sora-font">{item.label}</span>
        </div>
      );
    }

    // Storytelling branch floating popover
    return (
      <div className="absolute left-full top-0 ml-3 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50 bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] rounded-2xl py-3 px-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.25)] w-48 flex flex-col gap-1.5">
        <div className="text-[11px] font-extrabold uppercase text-[var(--text-secondary)] border-b border-[var(--border-color)]/20 pb-1.5 mb-1 px-1 sora-font">
          {item.label}
        </div>
        <div className="flex flex-col gap-1">
          {item.children.map(sub => {
            const isSubActive = pathname.startsWith(sub.href);
            return (
              <Link
                key={sub.id}
                href={sub.href}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl border text-xs transition-all duration-150 ${
                  isSubActive
                    ? 'bg-[var(--bg-active-nav)] border-[var(--border-color)] text-[var(--text-active-nav)] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.2)]'
                    : 'bg-transparent border-transparent hover:bg-[var(--bg-hover-nav)] text-[var(--text-primary)] hover:border-[var(--border-color)]/20'
                }`}
              >
                {sub.icon}
                <span className="sora-font font-medium">{sub.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  const renderChildrenList = (item: SidebarItem, onClick?: () => void) => {
    if (!item.children) return null;
    const isExpanded = expandedItems[item.id];

    return (
      <AnimatePresence initial={false}>
        {(isExpanded && (isOpen || mobileMode)) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden w-full flex flex-col gap-1.5 pl-5 mt-1.5 border-l-2 border-[var(--border-color)]/20 ml-5"
          >
            {item.children.map(sub => {
              const isSubActive = pathname.startsWith(sub.href);
              return (
                <Link
                  key={sub.id}
                  href={sub.href}
                  onClick={onClick}
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-xl border transition-all duration-150 text-xs ${
                    isSubActive
                      ? 'bg-[var(--bg-active-nav)] border-[var(--border-color)] text-[var(--text-active-nav)] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.2)]'
                      : 'bg-transparent border-transparent hover:bg-[var(--bg-hover-nav)] text-[var(--text-primary)] hover:border-[var(--border-color)]/20'
                  }`}
                >
                  {sub.icon}
                  <span className="sora-font font-bold">{sub.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const renderItemButton = (item: SidebarItem, onClick?: () => void) => {
    const isActive = isParentActive(item);
    const hasChildren = !!item.children;
    const isExpanded = expandedItems[item.id];

    const elementContent = (
      <>
        <div className="flex items-center gap-3 w-full">
          {item.icon}
          <div className={`flex flex-col items-start leading-tight ${!isOpen && !mobileMode && 'hidden'}`}>
            <span className="text-[13px] text-[var(--text-primary)] tracking-tight sora-font font-bold whitespace-nowrap">
              {item.label}
            </span>
            {item.description && (
              <span className="text-[10px] text-[var(--text-secondary)] font-normal whitespace-nowrap mt-0.5">
                {item.description}
              </span>
            )}
          </div>
        </div>
        {hasChildren && (isOpen || mobileMode) && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={`text-[var(--text-primary)] flex-shrink-0 ${!isOpen && !mobileMode && 'hidden'}`}
          >
            <ChevronDown size={16} />
          </motion.div>
        )}
      </>
    );

    if (hasChildren) {
      return (
        <button
          onClick={() => {
            if (isOpen || mobileMode) {
              setExpandedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }));
            }
            onClick?.();
          }}
          className={`flex items-center justify-between rounded-2xl border-2 transition-all duration-150 will-change-transform backface-visibility-hidden w-full cursor-pointer ${
            isActive && !isExpanded
              ? 'bg-[var(--bg-active-nav)] border-[var(--border-color)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.25)] text-[var(--text-active-nav)] font-bold py-2 px-4'
              : 'bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] border-[var(--border-color)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.15)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.2)] text-[var(--text-primary)] py-2 px-4'
          } ${mobileMode ? 'py-2.5 px-4' : isOpen ? 'py-2.5 px-4' : 'justify-center w-12 h-12 p-0'}`}
        >
          {isOpen || mobileMode ? elementContent : item.icon}
        </button>
      );
    }

    return (
      <Link
        href={item.href || '#'}
        onClick={onClick}
        className={`flex items-center rounded-2xl border-2 transition-all duration-150 will-change-transform backface-visibility-hidden w-full ${
          isActive
            ? 'bg-[var(--bg-active-nav)] border-[var(--border-color)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.25)] text-[var(--text-active-nav)] font-bold py-2 px-4'
            : 'bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] border-[var(--border-color)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.15)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.2)] text-[var(--text-primary)] py-2 px-4'
        } ${mobileMode ? 'py-2.5 px-4' : isOpen ? 'py-2.5 px-4' : 'justify-center w-12 h-12 p-0'}`}
      >
        {isOpen || mobileMode ? elementContent : item.icon}
      </Link>
    );
  };

  // Mobile overlay mode
  if (mobileMode) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <div key="mobile-sidebar-overlay" className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50" onClick={onClose}
            />
            <motion.section
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-0 h-full w-64 flex flex-col bg-[var(--bg-panel-solid)] border-r-2 border-[var(--border-color)] py-6 px-4 shadow-xl overflow-y-auto"
            >
              <div className="flex items-center justify-between w-full pt-2 pb-6">
                <span className="sora-font text-lg font-extrabold text-[var(--text-primary)]">{trans.sidebar.navigation}</span>
                <button
                  onClick={onClose}
                  className="cursor-pointer bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] border-2 border-[var(--border-color)] rounded-full p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.15)] transition-all duration-200"
                >
                  <span className="text-xl text-[var(--text-primary)]">✕</span>
                </button>
              </div>
              <nav className="w-full flex-grow flex flex-col gap-5">
                {chapters.map(chapter => (
                  <div key={chapter.id} className="w-full flex flex-col gap-2">
                    <div className="px-1">
                      <div className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-accent)] dark:text-[var(--color-accent)] leading-tight">
                        {chapter.title}
                      </div>
                      {chapter.subtitle && (
                        <div className="text-[9px] text-[var(--text-secondary)] font-medium leading-tight mt-0.5">
                          {chapter.subtitle}
                        </div>
                      )}
                    </div>
                    <ul className="w-full flex flex-col gap-2">
                      {chapter.items.map((item) => (
                        <li key={item.id} className="w-full flex flex-col items-start">
                          <motion.div variants={linkVariants} initial="initial" whileHover="hover" whileTap="tap" className="w-full">
                            {renderItemButton(item, onClose)}
                          </motion.div>
                          {renderChildrenList(item, onClose)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop mode
  return (
    <section
      className={`${isOpen ? "w-64" : "w-24"} flex flex-col items-center flex-none transition-[width] duration-200 ease-out py-6 px-4`}
      style={{ height: 'calc(100vh - 80px)' }}
    >
      <div className={`flex flex-row items-center pt-2 pb-6 transition-all duration-200 ${isOpen ? '' : 'justify-center w-full'}`}>
        <button
          onClick={toggleSidebar}
          className="cursor-pointer bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] border-2 border-[var(--border-color)] rounded-full p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(120,100,240,0.15)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.25)] transition-all duration-200 will-change-transform backface-visibility-hidden"
        >
          {isOpen ? NavLabelAndIcon : MenuIcon}
        </button>
      </div>
      <nav className={`w-full ${!isOpen ? 'overflow-visible flex flex-col items-center gap-5' : 'overflow-y-auto overflow-x-visible no-scrollbar flex flex-col gap-5'}`} style={{ flexGrow: 1 }}>
        {chapters.map(chapter => (
          <div key={chapter.id} className="w-full flex flex-col gap-2">
            {isOpen && (
              <div className="px-4">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-accent)] dark:text-[var(--color-accent)] leading-tight">
                  {chapter.title}
                </div>
                {chapter.subtitle && (
                  <div className="text-[9px] text-[var(--text-secondary)] font-medium leading-tight mt-0.5">
                    {chapter.subtitle}
                  </div>
                )}
              </div>
            )}
            <ul className="w-full flex flex-col gap-2">
              {chapter.items.map((item) => (
                <li key={item.id} className="w-full flex flex-col items-start relative group">
                  <motion.div variants={linkVariants} initial="initial" whileHover="hover" whileTap="tap" className={`w-full flex ${isOpen ? '' : 'justify-center'}`}>
                    {renderItemButton(item)}
                  </motion.div>
                  {renderChildrenList(item)}
                  {!isOpen && renderCollapsedPopover(item)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </section>
  );
};

export default Sidebar;
