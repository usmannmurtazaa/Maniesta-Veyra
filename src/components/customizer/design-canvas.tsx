'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Transformer } from 'react-konva';
import { useCustomizerStore } from '@/stores/customizer-store';
import type { KonvaEventObject } from 'konva/lib/Node';

export function DesignCanvas() {
  const { activeLocation, assets, setAssetConfig } = useCustomizerStore();
  const [garmentImage, setGarmentImage] = useState<HTMLImageElement | null>(null);
  const [designImage, setDesignImage] = useState<HTMLImageElement | null>(null);
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const imageRef = useRef<any>(null);

  const asset = activeLocation ? assets[activeLocation] : undefined;

  // Load garment image placeholder (we can use a static shirt silhouette)
  useEffect(() => {
    const img = new window.Image();
    img.src = '/images/shirt-placeholder.png'; // we need to provide this image; but if missing, use colored rect.
    img.crossOrigin = 'anonymous';
    img.onload = () => setGarmentImage(img);
  }, []);

  // Load design image when URL changes
  useEffect(() => {
    if (asset?.imageUrl) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = asset.imageUrl;
      img.onload = () => setDesignImage(img);
    } else {
      setDesignImage(null);
    }
  }, [asset?.imageUrl]);

  useEffect(() => {
    if (transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [designImage, activeLocation]);

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const node = e.target;
    setAssetConfig(activeLocation!, {
      positionX: node.x(),
      positionY: node.y(),
    });
  };

  const handleTransformEnd = () => {
    const node = imageRef.current;
    if (!node) return;
    setAssetConfig(activeLocation!, {
      positionX: node.x(),
      positionY: node.y(),
      scale: node.scaleX(),
      rotation: node.rotation(),
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Position Your Design</h2>
      <div className="border border-mv-border rounded-lg overflow-hidden">
        <Stage ref={stageRef} width={500} height={600}>
          <Layer>
            {garmentImage ? (
              <KonvaImage image={garmentImage} width={500} height={600} listening={false} />
            ) : (
              <Rect width={500} height={600} fill="#f5f5f0" />
            )}
            {/* Printable area outline */}
            <Rect
              x={150} y={150} width={200} height={300}
              stroke="rgba(0,0,0,0.2)" strokeWidth={1} dash={[5,5]} listening={false}
            />
            {designImage && asset && (
              <KonvaImage
                ref={imageRef}
                image={designImage}
                x={asset.positionX}
                y={asset.positionY}
                scaleX={asset.scale}
                scaleY={asset.scale}
                rotation={asset.rotation}
                draggable
                onDragEnd={handleDragEnd}
                onTransformEnd={handleTransformEnd}
                dragBoundFunc={(pos) => {
                  const halfW = (designImage.width * asset.scale) / 2;
                  const halfH = (designImage.height * asset.scale) / 2;
                  return {
                    x: Math.min(Math.max(pos.x, 150 + halfW), 150 + 200 - halfW),
                    y: Math.min(Math.max(pos.y, 150 + halfH), 150 + 300 - halfH),
                  };
                }}
              />
            )}
          </Layer>
          {designImage && (
            <Layer>
              <Transformer
                ref={transformerRef}
                rotateEnabled
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.x < 150 || newBox.y < 150 || newBox.x + newBox.width > 350 || newBox.y + newBox.height > 450) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            </Layer>
          )}
        </Stage>
      </div>
      <p className="text-sm text-mv-muted">Drag to move, use handles to resize/rotate. Design must stay inside dashed area.</p>
    </div>
  );
}