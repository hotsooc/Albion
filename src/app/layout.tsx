import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'antd/dist/reset.css';
import './globals.css';
import ClientLayoutWrapper from '@/component/ClientLayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My App',
  description: 'Login/Logout demo with Next.js + AntD',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}