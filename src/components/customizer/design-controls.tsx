'use client';

import { useState } from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCustomizerStore } from '@/stores/customizer-store';

/**
 * Coordinates must match the canvas constants in `design-canvas.tsx` and
 * the store defaults in `customizer-store.ts`.
 *
 * Printable area on the 500×600 canvas:
 *   x = 150, y = 150, width = 200, height = 300
 * Center:
 *   x = 150 + 200/2 = 250
 *   y = 150 + 300/2 = 300
 */
const RESET_POSITION = { positionX: 250, positionY: 300 };
const RESET_SCALE = 0.5;
const RESET_ROTATION = 0;

export function DesignControls() {
  const { activeLocation, setAssetConfig } = useCustomizerStore();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  if (!activeLocation) return null;

  const resetPosition = () => {
    setAssetConfig(activeLocation, RESET_POSITION);
  };

  const resetScale = () => {
    setAssetConfig(activeLocation, { scale: RESET_SCALE });
  };

  const resetRotation = () => {
    setAssetConfig(activeLocation, { rotation: RESET_ROTATION });
  };

  const clearDesign = () => {
    setAssetConfig(activeLocation, {
      imageUrl: undefined,
      fileName: undefined,
      fileSize: undefined,
      mimeType: undefined,
      imageWidth: undefined,
      imageHeight: undefined,
      ...RESET_POSITION,
      scale: RESET_SCALE,
      rotation: RESET_ROTATION,
    });
    setConfirmClearOpen(false);
  };

  return (
    <>
      <div
        className="flex flex-wrap gap-2"
        role="toolbar"
        aria-label="Design controls"
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetPosition}
          aria-label="Reset design position"
        >
          Reset position
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetScale}
          aria-label="Reset design size"
        >
          Reset size
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetRotation}
          aria-label="Reset design rotation"
          className="gap-1"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset rotation
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1 text-mv-error hover:bg-mv-error/10 hover:text-mv-error"
          onClick={() => setConfirmClearOpen(true)}
          aria-label="Remove design from this print location"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          Remove design
        </Button>
      </div>

      <Dialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove design?</DialogTitle>
            <DialogDescription>
              This removes the artwork from the{' '}
              <strong className="capitalize">
                {activeLocation.replace(/_/g, ' ').toLowerCase()}
              </strong>{' '}
              print location. You&rsquo;ll need to upload a new image to
              restore it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmClearOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={clearDesign}>
              Remove design
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}