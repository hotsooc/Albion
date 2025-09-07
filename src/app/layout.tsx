import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'antd/dist/reset.css';
import './globals.css';
import AntdProvider from '@/component/AntdProvider';
import AppHeader from '@/component/AppHeader';
import { cookies } from 'next/headers';
import Sidebar from '@/component/Sidebar';
// import Footer from '@/component/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My App',
  description: 'Login/Logout demo with Next.js + AntD',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookiesStoreCorrect = await cookies();
  const token = cookiesStoreCorrect.get('token')?.value;

  return (
    <html lang="vi">
      <body className={inter.className}>
        <AntdProvider>
          <div className="flex h-screen overflow-hidden bg-gradient-to-r from-sky-200 to-green-200">
            <Sidebar />
            <div className="flex flex-col flex-grow">
              <AppHeader loggedIn={!!token} />
              <main className='flex-grow p-4'>
                {children}
              </main>
              {/* <Footer /> */}
            </div>
          </div>
        </AntdProvider>
      </body>
    </html>
  );
}