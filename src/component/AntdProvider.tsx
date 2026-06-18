'use client';

import { ConfigProvider, theme as antdTheme } from 'antd';
import viVN from 'antd/locale/vi_VN';
import React, { useEffect, useState } from 'react';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = document.documentElement;
    setIsDark(el.getAttribute('data-theme') === 'dark');

    const observer = new MutationObserver(() => {
      setIsDark(el.getAttribute('data-theme') === 'dark');
    });
    observer.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return (
      <ConfigProvider locale={viVN} theme={{ algorithm: antdTheme.defaultAlgorithm, token: { borderRadius: 8 } }}>
        {children}
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          borderRadius: 8,
          colorPrimary: isDark ? '#7c3aed' : '#1677ff',
          colorBgContainer: isDark ? '#141428' : '#ffffff',
          colorBgElevated: isDark ? '#1a1a30' : '#ffffff',
          colorBorder: isDark ? '#2d2d4a' : '#000000',
          colorText: isDark ? '#e4e4e7' : '#000000',
          colorTextSecondary: isDark ? '#a1a1aa' : '#5d6c7b',
          controlItemBgHover: isDark ? '#252550' : '#fcf8f2',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
