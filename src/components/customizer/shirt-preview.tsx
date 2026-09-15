'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ShirtPreviewProps {
  garmentImageUrl?: string;
  designImageUrl?: string;
  /**
   * Position in the same pixel coordinate system used by the Konva
   * canvas (design-canvas.tsx). The printable area on that canvas is
   * (150, 150, 200, 300) on a 500×600 stage.
   */
  positionX?: number;
  positionY?: number;
  scale?: number;
  rotation?: number;
  className?: string;
}

// Must match the constants in design-canvas.tsx
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 600;
const PRINT_AREA = { x: 150, y: 150, width: 200, height: 300 };

export function ShirtPreview({
  garmentImageUrl,
  designImageUrl,
  positionX = 250,
  positionY = 300,
  scale = 0.5,
  rotation = 0,
  className,
}: ShirtPreviewProps) {
  // Convert the printable-area-local pixel coordinates to percentages of
  // the printable area. This positions the overlay relative to the same
  // sub-region the Konva editor uses, so preview and editor stay in sync.
  const printAreaLeftPct = (PRINT_AREA.x / CANVAS_WIDTH) * 100;   // 30%
  const printAreaTopPct = (PRINT_AREA.y / CANVAS_HEIGHT) * 100;   // 25%
  const printAreaWidthPct = (PRINT_AREA.width / CANVAS_WIDTH) * 100;  // 40%
  const printAreaHeightPct = (PRINT_AREA.height / CANVAS_HEIGHT) * 100; // 50%

  const designLeftPct =
    ((positionX - PRINT_AREA.x) / PRINT_AREA.width) * 100;
  const designTopPct =
    ((positionY - PRINT_AREA.y) / PRINT_AREA.height) * 100;

  return (
    <div
      className={cn(
        'relative aspect-[5/6] overflow-hidden rounded-lg border border-mv-border bg-mv-bg-alt',
        className
      )}
    >
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

      {designImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- blob URL from canvas.toDataURL
        <img
          src={designImageUrl}
          alt="Uploaded design preview"
          draggable={false}
          className="absolute select-none"
          style={{
            left: `${printAreaLeftPct + (designLeftPct / 100) * printAreaWidthPct}%`,
            top: `${printAreaTopPct + (designTopPct / 100) * printAreaHeightPct}%`,
            transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            maxWidth: `${printAreaWidthPct}%`,
            maxHeight: `${printAreaHeightPct}%`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}