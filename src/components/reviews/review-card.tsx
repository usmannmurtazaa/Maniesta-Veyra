import { RatingStars } from './rating-stars';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title?: string | null;
    content?: string | null;
    createdAt: string | Date;
    user?: {
      firstName: string;
      lastName: string;
    } | null;
    isVerifiedPurchase?: boolean;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const date = new Date(review.createdAt).toLocaleDateString();
  const authorName = review.user
    ? `${review.user.firstName} ${review.user.lastName}`
    : 'Anonymous';

  return (
    <div className="border border-mv-border rounded-lg p-4">
      <div className="flex items-center justify-between gap-4">
        <RatingStars rating={review.rating} />
        <span className="text-xs text-mv-muted">{date}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-mv-text">
        {authorName}
        {review.isVerifiedPurchase && (
          <span className="ml-2 text-xs text-mv-success">Verified Purchase</span>
        )}
      </p>
      {review.title && (
        <h3 className="mt-2 font-semibold text-mv-text">{review.title}</h3>
      )}
      {review.content && (
        <p className="mt-1 text-sm text-mv-text-secondary">{review.content}</p>
      )}
    </div>
  );
}