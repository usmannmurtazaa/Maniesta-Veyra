'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  onChange?: (rating: number) => void;
}

export function RatingStars({ rating, max = 5, onChange }: RatingStarsProps) {
  const [hovered, setHovered] = useState(0);

  const handleClick = (value: number) => {
    onChange?.(value);
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= (hovered || rating);
        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => onChange && setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`Rate ${starValue} out of ${max}`}
            disabled={!onChange}
            className={onChange ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star
              className={`h-4 w-4 ${
                filled ? 'fill-mv-warning text-mv-warning' : 'text-mv-border'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}