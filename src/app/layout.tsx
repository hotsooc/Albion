import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import 'antd/dist/reset.css';
import './globals.css';
import ClientLayoutWrapper from '@/component/ClientLayoutWrapper';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'XHCN Albion Guild Companion',
  description: 'Companion app for XHCN Guild in Albion Online',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}

