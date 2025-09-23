import { Suspense } from 'react';
import Link from 'next/link';
import BuildPageClient from '@/component/BuildPageClient';

export default function BuildPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const showContent = searchParams['show'] === 'true';

  if (!showContent) {
    return (
      <div className='flex justify-center items-center w-full h-full cursor-pointer pl-1 pr-10'>
        <Link href="/build?show=true">
          <img src="/Group4.png" alt="Enter button" className='w-screen h-[85vh]' />
        </Link>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <BuildPageClient />
    </Suspense>
  );
}