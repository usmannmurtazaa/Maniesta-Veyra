import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
}

export function RatingStars({ rating, max = 5 }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.round(rating) ? 'fill-mv-warning text-mv-warning' : 'text-mv-border'
          }`}
        />
      ))}
    </div>
  );
}