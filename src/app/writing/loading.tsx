import { SkeletonPage, SkeletonLine, SkeletonBlock } from '@/components/Skeleton';

export default function Loading() {
  return (
    <SkeletonPage>
      <SkeletonLine size="xl" />
      <SkeletonLine size="lg" width="55%" />
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <SkeletonBlock key={i} height={80} />
        ))}
      </div>
    </SkeletonPage>
  );
}
