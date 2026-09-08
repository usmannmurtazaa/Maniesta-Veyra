'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: { id: string; url: string; altText: string | null }[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-mv-bg-alt rounded-lg overflow-hidden">
        {selectedImage ? (
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText || 'Product image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-mv-muted">No image</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-md border',
                i === selectedIndex ? 'border-mv-primary' : 'border-mv-border'
              )}
            >
              <Image src={img.url} alt={img.altText || ''} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}