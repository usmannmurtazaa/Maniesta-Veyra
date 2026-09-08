'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = '/images/placeholder.png',
  fill = true,
  className,
  sizes,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? fallbackSrc : src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={cn('object-cover', className)}
      onError={() => setError(true)}
    />
  );
}