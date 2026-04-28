import React from 'react';

// ─── Base shimmer block ────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
}
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    style={{
      background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-shimmer 1.4s infinite',
    }}
  />
);

// ─── Product card skeleton ─────────────────────────────────────────────────────
export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
    <Skeleton className="h-52 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  </div>
);

// ─── Sponsor card skeleton ─────────────────────────────────────────────────────
export const SponsorCardSkeleton: React.FC = () => (
  <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
    <div className="flex items-center justify-center px-8 py-10" style={{ minHeight: '160px' }}>
      <Skeleton className="h-16 w-32" />
    </div>
    <div className="px-6 py-5 space-y-3 bg-gray-50">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  </div>
);

// ─── News card skeleton ────────────────────────────────────────────────────────
export const NewsCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-4 w-24 mt-2" />
    </div>
  </div>
);
