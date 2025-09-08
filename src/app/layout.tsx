import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'antd/dist/reset.css';
import './globals.css';
import AntdProvider from '@/component/AntdProvider';
import AppHeader from '@/component/AppHeader';
import Sidebar from '@/component/Sidebar';
import { createClient } from '../../lib/supabase/server';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My App',
  description: 'Login/Logout demo with Next.js + AntD',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { session } } = await (await supabase).auth.getSession();
  // const loggedIn = !!session;

  return (
    <html lang="vi">
      <body className={inter.className}>
        <AntdProvider>
          <div className="flex h-screen overflow-hidden bg-gradient-to-r from-sky-200 to-green-200">
            <Sidebar />
            <div className="flex flex-col flex-grow">
              <AppHeader />
              <main className='flex-grow'>
                {children}
              </main>
            </div>
          </div>
        </AntdProvider>
      </body>
    </html>
  );
}