'use client';

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-[24px] border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
      <div className="h-6 w-3/4 rounded-full bg-[var(--bg-column)]" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded-full bg-[var(--bg-column)]" />
        <div className="h-4 w-5/6 rounded-full bg-[var(--bg-column)]" />
        <div className="h-4 w-2/3 rounded-full bg-[var(--bg-column)]" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] p-4 space-y-3">
          <div className="aspect-video rounded-xl bg-[var(--bg-column)]" />
          <div className="h-4 w-3/4 rounded-full bg-[var(--bg-column)]" />
          <div className="h-3 w-1/2 rounded-full bg-[var(--bg-column)]" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-full border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)]">
          <div className="w-8 h-8 rounded-full bg-[var(--bg-column)]" />
          <div className="h-4 flex-1 rounded-full bg-[var(--bg-column)]" />
        </div>
      ))}
    </div>
  );
}
