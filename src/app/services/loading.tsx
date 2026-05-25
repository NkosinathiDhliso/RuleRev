import { SkeletonPage, SkeletonLine, SkeletonBlock } from '@/components/Skeleton';

export default function Loading() {
  return (
    <SkeletonPage>
      <SkeletonLine size="xl" />
      <SkeletonLine size="lg" width="60%" />
      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <SkeletonBlock height={240} />
        <SkeletonBlock height={240} />
        <SkeletonBlock height={240} />
      </div>
    </SkeletonPage>
  );
}
