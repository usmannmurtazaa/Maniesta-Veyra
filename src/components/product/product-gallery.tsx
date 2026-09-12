'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: { id: string; url: string; altText: string | null }[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = images[selectedIndex];

  if (images.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-mv-bg-alt">
        <div className="flex h-full items-center justify-center text-sm text-mv-muted">
          No image available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-mv-bg-alt">
        <Image
          src={selected.url}
          alt={selected.altText ?? 'Product image'}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Thumbnails — horizontally scrollable on mobile */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition md:h-20 md:w-20',
                i === selectedIndex
                  ? 'border-mv-primary'
                  : 'border-transparent hover:border-mv-border'
              )}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === selectedIndex}
            >
              <Image
                src={img.url}
                alt={img.altText ?? ''}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}