import { RatingStars } from '@/components/reviews/rating-stars';

interface ProductRatingProps {
  rating: number;
  ratingCount?: number;
}

export function ProductRating({ rating, ratingCount }: ProductRatingProps) {
  return (
    <div className="flex items-center gap-2">
      <RatingStars rating={rating} />
      {ratingCount !== undefined && (
        <span className="text-xs text-mv-muted">({ratingCount})</span>
      )}
    </div>
  );
}