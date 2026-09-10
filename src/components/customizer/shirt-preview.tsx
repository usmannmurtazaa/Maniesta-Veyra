'use client';

import Image from 'next/image';

interface ShirtPreviewProps {
  garmentImageUrl?: string;
  designImageUrl?: string;
  positionX?: number; // 0-100 (percentage)
  positionY?: number; // 0-100 (percentage)
  scale?: number; // 0.05 to maxScale
  rotation?: number; // degrees
  className?: string;
}

export function ShirtPreview({
  garmentImageUrl,
  designImageUrl,
  positionX = 50,
  positionY = 50,
  scale = 0.5,
  rotation = 0,
  className,
}: ShirtPreviewProps) {
  return (
    <div className={`relative aspect-[5/6] overflow-hidden rounded-lg border border-mv-border bg-mv-bg-alt ${className ?? ''}`}>
      {/* Garment base */}
      {garmentImageUrl ? (
        <Image
          src={garmentImageUrl}
          alt="Garment preview"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-mv-muted">
          Select a garment to preview
        </div>
      )}

      {/* Design overlay */}
      {designImageUrl && (
        <img
          src={designImageUrl}
          alt="Uploaded design"
          className="absolute"
          style={{
            left: `${positionX}%`,
            top: `${positionY}%`,
            transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            maxWidth: '40%',
            maxHeight: '40%',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}