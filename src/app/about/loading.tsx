import { SkeletonPage, SkeletonLine, SkeletonBlock } from '@/components/Skeleton';

export default function Loading() {
  return (
    <SkeletonPage>
      <SkeletonLine size="xl" />
      <SkeletonLine size="lg" width="65%" />
      <div style={{ marginTop: 32 }}>
        <SkeletonLine width="100%" />
        <SkeletonLine width="95%" />
        <SkeletonLine width="88%" />
        <SkeletonLine width="80%" />
      </div>
      <div style={{ marginTop: 32 }}>
        <SkeletonBlock height={200} />
      </div>
    </SkeletonPage>
  );
}
