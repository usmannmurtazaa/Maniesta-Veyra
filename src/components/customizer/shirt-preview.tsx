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
    <div
      className={`relative aspect-[5/6] overflow-hidden rounded-lg border border-mv-border bg-mv-bg-alt ${className ?? ''}`}
    >
      {/* Garment base — static asset, use next/image */}
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

      {/* Design overlay — user-uploaded blob, positioned via CSS transforms.
          next/image cannot optimize a blob: URL, and the transforms make the
          optimizer irrelevant. Native <img> is the correct choice here. */}
      {designImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={designImageUrl}
          alt="Uploaded design preview"
          draggable={false}
          className="absolute select-none"
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