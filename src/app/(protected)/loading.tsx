import { GridSkeleton } from '@/component/Skeleton';

export default function Loading() {
  return (
    <div className="w-full h-full p-2 md:p-6 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-10 w-64 rounded-full bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.2)] mb-8" />
        <GridSkeleton count={6} />
      </div>
    </div>
  );
}
