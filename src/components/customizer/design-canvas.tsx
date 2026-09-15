'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Transformer,
} from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type Konva from 'konva';
import { AlertCircle } from 'lucide-react';

import { useCustomizerStore } from '@/stores/customizer-store';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 600;

const PRINT_AREA = {
  x: 150,
  y: 150,
  width: 200,
  height: 300,
};

const MIN_DESIGN_SIZE = 20;
const DEFAULT_SCALE = 0.5;

export function DesignCanvas() {
  const activeLocation = useCustomizerStore((s) => s.activeLocation);
  const assets = useCustomizerStore((s) => s.assets);
  const setAssetConfig = useCustomizerStore((s) => s.setAssetConfig);

  const [garmentImage, setGarmentImage] = useState<HTMLImageElement | null>(
    null
  );
  const [designImage, setDesignImage] = useState<HTMLImageElement | null>(
    null
  );
  const [imageError, setImageError] = useState(false);

  const transformerRef = useRef<Konva.Transformer | null>(null);
  const imageRef = useRef<Konva.Image | null>(null);

  const asset = activeLocation ? assets[activeLocation] : undefined;

  // ---- Load garment placeholder ----
  useEffect(() => {
    let cancelled = false;
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      if (!cancelled) setGarmentImage(image);
    };
    image.onerror = () => {
      if (!cancelled) setGarmentImage(null);
    };
    image.src = '/images/shirt-placeholder.png';
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Load user design ----
  useEffect(() => {
    let cancelled = false;
    setDesignImage(null);
    setImageError(false);

    if (!asset?.imageUrl) {
      return () => {
        cancelled = true;
      };
    }

    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      if (!cancelled) setDesignImage(image);
    };
    image.onerror = () => {
      if (!cancelled) {
        setDesignImage(null);
        setImageError(true);
      }
    };
    image.src = asset.imageUrl;

    return () => {
      cancelled = true;
    };
  }, [asset?.imageUrl]);

  // ---- Attach transformer to design image ----
  useEffect(() => {
    const transformer = transformerRef.current;
    const imageNode = imageRef.current;
    if (!transformer || !imageNode || !designImage) return;

    transformer.nodes([imageNode]);
    const layer = transformer.getLayer();
    if (layer) layer.batchDraw();
  }, [designImage, activeLocation]);

  // ---- Drag handler ----
  const handleDragEnd = (event: KonvaEventObject<DragEvent>) => {
    if (!activeLocation) return;
    const node = event.target;
    setAssetConfig(activeLocation, {
      positionX: node.x(),
      positionY: node.y(),
    });
  };

  // ---- Transform handler ----
  const handleTransformEnd = () => {
    if (!activeLocation) return;
    const node = imageRef.current;
    if (!node) return;

    const scaleX = Math.abs(node.scaleX());
    const scaleY = Math.abs(node.scaleY());
    const scale = (scaleX + scaleY) / 2;

    setAssetConfig(activeLocation, {
      positionX: node.x(),
      positionY: node.y(),
      scale,
      rotation: node.rotation(),
    });
  };

  // ---- No active location ----
  if (!activeLocation) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Position Your Design</h2>
          <p className="mt-1 text-sm text-mv-muted">
            Select a print location to continue.
          </p>
        </div>
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-mv-border">
          <p className="text-sm text-mv-muted">
            Please select a print location first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Position Your Design</h2>
        <p className="mt-1 text-sm text-mv-muted">
          Position your design inside the printable area.
        </p>
      </div>

      {imageError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-mv-error/30 bg-mv-error/5 p-3"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-mv-error"
            aria-hidden
          />
          <p className="text-sm text-mv-error">
            Could not load your design image. Please re-upload it in the
            previous step.
          </p>
        </div>
      )}

      <div className="w-full overflow-auto rounded-lg border border-mv-border">
        <div
          className="mx-auto"
          style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        >
          <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
            {/* Garment + printable area */}
            <Layer>
              {garmentImage ? (
                <KonvaImage
                  image={garmentImage}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  listening={false}
                />
              ) : (
                <Rect
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  fill="#f5f5f0"
                  listening={false}
                />
              )}

              <Rect
                x={PRINT_AREA.x}
                y={PRINT_AREA.y}
                width={PRINT_AREA.width}
                height={PRINT_AREA.height}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth={1}
                dash={[5, 5]}
                listening={false}
              />

              {designImage && asset && (
                <KonvaImage
                  ref={imageRef}
                  image={designImage}
                  x={asset.positionX}
                  y={asset.positionY}
                  scaleX={asset.scale ?? DEFAULT_SCALE}
                  scaleY={asset.scale ?? DEFAULT_SCALE}
                  rotation={asset.rotation ?? 0}
                  draggable
                  onDragEnd={handleDragEnd}
                  onTransformEnd={handleTransformEnd}
                  dragBoundFunc={(position) => {
                    const scale = asset.scale ?? DEFAULT_SCALE;
                    const halfWidth = (designImage.width * scale) / 2;
                    const halfHeight = (designImage.height * scale) / 2;

                    const minX = PRINT_AREA.x + halfWidth;
                    const maxX =
                      PRINT_AREA.x + PRINT_AREA.width - halfWidth;
                    const minY = PRINT_AREA.y + halfHeight;
                    const maxY =
                      PRINT_AREA.y + PRINT_AREA.height - halfHeight;

                    // Design larger than printable area → center it
                    if (minX > maxX || minY > maxY) {
                      return {
                        x: PRINT_AREA.x + PRINT_AREA.width / 2,
                        y: PRINT_AREA.y + PRINT_AREA.height / 2,
                      };
                    }

                    return {
                      x: Math.min(Math.max(position.x, minX), maxX),
                      y: Math.min(Math.max(position.y, minY), maxY),
                    };
                  }}
                />
              )}
            </Layer>

            {/* Transformer */}
            {designImage && asset && (
              <Layer>
                <Transformer
                  ref={transformerRef}
                  rotateEnabled
                  keepRatio
                  enabledAnchors={[
                    'top-left',
                    'top-right',
                    'bottom-left',
                    'bottom-right',
                  ]}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (
                      Math.abs(newBox.width) < MIN_DESIGN_SIZE ||
                      Math.abs(newBox.height) < MIN_DESIGN_SIZE
                    ) {
                      return oldBox;
                    }
                    if (
                      newBox.x < PRINT_AREA.x ||
                      newBox.y < PRINT_AREA.y ||
                      newBox.x + newBox.width >
                        PRINT_AREA.x + PRINT_AREA.width ||
                      newBox.y + newBox.height >
                        PRINT_AREA.y + PRINT_AREA.height
                    ) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              </Layer>
            )}
          </Stage>
        </div>
      </div>

      <p className="text-sm text-mv-muted">
        Drag to move. Use the corner handles to resize or rotate. Your design
        must remain inside the dashed printable area.
      </p>
    </div>
  );
}