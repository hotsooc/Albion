'use client';

import { ConfigProvider, theme } from 'antd';
import viVN from 'antd/locale/vi_VN';
import React from 'react';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{ algorithm: theme.defaultAlgorithm, token: { colorPrimary: '#1677ff', borderRadius: 8 } }}
    >
      {children}
    </ConfigProvider>
  );
}
