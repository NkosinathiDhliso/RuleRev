import { SkeletonPage, SkeletonLine, SkeletonGrid } from '@/components/Skeleton';

export default function Loading() {
  return (
    <SkeletonPage>
      <SkeletonLine size="xl" />
      <SkeletonLine size="lg" width="50%" />
      <SkeletonGrid count={3} />
    </SkeletonPage>
  );
}
