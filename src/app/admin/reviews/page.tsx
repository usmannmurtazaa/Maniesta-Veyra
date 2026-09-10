import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { ReviewModeration } from '@/components/admin/review-moderation';
import { ReviewStatus } from '@prisma/client';

interface AdminReviewsPageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number(params.page || 1);
  const status = params.status as ReviewStatus | undefined;

  const { data: reviews } = await adminService.listReviews(page, 20, status);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Reviews</h1>
      <ReviewModeration reviews={reviews} />
    </div>
  );
}