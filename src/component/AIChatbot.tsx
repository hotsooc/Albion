'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, Sparkles, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { ChatMessage } from '@/types';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Xin chào! Tôi là Albion Guide. Tôi có thể giúp gì cho bạn dựa trên thông tin trang này?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    setMessages([
      { 
        role: 'assistant', 
        content: `Tôi thấy bạn vừa chuyển sang trang ${getPageName(pathname)}. Tôi có thể hỗ trợ gì cho bạn tại đây?` 
      }
    ]);
  }, [pathname]);

  const getPageName = (path: string) => {
    if (path.includes('/build')) return 'Builds Trang bị';
    if (path.includes('/teammate')) return 'Đồng đội / Đội hình';
    if (path.includes('/videos')) return 'Video hướng dẫn';
    if (path.includes('/dictionary')) return 'Từ điển thuật ngữ';
    if (path.includes('/settings')) return 'Cài đặt';
    if (path.includes('/aboutus')) return 'Giới thiệu';
    return 'Trang chủ';
  };

  const getDOMContext = () => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return `Người dùng đang xem trang: ${pathname}`;

    const headings = Array.from(mainElement.querySelectorAll('h1, h2, h3'))
      .map(h => h.textContent?.trim())
      .filter(Boolean)
      .join(', ');

    const textContent = mainElement.innerText || '';
    const cleanText = textContent
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 1500);

    return `Đường dẫn trang: ${pathname} (${getPageName(pathname)})
Tiêu đề xuất hiện: ${headings}
Nội dung đang hiển thị trên màn hình:
---
${cleanText}
---`;
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    const updatedMessages = [...messages, { role: 'user', content: userMessage } as ChatMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    const pageContext = getDOMContext();
    
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: updatedMessages,
        context: pageContext,
      }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: `Lỗi: ${data.error}` }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.reply }
        ]);
      }
    })
    .then(() => {
      setIsTyping(false);
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-600 border-2 border-[var(--border-color)] text-white rounded-full flex items-center justify-center cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.25)] relative group"
        title="Chat với Trợ lý AI"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="flex items-center justify-center"
            >
              <Bot size={24} className="group-hover:animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Glow Notification badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-purple-500 border border-white"></span>
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute bottom-18 right-0 w-[350px] sm:w-[400px] h-[500px] bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(120,100,240,0.25)] overflow-hidden flex flex-col theme-transition"
          >
            {/* Chat Header */}
            <div className="bg-[var(--bg-column)] border-b-2 border-[var(--border-color)] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl text-white border border-[var(--border-color)]">
                  <Bot size={18} />
                </div>
                <div>
                  <span className="block text-sm font-extrabold sora-font tracking-tight text-[var(--text-primary)]">
                    Albion AI Expert
                  </span>
                  <span className="block text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={10} className="text-purple-500" />
                    Context-Aware
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-[var(--bg-hover-nav)] rounded-full text-[var(--text-primary)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-grow overflow-y-auto no-scrollbar p-4 space-y-4 bg-[var(--background)]/30">
              {messages.map((msg, index) => {
                const isAI = msg.role === 'assistant';
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`p-1.5 rounded-lg border flex-shrink-0 ${
                        isAI
                          ? 'bg-purple-100 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400'
                          : 'bg-indigo-100 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {isAI ? <Bot size={14} /> : <User size={14} />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`p-3 rounded-2xl text-xs md:text-sm leading-relaxed border font-semibold whitespace-pre-wrap ${
                        isAI
                          ? 'bg-[var(--bg-panel-solid)] border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]'
                          : 'bg-[var(--color-accent)] border-[var(--border-color)] text-[var(--text-btn-upload)] rounded-tr-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {/* Typing State indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 mr-auto bg-[var(--bg-panel-solid)] border border-[var(--border-color)] p-3 rounded-2xl rounded-tl-none max-w-[70%] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                  <div className="flex gap-1 items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="border-t-2 border-[var(--border-color)] p-3 bg-[var(--bg-column)] flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Hỏi AI về thông tin trang này..."
                className="w-full bg-[var(--bg-input)] text-[var(--text-primary)] text-sm font-semibold outline-none border border-[var(--border-color)] rounded-xl px-3 focus:ring-0 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl cursor-pointer border border-[var(--border-color)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[0.5px] transition-all flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
