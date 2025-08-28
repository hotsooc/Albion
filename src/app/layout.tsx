// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'antd/dist/reset.css';
import './globals.css';
import AntdProvider from '@/component/AntdProvider';
import AppHeader from '@/component/AppHeader';
import { cookies } from 'next/headers';
import Footer from '@/component/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My App',
  description: 'Login/Logout demo with Next.js + AntD',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookiesStoreCorrect = cookies();
  const token = cookiesStoreCorrect.get('token')?.value;

  return (
    <html lang="vi">
      <body className={inter.className}>
        <AntdProvider>
          <div className="min-h-screen flex flex-col">
            <AppHeader loggedIn={!!token} />
            <main style={{ padding: 24 }}>{children}</main>
            <Footer />
          </div>
        </AntdProvider>
      </body>
    </html>
  );
}
