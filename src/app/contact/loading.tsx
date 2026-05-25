import { SkeletonPage, SkeletonLine, SkeletonBlock } from '@/components/Skeleton';

export default function Loading() {
  return (
    <SkeletonPage>
      <SkeletonLine size="xl" />
      <SkeletonLine size="lg" width="50%" />
      <div style={{ marginTop: 32 }}>
        <SkeletonBlock height={300} />
      </div>
    </SkeletonPage>
  );
}
