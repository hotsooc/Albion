import BuildPageClient from '@/component/BuildPageClient';
import { Suspense } from 'react';

export default function BuildPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <BuildPageClient />
    </Suspense>
  );
}