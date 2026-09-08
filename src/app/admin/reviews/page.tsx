import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { ReviewModeration } from '@/components/admin/review-moderation';

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  await requireAdmin();
  const page = Number(searchParams.page || 1);
  const status = searchParams.status as any;
  const { data: reviews, pagination } = await adminService.listReviews(page, 20, status);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Reviews</h1>
      <ReviewModeration reviews={reviews} />
    </div>
  );
}