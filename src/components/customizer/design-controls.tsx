'use client';

import { Button } from '@/components/ui/button';
import { useCustomizerStore } from '@/stores/customizer-store';
import { RotateCcw, Trash2 } from 'lucide-react';

export function DesignControls() {
  const { activeLocation, setAssetConfig } = useCustomizerStore();

  if (!activeLocation) return null;

  const resetPosition = () => {
    setAssetConfig(activeLocation, {
      positionX: 50,
      positionY: 50,
    });
  };

  const resetScale = () => {
    setAssetConfig(activeLocation, {
      scale: 0.5,
    });
  };

  const resetRotation = () => {
    setAssetConfig(activeLocation, {
      rotation: 0,
    });
  };

  const clearDesign = () => {
    setAssetConfig(activeLocation, {
      imageUrl: undefined,
      fileName: undefined,
      fileSize: undefined,
      mimeType: undefined,
      imageWidth: undefined,
      imageHeight: undefined,
      positionX: 50,
      positionY: 50,
      scale: 0.5,
      rotation: 0,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={resetPosition}>
        Reset Position
      </Button>
      <Button variant="outline" size="sm" onClick={resetScale}>
        Reset Scale
      </Button>
      <Button variant="outline" size="sm" onClick={resetRotation}>
        <RotateCcw className="h-3.5 w-3.5 mr-1" />
        Reset Rotation
      </Button>
      <Button variant="ghost" size="sm" className="text-mv-error" onClick={clearDesign}>
        <Trash2 className="h-3.5 w-3.5 mr-1" />
        Remove Design
      </Button>
    </div>
  );
}