import { SkeletonPage, SkeletonLine, SkeletonBlock } from '@/components/Skeleton';

export default function Loading() {
  return (
    <SkeletonPage>
      <SkeletonLine size="sm" width="20%" />
      <SkeletonLine size="xl" />
      <SkeletonLine size="lg" width="70%" />
      <div style={{ marginTop: 32 }}>
        <SkeletonBlock height={120} />
      </div>
      <div style={{ marginTop: 24 }}>
        <SkeletonLine width="100%" />
        <SkeletonLine width="95%" />
        <SkeletonLine width="88%" />
        <SkeletonLine width="92%" />
        <SkeletonLine width="60%" />
      </div>
      <div style={{ marginTop: 24 }}>
        <SkeletonLine width="100%" />
        <SkeletonLine width="90%" />
        <SkeletonLine width="85%" />
        <SkeletonLine width="70%" />
      </div>
    </SkeletonPage>
  );
}
